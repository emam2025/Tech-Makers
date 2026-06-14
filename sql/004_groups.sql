-- ============================================================
-- TKA-Egypt Academy — Groups Table
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  
  -- Relationships
  track text CHECK (track IN ('a', 'b', 'c', 'technomath', 'techenglish')) NOT NULL,
  trainer_id uuid REFERENCES trainers(id) ON DELETE SET NULL,
  supervisor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Schedule
  schedule_day text CHECK (schedule_day IN ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')),
  schedule_time time,
  schedule_duration integer DEFAULT 120, -- minutes
  
  -- Capacity
  max_students integer DEFAULT 25,
  current_students integer DEFAULT 0,
  
  -- Status
  status text CHECK (status IN ('active', 'inactive', 'full', 'archived')) DEFAULT 'active',
  
  -- Location
  branch text,
  room text,
  is_online boolean DEFAULT false,
  meeting_link text,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_groups_track ON groups(track);
CREATE INDEX IF NOT EXISTS idx_groups_trainer_id ON groups(trainer_id);
CREATE INDEX IF NOT EXISTS idx_groups_supervisor_id ON groups(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_groups_status ON groups(status);
CREATE INDEX IF NOT EXISTS idx_groups_branch ON groups(branch);

-- 3. Enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Authenticated users can read groups"
  ON groups FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage groups"
  ON groups FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Supervisors can manage their groups"
  ON groups FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

-- 5. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_groups_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW
  EXECUTE FUNCTION update_groups_updated_at();

-- ============================================================
-- Group-Students Junction Table
-- ============================================================

CREATE TABLE IF NOT EXISTS group_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  status text CHECK (status IN ('active', 'inactive', 'transferred')) DEFAULT 'active',
  UNIQUE(group_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_group_students_group_id ON group_students(group_id);
CREATE INDEX IF NOT EXISTS idx_group_students_student_id ON group_students(student_id);

ALTER TABLE group_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read group_students"
  ON group_students FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and supervisors can manage group_students"
  ON group_students FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
    )
  );
