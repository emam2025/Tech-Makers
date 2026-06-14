'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/payments');
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPayments(); }, [loadPayments]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setDrawer(null); loadPayments(); }
    } finally { setSaving(false); }
  };

  const columns = [
    { key: 'student', label: 'الطالب', render: (r) => <span className="font-medium">{r.student?.full_name || '-'}</span> },
    { key: 'amount', label: 'المبلغ', render: (r) => <span className="font-bold text-[var(--color-success)]">{r.amount} ج.م</span> },
    { key: 'method', label: 'الطريقة', render: (r) => (
      <Badge>{r.method === 'cash' ? 'كاش' : r.method === 'transfer' ? 'تحويل' : r.method === 'card' ? 'بطاقة' : r.method}</Badge>
    )},
    { key: 'payment_date', label: 'التاريخ', render: (r) => r.payment_date ? new Date(r.payment_date).toLocaleDateString('ar-EG') : '-' },
    { key: 'notes', label: 'ملاحظات' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>المدفوعات</h1><p>تسجيل ومتابعة المدفوعات</p></div>
        <Button icon="payments" onClick={() => { setForm({}); setDrawer('edit'); }}>تسجيل دفعة</Button>
      </div>

      <DataTable columns={columns} data={payments} loading={loading} emptyText="لا توجد مدفوعات" />

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="تسجيل دفعة"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="رقم الهوية" value={form.student_national_id || ''} onChange={(e) => setForm({ ...form, student_national_id: e.target.value })} required />
          <Input label="المبلغ (ج.م)" type="number" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} required />
          <Select label="طريقة الدفع" options={[{ value: 'cash', label: 'كاش' }, { value: 'transfer', label: 'تحويل بنكي' }, { value: 'card', label: 'بطاقة ائتمان' }]} value={form.method || 'cash'} onChange={(e) => setForm({ ...form, method: e.target.value })} />
          <Input label="التاريخ" type="date" value={form.payment_date || new Date().toISOString().split('T')[0]} onChange={(e) => setForm({ ...form, payment_date: e.target.value })} />
          <Input label="ملاحظات" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} multiline rows={2} />
        </div>
      </Drawer>
    </div>
  );
}
