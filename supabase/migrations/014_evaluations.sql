-- Migration: Add evaluations table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS evaluations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES students_enhanced(id) ON DELETE CASCADE,
  evaluator_id uuid REFERENCES profiles(id),
  group_id uuid REFERENCES groups(id),
  session_id uuid,
  
  -- Evaluation criteria (1-10 scale)
  technical_score int CHECK (technical_score >= 1 AND technical_score <= 10),
  attendance_score int CHECK (attendance_score >= 1 AND attendance_score <= 10),
  participation_score int CHECK (participation_score >= 1 AND participation_score <= 10),
  behavior_score int CHECK (behavior_score >= 1 AND behavior_score <= 10),
  effort_score int CHECK (effort_score >= 1 AND effort_score <= 10),
  
  -- Overall
  overall_score numeric(4,2),
  
  -- Feedback
  strengths text,
  weaknesses text,
  recommendations text,
  general_notes text,
  
  -- Metadata
  evaluation_date date DEFAULT CURRENT_DATE,
  evaluation_type text DEFAULT 'periodic', -- periodic, session, monthly, final
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Policies
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
