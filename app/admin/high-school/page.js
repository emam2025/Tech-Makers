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

const HIGH_SCHOOL_YEARS = [
  { value: 'first', label: 'الصف الأول الثانوي' },
  { value: 'second', label: 'الصف الثاني الثانوي' },
  { value: 'third', label: 'الصف الثالث الثانوي' },
];

const STATUSES = [
  { value: 'active', label: 'نشط', color: 'success' },
  { value: 'inactive', label: 'غير نشط', color: 'danger' },
  { value: 'graduated', label: 'تخرج', color: 'info' },
];

export default function HighSchoolPage() {
  const { success, error: toastError } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ education_level: 'high_school' });
      if (search) params.set('search', search);
      if (filterYear) params.set('high_school_year', filterYear);
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/admin/students?${params}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } finally {
      setLoading(false);
    }
  }, [search, filterYear, filterStatus]);

  useEffect(() => {
    const t = setTimeout(loadStudents, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [loadStudents, search]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!form.full_name || form.full_name.trim().length < 3) {
        toastError('الاسم مطلوب (3 أحرف على الأقل)');
        setSaving(false);
        return;
      }
      if (!form.national_id || !/^\d{14}$/.test(form.national_id)) {
        toastError('الرقم القومي يجب أن يكون 14 رقم');
        setSaving(false);
        return;
      }
      if (!form.phone || form.phone.trim().length < 10) {
        toastError('رقم الهاتف مطلوب');
        setSaving(false);
        return;
      }

      const payload = {
        ...form,
        education_level: 'high_school',
        status: form.status || 'active',
      };

      const url = form.id ? `/api/admin/students/${form.id}` : '/api/admin/students';
      const method = form.id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setDrawer(null);
        loadStudents();
        success(form.id ? 'تم تحديث بيانات الطالب' : 'تم إضافة الطالب');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(null);
      loadStudents();
      success('تم حذف الطالب');
    }
  };

  const firstYear = students.filter(s => s.high_school_year === 'first').length;
  const secondYear = students.filter(s => s.high_school_year === 'second').length;
  const thirdYear = students.filter(s => s.high_school_year === 'third').length;
  const activeStudents = students.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-md">
      <div className="flex items-center justify-between flex-wrap gap-base">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-[var(--color-on-surface)]">الثانويه العامه</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">إدارة طلاب المرحلة الثانوية</p>
        </div>
        <Button onClick={() => { setForm({ education_level: 'high_school', status: 'active' }); setDrawer('new'); }} icon="add">
          إضافة طالب ثانوي
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-base">
        <KPICard title="إجمالي الطلاب" value={students.length} icon="school" color="var(--color-primary)" />
        <KPICard title="الصف الأول" value={firstYear} icon="looks_one" color="var(--color-info)" />
        <KPICard title="الصف الثاني" value={secondYear} icon="looks_two" color="var(--color-warning)" />
        <KPICard title="الصف الثالث" value={thirdYear} icon="looks_3" color="var(--color-success)" />
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="بحث بالاسم أو الرقم القومي..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="search"
          />
        </div>
        <div className="w-48">
          <Select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            options={[{ value: '', label: 'كل الصفوف' }, ...HIGH_SCHOOL_YEARS]}
          />
        </div>
        <div className="w-36">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[{ value: '', label: 'كل الحالات' }, ...STATUSES]}
          />
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline-variant)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-[var(--color-on-surface-variant)] mb-xs">school</span>
            <p className="text-[var(--color-on-surface-variant)]">لا يوجد طلاب ثانوي</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container)]">
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الاسم</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الرقم القومي</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الصف</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الهاتف</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">البريد</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الحالة</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--color-on-surface-variant)]">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-[var(--color-outline-variant)]/50 hover:bg-[var(--color-surface-container-low)] transition-colors">
                    <td className="px-4 py-3 font-medium">{s.full_name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{s.national_id}</td>
                    <td className="px-4 py-3">
                      <Badge color="primary">{HIGH_SCHOOL_YEARS.find(y => y.value === s.high_school_year)?.label || '-'}</Badge>
                    </td>
                    <td className="px-4 py-3" dir="ltr">{s.phone}</td>
                    <td className="px-4 py-3 text-xs">{s.email || '-'}</td>
                    <td className="px-4 py-3">
                      <Badge color={STATUSES.find(st => st.value === s.status)?.color || 'warning'}>
                        {STATUSES.find(st => st.value === s.status)?.label || s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setForm(s); setDrawer('edit'); }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors" title="تعديل">
                          <span className="material-symbols-outlined text-lg text-[var(--color-on-surface-variant)]">edit</span>
                        </button>
                        <button onClick={() => setConfirmDelete(s)} className="p-1.5 rounded-lg hover:bg-[var(--color-error-container)] transition-colors" title="حذف">
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

      <Drawer
        title={drawer === 'new' ? 'إضافة طالب ثانوي' : 'تعديل بيانات الطالب'}
        isOpen={!!drawer}
        onClose={() => setDrawer(null)}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDrawer(null)}>إلغاء</Button>
            <Button onClick={handleSave} loading={saving} icon="save">{drawer === 'new' ? 'إضافة' : 'حفظ التعديلات'}</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="اسم الطالب *"
            placeholder="الاسم بالكامل"
            value={form.full_name || ''}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />

          <Input
            label="الرقم القومي *"
            placeholder="14 رقم"
            value={form.national_id || ''}
            onChange={(e) => setForm({ ...form, national_id: e.target.value.replace(/\D/g, '').slice(0, 14) })}
            maxLength={14}
            required
          />

          <Select
            label="الصف الدراسي *"
            value={form.high_school_year || 'first'}
            onChange={(e) => setForm({ ...form, high_school_year: e.target.value })}
            options={HIGH_SCHOOL_YEARS}
          />

          <Input
            label="رقم الهاتف *"
            placeholder="01000000000"
            value={form.phone || ''}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />

          <Input
            label="البريد الإلكتروني"
            placeholder="student@email.com"
            type="email"
            value={form.email || ''}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Input
            label="اسم ولي الأمر"
            placeholder="اسم ولي الأمر"
            value={form.parent_name || ''}
            onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
          />

          <Input
            label="هاتف ولي الأمر"
            placeholder="01000000000"
            value={form.parent_phone || ''}
            onChange={(e) => setForm({ ...form, parent_phone: e.target.value })}
          />

          <Input
            label="المدرسة"
            placeholder="اسم المدرسة"
            value={form.school_name || ''}
            onChange={(e) => setForm({ ...form, school_name: e.target.value })}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-on-surface)]">الحالة</label>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setForm({ ...form, status: s.value })}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-medium text-sm transition-all ${
                    form.status === s.value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]'
                      : 'border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete?.id)}
        title="حذف الطالب"
        message={`هل أنت متأكد من حذف "${confirmDelete?.full_name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        danger
      />
    </div>
  );
}
