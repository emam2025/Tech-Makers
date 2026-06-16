'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const SETTINGS_MODULES = [
  { icon: 'smart_toy', title: 'الذكاء الاصطناعي', desc: 'تكوين مساعد AI للطلاب — API، الحرارة، السياق، التعليمات', href: '/admin/settings/ai', color: '#9c27b0', bg: '#f3e5f5' },
  { icon: 'campaign', title: 'الإعلانات', desc: 'إنشاء وإدارة إعلانات منبثقة، داخل المجموعات، مستهدفة', href: '/admin/settings/ads', color: '#ba1a1a', bg: '#ffdad6' },
  { icon: 'account_balance_wallet', title: 'بوابات الدفع', desc: 'إدارة المحافظ الإلكترونية، الفيزا، فوري، روابط الدفع', href: '/admin/settings/payments', color: '#2e7d32', bg: '#e8f5e9' },
  { icon: 'web', title: 'محرر الموقع', desc: 'إنشاء صفحات، تعديل البانرات، الهيدر والفوتر، السلايدر', href: '/admin/settings/site', color: '#005ea1', bg: '#d2e4ff' },
  { icon: 'admin_panel_settings', title: 'الأدوار والصلاحيات', desc: 'إدارة أدوار المستخدمين وتفصيل صلاحيات كل قسم', href: '/admin/settings/roles', color: '#ed6c02', bg: '#fff3e0' },
];

