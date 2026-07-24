-- ============================================================
-- SUPABASE STRICT ROW LEVEL SECURITY (RLS) POLICIES
-- Copy and paste this into: Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- 1. Enable RLS on both tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 2. Clean up any existing policies
DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Public can insert messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can read messages" ON messages;
DROP POLICY IF EXISTS "Allow message verification update" ON messages;
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON messages;
DROP POLICY IF EXISTS "Admin full access site_settings" ON site_settings;
DROP POLICY IF EXISTS "Admin full access messages" ON messages;

-- ============================================================
-- SITE_SETTINGS SECURITY POLICIES
-- ============================================================

-- Public (Visitors): Can ONLY READ portfolio_data and under_construction
CREATE POLICY "Public read site_settings"
  ON site_settings FOR SELECT
  USING (true);

-- Admin Only (Authenticated): Can UPDATE site settings
CREATE POLICY "Admin update site_settings"
  ON site_settings FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Admin Only (Authenticated): Can INSERT site settings
CREATE POLICY "Admin insert site_settings"
  ON site_settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- MESSAGES SECURITY POLICIES
-- ============================================================

-- Public (Visitors): Can ONLY INSERT contact form messages
CREATE POLICY "Public insert messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Admin Only (Authenticated): Can VIEW/READ all messages
CREATE POLICY "Admin select messages"
  ON messages FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin & Verification update policy
CREATE POLICY "Allow verification and admin update messages"
  ON messages FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Admin Only (Authenticated): Can DELETE messages
CREATE POLICY "Admin delete messages"
  ON messages FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- CLEANUP SENSITIVE COLUMNS
-- ============================================================
ALTER TABLE site_settings DROP COLUMN IF EXISTS admin_user;
ALTER TABLE site_settings DROP COLUMN IF EXISTS admin_pass;
