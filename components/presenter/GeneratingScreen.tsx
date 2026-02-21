'use client';

import { useState, useEffect } from 'react';

const MESSAGES = [
  'Création de votre campagne...',
  'Élaboration de la vision...',
  'Presque terminé...',
];

export function GeneratingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="presenter-view min-h-screen flex flex-col items-center justify-center px-12">
      <h1 className="font-display font-light text-4xl md:text-6xl tracking-[0.15em] uppercase mb-12">
        {MESSAGES[messageIndex]}
      </h1>
      <div className="w-64 h-px bg-white/20 overflow-hidden">
        <div
          className="h-full bg-[var(--accent-gold)] animate-pulse"
          style={{ width: '60%' }}
        />
      </div>
    </div>
  );
}
