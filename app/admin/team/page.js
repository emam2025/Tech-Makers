'use client';

import { useEffect, useState } from 'react';

const FORM_TYPES = { trainer: 'مدرب', specialist: 'متخصص', admin: 'إداري' };
const STATUSES = { pending: 'قيد المراجعة', accepted: 'مقبول', rejected: 'مرفوض', interviewed: 'تمت المقابلة' };

export default function AdminTeamPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  async function fetchApplications() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterType) params.set('form_type', filterType);
      if (filterStatus) params.set('status', filterStatus);

      const res = await fetch(`/api/admin/team?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Fetch applications error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(fetchApplications, 400);
    return () => clearTimeout(timeout);
  }, [search, filterType, filterStatus]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) fetchApplications();
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-1">طلبات الفريق</h1>
        <p className="text-on-surface-variant font-body-md text-sm">مراجعة طلبات الانضمام للعمل في الفريق</p>
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
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface text-sm font-body-md focus:outline-none focus:border-primary"
          >
            <option value="">كل الأنواع</option>
            {Object.entries(FORM_TYPES).map(([k, v]) => (
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

      {/* Applications list */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-24 border border-outline-variant/20 flex flex-col items-center justify-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3">groups</span>
            <p className="font-body-md">لا توجد طلبات فريق</p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="bg-white rounded-24 border border-outline-variant/20 overflow-hidden">
              {/* Header row */}
              <div
                className="flex items-center justify-between px-4 md:px-6 py-4 cursor-pointer hover:bg-surface-container-lowest transition-colors"
                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-lg">person</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-on-surface text-sm truncate">{app.name}</div>
                    <div className="text-xs text-on-surface-variant truncate" dir="ltr" style={{ textAlign: 'right' }}>{app.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium text-xs">{FORM_TYPES[app.form_type] || app.form_type}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    app.status === 'accepted' ? 'bg-success/10 text-success' :
                    app.status === 'rejected' ? 'bg-error/10 text-error' :
                    app.status === 'interviewed' ? 'bg-tertiary/10 text-tertiary' :
                    'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {STATUSES[app.status] || app.status}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-lg transition-transform" style={{ transform: expandedId === app.id ? 'rotate(180deg)' : 'none' }}>expand_more</span>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === app.id && (
                <div className="px-4 md:px-6 pb-5 border-t border-outline-variant/10 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <InfoRow icon="phone" label="الهاتف" value={app.phone} />
                    <InfoRow icon="location_on" label="العنوان" value={app.address} />
                    <InfoRow icon="flag" label="الدولة" value={app.country} />
                    <InfoRow icon="family_restroom" label="الحالة الاجتماعية" value={app.marital_status} />
                    <InfoRow icon="school" label="المؤهل" value={app.qualification} />
                    <InfoRow icon="account_balance" label="الجامعة" value={app.university} />
                    <InfoRow icon="menu_book" label="الكليه" value={app.college} />
                    <InfoRow icon="science" label="التخصص" value={app.major} />
                    <InfoRow icon="calendar_today" label="سنة التخرج" value={app.graduation_year} />
                    <InfoRow icon="translate" label="اللغات" value={[app.lang_arabic && 'عربي', app.lang_english && 'إنجليزي', app.lang_french && 'فرنسي'].filter(Boolean).join('، ')} />
                    <InfoRow icon="work" label="التفضيل" value={app.work_preference} />
                    <InfoRow icon="event" label="التاريخ" value={formatDate(app.created_at)} />
                  </div>
                  {app.skills && (
                    <div className="mt-3">
                      <div className="text-xs font-bold text-on-surface-variant mb-1">المهارات</div>
                      <p className="text-sm text-on-surface bg-surface-container-low rounded-xl px-4 py-2">{app.skills}</p>
                    </div>
                  )}
                  {app.experience_history && (
                    <div className="mt-3">
                      <div className="text-xs font-bold text-on-surface-variant mb-1">الخبرات</div>
                      <p className="text-sm text-on-surface bg-surface-container-low rounded-xl px-4 py-2 whitespace-pre-wrap">{app.experience_history}</p>
                    </div>
                  )}
                  {app.bio && (
                    <div className="mt-3">
                      <div className="text-xs font-bold text-on-surface-variant mb-1">نبذة شخصية</div>
                      <p className="text-sm text-on-surface bg-surface-container-low rounded-xl px-4 py-2">{app.bio}</p>
                    </div>
                  )}
                  {/* Status Actions */}
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-outline-variant/10 pt-4">
                    <span className="text-xs font-bold text-on-surface-variant self-center">تحديث الحالة:</span>
                    {app.status !== 'accepted' && (
                      <button onClick={() => updateStatus(app.id, 'accepted')} disabled={updatingId === app.id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-bold hover:bg-success/20 transition-colors disabled:opacity-50">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        قبول
                      </button>
                    )}
                    {app.status !== 'rejected' && (
                      <button onClick={() => updateStatus(app.id, 'rejected')} disabled={updatingId === app.id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-error/10 text-error text-xs font-bold hover:bg-error/20 transition-colors disabled:opacity-50">
                        <span className="material-symbols-outlined text-sm">cancel</span>
                        رفض
                      </button>
                    )}
                    {app.status !== 'interviewed' && (
                      <button onClick={() => updateStatus(app.id, 'interviewed')} disabled={updatingId === app.id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold hover:bg-tertiary/20 transition-colors disabled:opacity-50">
                        <span className="material-symbols-outlined text-sm">event</span>
                        تمت المقابلة
                      </button>
                    )}
                    {app.status !== 'pending' && (
                      <button onClick={() => updateStatus(app.id, 'pending')} disabled={updatingId === app.id} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-colors disabled:opacity-50">
                        <span className="material-symbols-outlined text-sm">replay</span>
                        إعادة للمراجعة
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <span className="material-symbols-outlined text-on-surface-variant text-base mt-0.5">{icon}</span>
      <div>
        <div className="text-xs font-bold text-on-surface-variant">{label}</div>
        <div className="text-sm text-on-surface">{value}</div>
      </div>
    </div>
  );
}
