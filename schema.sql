-- ====================================================================
-- Kadamb Kanan Das Portal - Supabase PostgreSQL Database Schema
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)
-- ====================================================================

-- 1. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
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
CREATE TABLE IF NOT EXISTS speaking_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'corporate', 'university', 'values'
  description TEXT,
  points JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Audio Lectures Table (Google Drive Audio / Direct MP3)
CREATE TABLE IF NOT EXISTS audio_lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Vedic Wisdom',
  drive_url TEXT NOT NULL,
  duration TEXT DEFAULT '45 mins',
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Video Talks Table (YouTube / Google Drive Videos)
CREATE TABLE IF NOT EXISTS video_talks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  youtube_id TEXT, -- e.g. "dQw4w9WgXcQ"
  drive_url TEXT,
  category TEXT DEFAULT 'Keynote Address',
  duration TEXT DEFAULT '25:00',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Blogs & Articles Table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Photo Gallery Table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Seminar',
  event_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Event Invitations Table
CREATE TABLE IF NOT EXISTS event_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  event_date DATE,
  audience_size TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Acknowledged', 'Confirmed'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_talks ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_invitations ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Topics" ON speaking_topics FOR SELECT USING (true);
CREATE POLICY "Public Read Audio" ON audio_lectures FOR SELECT USING (true);
CREATE POLICY "Public Read Videos" ON video_talks FOR SELECT USING (true);
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public Read Photos" ON photos FOR SELECT USING (true);
CREATE POLICY "Public Insert Invitations" ON event_invitations FOR INSERT WITH CHECK (true);

-- Allow Authenticated Admin Full Access
CREATE POLICY "Admin All Settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Topics" ON speaking_topics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Audio" ON audio_lectures FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Videos" ON video_talks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Blogs" ON blogs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Photos" ON photos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Invitations" ON event_invitations FOR ALL USING (auth.role() = 'authenticated');
