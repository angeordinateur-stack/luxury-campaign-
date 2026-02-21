import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { buildImagePrompt } from '@/lib/imagePrompt';
import { FALLBACK_CAMPAIGN } from '@/lib/constants';
import { VOTE_OPTIONS } from '@/lib/constants';

const anthropic = new Anthropic();

function getLabel(category: 'silhouette' | 'mood' | 'setting', key: string): string {
  const opt = VOTE_OPTIONS[category].find((o) => o.key === key);
  return opt?.label ?? key;
}

async function generateImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.HIGGSFIELD_API_KEY;
  if (!apiKey) return null;

  try {
    const authParts = apiKey.includes(':') ? apiKey : `${apiKey}:`;
    const res = await fetch('https://platform.higgsfield.ai/higgsfield-ai/soul/standard', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${authParts}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: '3:4',
        resolution: '720p',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Higgsfield error:', err);
      return null;
    }

    const data = await res.json();
    const requestId = data.request_id;

    if (!requestId) return null;

    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const statusRes = await fetch(
        `https://platform.higgsfield.ai/requests/${requestId}/status`,
        {
          headers: { 'Authorization': `Key ${authParts}` },
        }
      );
      const statusData = await statusRes.json();

      if (statusData.status === 'completed' && statusData.images?.[0]?.url) {
        return statusData.images[0].url;
      }
      if (statusData.status === 'failed' || statusData.status === 'nsfw') {
        return null;
      }
    }
    return null;
  } catch (err) {
    console.error('Higgsfield:', err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: session } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!session) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 });
    }

    const brandName = session.selected_brand || 'Maison';
    const silhouette = session.winning_silhouette || 'oversized';
    const mood = session.winning_mood || 'quiet';
    const setting = session.winning_setting || 'tokyo';

    const silhouetteLabel = getLabel('silhouette', silhouette);
    const moodLabel = getLabel('mood', mood);
    const settingLabel = getLabel('setting', setting);

    const prompt = `Tu es le directeur créatif d'une maison de luxe appelée ${brandName}.

Le brief créatif de la nouvelle campagne est :
- Silhouette : ${silhouetteLabel}
- Ambiance : ${moodLabel}
- Cadre : ${settingLabel}

Génère un concept de campagne. Réponds en JSON uniquement :
{
  "tagline": "Un slogan de campagne luxe, max 8 mots, poétique et évocateur",
  "target_audience": "Une phrase décrivant le client idéal, max 20 mots",
  "launch_channels": ["canal 1", "canal 2", "canal 3"],
  "campaign_name": "Un nom de campagne interne en 2-3 mots"
}

Sois spécifique au brief. Pense Vogue Italia, Jacquemus, ancien Céline. Pas de langage marketing générique.`;

    const [claudeRes, imageUrl] = await Promise.all([
      anthropic.messages
        .create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 512,
          messages: [{ role: 'user', content: prompt }],
        })
        .then((m) => {
          const text = (m.content[0] as { text?: string })?.text?.trim() || '{}';
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        })
        .catch(() => null),
      generateImage(buildImagePrompt(silhouette, mood, setting, brandName)),
    ]);

    const campaign = claudeRes || FALLBACK_CAMPAIGN;
    const tagline = campaign.tagline || FALLBACK_CAMPAIGN.tagline;
    const target_audience = campaign.target_audience || FALLBACK_CAMPAIGN.target_audience;
    const launch_channels = campaign.launch_channels || FALLBACK_CAMPAIGN.launch_channels;
    const campaign_name = campaign.campaign_name || FALLBACK_CAMPAIGN.campaign_name;

    await supabase
      .from('sessions')
      .update({
        campaign_tagline: tagline,
        campaign_target: target_audience,
        campaign_channels: launch_channels,
        campaign_name,
        campaign_image_url: imageUrl,
        phase: 'reveal',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    return NextResponse.json({
      tagline,
      target_audience,
      launch_channels,
      campaign_name,
      image_url: imageUrl,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Erreur de génération', ...FALLBACK_CAMPAIGN },
      { status: 500 }
    );
  }
}
