'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setDrawer(null); loadSubscriptions(); }
    } finally { setSaving(false); }
  };

  const columns = [
    { key: 'student', label: 'الطالب', render: (r) => <span className="font-medium">{r.student?.full_name || '-'}</span> },
    { key: 'plan', label: 'الاشتراك', render: (r) => r.plan?.name || '-' },
    { key: 'start_date', label: 'البداية', render: (r) => r.start_date ? new Date(r.start_date).toLocaleDateString('ar-EG') : '-' },
    { key: 'end_date', label: 'النهاية', render: (r) => r.end_date ? new Date(r.end_date).toLocaleDateString('ar-EG') : '-' },
    { key: 'status', label: 'الحالة', render: (r) => (
      <Badge variant={r.status === 'active' ? 'success' : r.status === 'expired' ? 'danger' : 'warning'}>
        {r.status === 'active' ? 'نشط' : r.status === 'expired' ? 'منتهي' : 'معلق'}
      </Badge>
    )},
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>الاشتراكات</h1><p>إدارة اشتراكات الطلاب</p></div>
        <Button icon="card_membership" onClick={() => { setForm({}); setDrawer('edit'); }}>إضافة اشتراك</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Select options={[{ value: '', label: 'جميع الحالات' }, { value: 'active', label: 'نشط' }, { value: 'expired', label: 'منتهي' }, { value: 'pending', label: 'معلق' }]} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full sm:w-40" />
      </div>

      <DataTable columns={columns} data={subscriptions} loading={loading} emptyText="لا توجد اشتراكات" />

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="إضافة اشتراك"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="رقم الهوية" value={form.student_national_id || ''} onChange={(e) => setForm({ ...form, student_national_id: e.target.value })} required />
          <Input label="تاريخ البداية" type="date" value={form.start_date || ''} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          <Input label="تاريخ النهاية" type="date" value={form.end_date || ''} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          <Input label="المبلغ" type="number" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} />
          <Select label="الحالة" options={[{ value: 'active', label: 'نشط' }, { value: 'expired', label: 'منتهي' }, { value: 'pending', label: 'معلق' }]} value={form.status || 'active'} onChange={(e) => setForm({ ...form, status: e.target.value })} />
        </div>
      </Drawer>
    </div>
  );
}
