-- ============================================================
-- TKA-Egypt Academy — Final Unified Schema (Phase 2)
-- All tables, indexes, RLS policies in dependency order
-- ============================================================

-- ============================================================
-- 1. CORE TABLES
-- ============================================================

-- 1a. profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text CHECK (role IN ('admin', 'supervisor', 'trainer', 'student')) DEFAULT 'student',
  profile_photo text,
  phone text,
  branch text,
  supervised_groups text[] DEFAULT '{}',
  bio text,
  profile_completed boolean DEFAULT false,
  national_id text UNIQUE,
  status text CHECK (status IN ('active', 'suspended', 'trial', 'pending')) DEFAULT 'active',
  last_login timestamptz,
  login_count integer DEFAULT 0,
  hourly_rate numeric DEFAULT 0,
  salary_type text DEFAULT 'hourly' CHECK (salary_type IN ('hourly', 'monthly')),
  monthly_salary numeric DEFAULT 0,
  branch_id uuid,
  created_at timestamptz DEFAULT now()
);

-- 1b. test_codes
CREATE TABLE IF NOT EXISTS test_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  student_name text,
  student_email text,
  track text,
  used boolean DEFAULT false,
  used_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- 1c. students (legacy landing page)
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE,
  email TEXT,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  grade NUMERIC,
  country TEXT DEFAULT 'مصر',
  governorate TEXT,
  city TEXT,
  school TEXT,
  study_mode TEXT,
  track TEXT CHECK (track IN ('a', 'b', 'c', 'technomath', 'techenglish', 'secondary')) NOT NULL,
  plan TEXT CHECK (plan IN ('monthly', 'quarterly', 'yearly')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1d. students_enhanced
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
  track text CHECK (track IN ('a', 'b', 'c', 'technomath', 'techenglish')),
  grade numeric,
  school text,
  status text CHECK (status IN ('active', 'inactive', 'suspended', 'trial', 'pending')) DEFAULT 'pending',
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relation text,
  medical_notes text,
  profile_photo text,
  notes text,
  branch_id uuid,
  education_level text DEFAULT 'university' CHECK (education_level IN ('high_school', 'university')),
  high_school_year text CHECK (high_school_year IN ('first', 'second', 'third')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 1e. trainers
CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  national_id text UNIQUE NOT NULL,
  profile_photo text,
  specialty text NOT NULL,
  experience_years integer DEFAULT 0,
  qualifications text,
  bio text,
  skills text[],
  availability text CHECK (availability IN ('full_time', 'part_time', 'freelance', 'unavailable')) DEFAULT 'full_time',
  max_groups integer DEFAULT 5,
  status text CHECK (status IN ('active', 'inactive', 'suspended', 'pending')) DEFAULT 'pending',
  rating numeric(3,2) DEFAULT 0,
  total_ratings integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 1f. team_applications
CREATE TABLE IF NOT EXISTS team_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type TEXT NOT NULL CHECK (form_type IN ('trainer', 'specialist', 'admin')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  specialty TEXT,
  experience TEXT,
  portfolio TEXT,
  bio TEXT NOT NULL,
  online_work TEXT NOT NULL,
  student_interaction TEXT NOT NULL,
  gulf_experience TEXT NOT NULL,
  certificate TEXT,
  department TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  address TEXT,
  marital_status TEXT,
  qualification TEXT,
  college TEXT,
  qualification_name TEXT,
  graduation_year TEXT,
  university TEXT,
  major TEXT,
  lang_arabic TEXT,
  lang_english TEXT,
  lang_french TEXT,
  skills TEXT,
  experience_history TEXT,
  obtained_certificates TEXT,
  work_preference TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. ACADEMIC TABLES
-- ============================================================

-- 2a. groups
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  track text CHECK (track IN ('a', 'b', 'c', 'technomath', 'techenglish')) NOT NULL,
  trainer_id uuid REFERENCES trainers(id) ON DELETE SET NULL,
  supervisor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  schedule_day text CHECK (schedule_day IN ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')),
  schedule_time time,
  schedule_duration integer DEFAULT 120,
  max_students integer DEFAULT 25,
  current_students integer DEFAULT 0,
  status text CHECK (status IN ('active', 'inactive', 'full', 'archived')) DEFAULT 'active',
  branch text,
  room text,
  is_online boolean DEFAULT false,
  meeting_link text,
  level text DEFAULT 'beginner',
  program_name text,
  branch_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2b. group_students
CREATE TABLE IF NOT EXISTS group_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  status text CHECK (status IN ('active', 'inactive', 'transferred')) DEFAULT 'active',
  UNIQUE(group_id, student_id)
);

-- 2c. sessions
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  trainer_id uuid REFERENCES trainers(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  duration integer DEFAULT 120,
  end_time time,
  topics text[],
  materials text[],
  status text CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled', 'upcoming', 'postponed')) DEFAULT 'scheduled',
  notes text,
  requirements jsonb DEFAULT '[]'::jsonb,
  tasks jsonb DEFAULT '[]'::jsonb,
  theoretical_hours numeric DEFAULT 0,
  practical_hours numeric DEFAULT 0,
  projects jsonb DEFAULT '[]'::jsonb,
  join_url text,
  is_join_active boolean DEFAULT false,
  details text,
  actual_hours numeric,
  trainer_hours_logged boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2d. attendance
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  status text CHECK (status IN ('present', 'absent', 'late', 'excused')) DEFAULT 'absent',
  marked_by uuid REFERENCES auth.users(id),
  marked_at timestamptz DEFAULT now(),
  notes text,
  UNIQUE(session_id, student_id)
);

-- 2e. tasks
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE SET NULL,
  session_id uuid REFERENCES sessions(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id),
  title text NOT NULL,
  description text,
  type text CHECK (type IN ('assignment', 'quiz', 'project', 'homework', 'exam')) DEFAULT 'assignment',
  due_date timestamptz,
  max_score integer DEFAULT 100,
  status text CHECK (status IN ('draft', 'published', 'closed')) DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2f. task_submissions
CREATE TABLE IF NOT EXISTS task_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  submission_text text,
  submission_url text,
  attachment_url text,
  score integer,
  feedback text,
  graded_by uuid REFERENCES auth.users(id),
  graded_at timestamptz,
  status text CHECK (status IN ('submitted', 'graded', 'returned')) DEFAULT 'submitted',
  submitted_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(task_id, student_id)
);

-- 2g. evaluations
CREATE TABLE IF NOT EXISTS evaluations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  evaluator_id uuid REFERENCES profiles(id),
  group_id uuid REFERENCES groups(id),
  session_id uuid,
  technical_score int CHECK (technical_score >= 1 AND technical_score <= 10),
  attendance_score int CHECK (attendance_score >= 1 AND attendance_score <= 10),
  participation_score int CHECK (participation_score >= 1 AND participation_score <= 10),
  behavior_score int CHECK (behavior_score >= 1 AND behavior_score <= 10),
  effort_score int CHECK (effort_score >= 1 AND effort_score <= 10),
  overall_score numeric(4,2),
  strengths text,
  weaknesses text,
  recommendations text,
  general_notes text,
  evaluation_date date DEFAULT CURRENT_DATE,
  evaluation_type text DEFAULT 'periodic',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- 3. FINANCIAL TABLES
-- ============================================================

-- 3a. subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  plan_type text CHECK (plan_type IN ('basic', 'pro', 'enterprise')) DEFAULT 'basic',
  track text CHECK (track IN ('a', 'b', 'c', 'technomath', 'techenglish')),
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'EGP',
  discount numeric(10,2) DEFAULT 0,
  final_amount numeric(10,2) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text CHECK (status IN ('pending', 'active', 'expired', 'cancelled', 'suspended')) DEFAULT 'pending',
  payment_method text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3b. payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'EGP',
  payment_method text CHECK (payment_method IN ('cash', 'fawry', 'paymob', 'card', 'bank_transfer', 'other')) NOT NULL,
  transaction_id text,
  reference_number text,
  status text CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'verified', 'confirmed', 'rejected')) DEFAULT 'pending',
  verified_by uuid REFERENCES auth.users(id),
  verified_at timestamptz,
  verification_notes text,
  receipt_url text,
  paid_by_name text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3c. salary_reports
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

