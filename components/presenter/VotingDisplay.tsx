'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { VOTE_OPTIONS } from '@/lib/constants';

interface VotingDisplayProps {
  sessionId: string;
}

interface VoteCounts {
  silhouette: Record<string, number>;
  mood: Record<string, number>;
  setting: Record<string, number>;
}

export function VotingDisplay({ sessionId }: VotingDisplayProps) {
  const [counts, setCounts] = useState<VoteCounts>({
    silhouette: { oversized: 0, fluid: 0, sculptural: 0 },
    mood: { quiet: 0, provocative: 0, romantic: 0 },
    setting: { tokyo: 0, paris: 0, desert: 0 },
  });

  const refreshVotes = useCallback(async () => {
    const { data: votes } = await supabase
      .from('votes')
      .select('silhouette, mood, setting')
      .eq('session_id', sessionId);
    if (!votes) return;
    const newCounts: VoteCounts = {
      silhouette: { oversized: 0, fluid: 0, sculptural: 0 },
      mood: { quiet: 0, provocative: 0, romantic: 0 },
      setting: { tokyo: 0, paris: 0, desert: 0 },
    };
    votes.forEach((v) => {
      newCounts.silhouette[v.silhouette as keyof typeof newCounts.silhouette]++;
      newCounts.mood[v.mood as keyof typeof newCounts.mood]++;
      newCounts.setting[v.setting as keyof typeof newCounts.setting]++;
    });
    setCounts(newCounts);
  }, [sessionId]);

  useEffect(() => {
    refreshVotes();
  }, [refreshVotes]);

  useEffect(() => {
    const channel = supabase
      .channel(`votes-live-${sessionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'votes', filter: `session_id=eq.${sessionId}` },
        () => {
          refreshVotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, refreshVotes]);

  // Polling fallback pour garantir la mise à jour des votes
  useEffect(() => {
    if (!sessionId) return;
    const interval = setInterval(refreshVotes, 2000);
    return () => clearInterval(interval);
  }, [sessionId, refreshVotes]);

  function getMaxKey(obj: Record<string, number>): string {
    return Object.entries(obj).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  }

  return (
    <div className="presenter-view min-h-screen flex flex-col items-center justify-center px-12">
      <h1 className="font-display font-light text-4xl md:text-6xl tracking-[0.15em] uppercase mb-16">
        Define the vision
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl">
        {(['silhouette', 'mood', 'setting'] as const).map((category) => {
          const options = VOTE_OPTIONS[category];
          const categoryCounts = counts[category];
          const maxKey = getMaxKey(categoryCounts);

          return (
            <div key={category} className="space-y-4">
              <p className="font-display text-sm tracking-[0.15em] uppercase text-accent">
                {category === 'silhouette' && 'SILHOUETTE'}
                {category === 'mood' && 'MOOD'}
                {category === 'setting' && 'SETTING'}
              </p>
              {options.map((opt) => {
                const count = categoryCounts[opt.key] ?? 0;
                const isLeading = opt.key === maxKey && count > 0;
                return (
                  <div key={opt.key} className="space-y-1">
                    <div className="flex justify-between font-body text-sm">
                      <span className={isLeading ? 'text-accent' : 'text-muted'}>
                        {opt.label}
                      </span>
                      <span>{count}</span>
                    </div>
                    <div className="h-1 bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent-gold)] transition-all duration-500"
                        style={{ width: `${count > 0 ? (count / Math.max(...Object.values(categoryCounts))) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
