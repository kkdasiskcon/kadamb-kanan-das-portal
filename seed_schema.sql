-- ====================================================================
-- KADAMB KANAN DAS PORTAL - SUPABASE SETUP & SEED SCRIPT
-- Copy and paste this whole code block into your Supabase SQL Editor:
-- https://app.supabase.com/project/vlcmmdkionrotlzfzgbr/sql
-- Then click RUN!
-- ====================================================================

-- 1. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT DEFAULT 'Fusing High-Tech Excellence with Timeless Vedic Wisdom',
  hero_lead TEXT DEFAULT 'Empowering corporate enterprises, leadership teams, and university students across India to cultivate stress resilience, mindful focus, and purpose-driven success.',
  email TEXT DEFAULT 'kadambkanan.rns@gmail.com',
  phone TEXT DEFAULT '+91 9876543210',
  years_service INT DEFAULT 12,
  institutions_count INT DEFAULT 50,
  impacted_count INT DEFAULT 100000,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Speaking Topics Table
CREATE TABLE IF NOT EXISTS public.speaking_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  points JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Audio Lectures Table
CREATE TABLE IF NOT EXISTS public.audio_lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Vedic Wisdom',
  drive_url TEXT NOT NULL,
  duration TEXT DEFAULT '45:00',
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Video Talks Table
CREATE TABLE IF NOT EXISTS public.video_talks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  youtube_id TEXT,
  drive_url TEXT,
  category TEXT DEFAULT 'Keynote Address',
  duration TEXT DEFAULT '25:00',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Event Invitations Table
CREATE TABLE IF NOT EXISTS public.event_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  event_date DATE,
  audience_size TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS or Allow Public Access for Easy Admin Control
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaking_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_lectures DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_talks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_invitations DISABLE ROW LEVEL SECURITY;

-- Insert Initial Seed Rows
INSERT INTO public.site_settings (hero_title, hero_lead, email, phone, years_service, institutions_count, impacted_count)
VALUES (
  'Fusing High-Tech Excellence with Timeless Vedic Wisdom',
  'Empowering corporate enterprises, leadership teams, and university students across India to cultivate stress resilience, mindful focus, and purpose-driven success.',
  'kadambkanan.rns@gmail.com',
  '+91 9876543210',
  12,
  50,
  100000
) ON CONFLICT DO NOTHING;

INSERT INTO public.audio_lectures (title, category, drive_url, duration, views)
VALUES 
  ('Science of Mind Control & Overcoming Anxiety', 'Youth Focus', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', '45:00', 3420),
  ('Mindful Leadership under High Corporate Stress', 'Corporate Executive', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', '38:15', 2890),
  ('Universal Human Values - Wisdom Eye Principles', 'Vedic Science', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', '52:40', 5120)
ON CONFLICT DO NOTHING;

INSERT INTO public.video_talks (title, youtube_id, category, duration)
VALUES 
  ('Keynote Address at IIT Kharagpur Conclave', 'dQw4w9WgXcQ', 'University Keynote', '24:30'),
  ('Executive Wellness & Karma Mechanics at IBM', 'L_LUpnjgPso', 'Corporate Seminar', '32:10')
ON CONFLICT DO NOTHING;