-- ============================================================
-- 4. COMMUNICATION TABLES
-- ============================================================

-- 4a. conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text CHECK (type IN ('direct', 'group')) DEFAULT 'direct',
  name text,
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4b. conversation_participants
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz,
  UNIQUE(conversation_id, user_id)
);

-- 4c. messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  content text NOT NULL,
  type text CHECK (type IN ('text', 'image', 'file', 'system')) DEFAULT 'text',
  attachment_url text,
  is_edited boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4d. notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text CHECK (type IN ('system', 'student', 'session', 'payment', 'task', 'message', 'subscription')) DEFAULT 'system',
  reference_type text,
  reference_id uuid,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 4e. alerts
CREATE TABLE IF NOT EXISTS alerts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  link text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- ============================================================
-- 5. PROGRESS & CERTIFICATION
-- ============================================================

-- 5a. student_progress
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id) ON DELETE SET NULL,
  total_sessions integer DEFAULT 0,
  attended_sessions integer DEFAULT 0,
  attendance_rate numeric(5,2) DEFAULT 0,
  total_tasks integer DEFAULT 0,
  completed_tasks integer DEFAULT 0,
  task_completion_rate numeric(5,2) DEFAULT 0,
  average_score numeric(5,2) DEFAULT 0,
  total_score integer DEFAULT 0,
  current_level text,
  level_progress numeric(5,2) DEFAULT 0,
  last_evaluation_date date,
  evaluation_score numeric(5,2),
  evaluation_notes text,
  last_activity_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, group_id)
);

