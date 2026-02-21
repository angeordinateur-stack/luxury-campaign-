'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function usePresence(sessionId: string | undefined) {
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase.channel(`session:${sessionId}`);
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ joined_at: new Date().toISOString() });
      }
    });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [sessionId]);
}
