'use client';

import { useEffect, useState } from 'react';

const TRACKS = { a: 'مسار A', b: 'مسار B', c: 'مسار C', technomath: 'Techno Math', techenglish: 'Tech English' };
const STATUSES = { pending: 'قيد المراجعة', accepted: 'مقبول', rejected: 'مرفوض', interviewed: 'تمت المقابلة' };

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTrack, setFilterTrack] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [user, setUser] = useState(null);

  async function fetchStudents() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterTrack) params.set('track', filterTrack);
      if (filterStatus) params.set('status', filterStatus);

      const res = await fetch(`/api/admin/students?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error('Fetch students error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      const authRes = await fetch('/api/admin/auth');
      if (authRes.ok) {
        const authData = await authRes.json();
        setUser(authData.user);
      }
      fetchStudents();
    }
    init();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(fetchStudents, 400);
    return () => clearTimeout(timeout);
  }, [search, filterTrack, filterStatus]);

  async function handleUpdateStatus(id) {
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: editStatus }),
      });

      if (res.ok) {
        setEditingId(null);
        fetchStudents();
      }
    } catch (err) {
      console.error('Update student error:', err);
    }
  }

  function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-1">الطلاب المسجلون</h1>
        <p className="text-on-surface-variant font-body-md text-sm">إدارة ومراجعة بيانات الطلاب</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-24 p-4 md:p-6 border border-outline-variant/20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو البريد..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={filterTrack}
            onChange={(e) => setFilterTrack(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
          >
            <option value="">كل المسارات</option>
            {Object.entries(TRACKS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
          >
            <option value="">كل الحالات</option>
            {Object.entries(STATUSES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-24 border border-outline-variant/20 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3">school</span>
            <p className="font-body-md">لا يوجد طلاب مسجلون</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs">الاسم</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs">البريد</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs hidden sm:table-cell">المسار</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs hidden md:table-cell">الاشتراك</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs">الحالة</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface text-xs hidden lg:table-cell">التاريخ</th>
                  {user?.role === 'admin' && <th className="text-right px-4 py-3 font-bold text-on-surface text-xs">إجراء</th>}
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                    <td className="px-4 py-3 font-medium text-on-surface text-xs max-w-[150px] truncate">{s.name}</td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs max-w-[180px] truncate" dir="ltr" style={{ textAlign: 'right' }}>{s.email}</td>
                    <td className="px-4 py-3 text-xs hidden sm:table-cell">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium text-xs">{TRACKS[s.track] || s.track}</span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs hidden md:table-cell">{s.plan === 'monthly' ? 'شهري' : s.plan === 'quarterly' ? 'ربع سنوي' : 'سنوي'}</td>
                    <td className="px-4 py-3 text-xs">
                      {editingId === s.id ? (
                        <div className="flex items-center gap-1">
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="px-2 py-1 rounded-lg border border-outline-variant/50 text-xs"
                          >
                            {Object.entries(STATUSES).map(([k, v]) => (
                              <option key={k} value={k}>{v}</option>
                            ))}
                          </select>
                          <button onClick={() => handleUpdateStatus(s.id)} className="p-1 hover:bg-success/10 rounded-lg" title="حفظ">
                            <span className="material-symbols-outlined text-success text-sm">check</span>
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 hover:bg-error/10 rounded-lg" title="إلغاء">
                            <span className="material-symbols-outlined text-error text-sm">close</span>
                          </button>
                        </div>
                      ) : (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.status === 'accepted' ? 'bg-success/10 text-success' :
                          s.status === 'rejected' ? 'bg-error/10 text-error' :
                          s.status === 'interviewed' ? 'bg-tertiary/10 text-tertiary' :
                          'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {STATUSES[s.status] || s.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs hidden lg:table-cell">{formatDate(s.created_at)}</td>
                    {user?.role === 'admin' && (
                      <td className="px-4 py-3">
                        {editingId !== s.id && (
                          <button
                            onClick={() => { setEditingId(s.id); setEditStatus(s.status); }}
                            className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors"
                            title="تعديل الحالة"
                          >
                            <span className="material-symbols-outlined text-primary text-sm">edit</span>
                          </button>
                        )}
                      </td>
                    )}
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
