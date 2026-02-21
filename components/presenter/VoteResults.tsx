'use client';

import { FadeIn } from '@/components/ui/FadeIn';
import { VOTE_OPTIONS } from '@/lib/constants';

interface VoteResultsProps {
  brandName: string;
  winningSilhouette: string;
  winningMood: string;
  winningSetting: string;
}

function getLabel(category: 'silhouette' | 'mood' | 'setting', key: string): string {
  const opt = VOTE_OPTIONS[category].find((o) => o.key === key);
  return opt?.label ?? key;
}

export function VoteResults({
  brandName,
  winningSilhouette,
  winningMood,
  winningSetting,
}: VoteResultsProps) {
  return (
    <div className="presenter-view min-h-screen flex flex-col items-center justify-center px-12">
      <FadeIn>
        <h2 className="font-display text-sm tracking-[0.15em] uppercase text-accent mb-4">
          SILHOUETTE
        </h2>
        <p className="font-display text-3xl md:text-5xl tracking-[0.1em] mb-8">
          {getLabel('silhouette', winningSilhouette)}
        </p>
      </FadeIn>
      <FadeIn delay={1000}>
        <h2 className="font-display text-sm tracking-[0.15em] uppercase text-accent mb-4">
          MOOD
        </h2>
        <p className="font-display text-3xl md:text-5xl tracking-[0.1em] mb-8">
          {getLabel('mood', winningMood)}
        </p>
      </FadeIn>
      <FadeIn delay={2000}>
        <h2 className="font-display text-sm tracking-[0.15em] uppercase text-accent mb-4">
          SETTING
        </h2>
        <p className="font-display text-3xl md:text-5xl tracking-[0.1em] mb-12">
          {getLabel('setting', winningSetting)}
        </p>
      </FadeIn>
      <FadeIn delay={3000}>
        <p className="font-display text-2xl md:text-4xl tracking-[0.1em] text-accent">
          {brandName} — {getLabel('silhouette', winningSilhouette)} ·{' '}
          {getLabel('mood', winningMood)} · {getLabel('setting', winningSetting)}
        </p>
      </FadeIn>
    </div>
  );
}
