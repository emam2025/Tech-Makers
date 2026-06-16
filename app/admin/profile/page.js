'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AiChat from '../../../components/ai/AiChat';

const BRANCHES = ['القاهرة', 'الجيزة', 'الإسكندرية', 'المنصورة', 'أسيوط', 'طنطا', 'الزقازيق', 'الإسماعيلية', 'سوهاج', 'قنا', 'أسوان', 'بني سويف', 'الفيوم', 'المنوفية', 'دمياط', 'كفر الشيخ', 'البحيرة', 'مطروح', 'الوادي الجديد', 'شمال سيناء', 'جنوب سيناء', 'البحر الأحمر'];
const GROUPS = ['Track A', 'Track B', 'Track C', 'Techno Math', 'Tech English'];

export default function AdminProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [editing, setEditing] = useState(false);
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
        setUser({ ...user, ...form, profile_completed: true });
        setEditing(false);
      } else {
        setMsg('فشل الحفظ');
      }
    } catch {
      setMsg('خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {}
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-md py-lg">
      <div className="max-w-2xl mx-auto space-y-md">
        {/* Profile Header Section */}
        <section className="relative pt-8 pb-10 flex flex-col items-center">
          <div className="absolute inset-0 bg-primary-container/5 -z-10 rounded-xl" />
          {/* Avatar */}
          <div className="relative mb-sm group">
            <div className="w-32 h-32 rounded-full border-4 border-secondary-container shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
              {form.profile_photo ? (
                <img alt={form.full_name || user.full_name} className="w-full h-full object-cover" src={form.profile_photo} />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-6xl">person</span>
                </div>
              )}
            </div>
          </div>
          {/* User Info */}
          <h2 className="font-headline-md text-headline-md text-primary-container text-center mb-xs">
            {form.full_name || user.full_name || 'المستخدم'}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-md">
            {user.role === 'admin' ? 'مدير النظام' : user.role === 'supervisor' ? 'مشرف' : user.role === 'trainer' ? 'مدرّب' : 'عضو'} | ID: #{user.id?.toString().padStart(3, '0')}
          </p>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-8 py-2 rounded-xl border border-primary text-primary font-label-md text-label-md hover:bg-primary/5 active:scale-95 transition-all"
            >
              تعديل الملف الشخصي
            </button>
          )}
          {editing && (
            <button
              onClick={() => { setEditing(false); setForm({ full_name: user.full_name || '', phone: user.phone || '', branch: user.branch || '', supervised_groups: user.supervised_groups || [], bio: user.bio || '', profile_photo: user.profile_photo || '' }); setMsg(''); }}
              className="px-8 py-2 rounded-xl border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-all"
            >
              إلغاء التعديل
            </button>
          )}
        </section>

        {msg && (
          <div className={`rounded-xl p-sm flex items-center gap-sm text-sm ${msg.includes('نجاح') ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'}`}>
            <span className="material-symbols-outlined text-lg">{msg.includes('نجاح') ? 'check_circle' : 'error'}</span>
            {msg}
          </div>
        )}

        {!editing ? (
          /* ── View Mode: Stitch-style Cards ── */
          <div className="space-y-md">
            {/* Basic Info Card */}
            <div className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
              <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant">
                <h3 className="font-label-md text-label-md text-secondary">المعلومات الأساسية</h3>
              </div>
              <div className="divide-y divide-outline-variant/50">
                {user.national_id && (
                  <div className="flex items-center p-md">
                    <span className="material-symbols-outlined text-primary-container ml-4">id_card</span>
                    <div className="flex-1">
                      <p className="text-xs text-on-surface-variant">رقم الهوية الوطنية</p>
                      <p className="font-body-md text-body-md text-on-surface">{user.national_id}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center p-md">
                  <span className="material-symbols-outlined text-primary-container ml-4">mail</span>
                  <div className="flex-1">
                    <p className="text-xs text-on-surface-variant">البريد الإلكتروني</p>
                    <p className="font-body-md text-body-md text-on-surface">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center p-md">
                  <span className="material-symbols-outlined text-primary-container ml-4">phone_iphone</span>
                  <div className="flex-1">
                    <p className="text-xs text-on-surface-variant">رقم الهاتف</p>
                    <p className="font-body-md text-body-md text-on-surface">{form.phone || 'غير محدد'}</p>
                  </div>
                </div>
                {form.branch && (
                  <div className="flex items-center p-md">
                    <span className="material-symbols-outlined text-primary-container ml-4">location_on</span>
                    <div className="flex-1">
                      <p className="text-xs text-on-surface-variant">الفرع</p>
                      <p className="font-body-md text-body-md text-on-surface">{form.branch}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Settings Card */}
            <div className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
              <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant">
                <h3 className="font-label-md text-label-md text-secondary">إعدادات الحساب</h3>
              </div>
              <div className="divide-y divide-outline-variant/50">
                <button
                  onClick={() => setEditing(true)}
                  className="w-full flex items-center p-md hover:bg-surface-container transition-colors text-right"
                >
                  <span className="material-symbols-outlined text-primary-container ml-4">edit</span>
                  <div className="flex-1">
                    <p className="font-body-md text-body-md text-on-surface">تعديل البيانات الشخصية</p>
                  </div>
                  <span className="material-symbols-outlined text-outline">chevron_left</span>
                </button>
                <div className="flex items-center p-md">
                  <span className="material-symbols-outlined text-primary-container ml-4">language</span>
                  <div className="flex-1 flex justify-between items-center">
                    <p className="font-body-md text-body-md text-on-surface">اللغة</p>
                    <span className="text-label-md text-primary bg-primary-fixed px-2 py-0.5 rounded-lg ml-2">العربية</span>
                  </div>
                  <span className="material-symbols-outlined text-outline">chevron_left</span>
                </div>
                <div className="flex items-center p-md">
                  <span className="material-symbols-outlined text-primary-container ml-4">notifications</span>
                  <div className="flex-1">
                    <p className="font-body-md text-body-md text-on-surface">إشعارات النظام</p>
                  </div>
                  <span className="material-symbols-outlined text-outline">chevron_left</span>
                </div>
              </div>
            </div>

            {/* Supervised Groups */}
            {form.supervised_groups.length > 0 && (
              <div className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
                <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant">
                  <h3 className="font-label-md text-label-md text-secondary">المجموعات المُشرَف عليها</h3>
                </div>
                <div className="p-md">
                  <div className="flex flex-wrap gap-sm">
                    {form.supervised_groups.map((g) => (
                      <span key={g} className="inline-flex items-center gap-xs px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bio */}
            {form.bio && (
              <div className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
                <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant">
                  <h3 className="font-label-md text-label-md text-secondary">نبذة شخصية</h3>
                </div>
                <div className="p-md">
                  <p className="font-body-md text-body-md text-on-surface">{form.bio}</p>
                </div>
              </div>
            )}

            {/* Support & Privacy Card */}
            <div className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
              <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant">
                <h3 className="font-label-md text-label-md text-secondary">الدعم والخصوصية</h3>
              </div>
              <div className="divide-y divide-outline-variant/50">
                <button className="w-full flex items-center p-md hover:bg-surface-container transition-colors text-right">
                  <span className="material-symbols-outlined text-primary-container ml-4">policy</span>
                  <span className="font-body-md text-body-md text-on-surface flex-1">سياسة الخصوصية</span>
                  <span className="material-symbols-outlined text-outline">chevron_left</span>
                </button>
                <button className="w-full flex items-center p-md hover:bg-surface-container transition-colors text-right">
                  <span className="material-symbols-outlined text-primary-container ml-4">help_center</span>
                  <span className="font-body-md text-body-md text-on-surface flex-1">مركز المساعدة</span>
                  <span className="material-symbols-outlined text-outline">chevron_left</span>
                </button>
                <button className="w-full flex items-center p-md hover:bg-surface-container transition-colors text-right">
                  <span className="material-symbols-outlined text-primary-container ml-4">info</span>
                  <span className="font-body-md text-body-md text-on-surface flex-1">عن الأكاديمية</span>
                  <span className="material-symbols-outlined text-outline">chevron_left</span>
                </button>
              </div>
            </div>

            {/* Logout Action */}
            <div className="pt-sm pb-lg">
              <button
                onClick={handleLogout}
                className="w-full bg-error/10 text-error border border-error/20 py-4 rounded-xl font-headline-md text-lg flex items-center justify-center gap-3 hover:bg-error/20 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined">logout</span>
                تسجيل الخروج
              </button>
              <p className="text-center text-outline text-xs mt-md">إصدار النظام v2.4.0 (TKA-CMS)</p>
            </div>
          </div>
        ) : (
          /* ── Edit Mode: Form ── */
          <form onSubmit={handleSave} className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest rounded-xl p-md space-y-md border border-outline-variant">
            {/* Photo */}
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-xs">رابط الصورة الشخصية</label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-xs">الاسم الكامل</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-xs">رقم الهاتف</label>
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
              <label className="block text-xs font-bold text-on-surface-variant mb-xs">الفرع</label>
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
              <label className="block text-xs font-bold text-on-surface-variant mb-xs">نبذة شخصية</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary resize-none"
                placeholder="أخبرنا عن עצמك..."
              />
            </div>

            <div className="flex items-center gap-sm pt-xs">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60">
                {saving ? (
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-lg">save</span>
                )}
                {saving ? 'جاري الحفظ...' : 'حفظ البيانات'}
              </button>
              <button
                type="button"
                onClick={() => { setEditing(false); setForm({ full_name: user.full_name || '', phone: user.phone || '', branch: user.branch || '', supervised_groups: user.supervised_groups || [], bio: user.bio || '', profile_photo: user.profile_photo || '' }); setMsg(''); }}
                className="px-6 py-3 rounded-full border border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container-low transition-all text-sm"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

        {/* AI Assistant */}
        <AiChat user={user} />
      </div>
    </div>
  );
}
