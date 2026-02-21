export type Phase =
  | 'standby'
  | 'brand_naming'
  | 'brand_reveal'
  | 'voting'
  | 'vote_results'
  | 'generating'
  | 'reveal';

export interface Session {
  id: string;
  phase: Phase;
  selected_brand: string | null;
  selected_rationale: string | null;
  winning_silhouette: string | null;
  winning_mood: string | null;
  winning_setting: string | null;
  campaign_tagline: string | null;
  campaign_target: string | null;
  campaign_channels: string[] | null;
  campaign_name: string | null;
  campaign_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BrandName {
  id: string;
  session_id: string;
  name: string;
  submitted_at: string;
}

export interface Vote {
  id: string;
  session_id: string;
  voter_id: string;
  silhouette: string;
  mood: string;
  setting: string;
  submitted_at: string;
}

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: Session;
        Insert: Omit<Session, 'created_at' | 'updated_at'> & Partial<Session>;
        Update: Partial<Session>;
      };
      brand_names: {
        Row: BrandName;
        Insert: Omit<BrandName, 'id' | 'submitted_at'>;
        Update: Partial<BrandName>;
      };
      votes: {
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'submitted_at'>;
        Update: Partial<Vote>;
      };
    };
  };
}
