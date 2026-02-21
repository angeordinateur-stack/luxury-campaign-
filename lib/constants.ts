import type { Phase } from './database.types';

export const PHASES: Phase[] = [
  'standby',
  'brand_naming',
  'brand_reveal',
  'voting',
  'vote_results',
  'generating',
  'reveal',
];

export const VOTE_OPTIONS = {
  silhouette: [
    { key: 'oversized', label: 'OVERSIZED TAILORING' },
    { key: 'fluid', label: 'FLUID DRAPING' },
    { key: 'sculptural', label: 'SCULPTURAL STRUCTURE' },
  ],
  mood: [
    { key: 'quiet', label: 'QUIET LUXURY' },
    { key: 'provocative', label: 'PROVOCATIVE' },
    { key: 'romantic', label: 'ROMANTIC' },
  ],
  setting: [
    { key: 'tokyo', label: 'TOKYO AT NIGHT' },
    { key: 'paris', label: 'PARISIAN ROOFTOP' },
    { key: 'desert', label: 'DESERT AT GOLDEN HOUR' },
  ],
} as const;

export const FALLBACK_BRAND = 'MAISON ÉCLAIRE';

export const FALLBACK_CAMPAIGN = {
  tagline: 'Where silence speaks louder than gold.',
  target_audience: 'The discerning few who value restraint over excess.',
  launch_channels: ['Editorial partnerships', 'Private events', 'Digital-first launch'],
  campaign_name: 'Éclipse',
};
