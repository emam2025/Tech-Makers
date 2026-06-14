'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const BRANCHES = ['القاهرة', 'الجيزة', 'الإسكندرية', 'المنصورة', 'أسيوط', 'طنطا', 'الزقازيق', 'الإسماعيلية', 'سوهاج', 'قنا', 'أسوان', 'بني سويف', 'الفيوم', 'المنوفية', 'دمياط', 'كفر الشيخ', 'البحيرة', 'مطروح', 'الوادي الجديد', 'شمال سيناء', 'جنوب سيناء', 'البحر الأحمر'];
const GROUPS = ['Track A', 'Track B', 'Track C', 'Techno Math', 'Tech English'];

export default function AdminProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    branch: '',
    supervised_groups: [],
    bio: '',
    profile_photo: '',
  });

  useEffect(() => {
    async function init() {
      const res = await fetch('/api/admin/auth');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setForm({
        full_name: data.user.full_name || '',
        phone: data.user.phone || '',
        branch: data.user.branch || '',
        supervised_groups: data.user.supervised_groups || [],
        bio: data.user.bio || '',
        profile_photo: data.user.profile_photo || '',
      });
      setLoading(false);
    }
    init();
  }, [router]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...form, profile_completed: true }),
      });

      if (res.ok) {
        setMsg('تم حفظ البيانات بنجاح');
      } else {
        setMsg('فشل الحفظ');
      }
    } catch {
      setMsg('خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-1">الملف الشخصي</h1>
        <p className="text-on-surface-variant font-body-md text-sm">استكمال بياناتك الشخصية</p>
      </div>

      {!user.profile_completed && (
        <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary">info</span>
          <p className="text-sm text-on-surface">يرجى استكمال بياناتك الشخصية قبل المتابعة</p>
        </div>
      )}

      {msg && (
        <div className={`rounded-xl p-3 flex items-center gap-2 text-sm ${msg.includes('نجاح') ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
          <span className="material-symbols-outlined text-lg">{msg.includes('نجاح') ? 'check_circle' : 'error'}</span>
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-outline-variant/20 space-y-5">
        {/* Photo */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
            {form.profile_photo ? (
              <img src={form.profile_photo} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-primary text-3xl">person</span>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-on-surface-variant mb-1">رابط الصورة الشخصية</label>
            <input
              type="url"
              value={form.profile_photo}
              onChange={(e) => setForm({ ...form, profile_photo: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary"
              placeholder="https://example.com/photo.jpg"
              dir="ltr"
              style={{ textAlign: 'left' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">الاسم الكامل</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1">رقم الهاتف</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary"
              placeholder="01012345678"
              dir="ltr"
              style={{ textAlign: 'left' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1">الفرع</label>
          <select
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary"
          >
            <option value="">اختر الفرع</option>
            {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-2">المجموعات المُشرَف عليها</label>
          <div className="flex flex-wrap gap-2">
            {GROUPS.map((g) => (
              <label key={g} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${form.supervised_groups.includes(g) ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form.supervised_groups.includes(g)}
                  onChange={(e) => {
                    const groups = e.target.checked
                      ? [...form.supervised_groups, g]
                      : form.supervised_groups.filter((x) => x !== g);
                    setForm({ ...form, supervised_groups: groups });
                  }}
                />
                {form.supervised_groups.includes(g) && <span className="material-symbols-outlined text-sm">check</span>}
                {g}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1">نبذة شخصية</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary resize-none"
            placeholder="أخبرنا عن עצמك..."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60">
            {saving ? (
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-lg">save</span>
            )}
            {saving ? 'جاري الحفظ...' : 'حفظ البيانات'}
          </button>
          <span className="text-xs text-on-surface-variant">
            البريد: {user.email}
          </span>
        </div>
      </form>
    </div>
  );
}
