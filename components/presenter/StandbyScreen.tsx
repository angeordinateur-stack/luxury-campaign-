'use client';

import { QRCodeSVG } from 'qrcode.react';

interface StandbyScreenProps {
  audienceUrl: string;
  participantCount: number;
  onNext?: () => void;
}

export function StandbyScreen({ audienceUrl, participantCount, onNext }: StandbyScreenProps) {
  return (
    <div className="presenter-view min-h-screen flex flex-col items-center justify-center pb-32">
      <h1 className="font-display font-light text-6xl md:text-8xl tracking-[0.15em] uppercase mb-4">
        CO-CRÉER
      </h1>
      <p className="text-accent font-display text-lg tracking-[0.15em] uppercase mb-12">
        Scan the QR code to begin
      </p>
      <div className="p-6 bg-white">
        <QRCodeSVG value={audienceUrl} size={200} level="H" />
      </div>
      <p className="text-muted font-body text-sm mt-8">
        {participantCount} participant{participantCount !== 1 ? 's' : ''} connected
      </p>
      {onNext && (
        <button
          onClick={onNext}
          className="mt-12 px-12 py-4 bg-[var(--accent-gold)] text-[var(--bg-dark)] font-display text-base font-semibold tracking-[0.2em] uppercase hover:bg-white transition-all"
        >
          START SESSION →
        </button>
      )}
    </div>
  );
}
