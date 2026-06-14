-- ============================================================
-- TKA-Egypt Academy — Sessions Table
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  trainer_id uuid REFERENCES trainers(id) ON DELETE SET NULL,
  
  -- Schedule
  title text NOT NULL,
  description text,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  duration integer DEFAULT 120, -- minutes
  end_time time,
  
  -- Content
  topics text[],
  materials text[],
  
  -- Status
  status text CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')) DEFAULT 'scheduled',
  
  -- Meta
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_sessions_group_id ON sessions(group_id);
CREATE INDEX IF NOT EXISTS idx_sessions_trainer_id ON sessions(trainer_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_date ON sessions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

-- 3. Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Authenticated users can read sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and trainers can manage sessions"
  ON sessions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'trainer')
    )
  );

-- 5. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_sessions_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_sessions_updated_at();
