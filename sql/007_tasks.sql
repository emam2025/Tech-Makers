-- ============================================================
-- TKA-Egypt Academy — Tasks Table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE SET NULL,
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id),
  
  -- Content
  title text NOT NULL,
  description text,
  type text CHECK (type IN ('assignment', 'quiz', 'project', 'homework', 'exam')) DEFAULT 'assignment',
  
  -- Schedule
  due_date timestamptz,
  max_score integer DEFAULT 100,
  
  -- Status
  status text CHECK (status IN ('draft', 'published', 'closed')) DEFAULT 'draft',
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_group_id ON tasks(group_id);
CREATE INDEX IF NOT EXISTS idx_tasks_session_id ON tasks(session_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and trainers can manage tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'trainer')
    )
  );

-- Task Submissions
CREATE TABLE IF NOT EXISTS task_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  
  -- Content
  submission_text text,
  submission_url text,
  attachment_url text,
  
  -- Grading
  score integer,
  feedback text,
  graded_by uuid REFERENCES auth.users(id),
  graded_at timestamptz,
  
  -- Status
  status text CHECK (status IN ('submitted', 'graded', 'returned')) DEFAULT 'submitted',
  
  -- Meta
  submitted_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(task_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_task_submissions_task_id ON task_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_student_id ON task_submissions(student_id);

ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read task_submissions"
  ON task_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can submit their own tasks"
  ON task_submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'student'
    )
  );

CREATE POLICY "Admins and trainers can grade submissions"
  ON task_submissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'trainer')
    )
  );
