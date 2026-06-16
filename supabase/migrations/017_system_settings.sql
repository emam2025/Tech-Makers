-- Migration 017: System Settings — Ads, Payment Gateways, Pages, Permissions

-- ============================================================
-- 1. system_settings — key/value store for global config
-- ============================================================
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb DEFAULT '{}'::jsonb,
  category text DEFAULT 'general',
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on system_settings' AND tablename = 'system_settings') THEN
    CREATE POLICY "Admin full access on system_settings" ON system_settings FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
  END IF;
END $$;

-- ============================================================
-- 2. advertisements — popup, in-group, targeted ads
-- ============================================================
CREATE TABLE IF NOT EXISTS advertisements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text,
  image_url text,
  link_url text,
  type text NOT NULL DEFAULT 'popup' CHECK (type IN ('popup', 'banner', 'inline', 'notification')),
  target text NOT NULL DEFAULT 'all' CHECK (target IN ('all', 'students', 'trainers', 'supervisors', 'group')),
  target_group_id uuid REFERENCES groups(id),
  position text DEFAULT 'top' CHECK (position IN ('top', 'bottom', 'sidebar', 'center')),
  is_active boolean DEFAULT true,
  start_date timestamptz,
  end_date timestamptz,
  display_rules jsonb DEFAULT '{}'::jsonb,
  priority integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on ads' AND tablename = 'advertisements') THEN
    CREATE POLICY "Admin full access on ads" ON advertisements FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'supervisor')));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read active ads' AND tablename = 'advertisements') THEN
    CREATE POLICY "Public read active ads" ON advertisements FOR SELECT USING (is_active = true);
  END IF;
END $$;

-- ============================================================
-- 3. payment_gateways — wallets, visa, fawry, custom links
-- ============================================================
CREATE TABLE IF NOT EXISTS payment_gateways (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'wallet' CHECK (type IN ('wallet', 'visa', 'fawry', 'instapay', 'link', 'bank_transfer', 'other')),
  icon text,
  details jsonb DEFAULT '{}'::jsonb,
  instructions text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on gateways' AND tablename = 'payment_gateways') THEN
    CREATE POLICY "Admin full access on gateways" ON payment_gateways FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'supervisor')));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read active gateways' AND tablename = 'payment_gateways') THEN
    CREATE POLICY "Public read active gateways" ON payment_gateways FOR SELECT USING (is_active = true);
  END IF;
END $$;

-- ============================================================
-- 4. site_pages — custom pages, banners, sections
-- ============================================================
CREATE TABLE IF NOT EXISTS site_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  type text NOT NULL DEFAULT 'page' CHECK (type IN ('page', 'banner', 'section', 'slider', 'footer', 'header')),
  is_active boolean DEFAULT true,
  meta jsonb DEFAULT '{}'::jsonb,
  sort_order integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on pages' AND tablename = 'site_pages') THEN
    CREATE POLICY "Admin full access on pages" ON site_pages FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'supervisor')));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read active pages' AND tablename = 'site_pages') THEN
    CREATE POLICY "Public read active pages" ON site_pages FOR SELECT USING (is_active = true);
  END IF;
END $$;

-- ============================================================
-- 5. role_permissions — detailed permissions per role
-- ============================================================
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role text NOT NULL CHECK (role IN ('admin', 'supervisor', 'trainer', 'student')),
  resource text NOT NULL,
  permissions jsonb DEFAULT '{"read": true, "write": false, "delete": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role, resource)
);

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on permissions' AND tablename = 'role_permissions') THEN
    CREATE POLICY "Admin full access on permissions" ON role_permissions FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
  END IF;
END $$;

-- Seed default permissions for each role
INSERT INTO role_permissions (role, resource, permissions) VALUES
  ('admin', 'students', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'trainers', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'groups', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'sessions', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'attendance', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'tasks', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'payments', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'evaluations', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'messages', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'notifications', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'settings', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'ads', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'gateways', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'pages', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'subscriptions', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'alerts', '{"read": true, "write": true, "delete": true}'),
  ('supervisor', 'students', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'trainers', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'groups', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'sessions', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'attendance', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'tasks', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'payments', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'evaluations', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'messages', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'settings', '{"read": true, "write": false, "delete": false}'),
  ('supervisor', 'ads', '{"read": true, "write": false, "delete": false}'),
  ('supervisor', 'gateways', '{"read": true, "write": false, "delete": false}'),
  ('supervisor', 'pages', '{"read": true, "write": false, "delete": false}'),
  ('trainer', 'students', '{"read": true, "write": false, "delete": false}'),
  ('trainer', 'groups', '{"read": true, "write": false, "delete": false}'),
  ('trainer', 'sessions', '{"read": true, "write": true, "delete": false}'),
  ('trainer', 'attendance', '{"read": true, "write": true, "delete": false}'),
  ('trainer', 'tasks', '{"read": true, "write": true, "delete": false}'),
  ('trainer', 'evaluations', '{"read": true, "write": true, "delete": false}'),
  ('trainer', 'messages', '{"read": true, "write": true, "delete": false}'),
  ('student', 'tasks', '{"read": true, "write": false, "delete": false}'),
  ('student', 'messages', '{"read": true, "write": true, "delete": false}'),
  ('student', 'notifications', '{"read": true, "write": false, "delete": false}')
ON CONFLICT (role, resource) DO NOTHING;
