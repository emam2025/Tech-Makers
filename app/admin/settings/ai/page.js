'use client';

import { useEffect, useState } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { useToast } from '../../../../components/ui/Toast';

const MODELS = [
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (سريع)' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (دقيق)' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
];

const PRESETS = [
  { label: 'مساعد تعليمي', prompt: 'أنت مساعد تعليمي ذكي لأكاديمية Tech Makers Egypt (TKA). دورك شرح المفاهيم التعليمية فقط ولا تحل التاسكات أو الواجبات替代 الطالب. استخدم اسم الطالب في الرد واعرف مستواه ومحاضراته ونظام اشتراكه. رد بالعربية.' },
  { label: 'مساعد برمجي', prompt: 'أنت مساعد برمجي متخصص في تعليم البرمجة. شرح المفاهيم بوضوح وأمثلة عملية. لا تكتب الكود جاهزاً لحل التاسكات而是 شجع الطالب على المحاولة واعرض المفاهيم والخطوات.' },
  { label: 'مدرّب مهني', prompt: 'أنت مدرس خبرة في مجال التقنية. شارك المعرفة العملية والنصائح المهنية. استخدم اسم الطالب واعرف خلفيته التعليمية ومستواه.' },
];

export default function AiSettingsPage() {
  const { success, error: toastError } = useToast();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testMsg, setTestMsg] = useState('');
  const [testReply, setTestReply] = useState('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/ai-settings')
      .then(r => r.ok ? r.json() : {})
      .then(d => {
        const map = {};
        (d.settings || []).forEach(s => { map[s.key] = s.value?.value ?? s.value; });
        setSettings(map);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/ai-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) success('تم حفظ إعدادات AI');
      else toastError('فشل الحفظ');
    } finally { setSaving(false); }
  };

  const handleTest = async () => {
    if (!testMsg.trim()) return;
    setTesting(true);
    setTestReply('');
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testMsg, history: [] }),
      });
      const data = await res.json();
      if (res.ok) setTestReply(data.reply);
      else setTestReply(`خطأ: ${data.error}`);
    } catch { setTestReply('خطأ في الاتصال'); }
    finally { setTesting(false); }
  };

  if (loading) return <div className="flex justify-center py-12"><span className="material-symbols-outlined text-[var(--color-primary)] animate-spin text-[32px]">progress_activity</span></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="page-header">
        <div><h1>إعدادات الذكاء الاصطناعي</h1><p>تكوين مساعد AI للطلاب</p></div>
        <Button icon="save" loading={saving} onClick={handleSave}>حفظ</Button>
      </div>

      {/* Status */}
      <div className="card-admin p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-[var(--color-primary)]">smart_toy</span>
            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">حالة المساعد</h3>
              <p className="text-xs text-[var(--color-text-tertiary)]">{settings.is_active ? 'نشط — الطلاب يمكنهم استخدام المساعد' : 'معطل — لا يمكن للطلاب استخدام المساعد'}</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={settings.is_active !== false} onChange={(e) => setSettings({ ...settings, is_active: e.target.checked })} className="sr-only peer" />
            <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success)]"></div>
          </label>
        </div>
      </div>

      {/* API Configuration */}
      <div className="card-admin p-4 space-y-4">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">key</span>
          تكوين API
        </h3>
        <Input label="Gemini API Key" value={settings.api_key || ''} onChange={(e) => setSettings({ ...settings, api_key: e.target.value })} placeholder="AIza..." type="password" />
        <Input label="API Key احتياطي" value={settings.api_key_backup || ''} onChange={(e) => setSettings({ ...settings, api_key_backup: e.target.value })} placeholder="AIza..." type="password" />
        <Select label="النموذج" options={MODELS} value={settings.model || 'gemini-2.5-flash'} onChange={(e) => setSettings({ ...settings, model: e.target.value })} />
      </div>

      {/* Generation Parameters */}
      <div className="card-admin p-4 space-y-4">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">tune</span>
          معايير التوليد
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-[var(--color-text-secondary)] mb-1 block">الحرارة (Temperature)</label>
            <input type="range" min="0" max="2" step="0.1" value={settings.temperature || 0.7} onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })} className="w-full" />
            <span className="text-xs text-[var(--color-text-tertiary)]">{settings.temperature || 0.7}</span>
          </div>
          <div>
            <label className="text-xs font-bold text-[var(--color-text-secondary)] mb-1 block">Top P</label>
            <input type="range" min="0" max="1" step="0.05" value={settings.top_p || 0.9} onChange={(e) => setSettings({ ...settings, top_p: parseFloat(e.target.value) })} className="w-full" />
            <span className="text-xs text-[var(--color-text-tertiary)]">{settings.top_p || 0.9}</span>
          </div>
          <Input label="الحد الأقصى للرموز" type="number" value={settings.max_tokens || 2000} onChange={(e) => setSettings({ ...settings, max_tokens: parseInt(e.target.value) || 2000 })} />
        </div>
      </div>

      {/* System Prompt */}
      <div className="card-admin p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">psychology</span>
            System Instruction
          </h3>
          <div className="flex gap-2">
            {PRESETS.map((p, i) => (
              <button key={i} onClick={() => setSettings({ ...settings, system_prompt: p.prompt })} className="text-[10px] px-2 py-1 bg-[var(--color-surface-dim)] rounded hover:bg-[var(--color-primary-light)] transition-colors">
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={settings.system_prompt || ''}
          onChange={(e) => setSettings({ ...settings, system_prompt: e.target.value })}
          rows={8}
          className="w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm font-mono leading-relaxed focus:outline-none focus:border-[var(--color-primary)] resize-none"
          placeholder="Instructions for the AI assistant..."
        />
        <p className="text-[10px] text-[var(--color-text-tertiary)]">
          النظام يضيف تلقائياً معلومات الطالب (الاسم، المجموعة، المحاضرات، الاشتراك) إلى system prompt
        </p>
      </div>

      {/* Test Chat */}
      <div className="card-admin p-4 space-y-4">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">chat</span>
          اختبار المساعد
        </h3>
        <div className="flex gap-2">
          <Input value={testMsg} onChange={(e) => setTestMsg(e.target.value)} placeholder="اكتب رسالة اختبار..." className="flex-1" onKeyDown={(e) => e.key === 'Enter' && handleTest()} />
          <Button icon="send" loading={testing} onClick={handleTest}>اختبار</Button>
        </div>
        {testReply && (
          <div className="p-4 bg-[var(--color-surface-dim)] rounded-[var(--radius-md)]">
            <p className="text-sm text-[var(--color-text-primary)] leading-relaxed whitespace-pre-wrap">{testReply}</p>
          </div>
        )}
      </div>
    </div>
  );
}
