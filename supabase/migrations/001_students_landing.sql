-- Create students table for landing page registration
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE,
  email TEXT,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  grade NUMERIC,
  country TEXT DEFAULT 'مصر',
  governorate TEXT,
  city TEXT,
  school TEXT,
  study_mode TEXT,
  track TEXT CHECK (track IN ('a', 'b', 'c', 'technomath', 'techenglish', 'secondary')) NOT NULL,
  plan TEXT CHECK (plan IN ('monthly', 'quarterly', 'yearly')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant access to API roles
GRANT SELECT ON students TO anon;
GRANT INSERT ON students TO anon;
GRANT SELECT ON students TO authenticated;
GRANT INSERT ON students TO authenticated;

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public registration form)
CREATE POLICY "Allow public insert" ON students
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read (admin dashboard)
CREATE POLICY "Allow authenticated read" ON students
  FOR SELECT TO authenticated USING (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_track ON students(track);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at);