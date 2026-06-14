-- ============================================================
-- TKA-Egypt Academy — Enhanced Students Table
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create enhanced students table
CREATE TABLE IF NOT EXISTS students_enhanced (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  whatsapp text,
  national_id text UNIQUE NOT NULL,
  birth_date date,
  gender text CHECK (gender IN ('male', 'female')),
  country text DEFAULT 'egypt',
  governorate text,
  city text,
  address text,
  
  -- Academic
  track text CHECK (track IN ('a', 'b', 'c', 'technomath', 'techenglish')),
  grade numeric,
  school text,
  
  -- Status
  status text CHECK (status IN ('active', 'inactive', 'suspended', 'trial', 'pending')) DEFAULT 'pending',
  
  -- Emergency Contact
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relation text,
  
  -- Medical
  medical_notes text,
  
  -- Meta
  profile_photo text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_students_enhanced_user_id ON students_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_students_enhanced_national_id ON students_enhanced(national_id);
CREATE INDEX IF NOT EXISTS idx_students_enhanced_track ON students_enhanced(track);
CREATE INDEX IF NOT EXISTS idx_students_enhanced_status ON students_enhanced(status);
CREATE INDEX IF NOT EXISTS idx_students_enhanced_email ON students_enhanced(email);

-- 3. Enable RLS
ALTER TABLE students_enhanced ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Authenticated users can read students"
  ON students_enhanced FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage students"
  ON students_enhanced FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Supervisors can manage students in their groups"
  ON students_enhanced FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

-- 5. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_students_enhanced_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_students_enhanced_updated_at
  BEFORE UPDATE ON students_enhanced
  FOR EACH ROW
  EXECUTE FUNCTION update_students_enhanced_updated_at();

-- ============================================================
-- VERIFICATION QUERY
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'students_enhanced'
-- ORDER BY ordinal_position;
-- ============================================================