-- 5b. progress_events
CREATE TABLE IF NOT EXISTS progress_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id) ON DELETE SET NULL,
  event_type text CHECK (event_type IN ('session_attended', 'session_missed', 'task_submitted', 'task_graded', 'evaluation', 'level_up', 'payment', 'other')) NOT NULL,
  event_description text,
  reference_type text,
  reference_id uuid,
  score integer,
  created_at timestamptz DEFAULT now()
);

-- 5c. certificates
CREATE TABLE IF NOT EXISTS certificates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name_en text NOT NULL,
  national_id text NOT NULL,
  program text NOT NULL DEFAULT 'AI Programming',
  level text NOT NULL DEFAULT 'first' CHECK (level IN ('first', 'second', 'third')),
  certificate_type text NOT NULL DEFAULT 'student' CHECK (certificate_type IN ('student', 'experience')),
  delivery_method text NOT NULL DEFAULT 'email' CHECK (delivery_method IN ('email', 'whatsapp', 'printed')),
  delivery_contact text,
  delivery_address text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'issued', 'delivered', 'cancelled')),
  issued_by uuid REFERENCES profiles(id),
  notes text,
  serial_number text,
  issued_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5d. english_test_results
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

-- ============================================================
-- 6. SYSTEM TABLES
-- ============================================================

-- 6a. system_settings
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb DEFAULT '{}'::jsonb,
  category text DEFAULT 'general',
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6b. advertisements
CREATE TABLE IF NOT EXISTS advertisements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text,
  image_url text,
  link_url text,
  type text NOT NULL DEFAULT 'popup' CHECK (type IN ('popup', 'banner', 'inline', 'notification')),
  target text NOT NULL DEFAULT 'all' CHECK (target IN ('all', 'students', 'trainers', 'supervisors', 'group')),
  target_group_id uuid REFERENCES groups(id),
  position text DEFAULT 'top' CHECK (position IN ('top', 'bottom', 'sidebar', 'center')),
  is_active boolean DEFAULT true,
  start_date timestamptz,
  end_date timestamptz,
  display_rules jsonb DEFAULT '{}'::jsonb,
  priority integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6c. payment_gateways
