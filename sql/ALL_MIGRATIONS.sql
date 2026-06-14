-- ============================================================
-- TKA-Egypt Academy — Enhanced Profiles Table
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS national_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('active', 'suspended', 'trial', 'pending')) DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count integer DEFAULT 0;

-- 2. Make national_id unique (one national ID per user)
ALTER TABLE profiles ADD CONSTRAINT profiles_national_id_unique UNIQUE (national_id);

-- 3. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_national_id ON profiles(national_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 4. Update role check to include new roles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'supervisor', 'trainer', 'student'));

-- 5. Update the auto-create profile trigger to handle new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, national_id, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    NEW.raw_user_meta_data ->> 'national_id',
    COALESCE(NEW.raw_user_meta_data ->> 'status', 'active')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to validate national_id uniqueness
CREATE OR REPLACE FUNCTION check_national_id_unique()
RETURNS trigger AS $$
BEGIN
  IF NEW.national_id IS NOT NULL AND NEW.national_id != '' THEN
    IF EXISTS (
      SELECT 1 FROM profiles
      WHERE national_id = NEW.national_id AND id != NEW.id
    ) THEN
      RAISE EXCEPTION 'رقم الهوية الوطنية مستخدم بالفعل';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for national_id validation
DROP TRIGGER IF EXISTS validate_national_id ON profiles;
CREATE TRIGGER validate_national_id
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_national_id_unique();

-- 8. Create function to update last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET last_login = now(), login_count = login_count + 1
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create RLS policies for enhanced profiles
-- Allow authenticated users to read profiles (existing)
-- Allow admins to manage all profiles (existing)
-- Allow users to update their own profile (existing)

-- 10. Add policy for guest users (limited access)
CREATE POLICY "Guest users can read basic profile info"
  ON profiles FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- VERIFICATION QUERY
-- Run this to verify the table structure:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'profiles'
-- ORDER BY ordinal_position;
-- ============================================================
-- ============================================================
-- TKA-Egypt Academy — Enhanced Students Table
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create enhanced students table
CREATE TABLE IF NOT EXISTS students_enhanced (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  whatsapp text,
  national_id text UNIQUE NOT NULL,
  birth_date date,
  gender text CHECK (gender IN ('male', 'female')),
  country text DEFAULT 'egypt',
  governorate text,
  city text,
  address text,
  
  -- Academic
  track text CHECK (track IN ('a', 'b', 'c', 'technomath', 'techenglish')),
  grade numeric,
  school text,
  
  -- Status
  status text CHECK (status IN ('active', 'inactive', 'suspended', 'trial', 'pending')) DEFAULT 'pending',
  
  -- Emergency Contact
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relation text,
  
  -- Medical
  medical_notes text,
  
  -- Meta
  profile_photo text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_students_enhanced_user_id ON students_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_students_enhanced_national_id ON students_enhanced(national_id);
CREATE INDEX IF NOT EXISTS idx_students_enhanced_track ON students_enhanced(track);
CREATE INDEX IF NOT EXISTS idx_students_enhanced_status ON students_enhanced(status);
CREATE INDEX IF NOT EXISTS idx_students_enhanced_email ON students_enhanced(email);

-- 3. Enable RLS
ALTER TABLE students_enhanced ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Authenticated users can read students"
  ON students_enhanced FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage students"
  ON students_enhanced FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Supervisors can manage students in their groups"
  ON students_enhanced FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

-- 5. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_students_enhanced_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_students_enhanced_updated_at
  BEFORE UPDATE ON students_enhanced
  FOR EACH ROW
  EXECUTE FUNCTION update_students_enhanced_updated_at();

-- ============================================================
-- VERIFICATION QUERY
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'students_enhanced'
-- ORDER BY ordinal_position;
-- ============================================================
-- ============================================================
-- TKA-Egypt Academy — Trainers Table
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create trainers table
CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  national_id text UNIQUE NOT NULL,
  profile_photo text,
  
  -- Professional
  specialty text NOT NULL,
  experience_years integer DEFAULT 0,
  qualifications text,
  bio text,
  skills text[],
  
  -- Availability
  availability text CHECK (availability IN ('full_time', 'part_time', 'freelance', 'unavailable')) DEFAULT 'full_time',
  max_groups integer DEFAULT 5,
  
  -- Status
  status text CHECK (status IN ('active', 'inactive', 'suspended', 'pending')) DEFAULT 'pending',
  
  -- Rating
  rating numeric(3,2) DEFAULT 0,
  total_ratings integer DEFAULT 0,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_trainers_user_id ON trainers(user_id);
CREATE INDEX IF NOT EXISTS idx_trainers_national_id ON trainers(national_id);
CREATE INDEX IF NOT EXISTS idx_trainers_specialty ON trainers(specialty);
CREATE INDEX IF NOT EXISTS idx_trainers_status ON trainers(status);

-- 3. Enable RLS
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Authenticated users can read trainers"
  ON trainers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage trainers"
  ON trainers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_trainers_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_trainers_updated_at
  BEFORE UPDATE ON trainers
  FOR EACH ROW
  EXECUTE FUNCTION update_trainers_updated_at();
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
-- ============================================================
-- TKA-Egypt Academy — Subscriptions Table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  
  -- Plan
  plan_name text NOT NULL,
  plan_type text CHECK (plan_type IN ('basic', 'pro', 'enterprise')) DEFAULT 'basic',
  track text CHECK (track IN ('a', 'b', 'c', 'technomath', 'techenglish')),
  
  -- Pricing
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'EGP',
  discount numeric(10,2) DEFAULT 0,
  final_amount numeric(10,2) NOT NULL,
  
  -- Duration
  start_date date NOT NULL,
  end_date date NOT NULL,
  
  -- Status
  status text CHECK (status IN ('pending', 'active', 'expired', 'cancelled', 'suspended')) DEFAULT 'pending',
  
  -- Payment
  payment_method text,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_student_id ON subscriptions(student_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
    )
  );

CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();
-- ============================================================
-- TKA-Egypt Academy — Payments Table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  
  -- Amount
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'EGP',
  
  -- Payment Info
  payment_method text CHECK (payment_method IN ('cash', 'fawry', 'paymob', 'card', 'bank_transfer', 'other')) NOT NULL,
  transaction_id text,
  reference_number text,
  
  -- Status
  status text CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'verified')) DEFAULT 'pending',
  
  -- Verification
  verified_by uuid REFERENCES auth.users(id),
  verified_at timestamptz,
  verification_notes text,
  
  -- Receipt
  receipt_url text,
  
  -- Meta
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read payments"
  ON payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
    )
  );

CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_payments_updated_at();
-- ============================================================
-- TKA-Egypt Academy — Messages Table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text CHECK (type IN ('direct', 'group')) DEFAULT 'direct',
  name text,
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Content
  content text NOT NULL,
  type text CHECK (type IN ('text', 'image', 'file', 'system')) DEFAULT 'text',
  attachment_url text,
  
  -- Status
  is_edited boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can read conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can read messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
    )
  );
-- ============================================================
-- TKA-Egypt Academy — Notifications Table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Content
  title text NOT NULL,
  message text NOT NULL,
  type text CHECK (type IN ('system', 'student', 'session', 'payment', 'task', 'message', 'subscription')) DEFAULT 'system',
  
  -- Reference
  reference_type text,
  reference_id uuid,
  
  -- Status
  is_read boolean DEFAULT false,
  read_at timestamptz,
  
  -- Meta
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());
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
