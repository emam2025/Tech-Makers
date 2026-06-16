-- Migration 020: Trainer salaries + hours tracking + supervisor branches + high school

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  address text,
  city text,
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on branches' AND tablename = 'branches') THEN
    CREATE POLICY "Admin full access on branches" ON branches FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'supervisor')));
  END IF;
END $$;

-- Supervisor-branch assignment
CREATE TABLE IF NOT EXISTS supervisor_branches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  supervisor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(supervisor_id, branch_id)
);

ALTER TABLE supervisor_branches ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin manage supervisor branches' AND tablename = 'supervisor_branches') THEN
    CREATE POLICY "Admin manage supervisor branches" ON supervisor_branches FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
  END IF;
END $$;

-- Supervisor-group assignment
CREATE TABLE IF NOT EXISTS supervisor_groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  supervisor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(supervisor_id, group_id)
);

ALTER TABLE supervisor_groups ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin manage supervisor groups' AND tablename = 'supervisor_groups') THEN
    CREATE POLICY "Admin manage supervisor groups" ON supervisor_groups FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
  END IF;
END $$;

-- Trainer hourly rate in profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hourly_rate numeric DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS salary_type text DEFAULT 'hourly' CHECK (salary_type IN ('hourly', 'monthly'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS monthly_salary numeric DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS branch_id uuid REFERENCES branches(id);

-- Add branch_id to groups
ALTER TABLE groups ADD COLUMN IF NOT EXISTS branch_id uuid REFERENCES branches(id);

-- Add branch_id to students
ALTER TABLE students_enhanced ADD COLUMN IF NOT EXISTS branch_id uuid REFERENCES branches(id);
ALTER TABLE students_enhanced ADD COLUMN IF NOT EXISTS education_level text DEFAULT 'university' CHECK (education_level IN ('high_school', 'university'));
ALTER TABLE students_enhanced ADD COLUMN IF NOT EXISTS high_school_year text CHECK (high_school_year IN ('first', 'second', 'third'));

-- Trainer hours log
CREATE TABLE IF NOT EXISTS trainer_hours (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id),
  session_id uuid REFERENCES sessions(id),
  hours numeric NOT NULL DEFAULT 1,
  hour_type text NOT NULL DEFAULT 'training' CHECK (hour_type IN ('training', 'preparation', 'correction', 'meeting', 'other')),
  description text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  is_auto boolean DEFAULT false,
  approved_by uuid REFERENCES profiles(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trainer_hours ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Trainer manage own hours' AND tablename = 'trainer_hours') THEN
    CREATE POLICY "Trainer manage own hours" ON trainer_hours FOR ALL TO authenticated
      USING (auth.uid() = trainer_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin supervisor full access hours' AND tablename = 'trainer_hours') THEN
    CREATE POLICY "Admin supervisor full access hours" ON trainer_hours FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'supervisor')));
  END IF;
END $$;

-- Monthly salary reports
CREATE TABLE IF NOT EXISTS salary_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  month integer NOT NULL CHECK (month BETWEEN 1 AND 12),
  year integer NOT NULL,
  total_hours numeric DEFAULT 0,
  hourly_rate numeric DEFAULT 0,
  base_salary numeric DEFAULT 0,
  bonus numeric DEFAULT 0,
  deductions numeric DEFAULT 0,
  total_salary numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'paid')),
  paid_at timestamptz,
  notes text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(trainer_id, month, year)
);

ALTER TABLE salary_reports ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access salary reports' AND tablename = 'salary_reports') THEN
    CREATE POLICY "Admin full access salary reports" ON salary_reports FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Trainer read own salary reports' AND tablename = 'salary_reports') THEN
    CREATE POLICY "Trainer read own salary reports" ON salary_reports FOR SELECT TO authenticated
      USING (auth.uid() = trainer_id);
  END IF;
END $$;

-- Session hours field
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS actual_hours numeric;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS trainer_hours_logged boolean DEFAULT false;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trainer_hours_trainer_id ON trainer_hours(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_hours_date ON trainer_hours(date);
CREATE INDEX IF NOT EXISTS idx_salary_reports_trainer_month ON salary_reports(trainer_id, month, year);
CREATE INDEX IF NOT EXISTS idx_supervisor_branches_supervisor ON supervisor_branches(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_supervisor_groups_supervisor ON supervisor_groups(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_branches_is_active ON branches(is_active);
