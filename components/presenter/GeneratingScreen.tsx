'use client';

import { useState } from 'react';
import { buildImagePrompt } from '@/lib/imagePrompt';
import { VOTE_OPTIONS } from '@/lib/constants';
import type { Session } from '@/lib/database.types';

function getLabel(cat: 'silhouette' | 'mood' | 'setting', key: string) {
  return VOTE_OPTIONS[cat].find((o) => o.key === key)?.label ?? key;
}

interface GeneratingScreenProps {
  session: Session;
  onImageUrlSubmit: (url: string) => Promise<void>;
}

export function GeneratingScreen({ session, onImageUrlSubmit }: GeneratingScreenProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const brandName = session.selected_brand || 'Maison';
  const silhouette = session.winning_silhouette || 'oversized';
  const mood = session.winning_mood || 'quiet';
  const setting = session.winning_setting || 'tokyo';

  const imagePrompt = buildImagePrompt(silhouette, mood, setting, brandName);

  const hasCampaignData = !!session.campaign_tagline;

  const campaignPromptForDisplay = `Creative director of ${brandName}. Brief: Silhouette: ${getLabel('silhouette', silhouette)}, Mood: ${getLabel('mood', mood)}, Setting: ${getLabel('setting', setting)}. Generate tagline, target_audience, launch_channels, campaign_name (JSON).`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onImageUrlSubmit(imageUrl.trim());
    } finally {
      setIsSubmitting(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  if (!hasCampaignData) {
    return (
      <div className="presenter-view min-h-screen flex flex-col items-center justify-center px-12">
        <h1 className="font-display font-light text-4xl md:text-6xl tracking-[0.15em] uppercase mb-12">
          Creating your campaign...
        </h1>
        <div className="w-64 h-px bg-white/20 overflow-hidden">
          <div className="h-full bg-[var(--accent-gold)] animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="presenter-view min-h-screen flex flex-col items-center px-12 py-16 overflow-y-auto">
      <h1 className="font-display font-light text-3xl md:text-5xl tracking-[0.15em] uppercase mb-12">
        Generate image on Higgsfield
      </h1>

      <div className="w-full max-w-2xl space-y-8">
        <div>
          <p className="font-display text-xs tracking-[0.15em] uppercase text-accent mb-2">
            IMAGE PROMPT — Copy and paste into Higgsfield to generate
          </p>
          <div className="relative">
            <textarea
              readOnly
              value={imagePrompt}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 text-sm font-body text-white/90 resize-none"
              rows={4}
            />
            <button
              type="button"
              onClick={() => copyToClipboard(imagePrompt)}
              className="absolute top-2 right-2 px-3 py-1 text-xs border border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-[var(--bg-dark)] transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <details className="group">
          <summary className="font-display text-xs tracking-[0.15em] uppercase text-accent mb-2 cursor-pointer list-none">
            Campaign prompt (for Claude reference)
          </summary>
          <textarea
            readOnly
            value={campaignPromptForDisplay}
            className="w-full mt-2 px-4 py-3 bg-white/5 border border-white/20 text-xs font-body text-white/70 resize-none"
            rows={3}
          />
        </details>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="font-display text-xs tracking-[0.15em] uppercase text-accent mb-2">
              PASTE IMAGE URL (after generating on Higgsfield)
            </p>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-white/40 font-body"
            />
          </div>
          <button
            type="submit"
            disabled={!imageUrl.trim() || isSubmitting}
            className="px-8 py-3 bg-[var(--accent-gold)] text-[var(--bg-dark)] font-display text-sm tracking-[0.15em] uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '...' : 'REVEAL CAMPAIGN'}
          </button>
        </form>
      </div>
    </div>
  );
}
