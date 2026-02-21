'use client';

import { useSession } from '@/hooks/useSession';
import { useVoterId } from '@/hooks/useVoterId';
import { usePresence } from '@/hooks/usePresence';
import { WelcomeScreen } from '@/components/audience/WelcomeScreen';
import { BrandNameInput } from '@/components/audience/BrandNameInput';
import { VotingScreen } from '@/components/audience/VotingScreen';
import { DoneScreen } from '@/components/audience/DoneScreen';

export default function AudiencePage() {
  const { session, loading, error } = useSession();
  const voterId = useVoterId();
  usePresence(session?.id);

  if (loading) {
    return (
      <div className="audience-view min-h-screen flex items-center justify-center">
        <p className="font-body text-[var(--text-muted)]">Connecting...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="audience-view min-h-screen flex flex-col items-center justify-center px-6 gap-6">
        <p className="font-body text-red-600 text-center max-w-md">
          {error || 'Impossible de charger la session.'}
        </p>
        <a href="/" className="font-display text-sm tracking-[0.15em] uppercase text-[var(--accent-gold)] hover:underline">
          ← Back to home
        </a>
      </div>
    );
  }

  switch (session.phase) {
    case 'standby':
      return <WelcomeScreen />;
    case 'brand_naming':
      return <BrandNameInput sessionId={session.id} onSubmit={() => {}} />;
    case 'brand_reveal':
    case 'voting':
    case 'vote_results':
    case 'generating':
      if (session.phase === 'voting' && voterId) {
        return (
          <VotingScreen
            sessionId={session.id}
            voterId={voterId}
            onSubmit={() => {}}
          />
        );
      }
      if (['brand_reveal', 'vote_results', 'generating'].includes(session.phase)) {
        return (
          <div className="audience-view min-h-screen flex items-center justify-center px-6">
            <p className="font-body text-[var(--text-muted)] text-center">
              The campaign is being created. Watch the screen.
            </p>
          </div>
        );
      }
      return <WelcomeScreen />;
    case 'reveal':
      return <DoneScreen />;
    default:
      return <WelcomeScreen />;
  }
}
