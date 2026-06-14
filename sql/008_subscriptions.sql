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
