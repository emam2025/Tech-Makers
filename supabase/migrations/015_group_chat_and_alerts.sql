-- Migration: Add group_id to conversations for group chat
-- Run this in Supabase SQL Editor

-- Add group_id column to conversations
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS group_id uuid REFERENCES groups(id) ON DELETE CASCADE;

-- Create index for faster group conversation lookups
CREATE INDEX IF NOT EXISTS idx_conversations_group_id ON conversations(group_id);

-- Create notifications table for payment/absence alerts
CREATE TABLE IF NOT EXISTS alerts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'payment_due', 'payment_overdue', 'absence', 'evaluation', 'general'
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  link text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE alerts ENABLE ROW LEVEL POLICY;

-- Policies
CREATE POLICY "Users can view their own alerts" ON alerts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all alerts" ON alerts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "System can insert alerts" ON alerts
  FOR INSERT WITH CHECK (true);
