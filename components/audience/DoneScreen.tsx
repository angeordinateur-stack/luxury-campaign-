'use client';

import { FadeIn } from '@/components/ui/FadeIn';
import { GoldDivider } from '@/components/ui/GoldDivider';

export function DoneScreen() {
  return (
    <div className="audience-view min-h-screen flex flex-col items-center justify-center px-6">
      <FadeIn>
        <h1 className="font-display font-semibold text-2xl md:text-3xl text-center tracking-[0.15em] uppercase mb-4">
          La campagne est en ligne.
        </h1>
        <GoldDivider className="w-32 mx-auto mb-6 animate-gold-extend" />
        <p className="font-body text-lg text-center text-[var(--text-muted)] italic">
          Levez les yeux.
        </p>
      </FadeIn>
    </div>
  );
}
