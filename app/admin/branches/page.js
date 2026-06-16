'use client';

import { useEffect, useState, useCallback } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Drawer from '../../../components/ui/Drawer';
import Badge from '../../../components/ui/Badge';
import { KPICard } from '../../../components/ui/Card';
import { ConfirmModal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';

export default function BranchesPage() {
  const { success, error: toastError } = useToast();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadBranches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/branches');
      if (res.ok) {
        const data = await res.json();
        setBranches(data.branches || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBranches(); }, [loadBranches]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = '/api/admin/branches';
      const method = form.id ? 'PATCH' : 'POST';
      const payload = form.id ? { ...form, id: form.id } : form;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setDrawer(null);
        loadBranches();
        success(form.id ? 'تم تحديث الفرع' : 'تم إضافة الفرع');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/branches?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(null);
      loadBranches();
      success('تم حذف الفرع');
    }
  };

  return (
    <div className="space-y-md">
      <div className="flex items-center justify-between flex-wrap gap-base">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-[var(--color-on-surface)]">الفروع</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">إدارة فروع الأكاديمية والمجموعات والمشرفين</p>
        </div>
        <Button onClick={() => { setForm({}); setDrawer('new'); }} icon="add">
          إضافة فرع
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-base">
        <KPICard title="إجمالي الفروع" value={branches.length} icon="store" color="var(--color-primary)" />
        <KPICard title="فروع نشطة" value={branches.filter(b => b.is_active).length} icon="check_circle" color="var(--color-success)" />
        <KPICard title="المجموعات" value={branches.reduce((s, b) => s + (b.group_count?.[0]?.count || 0), 0)} icon="groups" color="var(--color-info)" />
        <KPICard title="الطلاب" value={branches.reduce((s, b) => s + (b.student_count?.[0]?.count || 0), 0)} icon="school" color="var(--color-secondary)" />
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline-variant)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
          </div>
        ) : branches.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-[var(--color-on-surface-variant)] mb-xs">store</span>
            <p className="text-[var(--color-on-surface-variant)]">لا توجد فروع</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-base p-sm">
            {branches.map((b) => (
              <div key={b.id} className="bg-[var(--color-surface-container-low)] rounded-xl p-md border border-[var(--color-outline-variant)]/50 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-container)] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[var(--color-on-primary-container)]">store</span>
                    </div>
                    <div>
                      <div className="font-bold text-[var(--color-on-surface)]">{b.name}</div>
                      {b.city && <div className="text-xs text-[var(--color-on-surface-variant)]">{b.city}</div>}
                    </div>
                  </div>
                  <Badge color={b.is_active ? 'success' : 'danger'}>{b.is_active ? 'نشط' : 'معطل'}</Badge>
                </div>
                {b.address && <p className="text-sm text-[var(--color-on-surface-variant)] mb-3">{b.address}</p>}
                {b.phone && <p className="text-sm text-[var(--color-on-surface-variant)] mb-3">{b.phone}</p>}
                <div className="flex gap-base text-xs text-[var(--color-on-surface-variant)] mb-3">
                  <span>{b.group_count?.[0]?.count || 0} مجموعة</span>
                  <span>{b.student_count?.[0]?.count || 0} طالب</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => { setForm(b); setDrawer('edit'); }} icon="edit">تعديل</Button>
                  <Button size="sm" variant="danger" onClick={() => setConfirmDelete(b)} icon="delete">حذف</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Drawer
        title={drawer === 'new' ? 'إضافة فرع' : 'تعديل الفرع'}
        isOpen={!!drawer}
        onClose={() => setDrawer(null)}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDrawer(null)}>إلغاء</Button>
            <Button onClick={handleSave} loading={saving} icon="save">حفظ</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="اسم الفرع *"
            placeholder="الفرع الرئيسي"
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="المدينة"
            placeholder="القاهرة"
            value={form.city || ''}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <Input
            label="العنوان"
            placeholder="العنوان التفصيلي"
            value={form.address || ''}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <Input
            label="رقم الهاتف"
            placeholder="01000000000"
            value={form.phone || ''}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-[var(--color-on-surface)]">الحالة</label>
            <button
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.is_active !== false ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-outline)]'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_active !== false ? 'right-0.5' : 'right-6'}`} />
            </button>
            <span className="text-sm text-[var(--color-on-surface-variant)]">{form.is_active !== false ? 'نشط' : 'معطل'}</span>
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete?.id)}
        title="حذف الفرع"
        message={`هل أنت متأكد من حذف فرع "${confirmDelete?.name}"؟ سيتم حذف جميع البيانات المرتبطة.`}
        confirmLabel="حذف"
        cancelLabel="إلغاء"
        danger
      />
    </div>
  );
}
