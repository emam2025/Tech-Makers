-- ============================================================
-- TKA-Egypt Academy — Progress Tracking Table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id) ON DELETE SET NULL,
  
  -- Progress Metrics
  total_sessions integer DEFAULT 0,
  attended_sessions integer DEFAULT 0,
  attendance_rate numeric(5,2) DEFAULT 0,
  
  total_tasks integer DEFAULT 0,
  completed_tasks integer DEFAULT 0,
  task_completion_rate numeric(5,2) DEFAULT 0,
  
  average_score numeric(5,2) DEFAULT 0,
  total_score integer DEFAULT 0,
  
  -- Level
  current_level text,
  level_progress numeric(5,2) DEFAULT 0,
  
  -- Evaluations
  last_evaluation_date date,
  evaluation_score numeric(5,2),
  evaluation_notes text,
  
  -- Meta
  last_activity_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(student_id, group_id)
);

CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_group_id ON student_progress(group_id);

ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read student_progress"
  ON student_progress FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and trainers can update student_progress"
  ON student_progress FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'trainer')
    )
  );

CREATE OR REPLACE FUNCTION update_student_progress_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_student_progress_updated_at
  BEFORE UPDATE ON student_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_student_progress_updated_at();

-- ============================================================
-- Progress Timeline (Event Log)
-- ============================================================

CREATE TABLE IF NOT EXISTS progress_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id) ON DELETE SET NULL,
  
  -- Event
  event_type text CHECK (event_type IN ('session_attended', 'session_missed', 'task_submitted', 'task_graded', 'evaluation', 'level_up', 'payment', 'other')) NOT NULL,
  event_description text,
  
  -- Reference
  reference_type text,
  reference_id uuid,
  
  -- Score
  score integer,
  
  -- Meta
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_progress_events_student_id ON progress_events(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_events_event_type ON progress_events(event_type);
CREATE INDEX IF NOT EXISTS idx_progress_events_created_at ON progress_events(created_at);

ALTER TABLE progress_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read progress_events"
  ON progress_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can create progress_events"
  ON progress_events FOR INSERT
  TO authenticated
  WITH CHECK (true);
