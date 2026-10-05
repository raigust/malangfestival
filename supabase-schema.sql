-- ====================================================================
-- MALANG FEST - SUPABASE SCHEMA & SEED MIGRATION SCRIPT
-- ====================================================================
-- Panduan Eksekusi:
-- 1. Buka dashboard Supabase Anda (https://supabase.com/dashboard)
-- 2. Pilih project Anda -> SQL Editor -> New Query
-- 3. Paste seluruh isi file ini dan klik "Run" (Ctrl+Enter)
-- ====================================================================

-- 1. Tabel Admins
CREATE TABLE IF NOT EXISTS public.admins (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ADMIN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabel Events (Poster Pertunjukan Mading)
CREATE TABLE IF NOT EXISTS public.events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  border_style TEXT NOT NULL DEFAULT 'washi-tape',
  pin_rotation INTEGER NOT NULL DEFAULT 0,
  date TIMESTAMPTZ NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  venue_address TEXT,
  price_type TEXT NOT NULL DEFAULT 'Gratis',
  price TEXT NOT NULL,
  ticket_url TEXT,
  performer TEXT NOT NULL,
  curator TEXT,
  synopsis TEXT NOT NULL,
  highlight TEXT,
  status TEXT NOT NULL DEFAULT 'UPCOMING',
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pencarian
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events (category);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events (status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events (date);

-- 3. Tabel Stickers (Stiker Apresiasi Mading)
CREATE TABLE IF NOT EXISTS public.stickers (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#FFE600',
  rotation NUMERIC(4, 1) NOT NULL DEFAULT 0,
  is_curator_badge BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stickers_event_id ON public.stickers (event_id);

-- 4. Tabel Site Content (CMS Teks Mading Malang Fest)
CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Seed Default Admin (admin / admin123)
-- bcrypt hash $2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRpH.eQW2q5m2mD3tM0yR8Y.xO0qC
INSERT INTO public.admins (username, password_hash, display_name, role)
VALUES (
  'admin',
  '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRpH.eQW2q5m2mD3tM0yR8Y.xO0qC',
  'Admin Malang Fest',
  'ADMIN'
)
ON CONFLICT (username) DO NOTHING;

-- 6. Seed Site Content
INSERT INTO public.site_content (key, data)
VALUES (
  'main',
  '{
    "topTape": "MADING SENI MALANG · KABAR PANGGUNG, BUNYI, DAN RUPA · EDISI OKTOBER 2026 ✦ MARI MERIAHKAN KOTA",
    "heroEyebrow": "KOTA MALANG, INDONESIA • RUANG SENI TERBUKA",
    "heroTitleLine1": "Yang hidup",
    "heroTitleLine2": "di kota ini,",
    "heroTitleItalic": "jangan lewat.",
    "heroIntro": "Konser, lakon, opera, pameran, dan gerak yang sedang mencari penontonnya. Semua ditempel di satu mading.",
    "heroPhotoUrl": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1300&q=85",
    "heroSideDate": "03/10/26",
    "heroSideNote": "CATAT. DATANG. BERISIK.",
    "marqueeItems": ["♫ KONSER", "✦ PAMERAN", "♧ PERTUNJUKAN", "◉ OPERA", "☄ TEATER", "☕ DISKUSI SENI"],
    "manifestoText": "Malang Fest adalah mading digital untuk hal-hal yang membuat kota ini berbunyi, bergerak, dan berpikir.",
    "footerTagline": "Bukan mesin tiket. Ini papan kabar untuk yang berkarya.",
    "categories": ["Semua", "Musik & Konser", "Opera & Klasik", "Teater & Drama", "Tari & Budaya", "Pameran Seni & Rupa", "Seni Rupa"],
    "audioTrack": {
      "enabled": true,
      "title": "Nocturne di Kayutangan (Akustik & Klasik Santai)",
      "artist": "Malang Classical & Heritage Ensemble",
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=jfKfPfyJRdk",
      "youtubeId": "jfKfPfyJRdk",
      "autoplay": true,
      "volume": 50
    }
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 7. Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Policy: Publik boleh membaca event yang statusnya UPCOMING / PUBLISHED
DROP POLICY IF EXISTS "Public can view published events" ON public.events;
CREATE POLICY "Public can view published events"
ON public.events FOR SELECT
USING (status IN ('UPCOMING', 'PUBLISHED'));

-- Policy: Publik boleh membaca semua stiker
DROP POLICY IF EXISTS "Public can view stickers" ON public.stickers;
CREATE POLICY "Public can view stickers"
ON public.stickers FOR SELECT
USING (true);

-- Policy: Publik boleh menempel stiker
DROP POLICY IF EXISTS "Public can create stickers" ON public.stickers;
CREATE POLICY "Public can create stickers"
ON public.stickers FOR INSERT
WITH CHECK (true);

-- Policy: Publik boleh membaca konten website
DROP POLICY IF EXISTS "Public can view site content" ON public.site_content;
CREATE POLICY "Public can view site content"
ON public.site_content FOR SELECT
USING (true);

-- Policy: Service role / backend memiliki akses penuh
DROP POLICY IF EXISTS "Service role full access events" ON public.events;
CREATE POLICY "Service role full access events"
ON public.events FOR ALL
USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access stickers" ON public.stickers;
CREATE POLICY "Service role full access stickers"
ON public.stickers FOR ALL
USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access content" ON public.site_content;
CREATE POLICY "Service role full access content"
ON public.site_content FOR ALL
USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access admins" ON public.admins;
CREATE POLICY "Service role full access admins"
ON public.admins FOR ALL
USING (auth.role() = 'service_role');
