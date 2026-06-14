'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'supervisor', branch: '', phone: '', supervised_groups: [] });
  const BRANCHES = ['القاهرة', 'الجيزة', 'الإسكندرية', 'المنصورة', 'أسيوط', 'طنطا', 'الزقازيق', 'الاسماعيلية', 'سوهاج', 'قنا', 'أسوان', 'بني سويف', 'الفيوم', 'المنياء', 'دمياط', 'كفر الشيخ', 'البحيرة', 'مطروح', 'الوادي الجديد', 'شمال سيناء', 'جنوب سيناء', ' البحر الأحمر'];
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState('');

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      const authRes = await fetch('/api/admin/auth');
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData.user?.role !== 'admin') {
          router.push('/admin');
          return;
        }
        setCurrentUser(authData.user);
      }
      fetchUsers();
    }
    init();
  }, [router]);

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'فشل إنشاء المستخدم');
        setFormLoading(false);
        return;
      }

      setForm({ email: '', password: '', full_name: '', role: 'supervisor', branch: '', phone: '', supervised_groups: [] });
      setShowForm(false);
      fetchUsers();
    } catch {
      setFormError('خطأ في الاتصال');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleUpdateRole(id) {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole }),
      });

      if (res.ok) {
        setEditingRole(null);
        fetchUsers();
      }
    } catch (err) {
      console.error('Update role error:', err);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Delete user error:', err);
    }
  }

  function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-error text-4xl">block</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-1">إدارة المستخدمين</h1>
          <p className="text-on-surface-variant font-body-md text-sm">إضافة وتعديل وحذف مستخدمي الإدارة</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setFormError(''); }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <span className="material-symbols-outlined text-xl">{showForm ? 'close' : 'person_add'}</span>
          {showForm ? 'إلغاء' : 'إضافة مستخدم'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-24 p-4 md:p-6 border border-outline-variant/20">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person_add</span>
            مستخدم جديد
          </h2>

          {formError && (
            <div className="bg-error-container/30 border-r-4 border-error rounded-xl p-3 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-lg">error</span>
              <p className="text-on-error-container text-sm">{formError}</p>
            </div>
          )}

          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">الاسم الكامل</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
                placeholder="أحمد محمد"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
                placeholder="admin@example.com"
                dir="ltr"
                style={{ textAlign: 'left' }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">كلمة المرور</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">الدور</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
              >
                <option value="supervisor">مشرف</option>
                <option value="admin">مدير</option>
              </select>
            </div>

            {/* Supervisor-only fields */}
            {form.role === 'supervisor' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
                    placeholder="01012345678"
                    dir="ltr"
                    style={{ textAlign: 'left' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">الفرع</label>
                  <select
                    value={form.branch}
                    onChange={(e) => setForm({ ...form, branch: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
                  >
                    <option value="">اختر الفرع</option>
                    {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">المجموعات المُشرَف عليها</label>
                  <div className="flex flex-wrap gap-2">
                    {['Track A', 'Track B', 'Track C', 'Techno Math', 'Tech English'].map((g) => (
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
              </>
            )}

            <div className="sm:col-span-2">
              <button type="submit" disabled={formLoading} className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60">
                {formLoading ? (
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-lg">check</span>
                )}
                {formLoading ? 'جاري الإنشاء...' : 'إنشاء المستخدم'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users table */}
      <div className="bg-white rounded-24 border border-outline-variant/20 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3">manage_accounts</span>
            <p className="font-body-md">لا يوجد مستخدمون</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs">الاسم</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs">البريد</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs">الدور</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs hidden md:table-cell">الفرع</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs hidden lg:table-cell">المجموعات</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs hidden sm:table-cell">التاريخ</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                    <td className="px-4 py-3 font-medium text-on-surface text-xs">{u.full_name || '—'}</td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs" dir="ltr" style={{ textAlign: 'right' }}>{u.email}</td>
                    <td className="px-4 py-3 text-xs">
                      {editingRole === u.id ? (
                        <div className="flex items-center gap-1">
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="px-2 py-1 rounded-lg border border-outline-variant/50 text-xs"
                          >
                            <option value="supervisor">مشرف</option>
                            <option value="admin">مدير</option>
                          </select>
                          <button onClick={() => handleUpdateRole(u.id)} className="p-1 hover:bg-success/10 rounded-lg" title="حفظ">
                            <span className="material-symbols-outlined text-success text-sm">check</span>
                          </button>
                          <button onClick={() => setEditingRole(null)} className="p-1 hover:bg-error/10 rounded-lg" title="إلغاء">
                            <span className="material-symbols-outlined text-error text-sm">close</span>
                          </button>
                        </div>
                      ) : (
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary'}`}>
                          {u.role === 'admin' ? 'مدير' : 'مشرف'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs hidden md:table-cell">{u.branch || '—'}</td>
                    <td className="px-4 py-3 text-xs hidden lg:table-cell">
                      {u.supervised_groups?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {u.supervised_groups.map((g) => (
                            <span key={g} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">{g}</span>
                          ))}
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs hidden sm:table-cell">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {editingRole !== u.id && u.id !== currentUser?.id && (
                          <button
                            onClick={() => { setEditingRole(u.id); setNewRole(u.role); }}
                            className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors"
                            title="تعديل الدور"
                          >
                            <span className="material-symbols-outlined text-primary text-sm">edit</span>
                          </button>
                        )}
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDelete(u.id, u.full_name || u.email)}
                            className="p-1.5 hover:bg-error/10 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <span className="material-symbols-outlined text-error text-sm">delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
