'use client';

import { LetterByLetter } from '@/components/ui/LetterByLetter';
import { GoldDivider } from '@/components/ui/GoldDivider';
import { FadeIn } from '@/components/ui/FadeIn';

interface BrandNameRevealProps {
  brandName: string;
  rationale: string;
}

export function BrandNameReveal({ brandName, rationale }: BrandNameRevealProps) {
  return (
    <div className="presenter-view min-h-screen flex flex-col items-center justify-center px-12">
      <FadeIn>
        <LetterByLetter
          text={brandName}
          className="font-display font-semibold text-6xl md:text-[120px] tracking-[0.15em] uppercase block text-center"
          duration={1000}
        />
        <GoldDivider className="w-48 mx-auto my-8" animated />
        <p className="font-body text-xl md:text-2xl italic text-center text-[var(--text-muted)] max-w-2xl">
          {rationale}
        </p>
      </FadeIn>
    </div>
  );
}
