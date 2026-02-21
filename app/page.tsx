import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Fond subtil - motif géométrique léger */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--accent-gold) 1px, transparent 1px),
            linear-gradient(90deg, var(--accent-gold) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ligne dorée décorative en haut */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-gold)] to-transparent opacity-60" />

      <div className="relative z-10 flex flex-col items-center max-w-xl">
        <h1 className="font-display font-light text-4xl md:text-5xl tracking-[0.2em] uppercase mb-6 opacity-0 animate-fade-in text-[var(--text-primary)]">
          Luxury AI Campaign
        </h1>
        <h2 className="font-display font-semibold text-2xl md:text-3xl tracking-[0.25em] uppercase mb-6 text-[var(--accent-gold)] opacity-0 animate-fade-in [animation-delay:200ms]">
          Co-Creator
        </h2>

        {/* Divider doré animé */}
        <div className="h-px w-24 bg-[var(--accent-gold)] mb-8 opacity-0 animate-gold-extend [animation-delay:400ms]" />

        <p className="font-body text-[var(--text-muted)] mb-14 text-center text-lg leading-relaxed italic opacity-0 animate-fade-in [animation-delay:500ms]">
          Expérience interactive de co-création de campagne luxe avec l&apos;IA
        </p>

        <div className="flex flex-col sm:flex-row gap-5 opacity-0 animate-fade-in [animation-delay:700ms]">
          <Link
            href="/audience"
            className="group px-10 py-5 border-2 border-[var(--accent-gold)] text-[var(--accent-gold)] font-display text-sm tracking-[0.2em] uppercase text-center transition-all duration-300 hover:bg-[var(--accent-gold)] hover:text-white hover:shadow-lg hover:shadow-[var(--accent-gold)]/20"
          >
            <span className="block group-hover:tracking-[0.25em] transition-all duration-300">
              Vue audience
            </span>
          </Link>
          <Link
            href="/presenter"
            className="group px-10 py-5 bg-[var(--bg-dark)] text-[var(--text-light)] font-display text-sm tracking-[0.2em] uppercase text-center transition-all duration-300 hover:bg-[var(--accent-gold)] hover:text-white hover:shadow-lg hover:shadow-[var(--accent-gold)]/30"
          >
            <span className="block group-hover:tracking-[0.25em] transition-all duration-300">
              Vue présentateur
            </span>
          </Link>
        </div>
      </div>

      {/* Ligne dorée en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-gold)] to-transparent opacity-40" />
    </div>
  );
}
