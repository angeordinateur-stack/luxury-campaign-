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

export async function POST(request: NextRequest) {
  try {
    const { sessionId, winning_silhouette: reqSilhouette, winning_mood: reqMood, winning_setting: reqSetting } =
      await request.json();

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
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const brandName = session.selected_brand || 'Maison';
    // Priorité aux valeurs passées explicitement (votes réels), sinon session, sinon défauts
    const silhouette = reqSilhouette ?? session.winning_silhouette ?? 'oversized';
    const mood = reqMood ?? session.winning_mood ?? 'quiet';
    const setting = reqSetting ?? session.winning_setting ?? 'tokyo';

    const silhouetteLabel = getLabel('silhouette', silhouette);
    const moodLabel = getLabel('mood', mood);
    const settingLabel = getLabel('setting', setting);

    const imagePrompt = buildImagePrompt(silhouette, mood, setting, brandName);

    const campaignPrompt = `You are the creative director of a luxury fashion house called ${brandName}.

The creative brief for the new campaign is:
- Silhouette: ${silhouetteLabel}
- Mood: ${moodLabel}
- Setting: ${settingLabel}

Generate a campaign concept. Respond in JSON only:
{
  "tagline": "A luxury campaign tagline, max 8 words, poetic and evocative",
  "target_audience": "One sentence describing the ideal customer, max 20 words",
  "launch_channels": ["channel 1", "channel 2", "channel 3"],
  "campaign_name": "A 2-3 word internal campaign name"
}

Be specific to the brief. Think Vogue Italia, Jacquemus, old Céline. No generic marketing language.`;

    const claudeRes = await anthropic.messages
      .create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [{ role: 'user', content: campaignPrompt }],
      })
      .then((m) => {
        const text = (m.content[0] as { text?: string })?.text?.trim() || '{}';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      })
      .catch(() => null);

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
        winning_silhouette: silhouette,
        winning_mood: mood,
        winning_setting: setting,
        phase: 'generating',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    return NextResponse.json({
      tagline,
      target_audience,
      launch_channels,
      campaign_name,
      image_prompt: imagePrompt,
      campaign_prompt: campaignPrompt,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Generation error', ...FALLBACK_CAMPAIGN },
      { status: 500 }
    );
  }
}
