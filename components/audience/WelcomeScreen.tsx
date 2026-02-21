'use client';

import { FadeIn } from '@/components/ui/FadeIn';
import { GoldDivider } from '@/components/ui/GoldDivider';

export function WelcomeScreen() {
  return (
    <div className="audience-view min-h-screen flex flex-col items-center justify-center px-6">
      <FadeIn>
        <h1 className="font-display font-light text-2xl md:text-3xl text-center tracking-[0.15em] uppercase mb-6">
          Vous allez co-créer une campagne luxe.
        </h1>
        <GoldDivider className="w-24 mx-auto mb-8" />
        <p className="font-body text-base text-[var(--text-muted)] text-center italic">
          Attendez que le présentateur lance la session.
        </p>
      </FadeIn>
    </div>
  );
}
