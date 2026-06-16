'use client';

import { useEffect, useState, useCallback } from 'react';
import { useToast } from '../../../components/ui/Toast';

const SPECIALTIES = [
  { value: 'web', label: 'تطوير ويب' },
  { value: 'mobile', label: 'تطوير موبايل' },
  { value: 'ai', label: 'ذكاء اصطناعي' },
  { value: 'cybersecurity', label: 'أمن سيبراني' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'database', label: 'قواعد بيانات' },
];

const ROLES = [
  { value: 'trainer', label: 'مدرب' },
  { value: 'specialist', label: 'إخصائي' },
  { value: 'admin', label: 'إداري' },
  { value: 'supervisor', label: 'مشرف' },
  { value: 'coordinator', label: 'منسق' },
];

const STATUS_MAP = {
  active: { label: 'نشط', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-600' },
  inactive: { label: 'غير نشط', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-600' },
  suspended: { label: 'معلق', bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
};

const SKELETON_ROWS = [1, 2, 3, 4, 5];

export default function TrainersPage() {
  const { success, error: toastError } = useToast();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [source, setSource] = useState('manual');
  const [sourceList, setSourceList] = useState([]);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [sourceSearch, setSourceSearch] = useState('');

  const loadTrainers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterSpecialty) params.set('specialty', filterSpecialty);
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/admin/trainers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTrainers(data.trainers || []);
      }
    } finally { setLoading(false); }
  }, [search, filterSpecialty, filterStatus]);

  useEffect(() => {
    const t = setTimeout(loadTrainers, search || filterSpecialty || filterStatus ? 300 : 0);
    return () => clearTimeout(t);
  }, [loadTrainers, search, filterSpecialty, filterStatus]);

  const loadSourceList = useCallback(async () => {
    if (source === 'manual') { setSourceList([]); return; }
    setSourceLoading(true);
    try {
      const params = new URLSearchParams({ source });
      if (sourceSearch) params.set('search', sourceSearch);
      const res = await fetch(`/api/admin/trainers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSourceList(source === 'students' ? (data.students || []) : (data.team || []));
      }
    } finally { setSourceLoading(false); }
  }, [source, sourceSearch]);

  useEffect(() => {
    if (modal === 'edit' && source !== 'manual') {
      const t = setTimeout(loadSourceList, sourceSearch ? 300 : 0);
      return () => clearTimeout(t);
    }
  }, [modal, source, sourceSearch, loadSourceList]);

  const handleSourceSelect = (item) => {
    if (source === 'students') {
      setForm({
        ...form,
        full_name: item.name || '',
        email: item.email || '',
        phone: item.phone || '',
        source: 'student',
        source_id: item.id,
      });
    } else {
      setForm({
        ...form,
        full_name: item.name || '',
        email: item.email || '',
        phone: item.phone || '',
        source: 'team',
        source_id: item.id,
      });
    }
    setSourceList([]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      if (source === 'manual') {
        payload.source = 'manual';
        payload.source_id = null;
      }
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id ? `/api/admin/trainers/${form.id}` : '/api/admin/trainers';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) { setModal(null); loadTrainers(); success(form.id ? 'تم تحديث بيانات المدرب' : 'تم إضافة المدرب'); }
      else { const data = await res.json(); toastError(data.error || 'حدث خطأ'); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/admin/trainers/${confirmDelete.id}`, { method: 'DELETE' });
      if (res.ok) { setConfirmDelete(null); loadTrainers(); success('تم حذف المدرب'); }
    } catch { toastError('خطأ في الحذف'); }
  };

  const openNewModal = () => {
    setForm({});
    setSource('manual');
    setSourceList([]);
    setSourceSearch('');
    setModal('edit');
  };

  const activeCount = trainers.filter(t => t.status === 'active').length;
  const inactiveCount = trainers.filter(t => t.status === 'inactive').length;
  const suspendedCount = trainers.filter(t => t.status === 'suspended').length;

  return (
    <div className="p-md lg:p-lg max-w-container-max mx-auto">
      {/* Statistics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm flex items-center gap-md">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">groups</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-body-sm">إجمالي المدربين</p>
            <h3 className="text-headline-md font-bold text-primary">{trainers.length}</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm flex items-center gap-md border-r-4 border-green-500">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
            <span className="material-symbols-outlined text-3xl">task_alt</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-body-sm">مدرب نشط</p>
            <h3 className="text-headline-md font-bold text-primary">{activeCount}</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm flex items-center gap-md border-r-4 border-secondary">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-3xl">star</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-body-sm">غير نشطين</p>
            <h3 className="text-headline-md font-bold text-primary">{inactiveCount}</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm flex items-center gap-md">
          <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-3xl">event_busy</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-body-sm">معلق</p>
            <h3 className="text-headline-md font-bold text-primary">{suspendedCount}</h3>
          </div>
        </div>
      </div>

      {/* Management Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-md">
        {/* Filters & Actions Header */}
        <div className="p-md border-b border-outline-variant bg-surface-container-low flex flex-col md:flex-row justify-between gap-md">
          <div className="flex flex-wrap items-center gap-base">
            <div className="relative">
              <select
                value={filterSpecialty}
                onChange={e => setFilterSpecialty(e.target.value)}
                className="appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-lg py-xs pr-10 text-body-sm focus:ring-primary focus:border-primary"
              >
                <option value="">كل التخصصات</option>
                {SPECIALTIES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">filter_list</span>
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg px-lg py-xs pr-10 text-body-sm focus:ring-primary focus:border-primary"
              >
                <option value="">الحالة: الكل</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="suspended">معلق</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">toggle_on</span>
            </div>
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                type="text"
                placeholder="بحث عن مدرب..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant rounded-lg px-10 py-xs text-body-sm focus:ring-primary focus:border-primary w-48"
              />
            </div>
          </div>
          <button
            onClick={() => { setForm({}); setModal('edit'); }}
            className="bg-primary text-white px-md py-xs rounded-lg flex items-center gap-xs hover:bg-primary-container transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">person_add</span>
            <span className="font-label-md">إضافة مدرب جديد</span>
          </button>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-surface-container-high/50 border-b border-outline-variant">
                <tr>
                  <th className="p-md font-label-md text-on-surface-variant">المدرب</th>
                  <th className="p-md font-label-md text-on-surface-variant">التخصص</th>
                  <th className="p-md font-label-md text-on-surface-variant">الهاتف</th>
                  <th className="p-md font-label-md text-on-surface-variant">الراتب</th>
                  <th className="p-md font-label-md text-on-surface-variant">الحالة</th>
                  <th className="p-md font-label-md text-on-surface-variant">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {SKELETON_ROWS.map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-high" />
                        <div className="space-y-2"><div className="h-4 bg-surface-container-high rounded w-24" /><div className="h-3 bg-surface-container-high rounded w-32" /></div>
                      </div>
                    </td>
                    <td className="p-md"><div className="h-6 bg-surface-container-high rounded-full w-20" /></td>
                    <td className="p-md"><div className="h-4 bg-surface-container-high rounded w-20" /></td>
                    <td className="p-md"><div className="h-4 bg-surface-container-high rounded w-24" /></td>
                    <td className="p-md"><div className="h-6 bg-surface-container-high rounded-full w-16" /></td>
                    <td className="p-md"><div className="h-4 bg-surface-container-high rounded w-16" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : trainers.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-[64px] text-outline mb-sm block">person_off</span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">لا يوجد مدربين</h3>
            <p className="text-on-surface-variant mb-sm">ابدأ بإضافة مدرب جديد</p>
              <button
                onClick={openNewModal}
                className="bg-primary text-white px-md py-xs rounded-lg inline-flex items-center gap-xs hover:bg-primary-container transition-all shadow-sm"
              >
              <span className="material-symbols-outlined">person_add</span>
              <span className="font-label-md">إضافة مدرب</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-surface-container-high/50 border-b border-outline-variant">
                <tr>
                  <th className="p-md font-label-md text-on-surface-variant">المدرب</th>
                  <th className="p-md font-label-md text-on-surface-variant">التخصص</th>
                  <th className="p-md font-label-md text-on-surface-variant">الهاتف</th>
                  <th className="p-md font-label-md text-on-surface-variant">الراتب</th>
                  <th className="p-md font-label-md text-on-surface-variant">الحالة</th>
                  <th className="p-md font-label-md text-on-surface-variant">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {trainers.map(trainer => {
                  const spec = SPECIALTIES.find(s => s.value === trainer.specialty);
                  const st = STATUS_MAP[trainer.status] || STATUS_MAP.active;
                  const initials = (trainer.full_name || '').split(' ').map(w => w[0]).slice(0, 2).join('');
                  return (
                    <tr key={trainer.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="p-md">
                        <div className="flex items-center gap-sm">
                          <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm">
                            {initials || 'م'}
                          </div>
                          <div>
                            <p className="font-bold text-primary">{trainer.full_name}</p>
                            <p className="text-xs text-on-surface-variant">{ROLES.find(r => r.value === trainer.role)?.label || trainer.role || trainer.email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-md">
                        <span className="px-base py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {spec?.label || trainer.specialty || 'غير محدد'}
                        </span>
                      </td>
                      <td className="p-md">
                        <span className="text-body-sm text-on-surface-variant">{trainer.phone || 'غير محدد'}</span>
                      </td>
                      <td className="p-md">
                        <span className="text-body-sm text-on-surface-variant">
                          {trainer.salary_type === 'monthly'
                            ? `${trainer.monthly_salary || 0} ج.م/شهري`
                            : `${trainer.hourly_rate || 0} ج.م/ساعة`}
                        </span>
                      </td>
                      <td className="p-md">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${st.bg} ${st.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ml-1.5`} />
                          {st.label}
                        </span>
                      </td>
                      <td className="p-md">
                        <div className="flex items-center gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setForm({ ...trainer }); setModal('edit'); }}
                            className="p-1 hover:text-primary transition-colors"
                            title="تعديل"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => setConfirmDelete(trainer)}
                            className="p-1 hover:text-error transition-colors"
                            title="حذف"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                          <button
                            onClick={() => { setForm({ ...trainer }); setModal('view'); }}
                            className="p-1 hover:text-secondary transition-colors"
                            title="تفاصيل"
                          >
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-md bg-surface-container-lowest flex items-center justify-between border-t border-outline-variant">
          <p className="text-body-sm text-on-surface-variant">عرض {trainers.length} مدرب</p>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modal === 'edit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md" onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-surface-container-lowest border-b border-outline-variant p-md flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-primary">
                {form.id ? 'تعديل بيانات المدرب' : 'إضافة مدرب جديد'}
              </h3>
              <button onClick={() => setModal(null)} className="p-base hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-md space-y-4">
              {/* Source selector */}
              {!form.id && (
                <div className="bg-surface-container-high rounded-lg p-3">
                  <label className="block text-body-sm text-on-surface-variant mb-2 font-bold">المصدر</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'manual', label: 'إدخال يدوي', icon: 'edit' },
                      { value: 'students', label: 'من المسجلين', icon: 'school' },
                      { value: 'team', label: 'من المتقدمين', icon: 'groups' },
                    ].map(s => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => { setSource(s.value); setSourceSearch(''); setSourceList([]); setForm({ ...form, full_name: '', email: '', phone: '' }); }}
                        className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                          source === s.value ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant hover:border-outline'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">{s.icon}</span>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Source search & list */}
              {!form.id && source !== 'manual' && (
                <div>
                  <input
                    type="text"
                    placeholder="بحث بالاسم أو البريد أو الهاتف..."
                    value={sourceSearch}
                    onChange={e => setSourceSearch(e.target.value)}
                    className="w-full border border-outline-variant rounded-lg px-base py-xs text-body-sm focus:ring-2 focus:ring-primary outline-none mb-2"
                  />
                  {sourceLoading ? (
                    <div className="text-center py-4 text-on-surface-variant text-sm">جاري التحميل...</div>
                  ) : sourceList.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto border border-outline-variant rounded-lg divide-y divide-outline-variant">
                      {sourceList.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSourceSelect(item)}
                          className="w-full text-right p-3 hover:bg-primary/5 transition-colors flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                            {(item.name || '').split(' ').map(w => w[0]).slice(0, 2).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-on-surface truncate">{item.name}</p>
                            <p className="text-xs text-on-surface-variant truncate">{item.email || item.phone}</p>
                          </div>
                          {source === 'team' && item.form_type && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">{item.form_type}</span>
                          )}
                          {source === 'students' && item.track && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">{item.track}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : sourceSearch ? (
                    <div className="text-center py-4 text-on-surface-variant text-sm">لا توجد نتائج</div>
                  ) : null}
                </div>
              )}

              <div>
                <label className="block text-body-sm text-on-surface-variant mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  value={form.full_name || ''}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                  className="w-full border border-outline-variant rounded-lg px-base py-xs text-body-sm focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-body-sm text-on-surface-variant mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={form.email || ''}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-outline-variant rounded-lg px-base py-xs text-body-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-body-sm text-on-surface-variant mb-1">رقم الهوية</label>
                <input
                  type="text"
                  value={form.national_id || ''}
                  onChange={e => setForm({ ...form, national_id: e.target.value })}
                  className="w-full border border-outline-variant rounded-lg px-base py-xs text-body-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-body-sm text-on-surface-variant mb-1">الهاتف</label>
                <input
                  type="text"
                  value={form.phone || ''}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-outline-variant rounded-lg px-base py-xs text-body-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-body-sm text-on-surface-variant mb-1">الوظيفة / الدور *</label>
                <select
                  value={form.role || ''}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-outline-variant rounded-lg px-base py-xs text-body-sm focus:ring-2 focus:ring-primary outline-none bg-surface-container-lowest"
                >
                  <option value="">اختر الوظيفة</option>
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-body-sm text-on-surface-variant mb-1">التخصص</label>
                <select
                  value={form.specialty || ''}
                  onChange={e => setForm({ ...form, specialty: e.target.value })}
                  className="w-full border border-outline-variant rounded-lg px-base py-xs text-body-sm focus:ring-2 focus:ring-primary outline-none bg-surface-container-lowest"
                >
                  <option value="">اختر التخصص</option>
                  {SPECIALTIES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-body-sm text-on-surface-variant mb-1">الحالة</label>
                <select
                  value={form.status || 'active'}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-outline-variant rounded-lg px-base py-xs text-body-sm focus:ring-2 focus:ring-primary outline-none bg-surface-container-lowest"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="suspended">معلق</option>
                </select>
              </div>
              <div className="border-t border-outline-variant pt-4 mt-4">
                <h4 className="text-sm font-bold text-on-surface mb-3">الراتب</h4>
                <div>
                  <label className="block text-body-sm text-on-surface-variant mb-1">نوع الراتب</label>
                  <select
                    value={form.salary_type || 'hourly'}
                    onChange={e => setForm({ ...form, salary_type: e.target.value })}
                    className="w-full border border-outline-variant rounded-lg px-base py-xs text-body-sm focus:ring-2 focus:ring-primary outline-none bg-surface-container-lowest"
                  >
                    <option value="hourly">بالساعة</option>
                    <option value="monthly">راتب شهري ثابت</option>
                  </select>
                </div>
                {form.salary_type === 'hourly' ? (
                  <div className="mt-3">
                    <label className="block text-body-sm text-on-surface-variant mb-1">سعر الساعة (ج.م)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.hourly_rate || ''}
                      onChange={e => setForm({ ...form, hourly_rate: e.target.value })}
                      className="w-full border border-outline-variant rounded-lg px-base py-xs text-body-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                ) : (
                  <div className="mt-3">
                    <label className="block text-body-sm text-on-surface-variant mb-1">الراتب الشهري (ج.م)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.monthly_salary || ''}
                      onChange={e => setForm({ ...form, monthly_salary: e.target.value })}
                      className="w-full border border-outline-variant rounded-lg px-base py-xs text-body-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 bg-surface-container-lowest border-t border-outline-variant p-md flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-primary text-on-primary py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity disabled:opacity-50 text-center"
              >
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button
                onClick={() => setModal(null)}
                className="px-md py-2 border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal (read-only) */}
      {modal === 'view' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md" onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-surface-container-lowest border-b border-outline-variant p-md flex items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-primary">بيانات المدرب</h3>
              <button onClick={() => setModal(null)} className="p-base hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-md space-y-4">
              <div className="flex items-center gap-md mb-md">
                <div className="w-16 h-16 rounded-lg bg-surface-container-high flex items-center justify-center text-primary font-bold text-xl">
                  {(form.full_name || '').split(' ').map(w => w[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="font-headline-md text-primary font-bold">{form.full_name}</p>
                  <p className="text-body-sm text-on-surface-variant">{form.email || ''}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-base text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">badge</span>
                  <span className="text-body-sm">{ROLES.find(r => r.value === form.role)?.label || form.role || 'غير محدد'}</span>
                </div>
                <div className="flex items-center gap-base text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">school</span>
                  <span className="text-body-sm">{SPECIALTIES.find(s => s.value === form.specialty)?.label || form.specialty || 'غير محدد'}</span>
                </div>
                <div className="flex items-center gap-base text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">phone</span>
                  <span className="text-body-sm">{form.phone || 'غير محدد'}</span>
                </div>
                <div className="flex items-center gap-base text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">credit_card</span>
                  <span className="text-body-sm">{form.national_id || 'غير محدد'}</span>
                </div>
                <div className="flex items-center gap-base text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">payments</span>
                  <span className="text-body-sm">
                    {form.salary_type === 'monthly'
                      ? `راتب شهري: ${form.monthly_salary || 0} ج.م`
                      : `ساعي: ${form.hourly_rate || 0} ج.م/ساعة`}
                  </span>
                </div>
                <div className="flex items-center gap-base text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">flag</span>
                  <span className="text-body-sm">{STATUS_MAP[form.status]?.label || form.status}</span>
                </div>
                {form.source && (
                  <div className="flex items-center gap-base text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">source</span>
                    <span className="text-body-sm">
                      {form.source === 'student' ? 'مسجّل بالموقع (طالب)' : form.source === 'team' ? 'متقدم للانضمام (فريق)' : 'إدخال يدوي'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 bg-surface-container-lowest border-t border-outline-variant p-md flex gap-3">
              <button
                onClick={() => { setModal('edit'); }}
                className="flex-1 bg-primary text-on-primary py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity text-center"
              >
                تعديل
              </button>
              <button
                onClick={() => setModal(null)}
                className="px-md py-2 border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md" onClick={() => setConfirmDelete(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-sm p-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <span className="material-symbols-outlined text-[48px] text-error mb-sm block">delete_forever</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">حذف المدرب</h3>
              <p className="text-body-sm text-on-surface-variant mb-md">
                هل أنت متأكد من حذف &quot;{confirmDelete.full_name}&quot;؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-error text-on-error py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                >
                  حذف
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-md py-2 border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
