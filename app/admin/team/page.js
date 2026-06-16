'use client';

import { useEffect, useState } from 'react';

const FORM_TYPES = { trainer: 'مدرب', specialist: 'متخصص', admin: 'إداري' };
const STATUSES = { pending: 'قيد المراجعة', accepted: 'مقبول', rejected: 'مرفوض', interviewed: 'تمت المقابلة' };

const STATUS_STYLES = {
  pending: 'bg-secondary/10 text-secondary',
  accepted: 'bg-success/10 text-success',
  rejected: 'bg-error/10 text-error',
  interviewed: 'bg-blue-100 text-blue-600',
};

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

  const stats = [
    {
      icon: 'person_search',
      label: 'إجمالي المتقدمين',
      count: applications.length,
      color: 'text-primary',
      bg: 'bg-primary/5',
      sub: null,
    },
    {
      icon: 'pending_actions',
      label: 'قيد المراجعة',
      count: applications.filter(a => a.status === 'pending').length,
      color: 'text-secondary',
      bg: 'bg-secondary/5',
      sub: null,
      bar: true,
      barPct: applications.length ? Math.round((applications.filter(a => a.status === 'pending').length / applications.length) * 100) : 0,
    },
    {
      icon: 'event_available',
      label: 'تمت المقابلة',
      count: applications.filter(a => a.status === 'interviewed').length,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      sub: null,
    },
    {
      icon: 'person_off',
      label: 'طلبات مرفوضة',
      count: applications.filter(a => a.status === 'rejected').length,
      color: 'text-error',
      bg: 'bg-error/5',
      sub: null,
    },
  ];

  return (
    <div className="p-gutter max-w-container-max mx-auto space-y-lg">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-md">
        {stats.map((s, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest p-md rounded-xl shadow-sm transition-transform hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-sm">
              <span className={`material-symbols-outlined ${s.color} p-xs ${s.bg} rounded-lg`}>{s.icon}</span>
              <span className={`${s.color} font-bold text-headline-md`}>{s.count}</span>
            </div>
            <p className="text-body-sm text-on-surface-variant">{s.label}</p>
            {s.bar && (
              <div className="h-1 w-full bg-surface-variant mt-sm rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: `${s.barPct}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-md border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
          <h2 className="font-headline-md text-headline-md text-primary">المتقدمون الجدد</h2>
          <div className="flex items-center gap-sm w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث عن متقدم..."
                className="w-full pr-10 pl-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-label-md focus:ring-primary outline-none"
            >
              <option value="">تصفية بالحالة</option>
              {Object.entries(STATUSES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-label-md focus:ring-primary outline-none"
            >
              <option value="">كل الأنواع</option>
              {Object.entries(FORM_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3">groups</span>
            <p className="font-body-md">لا توجد طلبات فريق</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-md py-4 font-label-md text-on-surface-variant">الاسم والمسمى</th>
                  <th className="px-md py-4 font-label-md text-on-surface-variant hidden sm:table-cell">تاريخ التقديم</th>
                  <th className="px-md py-4 font-label-md text-on-surface-variant hidden md:table-cell">النوع</th>
                  <th className="px-md py-4 font-label-md text-on-surface-variant">الحالة</th>
                  <th className="px-md py-4 font-label-md text-on-surface-variant text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-md py-4">
                      <div className="flex items-center gap-md">
                        <div className="w-12 h-12 rounded-full bg-surface-variant overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant text-xl">person</span>
                        </div>
                        <div>
                          <p className="font-label-md text-on-surface">{app.name}</p>
                          <p className="text-body-sm text-on-surface-variant">{FORM_TYPES[app.form_type] || app.form_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-4 text-body-sm text-on-surface-variant hidden sm:table-cell">{formatDate(app.created_at)}</td>
                    <td className="px-md py-4 text-body-sm text-on-surface-variant hidden md:table-cell">{FORM_TYPES[app.form_type] || app.form_type}</td>
                    <td className="px-md py-4">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${STATUS_STYLES[app.status] || 'bg-surface-container-high text-on-surface-variant'}`}>
                        {STATUSES[app.status] || app.status}
                      </span>
                    </td>
                    <td className="px-md py-4 text-left">
                      <div className="flex items-center justify-end gap-xs">
                        {app.status !== 'accepted' && (
                          <button onClick={() => updateStatus(app.id, 'accepted')} disabled={updatingId === app.id} className="w-8 h-8 rounded-full flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50" title="قبول">
                            <span className="material-symbols-outlined">check_circle</span>
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button onClick={() => updateStatus(app.id, 'rejected')} disabled={updatingId === app.id} className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error/5 transition-colors disabled:opacity-50" title="رفض">
                            <span className="material-symbols-outlined">cancel</span>
                          </button>
                        )}
                        {app.status !== 'interviewed' && (
                          <button onClick={() => updateStatus(app.id, 'interviewed')} disabled={updatingId === app.id} className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50" title="تمت المقابلة">
                            <span className="material-symbols-outlined">event_available</span>
                          </button>
                        )}
                        <button
                          onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                          title="عرض التفاصيل"
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {!loading && applications.length > 0 && (
          <div className="p-md border-t border-outline-variant flex items-center justify-between">
            <p className="text-body-sm text-on-surface-variant">عرض {applications.length} من أصل {applications.length} طلب</p>
          </div>
        )}
      </div>

      {/* Expanded Details Panel */}
      {expandedId && (
        <div className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          {(() => {
            const app = applications.find(a => a.id === expandedId);
            if (!app) return null;
            return (
              <div className="p-md">
                <div className="flex items-center justify-between mb-md">
                  <div className="flex items-center gap-md">
                    <div className="w-14 h-14 rounded-full bg-surface-variant overflow-hidden flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant text-2xl">person</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">{app.name}</h3>
                      <p className="text-body-sm text-on-surface-variant">{FORM_TYPES[app.form_type] || app.form_type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedId(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md text-sm">
                  <InfoRow icon="email" label="البريد الإلكتروني" value={app.email} />
                  <InfoRow icon="phone" label="الهاتف" value={app.phone} />
                  <InfoRow icon="location_on" label="العنوان" value={app.address} />
                  <InfoRow icon="flag" label="الدولة" value={app.country} />
                  <InfoRow icon="family_restroom" label="الحالة الاجتماعية" value={app.marital_status} />
                  <InfoRow icon="school" label="المؤهل" value={app.qualification} />
                  <InfoRow icon="account_balance" label="الجامعة" value={app.university} />
                  <InfoRow icon="menu_book" label="الكلية" value={app.college} />
                  <InfoRow icon="science" label="التخصص" value={app.major} />
                  <InfoRow icon="calendar_today" label="سنة التخرج" value={app.graduation_year} />
                  <InfoRow icon="translate" label="اللغات" value={[app.lang_arabic && 'عربي', app.lang_english && 'إنجليزي', app.lang_french && 'فرنسي'].filter(Boolean).join('، ')} />
                  <InfoRow icon="work" label="التفضيل" value={app.work_preference} />
                  <InfoRow icon="event" label="التاريخ" value={formatDate(app.created_at)} />
                </div>

                {app.skills && (
                  <div className="mt-md">
                    <div className="text-xs font-bold text-on-surface-variant mb-xs">المهارات</div>
                    <p className="text-sm text-on-surface bg-surface-container-low rounded-xl px-md py-sm">{app.skills}</p>
                  </div>
                )}
                {app.experience_history && (
                  <div className="mt-md">
                    <div className="text-xs font-bold text-on-surface-variant mb-xs">الخبرات</div>
                    <p className="text-sm text-on-surface bg-surface-container-low rounded-xl px-md py-sm whitespace-pre-wrap">{app.experience_history}</p>
                  </div>
                )}
                {app.bio && (
                  <div className="mt-md">
                    <div className="text-xs font-bold text-on-surface-variant mb-xs">نبذة شخصية</div>
                    <p className="text-sm text-on-surface bg-surface-container-low rounded-xl px-md py-sm">{app.bio}</p>
                  </div>
                )}

                {/* Status Actions */}
                <div className="mt-md flex flex-wrap gap-sm border-t border-outline-variant pt-md">
                  <span className="text-xs font-bold text-on-surface-variant self-center">تحديث الحالة:</span>
                  {app.status !== 'accepted' && (
                    <button onClick={() => updateStatus(app.id, 'accepted')} disabled={updatingId === app.id} className="inline-flex items-center gap-xs px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-bold hover:bg-success/20 transition-colors disabled:opacity-50">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      قبول
                    </button>
                  )}
                  {app.status !== 'rejected' && (
                    <button onClick={() => updateStatus(app.id, 'rejected')} disabled={updatingId === app.id} className="inline-flex items-center gap-xs px-3 py-1.5 rounded-full bg-error/10 text-error text-xs font-bold hover:bg-error/20 transition-colors disabled:opacity-50">
                      <span className="material-symbols-outlined text-sm">cancel</span>
                      رفض
                    </button>
                  )}
                  {app.status !== 'interviewed' && (
                    <button onClick={() => updateStatus(app.id, 'interviewed')} disabled={updatingId === app.id} className="inline-flex items-center gap-xs px-3 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold hover:bg-blue-200 transition-colors disabled:opacity-50">
                      <span className="material-symbols-outlined text-sm">event_available</span>
                      تمت المقابلة
                    </button>
                  )}
                  {app.status !== 'pending' && (
                    <button onClick={() => updateStatus(app.id, 'pending')} disabled={updatingId === app.id} className="inline-flex items-center gap-xs px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold hover:bg-surface-container transition-colors disabled:opacity-50">
                      <span className="material-symbols-outlined text-sm">replay</span>
                      إعادة للمراجعة
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* CTA Section */}
      <div className="relative overflow-hidden rounded-xl bg-primary h-64 flex items-center px-lg">
        <div className="relative z-10 max-w-lg text-white">
          <h3 className="font-headline-lg text-headline-lg mb-sm">هل تبحث عن مواهب معينة؟</h3>
          <p className="text-body-md text-primary-fixed mb-md">يمكنك مراجعة طلبات الفريق الحالي واختيار أفضل الكفاءات للانضمام إلى فريقك.</p>
        </div>
        <div className="hidden md:block absolute left-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-on-surface-variant text-base mt-0.5">{icon}</span>
      <div>
        <div className="text-xs font-bold text-on-surface-variant">{label}</div>
        <div className="text-sm text-on-surface">{value}</div>
      </div>
    </div>
  );
}
