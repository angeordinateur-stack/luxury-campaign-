'use client';

interface GoldDividerProps {
  className?: string;
  animated?: boolean;
}

export function GoldDivider({ className = '', animated = false }: GoldDividerProps) {
  return (
    <div
      className={`h-px bg-[var(--accent-gold)] ${animated ? 'animate-gold-extend' : 'w-full'} ${className}`}
    />
  );
}
