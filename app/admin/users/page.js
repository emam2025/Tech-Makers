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
  const [searchQuery, setSearchQuery] = useState('');

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

  function getInitials(name) {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.full_name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const supervisorCount = users.filter((u) => u.role === 'supervisor').length;
  const inactiveCount = 0;

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-error text-4xl">block</span>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-md py-lg">
      <div className="space-y-md">
        {/* Action Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
          <div className="relative w-full md:max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full pl-12 pr-md py-3 bg-white dark:bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-body-md shadow-sm"
            />
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setFormError(''); }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md shadow-md hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">{showForm ? 'close' : 'person_add'}</span>
            {showForm ? 'إلغاء' : 'إضافة مستخدم'}
          </button>
        </div>

        {/* KPI Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex items-center gap-md">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined text-3xl">group</span>
            </div>
            <div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">إجمالي المستخدمين</p>
              <h3 className="font-headline-md text-headline-md text-primary">{totalUsers}</h3>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex items-center gap-md">
            <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">المشرفون النشطون</p>
              <h3 className="font-headline-md text-headline-md text-primary">{supervisorCount}</h3>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex items-center gap-md">
            <div className="p-3 bg-on-primary-fixed-variant/10 rounded-lg text-primary">
              <span className="material-symbols-outlined text-3xl">assignment_ind</span>
            </div>
            <div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">المديرون</p>
              <h3 className="font-headline-md text-headline-md text-primary">{adminCount}</h3>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex items-center gap-md">
            <div className="p-3 bg-error/10 rounded-lg text-error">
              <span className="material-symbols-outlined text-3xl">block</span>
            </div>
            <div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">الحسابات غير النشطة</p>
              <h3 className="font-headline-md text-headline-md text-primary">{inactiveCount}</h3>
            </div>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-md">
            <h4 className="font-headline-md text-headline-md text-primary mb-md flex items-center gap-sm">
              <span className="material-symbols-outlined">person_add</span>
              مستخدم جديد
            </h4>

            {formError && (
              <div className="bg-error-container/30 border-r-4 border-error rounded-xl p-sm mb-md flex items-center gap-sm">
                <span className="material-symbols-outlined text-error text-lg">error</span>
                <p className="text-on-error-container text-body-sm">{formError}</p>
              </div>
            )}

            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">الاسم الكامل</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                  className="w-full px-md py-2.5 rounded-lg border border-outline-variant bg-white dark:bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="أحمد محمد"
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-md py-2.5 rounded-lg border border-outline-variant bg-white dark:bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="admin@example.com"
                  dir="ltr"
                  style={{ textAlign: 'left' }}
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">كلمة المرور</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-md py-2.5 rounded-lg border border-outline-variant bg-white dark:bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">الدور</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-md py-2.5 rounded-lg border border-outline-variant bg-white dark:bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="supervisor">مشرف</option>
                  <option value="admin">مدير</option>
                </select>
              </div>

              {form.role === 'supervisor' && (
                <>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">رقم الهاتف</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-md py-2.5 rounded-lg border border-outline-variant bg-white dark:bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="01012345678"
                      dir="ltr"
                      style={{ textAlign: 'left' }}
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">الفرع</label>
                    <select
                      value={form.branch}
                      onChange={(e) => setForm({ ...form, branch: e.target.value })}
                      className="w-full px-md py-2.5 rounded-lg border border-outline-variant bg-white dark:bg-surface text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="">اختر الفرع</option>
                      {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">المجموعات المُشرَف عليها</label>
                    <div className="flex flex-wrap gap-sm">
                      {['Track A', 'Track B', 'Track C', 'Techno Math', 'Tech English'].map((g) => (
                        <label key={g} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${form.supervised_groups.includes(g) ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}>
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
                <button type="submit" disabled={formLoading} className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-60">
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

        {/* Main Data Table Section */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
            <h4 className="font-label-md text-label-md text-primary uppercase tracking-wider">قائمة المستخدمين</h4>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-surface-container rounded transition-all text-on-surface-variant">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="p-2 hover:bg-surface-container rounded transition-all text-on-surface-variant">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-sm">manage_accounts</span>
              <p className="font-body-md text-body-md">{searchQuery ? 'لا توجد نتائج' : 'لا يوجد مستخدمون'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant">
                    <th className="px-md py-4 font-label-md text-label-md border-b border-outline-variant">الاسم</th>
                    <th className="px-md py-4 font-label-md text-label-md border-b border-outline-variant">البريد</th>
                    <th className="px-md py-4 font-label-md text-label-md border-b border-outline-variant">الدور</th>
                    <th className="px-md py-4 font-label-md text-label-md border-b border-outline-variant hidden md:table-cell">الفرع</th>
                    <th className="px-md py-4 font-label-md text-label-md border-b border-outline-variant hidden lg:table-cell">المجموعات</th>
                    <th className="px-md py-4 font-label-md text-label-md border-b border-outline-variant hidden sm:table-cell">التاريخ</th>
                    <th className="px-md py-4 font-label-md text-label-md border-b border-outline-variant text-right">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-md py-4">
                        <div className="flex items-center gap-sm">
                          <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                            {getInitials(u.full_name)}
                          </div>
                          <div>
                            <div className="font-label-md text-label-md text-on-surface">{u.full_name || '—'}</div>
                            <div className="text-xs text-on-surface-variant">ID: {u.id?.substring(0, 8) || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-md py-4 font-body-sm text-body-sm" dir="ltr" style={{ textAlign: 'right' }}>{u.email}</td>
                      <td className="px-md py-4">
                        {editingRole === u.id ? (
                          <div className="flex items-center gap-xs">
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="px-2 py-1 rounded-lg border border-outline-variant text-xs"
                            >
                              <option value="supervisor">مشرف</option>
                              <option value="admin">مدير</option>
                            </select>
                            <button onClick={() => handleUpdateRole(u.id)} className="p-1.5 hover:bg-surface-container rounded text-green-600 transition-all" title="حفظ">
                              <span className="material-symbols-outlined text-sm">check</span>
                            </button>
                            <button onClick={() => setEditingRole(null)} className="p-1.5 hover:bg-surface-container rounded text-error transition-all" title="إلغاء">
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                            {u.role === 'admin' ? 'مدير' : 'مشرف'}
                          </span>
                        )}
                      </td>
                      <td className="px-md py-4 font-body-sm text-body-sm hidden md:table-cell">{u.branch || '—'}</td>
                      <td className="px-md py-4 hidden lg:table-cell">
                        {u.supervised_groups?.length > 0 ? (
                          <div className="flex flex-wrap gap-xs">
                            {u.supervised_groups.map((g) => (
                              <span key={g} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">{g}</span>
                            ))}
                          </div>
                        ) : '—'}
                      </td>
                      <td className="px-md py-4 font-body-sm text-body-sm hidden sm:table-cell">{formatDate(u.created_at)}</td>
                      <td className="px-md py-4 text-right">
                        <div className="flex justify-end gap-xs">
                          {editingRole !== u.id && u.id !== currentUser?.id && (
                            <button
                              onClick={() => { setEditingRole(u.id); setNewRole(u.role); }}
                              className="p-1.5 hover:bg-surface-container rounded text-primary transition-all"
                              title="تعديل الدور"
                            >
                              <span className="material-symbols-outlined">lock_open</span>
                            </button>
                          )}
                          {u.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDelete(u.id, u.full_name || u.email)}
                              className="p-1.5 hover:bg-surface-container rounded text-error transition-all"
                              title="حذف"
                            >
                              <span className="material-symbols-outlined">person_off</span>
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

          {/* Table Footer / Pagination */}
          <div className="p-md bg-surface-container-low border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-sm">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              عرض {filteredUsers.length} من {totalUsers} مستخدم
            </span>
            <div className="flex items-center gap-xs">
              <button className="p-2 border border-outline-variant rounded-md hover:bg-surface transition-all text-on-surface-variant disabled:opacity-50" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="px-4 py-2 bg-primary text-on-primary rounded-md font-label-md text-label-md">1</button>
              <button className="p-2 border border-outline-variant rounded-md hover:bg-surface transition-all text-on-surface-variant">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Panels (Bento Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md pb-lg">
          {/* Role Distribution */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-sm flex flex-col items-center justify-center text-center">
            <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-md">توزيع الأدوار</h4>
            <div className="relative w-32 h-32 mb-md">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-primary-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="transparent" stroke="currentColor" strokeDasharray={`${totalUsers > 0 ? (adminCount / totalUsers) * 100 : 0}, 100`} strokeWidth="3" />
                <path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="transparent" stroke="currentColor" strokeDasharray={`${totalUsers > 0 ? (supervisorCount / totalUsers) * 100 : 0}, 100`} strokeDashoffset={`-${totalUsers > 0 ? (adminCount / totalUsers) * 100 : 0}`} strokeWidth="3" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-headline-md text-headline-md text-primary">{totalUsers}</span>
              </div>
            </div>
            <div className="w-full space-y-xs text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary-container"></span> مديرون</span>
                <span className="font-bold">{totalUsers > 0 ? Math.round((adminCount / totalUsers) * 100) : 0}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary"></span> مشرفون</span>
                <span className="font-bold">{totalUsers > 0 ? Math.round((supervisorCount / totalUsers) * 100) : 0}%</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-sm">
            <h4 className="font-headline-md text-headline-md text-primary mb-md">سجل النشاط</h4>
            <div className="space-y-sm">
              {filteredUsers.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-start gap-md p-sm hover:bg-surface rounded-lg transition-all border-l-4 border-primary">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-label-md text-label-md text-on-surface">{u.role === 'admin' ? 'مدير' : 'مشرف'} جديد</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      تم إنشاء حساب <span className="font-semibold text-primary">{u.full_name || u.email}</span>
                    </p>
                    <span className="text-xs text-outline">{formatDate(u.created_at)}</span>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-md text-on-surface-variant">
                  <p className="font-body-sm text-body-sm">لا يوجد نشاط حديث</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
