-- Create team_applications table for team registration forms
CREATE TABLE IF NOT EXISTS team_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type TEXT NOT NULL CHECK (form_type IN ('trainer', 'specialist', 'admin')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  specialty TEXT,
  experience TEXT,
  portfolio TEXT,
  bio TEXT NOT NULL,
  online_work TEXT NOT NULL,
  student_interaction TEXT NOT NULL,
  gulf_experience TEXT NOT NULL,
  certificate TEXT,
  department TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant access to API roles (required since Supabase no longer auto-exposes tables)
GRANT SELECT ON team_applications TO anon;
GRANT INSERT ON team_applications TO anon;
GRANT SELECT ON team_applications TO authenticated;
GRANT INSERT ON team_applications TO authenticated;

-- Enable RLS
ALTER TABLE team_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public registration form)
CREATE POLICY "Allow public insert" ON team_applications
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read (admin dashboard)
CREATE POLICY "Allow authenticated read" ON team_applications
  FOR SELECT TO authenticated USING (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_team_applications_email ON team_applications(email);
CREATE INDEX IF NOT EXISTS idx_team_applications_form_type ON team_applications(form_type);
CREATE INDEX IF NOT EXISTS idx_team_applications_status ON team_applications(status);
