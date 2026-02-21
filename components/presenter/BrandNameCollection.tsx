'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BrandNameCollectionProps {
  sessionId: string;
}

interface BrandName {
  id: string;
  name: string;
}

export function BrandNameCollection({ sessionId }: BrandNameCollectionProps) {
  const [names, setNames] = useState<BrandName[]>([]);

  useEffect(() => {
    async function fetchNames() {
      const { data } = await supabase
        .from('brand_names')
        .select('id, name')
        .eq('session_id', sessionId)
        .order('submitted_at', { ascending: true });
      setNames(data ?? []);
    }

    fetchNames();
  }, [sessionId]);

  useEffect(() => {
    const channel = supabase
      .channel('brand-names')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'brand_names', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setNames((prev) => [...prev, payload.new as BrandName]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  return (
    <div className="presenter-view min-h-screen flex flex-col items-center justify-center px-12">
      <h1 className="font-display font-light text-4xl md:text-6xl tracking-[0.15em] uppercase mb-16">
        Nommez votre maison
      </h1>
      <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
        {names.map((item, i) => (
          <div
            key={item.id}
            className="font-display text-2xl md:text-3xl tracking-[0.1em] opacity-90 animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
