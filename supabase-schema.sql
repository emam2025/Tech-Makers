CREATE TABLE students (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  grade TEXT NOT NULL,
  country TEXT DEFAULT '',
  governorate TEXT DEFAULT '',
  city TEXT DEFAULT '',
  track TEXT NOT NULL,
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for anon" ON students
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow select for service" ON students
  FOR SELECT TO service_role
  USING (true);
