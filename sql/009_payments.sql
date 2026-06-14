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
