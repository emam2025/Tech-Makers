-- ============================================================
-- TKA-Egypt Academy — Enhanced Profiles Table
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS national_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('active', 'suspended', 'trial', 'pending')) DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count integer DEFAULT 0;

-- 2. Make national_id unique (one national ID per user)
ALTER TABLE profiles ADD CONSTRAINT profiles_national_id_unique UNIQUE (national_id);

-- 3. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_national_id ON profiles(national_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 4. Update role check to include new roles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'supervisor', 'trainer', 'student'));

-- 5. Update the auto-create profile trigger to handle new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, national_id, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    NEW.raw_user_meta_data ->> 'national_id',
    COALESCE(NEW.raw_user_meta_data ->> 'status', 'active')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to validate national_id uniqueness
CREATE OR REPLACE FUNCTION check_national_id_unique()
RETURNS trigger AS $$
BEGIN
  IF NEW.national_id IS NOT NULL AND NEW.national_id != '' THEN
    IF EXISTS (
      SELECT 1 FROM profiles
      WHERE national_id = NEW.national_id AND id != NEW.id
    ) THEN
      RAISE EXCEPTION 'رقم الهوية الوطنية مستخدم بالفعل';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for national_id validation
DROP TRIGGER IF EXISTS validate_national_id ON profiles;
CREATE TRIGGER validate_national_id
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_national_id_unique();

-- 8. Create function to update last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET last_login = now(), login_count = login_count + 1
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create RLS policies for enhanced profiles
-- Allow authenticated users to read profiles (existing)
-- Allow admins to manage all profiles (existing)
-- Allow users to update their own profile (existing)

-- 10. Add policy for guest users (limited access)
CREATE POLICY "Guest users can read basic profile info"
  ON profiles FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- VERIFICATION QUERY
-- Run this to verify the table structure:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'profiles'
-- ORDER BY ordinal_position;
-- ============================================================
