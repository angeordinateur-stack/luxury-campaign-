'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'luxury_campaign_voter_id';

export function useVoterId(): string | null {
  const [voterId, setVoterId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = uuidv4();
      localStorage.setItem(STORAGE_KEY, id);
    }
    setVoterId(id);
  }, []);

  return voterId;
}
