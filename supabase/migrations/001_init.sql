-- ═══════════════════════════════════════════════════════════════
--  KhabarPati — Initial Schema
--  Run this in your Supabase SQL editor or via supabase db push
-- ═══════════════════════════════════════════════════════════════

-- ─── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles ─────────────────────────────────────────────────
-- Extends auth.users (created automatically by Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name              TEXT,
  phone             TEXT UNIQUE,
  email             TEXT,
  avatar_url        TEXT,
  subscription      TEXT NOT NULL DEFAULT 'free'
                    CHECK (subscription IN ('free', 'whatsapp', 'sms', 'premium')),
  interests         TEXT[]   NOT NULL DEFAULT '{}',
  preferred_sources TEXT[]   NOT NULL DEFAULT '{}',
  saved_articles    TEXT[]   NOT NULL DEFAULT '{}',
  notif_email       BOOLEAN  NOT NULL DEFAULT true,
  notif_whatsapp    BOOLEAN  NOT NULL DEFAULT false,
  notif_sms         BOOLEAN  NOT NULL DEFAULT false,
  joined_date       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone)
  VALUES (
    NEW.id,
    NEW.phone
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ─── News Items ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.news_items (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  title_en        TEXT,
  excerpt         TEXT,
  excerpt_en      TEXT,
  category        TEXT NOT NULL DEFAULT 'सामान्य',
  category_en     TEXT NOT NULL DEFAULT 'General',
  source          TEXT NOT NULL,
  source_url      TEXT,
  url             TEXT UNIQUE NOT NULL,
  image_url       TEXT,
  emoji           TEXT DEFAULT '📰',
  interest_score  INTEGER NOT NULL DEFAULT 50 CHECK (interest_score BETWEEN 0 AND 100),
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  is_breaking     BOOLEAN NOT NULL DEFAULT false,
  views           INTEGER NOT NULL DEFAULT 0,
  published_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS news_items_published_at_idx ON public.news_items (published_at DESC);
CREATE INDEX IF NOT EXISTS news_items_category_idx     ON public.news_items (category);
CREATE INDEX IF NOT EXISTS news_items_is_featured_idx  ON public.news_items (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS news_items_is_breaking_idx  ON public.news_items (is_breaking) WHERE is_breaking = true;
CREATE INDEX IF NOT EXISTS news_items_source_idx       ON public.news_items (source);

-- RLS — public read
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read news"
  ON public.news_items FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert/update news"
  ON public.news_items FOR ALL
  USING (auth.role() = 'service_role');

-- ─── Ads ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label       TEXT NOT NULL,
  label_en    TEXT,
  sponsor     TEXT NOT NULL,
  cta         TEXT NOT NULL DEFAULT 'थप जान्नुहोस्',
  cta_en      TEXT NOT NULL DEFAULT 'Learn More',
  gradient    TEXT NOT NULL DEFAULT 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  badge       TEXT,
  badge_color TEXT NOT NULL DEFAULT '#C41E3A',
  size        TEXT NOT NULL DEFAULT 'medium-rect'
              CHECK (size IN ('leaderboard', 'medium-rect', 'half-page', 'strip')),
  target_url  TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  priority    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active ads"
  ON public.ads FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role can manage ads"
  ON public.ads FOR ALL
  USING (auth.role() = 'service_role');

-- ─── Breaking Tickers ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.breaking_tickers (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text_np    TEXT NOT NULL,
  text_en    TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  priority   INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.breaking_tickers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active tickers"
  ON public.breaking_tickers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role can manage tickers"
  ON public.breaking_tickers FOR ALL
  USING (auth.role() = 'service_role');

-- ─── Article Views (analytics) ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.article_views (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id  UUID REFERENCES public.news_items(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS article_views_article_id_idx ON public.article_views (article_id);

ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage views"
  ON public.article_views FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can insert own views"
  ON public.article_views FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ─── RPC: increment article view count ────────────────────────
CREATE OR REPLACE FUNCTION public.increment_views(article_id UUID)
RETURNS VOID AS $$
  UPDATE public.news_items SET views = views + 1 WHERE id = article_id;
$$ LANGUAGE SQL SECURITY DEFINER;

ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage views"
  ON public.article_views FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can insert own views"
  ON public.article_views FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
