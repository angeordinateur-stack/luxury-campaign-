'use client';

import { FadeIn } from '@/components/ui/FadeIn';
import { GoldDivider } from '@/components/ui/GoldDivider';

interface CampaignRevealProps {
  brandName: string;
  campaignName: string;
  tagline: string;
  targetAudience: string;
  launchChannels: string[];
  imageUrl: string;
  participantCount: number;
}

export function CampaignReveal({
  brandName,
  campaignName,
  tagline,
  targetAudience,
  launchChannels,
  imageUrl,
  participantCount,
}: CampaignRevealProps) {
  return (
    <div className="presenter-view min-h-screen flex">
      {/* Left 55% - Image */}
      <div className="w-[55%] flex items-center justify-center p-8">
        <div className="w-full aspect-[3/4] max-h-[90vh] overflow-hidden bg-black/50">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={`Campagne ${brandName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              Image en cours de chargement...
            </div>
          )}
        </div>
      </div>

      {/* Right 45% - Content */}
      <div className="w-[45%] flex flex-col justify-center px-12 py-16">
        <FadeIn delay={0}>
          <p className="font-display text-xs tracking-[0.15em] uppercase text-accent mb-2">
            {campaignName}
          </p>
          <h1 className="font-display font-semibold text-5xl md:text-[80px] tracking-[0.1em] mb-4">
            {brandName}
          </h1>
          <GoldDivider className="mb-6" animated />
          <p className="font-body text-2xl md:text-[28px] italic mb-10">{tagline}</p>
        </FadeIn>

        <FadeIn delay={800}>
          <p className="font-display text-xs tracking-[0.15em] uppercase text-accent mb-2">
            CIBLE
          </p>
          <p className="font-body text-lg mb-8">{targetAudience}</p>
        </FadeIn>

        <FadeIn delay={1200}>
          <p className="font-display text-xs tracking-[0.15em] uppercase text-accent mb-2">
            CANAUX
          </p>
          <ul className="font-body text-lg space-y-1 mb-12">
            {launchChannels.map((ch, i) => (
              <li key={i}>{ch}</li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={1600}>
          <p className="font-body text-sm text-muted">
            Concept co-créé par {participantCount} humain{participantCount !== 1 ? 's' : ''} et un
            algorithme en 90 secondes
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