CREATE TABLE IF NOT EXISTS payment_gateways (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'wallet' CHECK (type IN ('wallet', 'visa', 'fawry', 'instapay', 'link', 'bank_transfer', 'other')),
  icon text,
  details jsonb DEFAULT '{}'::jsonb,
  instructions text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6d. site_pages
CREATE TABLE IF NOT EXISTS site_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  type text NOT NULL DEFAULT 'page' CHECK (type IN ('page', 'banner', 'section', 'slider', 'footer', 'header')),
  is_active boolean DEFAULT true,
  meta jsonb DEFAULT '{}'::jsonb,
  sort_order integer DEFAULT 0,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6e. role_permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role text NOT NULL CHECK (role IN ('admin', 'supervisor', 'trainer', 'student')),
  resource text NOT NULL,
  permissions jsonb DEFAULT '{"read": true, "write": false, "delete": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role, resource)
);

-- 6f. ai_settings
CREATE TABLE IF NOT EXISTS ai_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb DEFAULT '{}'::jsonb,
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6g. branches
CREATE TABLE IF NOT EXISTS branches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  address text,
  city text,
  phone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 6h. supervisor_branches
CREATE TABLE IF NOT EXISTS supervisor_branches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  supervisor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(supervisor_id, branch_id)
);

-- 6i. supervisor_groups
CREATE TABLE IF NOT EXISTS supervisor_groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  supervisor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(supervisor_id, group_id)
);

-- 6j. trainer_hours
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

-- 6k. rate_limits
CREATE TABLE IF NOT EXISTS rate_limits (
  id BIGSERIAL PRIMARY KEY,
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL DEFAULT '/',
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 7. INDEXES
-- ============================================================

-- students
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_track ON students(track);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at);

