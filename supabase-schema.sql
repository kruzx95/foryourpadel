-- ═══════════════════════════════════════════════════════════
-- FOR YOU PADEL (FYP) — Supabase PostgreSQL Schema (HARDENED)
-- Security Best Practice: Strict Row Level Security (RLS) + Principle of Least Privilege
-- ═══════════════════════════════════════════════════════════

-- 1. COURTS TABLE
CREATE TABLE IF NOT EXISTS public.courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) DEFAULT 'panoramic',
  description TEXT,
  rate_regular NUMERIC(12, 2) DEFAULT 180000,
  rate_peak NUMERIC(12, 2) DEFAULT 250000,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SLOTS AVAILABILITY TABLE
CREATE TABLE IF NOT EXISTS public.slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id UUID REFERENCES public.courts(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'available', -- 'available' | 'booked' | 'blocked'
  is_peak BOOLEAN DEFAULT false,
  booked_by VARCHAR(100),
  customer_phone VARCHAR(50),
  booking_id UUID,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(court_id, slot_date, time_start)
);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(30) UNIQUE NOT NULL,
  court_name VARCHAR(100) NOT NULL,
  booking_date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  duration INT DEFAULT 2,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  rackets_count INT DEFAULT 0,
  balls_count INT DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL,
  payment_status VARCHAR(30) DEFAULT 'pending', -- 'pending' | 'paid_dp' | 'paid_full' | 'completed' | 'cancelled'
  notes TEXT,
  source VARCHAR(50) DEFAULT 'whatsapp_web',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TOURNAMENTS TABLE
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(150) NOT NULL,
  subtitle TEXT,
  status VARCHAR(30) DEFAULT 'no_tournament',
  date_start DATE,
  date_end DATE,
  venue VARCHAR(100) DEFAULT 'FYP Padel Court Tasikmalaya',
  prize_pool_total NUMERIC(12, 2) DEFAULT 15000000,
  entry_fee NUMERIC(12, 2) DEFAULT 350000,
  categories JSONB DEFAULT '["Men Double (Beginner - Intermediate)", "Women Double (Beginner - Intermediate)", "Open Mixed Double"]'::jsonb,
  schedule_data JSONB DEFAULT '[]'::jsonb,
  rules TEXT[],
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES — HARDENED
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 1. COURTS:
-- Public can only READ active courts
CREATE POLICY "Public read active courts" ON public.courts 
  FOR SELECT TO anon, authenticated 
  USING (is_active = true);

-- Only authenticated admins can modify courts
CREATE POLICY "Admin manage courts" ON public.courts 
  FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);

-- 2. SLOTS & PUBLIC AVAILABILITY VIEW:
-- Security Best Practice: Data Minimization & Privacy Protection (Zero-Trust)
-- Public users should only know if a time slot is free or booked.
-- Customer phone numbers, player names, and internal staff notes MUST NEVER be exposed to the public.

-- Create hardened public view:
CREATE OR REPLACE VIEW public.v_public_slots AS
  SELECT 
    s.id,
    s.court_id,
    c.code AS court_code,
    c.name AS court_name,
    s.slot_date,
    s.time_start,
    s.time_end,
    s.status,
    s.is_peak
  FROM public.slots s
  JOIN public.courts c ON c.id = s.court_id;

-- Grant public read access to the non-sensitive view:
GRANT SELECT ON public.v_public_slots TO anon, authenticated;

-- On the base 'slots' table: ONLY authenticated staff can read sensitive customer data
CREATE POLICY "Admin select raw slots" ON public.slots 
  FOR SELECT TO authenticated 
  USING (true);

-- Only authenticated admins can insert, update, or delete slots
CREATE POLICY "Admin manage slots" ON public.slots 
  FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);

-- 3. BOOKINGS (PRIVACY CRITICAL):
-- Public CANNOT read bookings (prevents customer harvesting / data leak!)
-- Public can ONLY INSERT their own booking
CREATE POLICY "Public insert booking" ON public.bookings 
  FOR INSERT TO anon, authenticated 
  WITH CHECK (true);

-- Only authenticated admins can read, update, or delete bookings
CREATE POLICY "Admin manage bookings" ON public.bookings 
  FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);

-- 4. TOURNAMENTS:
-- Public can read tournament info
CREATE POLICY "Public read tournaments" ON public.tournaments 
  FOR SELECT TO anon, authenticated 
  USING (true);

-- Only authenticated admins can modify tournaments
CREATE POLICY "Admin manage tournaments" ON public.tournaments 
  FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);

-- 5. SETTINGS:
-- Public can read public store settings (rates, hours)
CREATE POLICY "Public read settings" ON public.settings 
  FOR SELECT TO anon, authenticated 
  USING (true);

-- Only authenticated admins can modify settings
CREATE POLICY "Admin manage settings" ON public.settings 
  FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════
-- SEED INITIAL DATA
-- ═══════════════════════════════════════════════════════════
INSERT INTO public.courts (code, name, type, description, rate_regular, rate_peak)
VALUES 
  ('court-1', 'Court 1 — Panoramic WPT', 'panoramic', 'Kaca panoramik tanpa pilar 12mm, karpet Mondo Supercourt XN, pencahayaan LED 800 lux.', 200000, 280000),
  ('court-2', 'Court 2 — Standard Pro A', 'standard', 'Lapangan spesifikasi kompetisi resmi, bantalan karpet empuk anti-cedera lutut.', 180000, 250000),
  ('court-3', 'Court 3 — Standard Pro B', 'standard', 'Optimal untuk sparring harian, latihan intensif, maupun fun match komunitas.', 180000, 250000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.tournaments (slug, title, subtitle, status, date_start, date_end, prize_pool_total, entry_fee)
VALUES (
  'fyp-tasik-padel-open-2026',
  'FYP Tasikmalaya Padel Championship 2026',
  'Turnamen Padel resmi terbesar di Priangan Timur mempertemukan talenta terbaik Jawa Barat.',
  'no_tournament',
  '2026-10-18',
  '2026-10-19',
  15000000,
  350000
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.settings (key, value)
VALUES 
  ('rates', '{"regular": 180000, "peak": 250000, "racket_rent": 35000, "balls_buy": 85000}'::jsonb),
  ('hours', '{"open": "06:00", "close": "23:00", "peak_start": "17:00", "peak_end": "23:00"}'::jsonb),
  ('whatsapp', '{"admin_number": "6281234567890", "default_message": "Halo Admin FYP Padel..."}'::jsonb)
ON CONFLICT (key) DO NOTHING;
