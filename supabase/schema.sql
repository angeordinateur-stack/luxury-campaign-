-- Luxury AI Campaign Co-Creator - Supabase Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Session management
CREATE TABLE sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  phase TEXT DEFAULT 'standby' CHECK (phase IN (
    'standby', 'brand_naming', 'brand_reveal', 'voting', 'vote_results', 'generating', 'reveal'
  )),
  selected_brand TEXT,
  selected_rationale TEXT,
  winning_silhouette TEXT,
  winning_mood TEXT,
  winning_setting TEXT,
  campaign_tagline TEXT,
  campaign_target TEXT,
  campaign_channels TEXT[],
  campaign_name TEXT,
  campaign_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brand name submissions
CREATE TABLE brand_names (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes (one per voter per session)
CREATE TABLE votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  voter_id TEXT NOT NULL,
  silhouette TEXT NOT NULL,
  mood TEXT NOT NULL,
  setting TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, voter_id)
);

-- Enable Realtime: In Supabase Dashboard > Database > Replication,
-- add tables: sessions, brand_names, votes

-- RLS policies (permissive for presentation - tighten for production)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on sessions" ON sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on brand_names" ON brand_names FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on votes" ON votes FOR ALL USING (true) WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX idx_brand_names_session ON brand_names(session_id);
CREATE INDEX idx_votes_session ON votes(session_id);