-- team_applications
CREATE INDEX IF NOT EXISTS idx_team_applications_email ON team_applications(email);
CREATE INDEX IF NOT EXISTS idx_team_applications_form_type ON team_applications(form_type);
CREATE INDEX IF NOT EXISTS idx_team_applications_status ON team_applications(status);

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_national_id ON profiles(national_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- students_enhanced
CREATE INDEX IF NOT EXISTS idx_students_enhanced_user_id ON students_enhanced(user_id);
CREATE INDEX IF NOT EXISTS idx_students_enhanced_national_id ON students_enhanced(national_id);
CREATE INDEX IF NOT EXISTS idx_students_enhanced_track ON students_enhanced(track);
CREATE INDEX IF NOT EXISTS idx_students_enhanced_status ON students_enhanced(status);
CREATE INDEX IF NOT EXISTS idx_students_enhanced_email ON students_enhanced(email);

-- trainers
CREATE INDEX IF NOT EXISTS idx_trainers_user_id ON trainers(user_id);
CREATE INDEX IF NOT EXISTS idx_trainers_national_id ON trainers(national_id);
CREATE INDEX IF NOT EXISTS idx_trainers_specialty ON trainers(specialty);
CREATE INDEX IF NOT EXISTS idx_trainers_status ON trainers(status);

-- groups
CREATE INDEX IF NOT EXISTS idx_groups_track ON groups(track);
CREATE INDEX IF NOT EXISTS idx_groups_trainer_id ON groups(trainer_id);
CREATE INDEX IF NOT EXISTS idx_groups_supervisor_id ON groups(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_groups_status ON groups(status);
CREATE INDEX IF NOT EXISTS idx_groups_branch ON groups(branch);

-- group_students
CREATE INDEX IF NOT EXISTS idx_group_students_group_id ON group_students(group_id);
CREATE INDEX IF NOT EXISTS idx_group_students_student_id ON group_students(student_id);

-- sessions
CREATE INDEX IF NOT EXISTS idx_sessions_group_id ON sessions(group_id);
CREATE INDEX IF NOT EXISTS idx_sessions_trainer_id ON sessions(trainer_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_date ON sessions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

-- attendance
CREATE INDEX IF NOT EXISTS idx_attendance_session_id ON attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_group_id ON attendance(group_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- tasks
CREATE INDEX IF NOT EXISTS idx_tasks_group_id ON tasks(group_id);
CREATE INDEX IF NOT EXISTS idx_tasks_session_id ON tasks(session_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- task_submissions
CREATE INDEX IF NOT EXISTS idx_task_submissions_task_id ON task_submissions(task_id);
CREATE INDEX IF NOT EXISTS idx_task_submissions_student_id ON task_submissions(student_id);

-- subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_student_id ON subscriptions(student_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);

-- payments
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- conversations
CREATE INDEX IF NOT EXISTS idx_conversations_group_id ON conversations(group_id);

-- notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- student_progress
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_group_id ON student_progress(group_id);

-- progress_events
CREATE INDEX IF NOT EXISTS idx_progress_events_student_id ON progress_events(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_events_event_type ON progress_events(event_type);
CREATE INDEX IF NOT EXISTS idx_progress_events_created_at ON progress_events(created_at);

-- english_test_results
CREATE INDEX IF NOT EXISTS idx_english_test_results_email ON english_test_results(email);
CREATE INDEX IF NOT EXISTS idx_english_test_results_level ON english_test_results(level);
CREATE INDEX IF NOT EXISTS idx_english_test_results_created_at ON english_test_results(created_at);

-- certificates
CREATE INDEX IF NOT EXISTS idx_certificates_national_id ON certificates(national_id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);

-- evaluations
CREATE INDEX IF NOT EXISTS idx_evaluations_student_id ON evaluations(student_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_evaluator_id ON evaluations(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_group_id ON evaluations(group_id);

-- alerts
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);

-- advertisements
CREATE INDEX IF NOT EXISTS idx_advertisements_type ON advertisements(type);
CREATE INDEX IF NOT EXISTS idx_advertisements_target ON advertisements(target);
CREATE INDEX IF NOT EXISTS idx_advertisements_is_active ON advertisements(is_active);

-- rate_limits
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip ON rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- trainer_hours
CREATE INDEX IF NOT EXISTS idx_trainer_hours_trainer_id ON trainer_hours(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_hours_date ON trainer_hours(date);

-- salary_reports
CREATE INDEX IF NOT EXISTS idx_salary_reports_trainer_month ON salary_reports(trainer_id, month, year);

-- supervisor_branches
CREATE INDEX IF NOT EXISTS idx_supervisor_branches_supervisor ON supervisor_branches(supervisor_id);

-- supervisor_groups
CREATE INDEX IF NOT EXISTS idx_supervisor_groups_supervisor ON supervisor_groups(supervisor_id);

-- branches
CREATE INDEX IF NOT EXISTS idx_branches_is_active ON branches(is_active);

-- ============================================================
-- 8. RLS POLICIES
-- ============================================================

-- 8a. profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 8b. test_codes
ALTER TABLE test_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read test_codes"
  ON test_codes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert test_codes"
  ON test_codes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update test_codes"
  ON test_codes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete test_codes"
  ON test_codes FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 8c. students
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON students
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON students
  FOR SELECT TO authenticated USING (true);

-- 8d. students_enhanced
ALTER TABLE students_enhanced ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read students"
  ON students_enhanced FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage students"
  ON students_enhanced FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Supervisors can manage students in their groups"
  ON students_enhanced FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'supervisor')
  );

-- 8e. trainers
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read trainers"
  ON trainers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage trainers"
  ON trainers FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 8f. team_applications
ALTER TABLE team_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON team_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON team_applications
  FOR SELECT TO authenticated USING (true);

-- 8g. groups
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read groups"
  ON groups FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage groups"
  ON groups FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Supervisors can manage their groups"
  ON groups FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'supervisor')
  );

-- 8h. group_students
ALTER TABLE group_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read group_students"
  ON group_students FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and supervisors can manage group_students"
  ON group_students FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
  );

-- 8i. sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and trainers can manage sessions"
  ON sessions FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
  );

-- 8j. attendance
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and trainers can manage attendance"
  ON attendance FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
  );

-- 8k. tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and trainers can manage tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
  );

-- 8l. task_submissions
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read task_submissions"
  ON task_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can submit their own tasks"
  ON task_submissions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'student')
  );

