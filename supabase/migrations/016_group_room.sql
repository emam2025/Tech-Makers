-- Migration 016: Group Room — extend groups + sessions
-- Groups: add level, program_name
-- Sessions: add requirements, tasks, hours, join_url, is_join_active, details, status enum

-- ============================================================
-- 1. Extend groups table
-- ============================================================
ALTER TABLE groups ADD COLUMN IF NOT EXISTS level text DEFAULT 'beginner';
ALTER TABLE groups ADD COLUMN IF NOT EXISTS program_name text;

-- ============================================================
-- 2. Extend sessions table
-- ============================================================
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS requirements jsonb DEFAULT '[]'::jsonb;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS tasks jsonb DEFAULT '[]'::jsonb;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS theoretical_hours numeric DEFAULT 0;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS practical_hours numeric DEFAULT 0;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS projects jsonb DEFAULT '[]'::jsonb;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS join_url text;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS is_join_active boolean DEFAULT false;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS details text;

-- Status enum: upcoming, completed, postponed, cancelled
-- (sessions table may already have a status column, we just add a default + check)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sessions_status_check'
  ) THEN
    ALTER TABLE sessions ADD CONSTRAINT sessions_status_check
      CHECK (status IN ('upcoming', 'completed', 'postponed', 'cancelled'));
  END IF;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Set default status for existing sessions that have no status
UPDATE sessions SET status = 'upcoming' WHERE status IS NULL;

-- ============================================================
-- 3. RLS policies for sessions (if not already)
-- ============================================================
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admin/supervisor full access on sessions' AND tablename = 'sessions'
  ) THEN
    CREATE POLICY "Admin/supervisor full access on sessions" ON sessions
      FOR ALL TO authenticated
      USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'supervisor'))
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Trainer manage own sessions' AND tablename = 'sessions'
  ) THEN
    CREATE POLICY "Trainer manage own sessions" ON sessions
      FOR ALL TO authenticated
      USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'trainer')
        AND trainer_id = auth.uid()
      );
  END IF;
END $$;
