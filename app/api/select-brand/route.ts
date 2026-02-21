import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { FALLBACK_BRAND } from '@/lib/constants';

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { sessionId, names } = await request.json();

    if (!sessionId || !Array.isArray(names) || names.length === 0) {
      const selected = names?.length ? names[0] : FALLBACK_BRAND;
      return NextResponse.json({
        selected_name: selected,
        rationale: 'Default selection.',
      });
    }

    const filteredNames = names
      .map((n: string) => String(n).trim())
      .filter((n: string) => n.length > 0 && n.length <= 50);

    if (filteredNames.length === 0) {
      return NextResponse.json({
        selected_name: FALLBACK_BRAND,
        rationale: 'Aucune proposition valide.',
      });
    }

    const prompt = `Tu es un expert en naming de marques de luxe. Parmi les propositions de noms de marque soumises par un public, choisis celui qui fonctionne le mieux pour une maison de couture luxe. Considère : l'élégance phonétique, la mémorabilité, le potentiel d'identité visuelle, et la résonance culturelle. Si aucun n'est assez fort, adapte légèrement le meilleur.

Noms proposés : ${filteredNames.join(', ')}

Réponds en JSON uniquement : { "selected_name": "...", "rationale": "une phrase, max 15 mots" }`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    });

    const text =
      (message.content[0] as { type: string; text: string })?.text?.trim() || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    const selected_name = parsed.selected_name || filteredNames[0] || FALLBACK_BRAND;
    const rationale = parsed.rationale || 'Sélection pour son potentiel.';

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase
      .from('sessions')
      .update({
        selected_brand: selected_name,
        selected_rationale: rationale,
        phase: 'brand_reveal',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    return NextResponse.json({ selected_name, rationale });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Erreur de sélection', selected_name: FALLBACK_BRAND, rationale: 'Sélection par défaut.' },
      { status: 500 }
    );
  }
}