CREATE POLICY "Admins and trainers can grade submissions"
  ON task_submissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
  );

-- 8m. evaluations
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage evaluations" ON evaluations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Supervisors can manage evaluations" ON evaluations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'supervisor')
  );

CREATE POLICY "Trainers can view and create evaluations" ON evaluations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'trainer')
  );

CREATE POLICY "Trainers can insert evaluations" ON evaluations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'trainer')
  );

-- 8n. subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
  );

-- 8o. payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read payments"
  ON payments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'supervisor'))
  );

-- 8p. salary_reports
ALTER TABLE salary_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access salary reports" ON salary_reports
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Trainer read own salary reports" ON salary_reports
  FOR SELECT TO authenticated
  USING (auth.uid() = trainer_id);

-- 8q. conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can read conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = id AND user_id = auth.uid())
  );

-- 8r. conversation_participants
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- 8s. messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can read messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
  );

CREATE POLICY "Participants can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
  );

-- 8t. notifications
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

-- 8u. alerts
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own alerts" ON alerts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all alerts" ON alerts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "System can insert alerts" ON alerts
  FOR INSERT WITH CHECK (true);

-- 8v. student_progress
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read student_progress"
  ON student_progress FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and trainers can update student_progress"
  ON student_progress FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'trainer'))
  );

-- 8w. progress_events
ALTER TABLE progress_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read progress_events"
  ON progress_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can create progress_events"
  ON progress_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 8x. certificates
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on certificates" ON certificates
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'supervisor'))
  );

CREATE POLICY "Students read own certificates" ON certificates
  FOR SELECT TO authenticated
  USING (national_id = (SELECT national_id FROM profiles WHERE id = auth.uid()));

-- 8y. english_test_results
ALTER TABLE english_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON english_test_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON english_test_results
  FOR SELECT TO authenticated USING (true);

-- 8z. system_settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on system_settings" ON system_settings
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 8aa. advertisements
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on ads" ON advertisements
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'supervisor'))
  );

CREATE POLICY "Public read active ads" ON advertisements
  FOR SELECT USING (is_active = true);

-- 8ab. payment_gateways
ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on gateways" ON payment_gateways
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'supervisor'))
  );

CREATE POLICY "Public read active gateways" ON payment_gateways
  FOR SELECT USING (is_active = true);

-- 8ac. site_pages
ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on pages" ON site_pages
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'supervisor'))
  );

CREATE POLICY "Public read active pages" ON site_pages
  FOR SELECT USING (is_active = true);

-- 8ad. role_permissions
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on permissions" ON role_permissions
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 8ae. ai_settings
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on ai_settings" ON ai_settings
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Authenticated read ai_settings" ON ai_settings
  FOR SELECT TO authenticated USING (true);

-- 8af. branches
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on branches" ON branches
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'supervisor'))
  );

-- 8ag. supervisor_branches
ALTER TABLE supervisor_branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manage supervisor branches" ON supervisor_branches
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 8ah. supervisor_groups
ALTER TABLE supervisor_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manage supervisor groups" ON supervisor_groups
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- 8ai. trainer_hours
ALTER TABLE trainer_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainer manage own hours" ON trainer_hours
  FOR ALL TO authenticated
  USING (auth.uid() = trainer_id);

CREATE POLICY "Admin supervisor full access hours" ON trainer_hours
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'supervisor'))
  );

-- 8aj. rate_limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 9. FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Validate national_id uniqueness
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

DROP TRIGGER IF EXISTS validate_national_id ON profiles;
CREATE TRIGGER validate_national_id
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_national_id_unique();

-- Update last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET last_login = now(), login_count = login_count + 1
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- updated_at triggers
CREATE OR REPLACE FUNCTION update_students_enhanced_updated_at()
RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS set_students_enhanced_updated_at ON students_enhanced;
CREATE TRIGGER set_students_enhanced_updated_at BEFORE UPDATE ON students_enhanced FOR EACH ROW EXECUTE FUNCTION update_students_enhanced_updated_at();

