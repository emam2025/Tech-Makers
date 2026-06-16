-- Create english_test_results table for English placement test
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS english_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  level TEXT CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')) NOT NULL,
  percentage NUMERIC NOT NULL,
  correct INTEGER NOT NULL,
  total INTEGER NOT NULL,
  track TEXT CHECK (track IN ('a', 'b', 'c')),
  strengths TEXT[],
  weaknesses TEXT[],
  breakdown JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant access to API roles
GRANT SELECT ON english_test_results TO anon;
GRANT INSERT ON english_test_results TO anon;
GRANT SELECT ON english_test_results TO authenticated;
GRANT INSERT ON english_test_results TO authenticated;

-- Enable RLS
ALTER TABLE english_test_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public test submission)
CREATE POLICY "Allow public insert" ON english_test_results
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read (admin dashboard)
CREATE POLICY "Allow authenticated read" ON english_test_results
  FOR SELECT TO authenticated USING (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_english_test_results_email ON english_test_results(email);
CREATE INDEX IF NOT EXISTS idx_english_test_results_level ON english_test_results(level);
CREATE INDEX IF NOT EXISTS idx_english_test_results_created_at ON english_test_results(created_at);