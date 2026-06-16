-- Migration 018: AI Settings — assistant configuration

CREATE TABLE IF NOT EXISTS ai_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb DEFAULT '{}'::jsonb,
  updated_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access on ai_settings' AND tablename = 'ai_settings') THEN
    CREATE POLICY "Admin full access on ai_settings" ON ai_settings FOR ALL TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated read ai_settings' AND tablename = 'ai_settings') THEN
    CREATE POLICY "Authenticated read ai_settings" ON ai_settings FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Seed default settings
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
