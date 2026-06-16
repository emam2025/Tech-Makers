'use client';

import { useEffect, useState, useCallback } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Drawer from '../../../components/ui/Drawer';
import Badge from '../../../components/ui/Badge';
import { KPICard } from '../../../components/ui/Card';
import { ConfirmModal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';

const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const HOUR_TYPES = [
  { value: 'training', label: 'تدريب', icon: 'school' },
  { value: 'preparation', label: 'تحضير', icon: 'edit_note' },
  { value: 'correction', label: 'تصحيح', icon: 'grading' },
  { value: 'meeting', label: 'اجتماع', icon: 'groups' },
  { value: 'other', label: 'أخرى', icon: 'more_horiz' },
];

const STATUS_MAP = {
  pending: { label: 'قيد المراجعة', color: 'warning' },
  approved: { label: 'معتمدة', color: 'success' },
  rejected: { label: 'مرفوضة', color: 'danger' },
};

const REPORT_STATUS = {
  draft: { label: 'مسودة', color: 'warning' },
  approved: { label: 'معتمد', color: 'info' },
  paid: { label: 'مدفوع', color: 'success' },
};

export default function SalariesPage() {
  const { success, error: toastError } = useToast();
  const [trainers, setTrainers] = useState([]);
  const [hours, setHours] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('hours');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterTrainer, setFilterTrainer] = useState('');
  const [filterMonth, setFilterMonth] = useState(String(new Date().getMonth() + 1));
  const [filterYear, setFilterYear] = useState(String(new Date().getFullYear()));

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterTrainer) params.set('trainer_id', filterTrainer);
      params.set('month', filterMonth);
      params.set('year', filterYear);

      const [hoursRes, reportsRes, trainersRes] = await Promise.all([
        fetch(`/api/admin/trainer-hours?${params}`),
        fetch(`/api/admin/salaries?${params}`),
        fetch('/api/admin/trainers'),
      ]);

      if (hoursRes.ok) {
        const data = await hoursRes.json();
        setHours(data.hours || []);
      }
      if (reportsRes.ok) {
        const data = await reportsRes.json();
        setReports(data.reports || []);
      }
      if (trainersRes.ok) {
        const data = await trainersRes.json();
        setTrainers(data.trainers || []);
      }
    } finally {
      setLoading(false);
    }
  }, [filterTrainer, filterMonth, filterYear]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveHour = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/trainer-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDrawer(null);
        loadData();
        success('تم إضافة الساعات');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const handleApproveHour = async (id, status) => {
    const res = await fetch('/api/admin/trainer-hours', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      loadData();
      success(status === 'approved' ? 'تم الاعتماد' : 'تم الرفض');
    } else {
      toastError('حدث خطأ');
    }
  };

  const handleDeleteHour = async (id) => {
    const res = await fetch(`/api/admin/trainer-hours?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(null);
      loadData();
      success('تم الحذف');
    }
  };

  const handleGenerateReport = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/salaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainer_id: filterTrainer,
          month: parseInt(filterMonth),
          year: parseInt(filterYear),
        }),
      });
      if (res.ok) {
        loadData();
        success('تم إنشاء التقرير');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const handleReportStatus = async (id, status) => {
    const res = await fetch('/api/admin/salaries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      loadData();
      success('تم التحديث');
    }
  };

  const totalHours = hours.reduce((s, h) => s + (parseFloat(h.hours) || 0), 0);
  const approvedHours = hours.filter(h => h.status === 'approved').reduce((s, h) => s + (parseFloat(h.hours) || 0), 0);
  const totalReportSalary = reports.reduce((s, r) => s + (parseFloat(r.total_salary) || 0), 0);

  const currentMonthName = MONTHS[parseInt(filterMonth) - 1];

  return (
    <div className="space-y-md">
      <div className="flex items-center justify-between flex-wrap gap-base">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-[var(--color-on-surface)]">رواتب المدربين</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">إدارة ساعات العمل والرواتب الشهرية</p>
        </div>
        <Button onClick={() => { setForm({ hour_type: 'training', date: new Date().toISOString().split('T')[0] }); setDrawer('hour'); }} icon="add">
          إضافة ساعات
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-base">
        <KPICard title={`ساعات ${currentMonthName}`} value={`${totalHours.toFixed(1)} ساعة`} icon="schedule" color="var(--color-primary)" />
        <KPICard title="ساعات معتمدة" value={`${approvedHours.toFixed(1)} ساعة`} icon="check_circle" color="var(--color-success)" />
        <KPICard title="تقارير الرواتب" value={reports.length} icon="receipt_long" color="var(--color-info)" />
        <KPICard title="إجمالي الرواتب" value={`${totalReportSalary.toLocaleString('ar-EG')} ج.م`} icon="payments" color="var(--color-secondary)" />
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="w-48">
          <Select
            value={filterTrainer}
            onChange={(e) => setFilterTrainer(e.target.value)}
            options={[{ value: '', label: 'كل المدربين' }, ...trainers.map(t => ({ value: t.id, label: t.full_name }))]}
          />
        </div>
        <div className="w-36">
          <Select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            options={MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))}
          />
        </div>
        <div className="w-28">
          <Select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            options={[2024, 2025, 2026, 2027].map(y => ({ value: String(y), label: String(y) }))}
          />
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-[var(--color-surface-container)] rounded-xl w-fit">
        {[
          { id: 'hours', label: 'ساعات العمل', icon: 'schedule' },
          { id: 'reports', label: 'تقارير الرواتب', icon: 'receipt_long' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
              tab === t.id
                ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-md'
                : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'hours' ? (
        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline-variant)] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin h-8 w-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
            </div>
          ) : hours.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-[var(--color-on-surface-variant)] mb-xs">schedule</span>
              <p className="text-[var(--color-on-surface-variant)]">لا توجد سجلات ساعات</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container)]">
                    <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">المدرب</th>
                    <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">التاريخ</th>
                    <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">النوع</th>
                    <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الساعات</th>
                    <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">المجموعة</th>
                    <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">التلقائي</th>
                    <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الحالة</th>
                    <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {hours.map((h) => (
                    <tr key={h.id} className="border-b border-[var(--color-outline-variant)]/50 hover:bg-[var(--color-surface-container-low)] transition-colors">
                      <td className="px-4 py-3 font-medium">{h.trainer?.full_name || '-'}</td>
                      <td className="px-4 py-3">{h.date}</td>
                      <td className="px-4 py-3">
                        <Badge color="primary">{HOUR_TYPES.find(t => t.value === h.hour_type)?.label}</Badge>
                      </td>
                      <td className="px-4 py-3 font-bold text-[var(--color-primary)]">{h.hours} ساعة</td>
                      <td className="px-4 py-3">{h.group?.name || '-'}</td>
                      <td className="px-4 py-3">
                        {h.is_auto ? (
                          <Badge color="info">تلقائي</Badge>
                        ) : (
                          <Badge color="secondary">يدوي</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={STATUS_MAP[h.status]?.color}>{STATUS_MAP[h.status]?.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {h.status === 'pending' && (
                            <>
                              <button onClick={() => handleApproveHour(h.id, 'approved')} className="p-1.5 rounded-lg hover:bg-[var(--color-success-container)] transition-colors" title="اعتماد">
                                <span className="material-symbols-outlined text-lg text-[var(--color-success)]">check_circle</span>
                              </button>
                              <button onClick={() => handleApproveHour(h.id, 'rejected')} className="p-1.5 rounded-lg hover:bg-[var(--color-error-container)] transition-colors" title="رفض">
                                <span className="material-symbols-outlined text-lg text-[var(--color-danger)]">cancel</span>
                              </button>
                            </>
                          )}
                          <button onClick={() => setConfirmDelete({ type: 'hour', id: h.id })} className="p-1.5 rounded-lg hover:bg-[var(--color-error-container)] transition-colors" title="حذف">
                            <span className="material-symbols-outlined text-lg text-[var(--color-danger)]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-xs">
          <div className="flex gap-3">
            <Button onClick={handleGenerateReport} loading={saving} icon="receipt_long">
              إنشاء تقرير راتب {currentMonthName}
            </Button>
          </div>
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline-variant)] overflow-hidden">
            {reports.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-6xl text-[var(--color-on-surface-variant)] mb-xs">receipt_long</span>
                <p className="text-[var(--color-on-surface-variant)]">لا توجد تقارير رواتب لهذا الشهر</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-base p-sm">
                {reports.map((r) => (
                  <div key={r.id} className="bg-[var(--color-surface-container-low)] rounded-xl p-md border border-[var(--color-outline-variant)]/50">
                    <div className="flex items-center justify-between mb-xs">
                      <div className="font-headline-lg text-headline-lg text-[var(--color-primary)]">{r.trainer?.full_name}</div>
                      <Badge color={REPORT_STATUS[r.status]?.color}>{REPORT_STATUS[r.status]?.label}</Badge>
                    </div>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">نوع الراتب:</span><span className="font-medium">{r.trainer?.salary_type === 'monthly' ? 'راتب شهري' : 'بالساعة'}</span></div>
                      <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">الساعات:</span><span className="font-medium">{r.total_hours} ساعة</span></div>
                      <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">سعر الساعة:</span><span className="font-medium">{r.hourly_rate} ج.م</span></div>
                      <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">الأساسي:</span><span className="font-medium">{parseFloat(r.base_salary).toLocaleString('ar-EG')} ج.م</span></div>
                      {parseFloat(r.bonus) > 0 && <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">المكافآت:</span><span className="font-medium text-[var(--color-success)]">+{parseFloat(r.bonus).toLocaleString('ar-EG')} ج.م</span></div>}
                      {parseFloat(r.deductions) > 0 && <div className="flex justify-between"><span className="text-[var(--color-on-surface-variant)]">الخصومات:</span><span className="font-medium text-[var(--color-danger)]">-{parseFloat(r.deductions).toLocaleString('ar-EG')} ج.م</span></div>}
                      <div className="flex justify-between border-t border-[var(--color-outline-variant)]/30 pt-2 mt-2"><span className="font-bold text-[var(--color-on-surface)]">الإجمالي:</span><span className="font-bold text-[var(--color-primary)] text-lg">{parseFloat(r.total_salary).toLocaleString('ar-EG')} ج.م</span></div>
                    </div>
                    <div className="flex gap-2">
                      {r.status === 'draft' && (
                        <Button size="sm" onClick={() => handleReportStatus(r.id, 'approved')} icon="check_circle">اعتماد</Button>
                      )}
                      {r.status === 'approved' && (
                        <Button size="sm" onClick={() => handleReportStatus(r.id, 'paid')} icon="payments" variant="success">دفع</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Drawer
        title="إضافة ساعات عمل"
        isOpen={drawer === 'hour'}
        onClose={() => setDrawer(null)}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDrawer(null)}>إلغاء</Button>
            <Button onClick={handleSaveHour} loading={saving} icon="save">إضافة</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-on-surface)]">المدرب *</label>
            <select
              value={form.trainer_id || ''}
              onChange={(e) => setForm({ ...form, trainer_id: e.target.value })}
              className="w-full px-4 py-3 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl text-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none"
            >
              <option value="">اختر المدرب</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>{t.full_name}</option>
              ))}
            </select>
          </div>

          <Input
            label="عدد الساعات *"
            type="number"
            step="0.5"
            min="0.5"
            max="24"
            value={form.hours || ''}
            onChange={(e) => setForm({ ...form, hours: parseFloat(e.target.value) || 0 })}
            placeholder="1"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-on-surface)]">نوع الساعة *</label>
            <div className="grid grid-cols-3 gap-2">
              {HOUR_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setForm({ ...form, hour_type: type.value })}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                    form.hour_type === type.value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]'
                      : 'border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{type.icon}</span>
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="التاريخ"
            type="date"
            value={form.date || ''}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <Input
            label="ملاحظات"
            placeholder="وصف العمل المنجز"
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </Drawer>

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDeleteHour(confirmDelete?.id)}
        title="حذف سجل"
        message="هل أنت متأكد من حذف هذا السجل؟"
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        danger
      />
    </div>
  );
}
