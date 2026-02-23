'use client';

import { useState } from 'react';
import { FadeIn } from '@/components/ui/FadeIn';

interface BrandNameInputProps {
  sessionId: string;
  onSubmit: () => void;
}

export function BrandNameInput({ sessionId, onSubmit }: BrandNameInputProps) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || name.length > 20 || loading) return;

    setLoading(true);
    setError(null);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error: insertError } = await supabase.from('brand_names').insert({
        session_id: sessionId,
        name: name.trim(),
      });

      if (insertError) throw insertError;
      setSubmitted(true);
      onSubmit();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Impossible d\'enregistrer. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="audience-view min-h-screen flex flex-col items-center justify-center px-6">
        <FadeIn>
          <p className="font-body text-lg text-center text-[var(--text-muted)]">
            Your proposal has been submitted. Watch the screen.
          </p>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="audience-view min-h-screen flex flex-col items-center justify-center px-6">
      <FadeIn>
        <h1 className="font-display font-semibold text-xl md:text-2xl text-center tracking-[0.15em] uppercase mb-2">
          Name your maison
        </h1>
        <p className="font-body text-sm text-[var(--text-muted)] text-center mb-8">
          Type a luxury brand name. Make it iconic.
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          {error && (
            <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
          )}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            maxLength={20}
            placeholder="Ex: Maison Lumière"
            className="w-full px-4 py-4 tap-target border border-[var(--border-light)] bg-white text-[var(--text-primary)] font-body text-base focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
          />
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full mt-4 px-4 py-4 tap-target border border-[var(--accent-gold)] text-[var(--accent-gold)] font-display text-sm tracking-[0.15em] uppercase hover:bg-[var(--accent-gold)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Propose'}
          </button>
        </form>
      </FadeIn>
    </div>
  );
}
