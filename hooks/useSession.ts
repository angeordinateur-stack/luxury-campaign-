'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@/lib/database.types';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      const { data: sessions, error: fetchError } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;
      const currentSession = sessions?.[0] ?? null;
      setSession(currentSession);
    } catch (err) {
      console.error('Refetch error:', err);
    }
  }, []);

  useEffect(() => {
    async function fetchOrCreateSession() {
      try {
        const { data: sessions, error: fetchError } = await supabase
          .from('sessions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchError) throw fetchError;

        let currentSession: Session | null = sessions?.[0] ?? null;

        if (!currentSession || currentSession.phase === 'reveal') {
          const { data: newSession, error: insertError } = await supabase
            .from('sessions')
            .insert({ phase: 'standby' })
            .select()
            .single();

          if (insertError) throw insertError;
          currentSession = newSession;
        }

        setSession(currentSession);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Loading error';
        const isConfigError =
          !process.env.NEXT_PUBLIC_SUPABASE_URL ||
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
          msg.includes('fetch') ||
          msg.includes('Failed to fetch');
        setError(
          isConfigError
            ? 'Missing configuration. Add Supabase env vars in Vercel → Settings → Environment Variables.'
            : msg
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrCreateSession();
  }, []);

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('session-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sessions', filter: `id=eq.${session.id}` },
        (payload) => {
          setSession(payload.new as Session);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.id]);

  return { session, loading, error, refetch };
}
