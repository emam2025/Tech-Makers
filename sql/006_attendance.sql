-- ============================================================
-- TKA-Egypt Academy — Attendance Table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  
  -- Status
  status text CHECK (status IN ('present', 'absent', 'late', 'excused')) DEFAULT 'absent',
  
  -- Meta
  marked_by uuid REFERENCES auth.users(id),
  marked_at timestamptz DEFAULT now(),
  notes text,
  
  UNIQUE(session_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_attendance_session_id ON attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_group_id ON attendance(group_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and trainers can manage attendance"
  ON attendance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'trainer')
    )
  );
