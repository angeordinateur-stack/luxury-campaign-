'use client';

import { useState } from 'react';
import { FadeIn } from '@/components/ui/FadeIn';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { VOTE_OPTIONS } from '@/lib/constants';

interface VotingScreenProps {
  sessionId: string;
  voterId: string;
  onSubmit: () => void;
}

type VoteSelection = {
  silhouette: string;
  mood: string;
  setting: string;
};

export function VotingScreen({ sessionId, voterId, onSubmit }: VotingScreenProps) {
  const [votes, setVotes] = useState<VoteSelection>({
    silhouette: '',
    mood: '',
    setting: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = votes.silhouette && votes.mood && votes.setting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.from('votes').upsert(
        {
          session_id: sessionId,
          voter_id: voterId,
          silhouette: votes.silhouette,
          mood: votes.mood,
          setting: votes.setting,
        },
        { onConflict: 'session_id,voter_id' }
      );

      if (error) throw error;
      setSubmitted(true);
      onSubmit();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function toggleVote(category: keyof VoteSelection, key: string) {
    setVotes((prev) => ({
      ...prev,
      [category]: prev[category] === key ? '' : key,
    }));
  }

  if (submitted) {
    return (
      <div className="audience-view min-h-screen flex flex-col items-center justify-center px-6">
        <FadeIn>
          <p className="font-body text-lg text-center text-[var(--text-muted)]">
            La campagne est en cours de création. Regardez l&apos;écran.
          </p>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="audience-view min-h-screen flex flex-col items-center px-6 py-12">
      <FadeIn>
        <h1 className="font-display font-semibold text-xl md:text-2xl text-center tracking-[0.15em] uppercase mb-2">
          Définissez la vision
        </h1>
        <GoldDivider className="w-24 mx-auto mb-8" />
      </FadeIn>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
        {(['silhouette', 'mood', 'setting'] as const).map((category, idx) => (
          <FadeIn key={category} delay={idx * 100}>
            <p className="font-display text-xs tracking-[0.15em] uppercase text-[var(--text-muted)] mb-3">
              {category === 'silhouette' && 'SILHOUETTE'}
              {category === 'mood' && 'AMBIANCE'}
              {category === 'setting' && 'CADRE'}
            </p>
            <div className="space-y-2">
              {VOTE_OPTIONS[category].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => toggleVote(category, opt.key)}
                  className={`w-full px-4 py-4 tap-target text-left font-body text-sm transition-all border ${
                    votes[category] === opt.key
                      ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-[var(--text-primary)]'
                      : 'border-[var(--border-light)] hover:border-[var(--accent-gold)]/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FadeIn>
        ))}

        <FadeIn delay={300}>
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full px-4 py-4 tap-target border border-[var(--accent-gold)] text-[var(--accent-gold)] font-display text-sm tracking-[0.15em] uppercase hover:bg-[var(--accent-gold)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Envoi...' : 'Valider ma vision'}
          </button>
        </FadeIn>
      </form>
    </div>
  );
}