CREATE OR REPLACE FUNCTION update_trainers_updated_at()
RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS set_trainers_updated_at ON trainers;
CREATE TRIGGER set_trainers_updated_at BEFORE UPDATE ON trainers FOR EACH ROW EXECUTE FUNCTION update_trainers_updated_at();

CREATE OR REPLACE FUNCTION update_groups_updated_at()
RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS set_groups_updated_at ON groups;
CREATE TRIGGER set_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_groups_updated_at();

CREATE OR REPLACE FUNCTION update_sessions_updated_at()
RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS set_sessions_updated_at ON sessions;
CREATE TRIGGER set_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_sessions_updated_at();

CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS set_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER set_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_subscriptions_updated_at();

CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS set_payments_updated_at ON payments;
CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_payments_updated_at();

CREATE OR REPLACE FUNCTION update_student_progress_updated_at()
RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS set_student_progress_updated_at ON student_progress;
CREATE TRIGGER set_student_progress_updated_at BEFORE UPDATE ON student_progress FOR EACH ROW EXECUTE FUNCTION update_student_progress_updated_at();

-- ============================================================
-- 10. SEED DATA
-- ============================================================

-- Seed default permissions for each role
INSERT INTO role_permissions (role, resource, permissions) VALUES
  ('admin', 'students', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'trainers', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'groups', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'sessions', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'attendance', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'tasks', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'payments', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'evaluations', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'messages', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'notifications', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'settings', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'ads', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'gateways', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'pages', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'subscriptions', '{"read": true, "write": true, "delete": true}'),
  ('admin', 'alerts', '{"read": true, "write": true, "delete": true}'),
  ('supervisor', 'students', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'trainers', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'groups', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'sessions', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'attendance', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'tasks', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'payments', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'evaluations', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'messages', '{"read": true, "write": true, "delete": false}'),
  ('supervisor', 'settings', '{"read": true, "write": false, "delete": false}'),
  ('supervisor', 'ads', '{"read": true, "write": false, "delete": false}'),
  ('supervisor', 'gateways', '{"read": true, "write": false, "delete": false}'),
  ('supervisor', 'pages', '{"read": true, "write": false, "delete": false}'),
  ('trainer', 'students', '{"read": true, "write": false, "delete": false}'),
  ('trainer', 'groups', '{"read": true, "write": false, "delete": false}'),
  ('trainer', 'sessions', '{"read": true, "write": true, "delete": false}'),
  ('trainer', 'attendance', '{"read": true, "write": true, "delete": false}'),
  ('trainer', 'tasks', '{"read": true, "write": true, "delete": false}'),
  ('trainer', 'evaluations', '{"read": true, "write": true, "delete": false}'),
  ('trainer', 'messages', '{"read": true, "write": true, "delete": false}'),
  ('student', 'tasks', '{"read": true, "write": false, "delete": false}'),
  ('student', 'messages', '{"read": true, "write": true, "delete": false}'),
  ('student', 'notifications', '{"read": true, "write": false, "delete": false}')
ON CONFLICT (role, resource) DO NOTHING;

-- Seed default AI settings
INSERT INTO ai_settings (key, value) VALUES
  ('api_key', '{"value": ""}'),
  ('api_key_backup', '{"value": ""}'),
  ('model', '{"value": "gemini-2.5-flash"}'),
  ('temperature', '{"value": 0.7}'),
  ('top_p', '{"value": 0.9}'),
  ('max_tokens', '{"value": 2000}'),
  ('system_prompt', '{"value": "أنت مساعد تعليمي ذكي لأكاديمية Tech Makers Egypt (TKA). دورك شرح المفاهيم التعليمية فقط ولا تحل التاسكات أو الواجباتแทน الطالب. استخدم اسم الطالب في الرد واعرف مستواه ومحاضراته ونظام اشتراكه. رد بالعربية."}'),
  ('is_active', '{"value": true}'),
  ('allowed_topics', '{"value": ["programming", "web development", "data science", "math", "english", "computer science", "general"]}')
ON CONFLICT (key) DO NOTHING;
