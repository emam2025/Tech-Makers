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
