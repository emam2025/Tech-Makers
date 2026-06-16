'use client';

import { useEffect, useState, useCallback } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import { ConfirmModal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';
import Drawer from '../../../components/ui/Drawer';

export default function PlansPage() {
  const { success, error: toastError } = useToast();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/subscriptions/plans');
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPlans(); }, [loadPlans]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = form.id ? `/api/admin/subscriptions/plans/${form.id}` : '/api/admin/subscriptions/plans';
      const res = await fetch(url, {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDrawer(null);
        loadPlans();
        success(form.id ? 'تم تحديث الباقة' : 'تم إنشاء الباقة');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/subscriptions/plans/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(null);
      loadPlans();
      success('تم حذف الباقة');
    } else {
      toastError('فشل الحذف');
    }
  };

  const handleToggleActive = async (plan) => {
    try {
      const res = await fetch(`/api/admin/subscriptions/plans/${plan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !plan.is_active }),
      });
      if (res.ok) loadPlans();
    } catch {}
  };

  if (loading) return <div className="page-container"><div className="text-center py-8 text-[var(--color-text-tertiary)]">جاري التحميل...</div></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>خطط الاشتراك</h1><p>إنشاء وتعديل وحذف خطط الاشتراك</p></div>
        <Button icon="add" onClick={() => { setForm({ duration_days: 30, is_active: true }); setDrawer('new'); }}>إضافة باقة</Button>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-16 card-admin">
          <span className="material-symbols-outlined text-[64px] text-[var(--color-text-tertiary)]">card_membership</span>
          <p className="text-[var(--color-text-secondary)] mt-3">لا توجد باقات بعد</p>
          <Button icon="add" className="mt-4" onClick={() => { setForm({ duration_days: 30, is_active: true }); setDrawer('new'); }}>إنشاء أول باقة</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-base">
          {plans.map((plan) => (
            <div key={plan.id} className="card-admin p-md relative">
              <div className="absolute top-4 left-4">
                <Badge variant={plan.is_active ? 'success' : 'default'}>{plan.is_active ? 'نشطة' : 'معطلة'}</Badge>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">{plan.name}</h3>
              <div className="text-2xl font-bold text-[var(--color-primary)] mb-1">{plan.price?.toLocaleString()} ج.م</div>
              <div className="text-sm text-[var(--color-text-tertiary)] mb-3">{plan.duration_days || 30} يوم</div>
              {plan.description && <p className="text-sm text-[var(--color-text-secondary)] mb-3">{plan.description}</p>}
              <div className="flex gap-2 border-t border-[var(--color-border-subtle)] pt-3">
                <Button size="sm" variant="ghost" icon="edit" onClick={() => { setForm({ ...plan }); setDrawer('edit'); }}>تعديل</Button>
                <Button size="sm" variant="ghost" icon={plan.is_active ? 'block' : 'check_circle'} onClick={() => handleToggleActive(plan)}>{plan.is_active ? 'تعطيل' : 'تفعيل'}</Button>
                <Button size="sm" variant="ghost" icon="delete" className="text-[var(--color-danger)]" onClick={() => setConfirmDelete(plan)}>حذف</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title={form.id ? 'تعديل الباقة' : 'إضافة باقة جديدة'}
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="اسم الباقة" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="مثال: باقة شهرية، باقة فصل" />
          <Input label="السعر (ج.م)" type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} required />
          <Input label="المدة (بالأيام)" type="number" value={form.duration_days || 30} onChange={(e) => setForm({ ...form, duration_days: parseInt(e.target.value) || 30 })} />
          <Input label="الوصف" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} multiline rows={2} placeholder="وصف مختصر للباقة" />
        </div>
      </Drawer>

      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDelete(confirmDelete?.id)} title="حذف الباقة" message={`هل أنت متأكد من حذف "${confirmDelete?.name}"؟`} confirmText="حذف" confirmVariant="danger" />
    </div>
  );
}
