'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from '@/hooks/useSession';
import { StandbyScreen } from '@/components/presenter/StandbyScreen';
import { BrandNameCollection } from '@/components/presenter/BrandNameCollection';
import { BrandNameReveal } from '@/components/presenter/BrandNameReveal';
import { VotingDisplay } from '@/components/presenter/VotingDisplay';
import { VoteResults } from '@/components/presenter/VoteResults';
import { GeneratingScreen } from '@/components/presenter/GeneratingScreen';
import { CampaignReveal } from '@/components/presenter/CampaignReveal';
import { supabase } from '@/lib/supabase';
import { PHASES } from '@/lib/constants';

export default function PresenterPage() {
  const { session, loading, error } = useSession();
  const [participantCount, setParticipantCount] = useState(0);

  const advancePhase = useCallback(async () => {
    if (!session) return;

    const idx = PHASES.indexOf(session.phase);
    if (idx < 0 || idx >= PHASES.length - 1) return;

    const nextPhase = PHASES[idx + 1];

    if (session.phase === 'brand_naming' && nextPhase === 'brand_reveal') {
      const { data: names } = await supabase
        .from('brand_names')
        .select('name')
        .eq('session_id', session.id);
      const nameList = (names ?? []).map((n: { name: string }) => n.name);
      if (nameList.length < 3) {
        nameList.push('Maison Éclaire', 'Atelier Lumière', 'Studio Ombre');
      }
      const res = await fetch('/api/select-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, names: nameList }),
      });
      if (!res.ok) {
        await supabase
          .from('sessions')
          .update({ phase: 'brand_reveal', selected_brand: 'MAISON ÉCLAIRE', selected_rationale: 'Sélection par défaut.' })
          .eq('id', session.id);
      }
      return;
    }

    if (session.phase === 'voting' && nextPhase === 'vote_results') {
      const { data: votes } = await supabase
        .from('votes')
        .select('silhouette, mood, setting')
        .eq('session_id', session.id);

      const counts = { silhouette: {} as Record<string, number>, mood: {} as Record<string, number>, setting: {} as Record<string, number> };
      (votes ?? []).forEach((v) => {
        counts.silhouette[v.silhouette] = (counts.silhouette[v.silhouette] || 0) + 1;
        counts.mood[v.mood] = (counts.mood[v.mood] || 0) + 1;
        counts.setting[v.setting] = (counts.setting[v.setting] || 0) + 1;
      });

      const winner = (obj: Record<string, number>) =>
        Object.entries(obj).reduce((a, b) => (a[1] > b[1] ? a : b), ['oversized', 0])[0];

      const winning_silhouette = winner(counts.silhouette) || 'oversized';
      const winning_mood = winner(counts.mood) || 'quiet';
      const winning_setting = winner(counts.setting) || 'tokyo';

      await supabase
        .from('sessions')
        .update({
          phase: 'vote_results',
          winning_silhouette,
          winning_mood,
          winning_setting,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.id);
      return;
    }

    if (session.phase === 'vote_results' && nextPhase === 'generating') {
      await supabase
        .from('sessions')
        .update({ phase: 'generating', updated_at: new Date().toISOString() })
        .eq('id', session.id);

      fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id }),
      });
      return;
    }

    if (session.phase === 'standby' || session.phase === 'brand_reveal') {
      await supabase
        .from('sessions')
        .update({ phase: nextPhase, updated_at: new Date().toISOString() })
        .eq('id', session.id);
    }
  }, [session]);

  const goBack = useCallback(async () => {
    if (!session) return;
    const idx = PHASES.indexOf(session.phase);
    if (idx <= 0) return;
    const prevPhase = PHASES[idx - 1];
    await supabase
      .from('sessions')
      .update({ phase: prevPhase, updated_at: new Date().toISOString() })
      .eq('id', session.id);
  }, [session]);

  const resetToStandby = useCallback(async () => {
    if (!session) return;
    await supabase
      .from('sessions')
      .update({
        phase: 'standby',
        selected_brand: null,
        selected_rationale: null,
        winning_silhouette: null,
        winning_mood: null,
        winning_setting: null,
        campaign_tagline: null,
        campaign_target: null,
        campaign_channels: null,
        campaign_name: null,
        campaign_image_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.id);
  }, [session]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        advancePhase();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goBack();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetToStandby();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advancePhase, goBack, resetToStandby]);

  useEffect(() => {
    if (!session) return;

    const channel = supabase.channel(`session:${session.id}`);
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const count = Object.values(state).flat().length;
      setParticipantCount(count);
    });
    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  if (loading) {
    return (
      <div className="presenter-view min-h-screen flex items-center justify-center">
        <p className="text-muted">Chargement...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="presenter-view min-h-screen flex flex-col items-center justify-center px-6 gap-6">
        <p className="text-red-400 text-center max-w-md">{error || 'Session introuvable.'}</p>
        <a href="/" className="font-display text-sm tracking-[0.15em] uppercase text-accent hover:underline">
          ← Retour à l&apos;accueil
        </a>
      </div>
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  const audienceUrl = baseUrl ? `${baseUrl.replace(/\/$/, '')}/audience` : '/audience';

  return (
    <div className="presenter-view min-h-screen relative">
      {session.phase === 'standby' && (
        <StandbyScreen
          audienceUrl={audienceUrl}
          participantCount={participantCount}
          onNext={() => advancePhase()}
        />
      )}
      {session.phase === 'brand_naming' && (
        <BrandNameCollection sessionId={session.id} />
      )}
      {session.phase === 'brand_reveal' && session.selected_brand && (
        <BrandNameReveal
          brandName={session.selected_brand}
          rationale={session.selected_rationale || ''}
        />
      )}
      {session.phase === 'voting' && <VotingDisplay sessionId={session.id} />}
      {session.phase === 'vote_results' &&
        session.winning_silhouette &&
        session.winning_mood &&
        session.winning_setting && (
          <VoteResults
            brandName={session.selected_brand || ''}
            winningSilhouette={session.winning_silhouette}
            winningMood={session.winning_mood}
            winningSetting={session.winning_setting}
          />
        )}
      {session.phase === 'generating' && <GeneratingScreen />}
      {session.phase === 'reveal' && (
        <CampaignReveal
          brandName={session.selected_brand || ''}
          campaignName={session.campaign_name || ''}
          tagline={session.campaign_tagline || ''}
          targetAudience={session.campaign_target || ''}
          launchChannels={session.campaign_channels || []}
          imageUrl={session.campaign_image_url || ''}
          participantCount={participantCount}
        />
      )}

      {/* Bouton Suivant - toujours visible sauf pendant génération/révélation */}
      {session.phase !== 'generating' && session.phase !== 'reveal' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
          <button
            onClick={() => advancePhase()}
            className="px-12 py-4 bg-[var(--accent-gold)] text-[var(--bg-dark)] font-display text-base font-semibold tracking-[0.2em] uppercase hover:bg-white hover:text-[var(--bg-dark)] transition-all shadow-lg"
          >
            SUIVANT →
          </button>
          <p className="text-xs text-white/50">
            ou touche → du clavier
          </p>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-50 text-[10px] text-white/40 font-mono">
        R = reset · F = plein écran
      </div>
    </div>
  );
}
