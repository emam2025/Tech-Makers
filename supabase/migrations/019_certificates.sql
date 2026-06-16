-- Migration 019: Certificates issuance system

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

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on certificates' AND tablename = 'certificates') THEN
    CREATE POLICY "Admin full access on certificates" ON certificates FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'supervisor')));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students read own certificates' AND tablename = 'certificates') THEN
    CREATE POLICY "Students read own certificates" ON certificates FOR SELECT TO authenticated
      USING (national_id = (SELECT national_id FROM profiles WHERE id = auth.uid()));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_certificates_national_id ON certificates(national_id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);
