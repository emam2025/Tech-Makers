-- ============================================================
-- TKA-Egypt Academy — Trainers Table
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create trainers table
CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  national_id text UNIQUE NOT NULL,
  profile_photo text,
  
  -- Professional
  specialty text NOT NULL,
  experience_years integer DEFAULT 0,
  qualifications text,
  bio text,
  skills text[],
  
  -- Availability
  availability text CHECK (availability IN ('full_time', 'part_time', 'freelance', 'unavailable')) DEFAULT 'full_time',
  max_groups integer DEFAULT 5,
  
  -- Status
  status text CHECK (status IN ('active', 'inactive', 'suspended', 'pending')) DEFAULT 'pending',
  
  -- Rating
  rating numeric(3,2) DEFAULT 0,
  total_ratings integer DEFAULT 0,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_trainers_user_id ON trainers(user_id);
CREATE INDEX IF NOT EXISTS idx_trainers_national_id ON trainers(national_id);
CREATE INDEX IF NOT EXISTS idx_trainers_specialty ON trainers(specialty);
CREATE INDEX IF NOT EXISTS idx_trainers_status ON trainers(status);

-- 3. Enable RLS
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Authenticated users can read trainers"
  ON trainers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage trainers"
  ON trainers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_trainers_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_trainers_updated_at
  BEFORE UPDATE ON trainers
  FOR EACH ROW
  EXECUTE FUNCTION update_trainers_updated_at();
