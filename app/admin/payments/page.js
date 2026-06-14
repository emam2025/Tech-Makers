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

export default function PaymentsPage() {
  const { success, error: toastError } = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

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
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id ? `/api/admin/payments/${form.id}` : '/api/admin/payments';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDrawer(null);
        loadPayments();
        success(form.id ? 'تم تحديث الدفعة' : 'تم تسجيل الدفعة');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/payments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(null);
      loadPayments();
      success('تم حذف الدفعة');
    } else {
      toastError('فشل الحذف');
    }
  };

  const exportCSV = () => {
    const headers = ['الطالب', 'المبلغ', 'طريقة الدفع', 'التاريخ', 'ملاحظات'];
    const rows = filtered.map(r => [
      r.student?.full_name || '',
      r.amount || '',
      r.method === 'cash' ? 'كاش' : r.method === 'transfer' ? 'تحويل' : r.method === 'card' ? 'بطاقة' : r.method,
      r.payment_date ? new Date(r.payment_date).toLocaleDateString('ar-EG') : '',
      r.notes || '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    success('تم تصدير الملف');
  };

  const filtered = payments.filter((p) => {
    const matchSearch = !search || (p.student?.full_name || '').toLowerCase().includes(search.toLowerCase());
    const matchMethod = !filterMethod || p.method === filterMethod;
    return matchSearch && matchMethod;
  });

  const totalAmount = filtered.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const cashAmount = filtered.filter(p => p.method === 'cash').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const transferAmount = filtered.filter(p => p.method === 'transfer').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const cardAmount = filtered.filter(p => p.method === 'card').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const columns = [
    { key: 'student', label: 'الطالب', render: (r) => <span className="font-medium">{r.student?.full_name || '-'}</span> },
    { key: 'amount', label: 'المبلغ', render: (r) => <span className="font-bold text-[var(--color-success)]">{r.amount} ج.م</span> },
    { key: 'method', label: 'الطريقة', render: (r) => (
      <Badge>{r.method === 'cash' ? 'كاش' : r.method === 'transfer' ? 'تحويل' : r.method === 'card' ? 'بطاقة' : r.method}</Badge>
    )},
    { key: 'payment_date', label: 'التاريخ', render: (r) => r.payment_date ? new Date(r.payment_date).toLocaleDateString('ar-EG') : '-' },
    { key: 'notes', label: 'ملاحظات', render: (r) => <span className="text-sm text-[var(--color-text-secondary)] line-clamp-1">{r.notes || '-'}</span> },
  ];

  const actions = [
    { icon: 'edit', label: 'تعديل', onClick: (r) => { setForm(r); setDrawer('edit'); } },
    { icon: 'delete', label: 'حذف', onClick: (r) => setConfirmDelete(r), danger: true },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>المدفوعات</h1><p>تسجيل ومتابعة المدفوعات</p></div>
        <div className="flex gap-2">
          <Button icon="download" variant="outlined" onClick={exportCSV}>تصدير CSV</Button>
          <Button icon="payments" onClick={() => { setForm({}); setDrawer('edit'); }}>تسجيل دفعة</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon="payments" iconColor="var(--color-success)" iconBg="var(--color-success-light)" value={`${totalAmount.toLocaleString()} ج.م`} label="إجمالي المدفوعات" />
        <KPICard icon="receipt" iconColor="var(--color-primary)" iconBg="var(--color-primary-light)" value={filtered.length} label="عدد المدفوعات" />
        <KPICard icon="money" iconColor="var(--color-secondary)" iconBg="var(--color-secondary-light)" value={`${cashAmount.toLocaleString()} ج.م`} label="كاش" />
        <KPICard icon="account_balance" iconColor="var(--color-info)" iconBg="var(--color-info-light)" value={`${transferAmount.toLocaleString()} ج.م`} label="تحويل بنكي" />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input placeholder="بحث بالاسم..." icon="search" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64" />
        <Select options={[{ value: '', label: 'جميع الطرق' }, { value: 'cash', label: 'كاش' }, { value: 'transfer', label: 'تحويل بنكي' }, { value: 'card', label: 'بطاقة ائتمان' }]} value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)} className="w-full sm:w-40" />
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} actions={actions} emptyText="لا توجد مدفوعات" searchable={['student']} />

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title={form.id ? 'تعديل الدفعة' : 'تسجيل دفعة'}
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="رقم الهوية" value={form.student_national_id || ''} onChange={(e) => setForm({ ...form, student_national_id: e.target.value })} required />
          <Input label="المبلغ (ج.م)" type="number" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} required />
          <Select label="طريقة الدفع" options={[{ value: 'cash', label: 'كاش' }, { value: 'transfer', label: 'تحويل بنكي' }, { value: 'card', label: 'بطاقة ائتمان' }]} value={form.method || 'cash'} onChange={(e) => setForm({ ...form, method: e.target.value })} />
          <Input label="التاريخ" type="date" value={form.payment_date || new Date().toISOString().split('T')[0]} onChange={(e) => setForm({ ...form, payment_date: e.target.value })} />
          <Input label="ملاحظات" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} multiline rows={2} />
        </div>
      </Drawer>

      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDelete(confirmDelete?.id)} title="حذف الدفعة" message="هل أنت متأكد من حذف هذه الدفعة؟" confirmLabel="حذف" danger />
    </div>
  );
}