const NOTIFICATION_DEFAULTS = [
  { key: 'email_alerts', label: 'تنبيهات البريد الإلكتروني', desc: 'تحديثات النظام الحرجة', defaultOn: true },
  { key: 'sms_gateway', label: 'بوابة SMS', desc: 'حضور الطلاب والتنبيهات العاجلة', defaultOn: false },
  { key: 'push_notifications', label: 'الإشعارات الفورية', desc: 'تفاعلات تطبيق الطلاب', defaultOn: true },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [profile, setProfile] = useState({
    academy_name: '',
    tax_id: '',
    address: '',
    email: '',
    phone: '',
    logo_url: '',
  });

  const [notifications, setNotifications] = useState({
    email_alerts: true,
    sms_gateway: false,
    push_notifications: true,
  });

  const [academic, setAcademic] = useState({
    year_start: '',
    year_end: '',
    grading_scale: 'نسبة مئوية (0-100)',
    language: 'ar',
  });

  const [logs] = useState([
    { time: '15 يونيو 2026 - 14:22', admin: 'م. أحمد', role: 'SuperAdmin', action: 'تحديث نظام الدرجات', target: 'الشؤون الأكاديمية', status: 'success' },
    { time: '15 يونيو 2026 - 11:05', admin: 'النظام', role: 'System', action: 'نسخ احتياطي تلقائي للقاعدة', target: 'تخزين النظام', status: 'success' },
    { time: '14 يونيو 2026 - 16:45', admin: 'ج. DOE', role: 'IT Support', action: 'تعديل مستوى الصلاحيات', target: 'المستخدم: ح. يوسف', status: 'warning' },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) setProfile(prev => ({ ...prev, ...data.profile }));
          if (data.notifications) setNotifications(prev => ({ ...prev, ...data.notifications }));
          if (data.academic) setAcademic(prev => ({ ...prev, ...data.academic }));
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  async function handleSaveAll() {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, notifications, academic }),
      });
      if (res.ok) {
        setMsg('تم حفظ جميع التغييرات بنجاح');
      } else {
        setMsg('فشل الحفظ');
      }
    } catch {
      setMsg('خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  }

  function handleExport() {
    const config = { profile, notifications, academic };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tka-settings-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-md py-lg lg:px-xl lg:py-xl space-y-md">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">مركز الإعدادات</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">إدارة الملف المؤسسي، المعايير الأكاديمية، وأمان النظام.</p>
        </div>
        <div className="flex gap-sm">
          <button
            onClick={handleExport}
            className="px-md py-sm border border-primary text-primary font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-all"
          >
            تصدير الإعدادات
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-md py-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 shadow-sm transition-all disabled:opacity-60 flex items-center gap-xs"
          >
            {saving ? (
              <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-base">save</span>
            )}
            {saving ? 'جاري الحفظ...' : 'حفظ جميع التغييرات'}
          </button>
        </div>
      </div>

      {/* Status Message */}
      {msg && (
        <div className={`rounded-xl p-3 flex items-center gap-2 text-sm ${msg.includes('نجاح') ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
          <span className="material-symbols-outlined text-lg">{msg.includes('نجاح') ? 'check_circle' : 'error'}</span>
          {msg}
        </div>
      )}

      {/* Settings Grid (Bento Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Academy Profile Section — 8 cols */}
        <section className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm space-y-md">
          <div className="flex items-center justify-between border-b border-outline-variant pb-sm">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">domain</span>
              <h3 className="font-headline-md text-headline-md text-primary">الملف المؤسسي</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant">اسم الأكاديمية</label>
              <input
                type="text"
                value={profile.academy_name}
                onChange={(e) => setProfile({ ...profile, academy_name: e.target.value })}
                className="w-full p-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="اسم الأكاديمية"
              />
            </div>
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant">رقم السجل الضريبي / التسجيل</label>
              <input
                type="text"
                value={profile.tax_id}
                onChange={(e) => setProfile({ ...profile, tax_id: e.target.value })}
                className="w-full p-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="REG-990-221-ET"
                dir="ltr"
                style={{ textAlign: 'left' }}
              />
            </div>
            <div className="md:col-span-2 space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant">العنوان الفعلي</label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                rows={2}
                className="w-full p-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                placeholder="المنطقة الصناعية، القرية الذكية، القاهرة، مصر"
              />
            </div>
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant">البريد الإلكتروني الأساسي</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="admin@tka-egypt.edu.eg"
                dir="ltr"
                style={{ textAlign: 'left' }}
              />
            </div>
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface-variant">هاتف المؤسسة</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full p-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="+20 100 123 4567"
                dir="ltr"
                style={{ textAlign: 'left' }}
              />
            </div>
          </div>
          <div className="pt-sm">
            <label className="font-label-md text-label-md text-on-surface-variant mb-xs block">الشعار المؤسسي</label>
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center gap-sm bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer">
              <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
              <p className="font-body-sm text-body-sm text-center">
                انقر للرفع أو اسحب وأفلت شعار الأكاديمية.<br />
                <span className="text-on-surface-variant opacity-70">PNG، JPG حتى 5 ميجا (نسبة 1:1 موصى بها)</span>
              </p>
            </div>
          </div>
        </section>

        {/* Right Column — 4 cols */}
        <section className="lg:col-span-4 flex flex-col gap-gutter">
          {/* Notification Settings */}
          <div className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm space-y-md">
            <div className="flex items-center gap-sm border-b border-outline-variant pb-sm">
              <span className="material-symbols-outlined text-primary">notifications_active</span>
              <h3 className="font-headline-md text-headline-md text-primary">الإشعارات</h3>
            </div>
            <div className="space-y-md">
              {NOTIFICATION_DEFAULTS.map((n) => (
                <div key={n.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-label-md text-label-md text-primary">{n.label}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{n.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notifications[n.key]}
                      onChange={(e) => setNotifications({ ...notifications, [n.key]: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-primary text-on-primary p-md rounded-xl shadow-md relative overflow-hidden group">
            <div className="relative z-10 space-y-sm">
              <h4 className="font-headline-md text-headline-md">هل تحتاج مساعدة؟</h4>
              <p className="font-body-sm text-body-sm opacity-90">فريق الدعم الفني متاح على مدار الساعة لتكوينات النظام الحرجة.</p>
              <button className="flex items-center gap-xs font-label-md text-label-md text-secondary-fixed bg-on-primary-fixed-variant px-md py-xs rounded-full hover:bg-opacity-80 transition-all">
                تواصل مع الدعم
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:scale-110 transition-transform">help_center</span>
          </div>
        </section>

        {/* Settings Modules Navigation — 12 cols */}
        <section className="lg:col-span-12 bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm space-y-md">
          <div className="flex items-center gap-sm border-b border-outline-variant pb-sm">
            <span className="material-symbols-outlined text-primary">tune</span>
            <h3 className="font-headline-md text-headline-md text-primary">وحدات الإعدادات</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
            {SETTINGS_MODULES.map((mod) => (
              <Link key={mod.href} href={mod.href}>
                <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl border border-outline-variant hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start gap-md">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: mod.bg }}
                    >
                      <span className="material-symbols-outlined text-2xl" style={{ color: mod.color }}>{mod.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">{mod.title}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">{mod.desc}</p>
                    </div>
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">arrow_back</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Academic Preferences — 12 cols */}
        <section className="lg:col-span-12 bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm space-y-md">
          <div className="flex items-center gap-sm border-b border-outline-variant pb-sm">
            <span className="material-symbols-outlined text-primary">history_edu</span>
            <h3 className="font-headline-md text-headline-md text-primary">التفضيلات الأكاديمية</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="space-y-sm">
              <label className="font-label-md text-label-md text-on-surface-variant block">العام الأكاديمي الحالي</label>
              <div className="flex items-center gap-sm">
                <input
                  type="date"
                  value={academic.year_start}
                  onChange={(e) => setAcademic({ ...academic, year_start: e.target.value })}
                  className="w-full p-sm bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <span className="text-on-surface-variant text-sm">إلى</span>
                <input
                  type="date"
                  value={academic.year_end}
                  onChange={(e) => setAcademic({ ...academic, year_end: e.target.value })}
                  className="w-full p-sm bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>
            <div className="space-y-sm">
              <label className="font-label-md text-label-md text-on-surface-variant block">مقياس الدرجات الافتراضي</label>
              <select
                value={academic.grading_scale}
                onChange={(e) => setAcademic({ ...academic, grading_scale: e.target.value })}
                className="w-full p-sm bg-surface border border-outline-variant rounded-lg outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option>نسبة مئوية (0-100)</option>
                <option>GPA (مقياس 4.0)</option>
                <option>ECTS (A-F)</option>
                <option>تقييم سردي</option>
              </select>
            </div>
            <div className="space-y-sm">
              <label className="font-label-md text-label-md text-on-surface-variant block">لغة التعليم الأساسية</label>
              <div className="flex gap-sm">
                <button
                  type="button"
                  onClick={() => setAcademic({ ...academic, language: 'en' })}
                  className={`flex-1 py-sm font-label-md text-label-md rounded-lg border transition-all ${
                    academic.language === 'en'
                      ? 'bg-primary-fixed text-primary border-primary'
                      : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setAcademic({ ...academic, language: 'ar' })}
                  className={`flex-1 py-sm font-label-md text-label-md rounded-lg border transition-all ${
                    academic.language === 'ar'
                      ? 'bg-primary-fixed text-primary border-primary'
                      : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  العربية
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* System Audit Logs — 12 cols */}
        <section className="lg:col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-md flex items-center justify-between border-b border-outline-variant">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
              <h3 className="font-headline-md text-headline-md text-primary">سجلات المراجعة</h3>
            </div>
            <button className="text-primary font-label-md text-label-md hover:underline">عرض جميع السجلات</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant">الوقت</th>
                  <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant">المشرف</th>
                  <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant">الإجراء</th>
                  <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant">الهدف</th>
                  <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant text-right">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {logs.map((log, i) => (
                  <tr key={i} className="hover:bg-primary-fixed/20 transition-all group">
                    <td className="px-md py-md font-body-sm text-body-sm">{log.time}</td>
                    <td className="px-md py-md">
                      <div className="flex items-center gap-xs">
                        <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[10px]">
                          {log.admin.charAt(0)}
                        </div>
                        <span className="font-label-md text-label-md">{log.admin} ({log.role})</span>
                      </div>
                    </td>
                    <td className="px-md py-md font-body-sm text-body-sm">{log.action}</td>
                    <td className="px-md py-md font-body-sm text-body-sm">{log.target}</td>
                    <td className="px-md py-md text-right">
                      <span className={`px-sm py-xs rounded-full font-label-md text-[12px] uppercase ${
                        log.status === 'success'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {log.status === 'success' ? 'نجاح' : 'تحذير'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
