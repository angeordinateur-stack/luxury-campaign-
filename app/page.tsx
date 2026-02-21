import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--bg-primary)]">
      <h1 className="font-display font-light text-3xl md:text-4xl tracking-[0.15em] uppercase mb-4">
        Luxury AI Campaign Co-Creator
      </h1>
      <p className="font-body text-[var(--text-muted)] mb-12 text-center max-w-md">
        Expérience interactive de co-création de campagne luxe avec l&apos;IA
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/audience"
          className="px-8 py-4 border border-[var(--accent-gold)] text-[var(--accent-gold)] font-display text-sm tracking-[0.15em] uppercase hover:bg-[var(--accent-gold)] hover:text-white transition-colors text-center"
        >
          Vue audience
        </Link>
        <Link
          href="/presenter"
          className="px-8 py-4 bg-[var(--bg-dark)] text-[var(--text-light)] font-display text-sm tracking-[0.15em] uppercase hover:bg-[var(--accent-gold)] transition-colors text-center"
        >
          Vue présentateur
        </Link>
      </div>
    </div>
  );
}
