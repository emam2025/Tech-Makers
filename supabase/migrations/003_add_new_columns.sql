-- Add new columns to team_applications table
-- Run this in Supabase SQL Editor

ALTER TABLE team_applications
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS middle_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS marital_status TEXT,
  ADD COLUMN IF NOT EXISTS qualification TEXT,
  ADD COLUMN IF NOT EXISTS college TEXT,
  ADD COLUMN IF NOT EXISTS qualification_name TEXT,
  ADD COLUMN IF NOT EXISTS graduation_year TEXT,
  ADD COLUMN IF NOT EXISTS university TEXT,
  ADD COLUMN IF NOT EXISTS major TEXT,
  ADD COLUMN IF NOT EXISTS lang_arabic TEXT,
  ADD COLUMN IF NOT EXISTS lang_english TEXT,
  ADD COLUMN IF NOT EXISTS lang_french TEXT,
  ADD COLUMN IF NOT EXISTS skills TEXT,
  ADD COLUMN IF NOT EXISTS experience_history TEXT,
  ADD COLUMN IF NOT EXISTS obtained_certificates TEXT,
  ADD COLUMN IF NOT EXISTS work_preference TEXT,
  ADD COLUMN IF NOT EXISTS photo_url TEXT;
