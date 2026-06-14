'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import { KPICard } from '../../../components/ui/Card';
import { ConfirmModal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';

export default function SubscriptionsPage() {
  const { success, error: toastError } = useToast();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [plans, setPlans] = useState([]);

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/admin/subscriptions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions || []);
      }
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { loadSubscriptions(); }, [loadSubscriptions]);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch('/api/admin/subscriptions/plans');
        if (res.ok) {
          const data = await res.json();
          setPlans(data.plans || []);
        }
      } catch {}
    }
    fetchPlans();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id ? `/api/admin/subscriptions/${form.id}` : '/api/admin/subscriptions';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDrawer(null);
        loadSubscriptions();
        success(form.id ? 'تم تحديث الاشتراك' : 'تم إضافة الاشتراك');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/subscriptions/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(null);
      loadSubscriptions();
      success('تم حذف الاشتراك');
    } else {
      toastError('فشل الحذف');
    }
  };

  const filtered = subscriptions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (s.student?.full_name || '').toLowerCase().includes(q) ||
           (s.plan?.name || '').toLowerCase().includes(q);
  });

  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const expiredCount = subscriptions.filter(s => s.status === 'expired').length;
  const pendingCount = subscriptions.filter(s => s.status === 'pending').length;
  const totalAmount = subscriptions.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);

  const columns = [
    { key: 'student', label: 'الطالب', render: (r) => <span className="font-medium">{r.student?.full_name || '-'}</span> },
    { key: 'plan', label: 'الاشتراك', render: (r) => r.plan?.name || '-' },
    { key: 'start_date', label: 'البداية', render: (r) => r.start_date ? new Date(r.start_date).toLocaleDateString('ar-EG') : '-' },
    { key: 'end_date', label: 'النهاية', render: (r) => r.end_date ? new Date(r.end_date).toLocaleDateString('ar-EG') : '-' },
    { key: 'amount', label: 'المبلغ', render: (r) => <span className="font-bold">{r.amount ? `${r.amount} ج.م` : '-'}</span> },
    { key: 'status', label: 'الحالة', render: (r) => (
      <Badge variant={r.status === 'active' ? 'success' : r.status === 'expired' ? 'danger' : 'warning'}>
        {r.status === 'active' ? 'نشط' : r.status === 'expired' ? 'منتهي' : 'معلق'}
      </Badge>
    )},
  ];

  const actions = [
    { icon: 'edit', label: 'تعديل', onClick: (r) => { setForm(r); setDrawer('edit'); } },
    { icon: 'delete', label: 'حذف', onClick: (r) => setConfirmDelete(r), danger: true },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>الاشتراكات</h1><p>إدارة اشتراكات الطلاب</p></div>
        <Button icon="card_membership" onClick={() => { setForm({}); setDrawer('edit'); }}>إضافة اشتراك</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon="card_membership" iconColor="var(--color-primary)" iconBg="var(--color-primary-light)" value={subscriptions.length} label="إجمالي الاشتراكات" />
        <KPICard icon="check_circle" iconColor="var(--color-success)" iconBg="var(--color-success-light)" value={activeCount} label="نشط" trendDir="up" />
        <KPICard icon="cancel" iconColor="var(--color-danger)" iconBg="var(--color-danger-light)" value={expiredCount} label="منتهي" />
        <KPICard icon="pending" iconColor="var(--color-warning)" iconBg="var(--color-warning-light)" value={pendingCount} label="معلق" />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input placeholder="بحث بالاسم أو_plan..." icon="search" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64" />
        <Select options={[{ value: '', label: 'جميع الحالات' }, { value: 'active', label: 'نشط' }, { value: 'expired', label: 'منتهي' }, { value: 'pending', label: 'معلق' }]} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full sm:w-40" />
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} actions={actions} emptyText="لا توجد اشتراكات" searchable={['student', 'plan']} />

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title={form.id ? 'تعديل الاشتراك' : 'إضافة اشتراك'}
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="رقم الهوية" value={form.student_national_id || ''} onChange={(e) => setForm({ ...form, student_national_id: e.target.value })} required />
          <Select label="الباقة" options={plans.map(p => ({ value: p.id, label: `${p.name} — ${p.amount || ''} ج.م` }))} value={form.plan_id || ''} onChange={(e) => setForm({ ...form, plan_id: e.target.value })} />
          <Input label="تاريخ البداية" type="date" value={form.start_date || ''} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          <Input label="تاريخ النهاية" type="date" value={form.end_date || ''} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          <Input label="المبلغ" type="number" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} />
          <Select label="الحالة" options={[{ value: 'active', label: 'نشط' }, { value: 'expired', label: 'منتهي' }, { value: 'pending', label: 'معلق' }]} value={form.status || 'active'} onChange={(e) => setForm({ ...form, status: e.target.value })} />
        </div>
      </Drawer>

      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDelete(confirmDelete?.id)} title="حذف الاشتراك" message={`هل أنت متأكد من حذف هذا الاشتراك؟`} confirmLabel="حذف" danger />
    </div>
  );
}
