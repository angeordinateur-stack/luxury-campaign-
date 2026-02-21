'use client';

import { useEffect, useState } from 'react';

interface LetterByLetterProps {
  text: string;
  className?: string;
  duration?: number;
  onComplete?: () => void;
}

export function LetterByLetter({ text, className = '', duration = 1000, onComplete }: LetterByLetterProps) {
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    if (displayedLength >= text.length) {
      onComplete?.();
      return;
    }
    const interval = duration / text.length;
    const timer = setTimeout(() => {
      setDisplayedLength((prev) => Math.min(prev + 1, text.length));
    }, interval);
    return () => clearTimeout(timer);
  }, [displayedLength, text, duration, onComplete]);

  return (
    <span className={className}>
      {text.slice(0, displayedLength)}
      {displayedLength < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}
