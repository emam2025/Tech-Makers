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

const PAYMENT_METHODS = [
  { value: 'cash', label: 'كاش بالفرع', icon: 'payments' },
  { value: 'instapay', label: 'InstaPay', icon: 'smartphone' },
  { value: 'vodafone_cash', label: 'فودافون كاش', icon: 'account_balance_wallet' },
  { value: 'orange_money', label: 'أورانج موني', icon: 'account_balance_wallet' },
  { value: 'etisalat_cash', label: 'اتصالات كاش', icon: 'account_balance_wallet' },
  { value: 'fawry', label: 'فوري', icon: 'local_atm' },
  { value: 'visa', label: 'فيزا كارت', icon: 'credit_card' },
  { value: 'mastercard', label: 'ماستركارد', icon: 'credit_card' },
  { value: 'transfer', label: 'تحويل بنكي', icon: 'account_balance' },
  { value: 'other', label: 'أخرى', icon: 'more_horiz' },
];

const PAYMENT_STATUSES = [
  { value: 'pending', label: 'بانتظار التأكيد', variant: 'warning' },
  { value: 'confirmed', label: 'مؤكد', variant: 'success' },
  { value: 'rejected', label: 'مرفوض', variant: 'danger' },
  { value: 'refunded', label: 'مسترد', variant: 'info' },
];

const METHOD_LABELS = Object.fromEntries(PAYMENT_METHODS.map(m => [m.value, m.label]));

export default function PaymentsPage() {
  const { success, error: toastError } = useToast();
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
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

  useEffect(() => {
    loadPayments();
    fetch('/api/admin/students').then(r => r.ok ? r.json() : {}).then(d => setStudents(d.students || []));
  }, [loadPayments]);

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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadPayments();
        success('تم تحديث الحالة');
      } else {
        toastError('فشل تحديث الحالة');
      }
    } catch { toastError('خطأ في الشبكة'); }
  };

  const exportCSV = () => {
    const headers = ['الطالب', 'المبلغ', 'طريقة الدفع', 'الحالة', 'رقم المرجع', 'التاريخ', 'ملاحظات'];
    const rows = filtered.map(r => [
      r.student?.full_name || '',
      r.amount || '',
      METHOD_LABELS[r.method] || r.method,
      PAYMENT_STATUSES.find(s => s.value === r.status)?.label || r.status || 'مؤكد',
      r.reference_number || r.transaction_id || '',
      r.payment_date ? new Date(r.payment_date).toLocaleDateString('ar-EG') : '',
      r.notes || '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
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
    const matchStatus = !filterStatus || (p.status || 'confirmed') === filterStatus;
    return matchSearch && matchMethod && matchStatus;
  });

  const totalAmount = filtered.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const confirmedAmount = filtered.filter(p => (p.status || 'confirmed') === 'confirmed').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const pendingAmount = filtered.filter(p => p.status === 'pending').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const confirmedCount = filtered.filter(p => (p.status || 'confirmed') === 'confirmed').length;
  const pendingCount = filtered.filter(p => p.status === 'pending').length;

  const columns = [
    { key: 'student', label: 'الطالب', render: (r) => <span className="font-medium">{r.student?.full_name || '-'}</span> },
    { key: 'amount', label: 'المبلغ', render: (r) => <span className="font-bold text-[var(--color-success)]">{r.amount?.toLocaleString()} ج.م</span> },
    { key: 'method', label: 'الطريقة', render: (r) => (
      <Badge>{METHOD_LABELS[r.method] || r.method}</Badge>
    )},
    { key: 'status', label: 'الحالة', render: (r) => {
      const status = PAYMENT_STATUSES.find(s => s.value === (r.status || 'confirmed'));
      return <Badge variant={status?.variant || 'success'}>{status?.label || 'مؤكد'}</Badge>;
    }},
    { key: 'reference_number', label: 'رقم المرجع', render: (r) => (
      <span className="text-xs font-mono text-[var(--color-text-secondary)]">{r.reference_number || r.transaction_id || '-'}</span>
    )},
    { key: 'payment_date', label: 'التاريخ', render: (r) => r.payment_date ? new Date(r.payment_date).toLocaleDateString('ar-EG') : '-' },
  ];

  const actions = [
    { icon: 'edit', label: 'تعديل', onClick: (r) => { setForm({ ...r }); setDrawer('edit'); } },
    { icon: 'check_circle', label: 'تأكيد', onClick: (r) => handleStatusChange(r.id, 'confirmed'), hidden: (r) => (r.status || 'confirmed') === 'confirmed' },
    { icon: 'pending', label: 'تحويل لمعلق', onClick: (r) => handleStatusChange(r.id, 'pending'), hidden: (r) => r.status === 'pending' },
    { icon: 'cancel', label: 'رفض', onClick: (r) => handleStatusChange(r.id, 'rejected'), danger: true, hidden: (r) => r.status === 'rejected' },
    { icon: 'delete', label: 'حذف', onClick: (r) => setConfirmDelete(r), danger: true },
  ];

  const isDigitalMethod = ['instapay', 'vodafone_cash', 'orange_money', 'etisalat_cash', 'fawry', 'visa', 'mastercard', 'transfer'].includes(form.method);

  return (
    <div className="max-w-container-max mx-auto px-md py-lg">
      {/* Hero Banner */}
      <div className="mb-lg relative rounded-xl overflow-hidden h-48 flex items-end p-lg">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover brightness-50"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp7RImcnHdi9eiahdmn3ZXNPkk4nKbJKpK9snETXMeangN5WJpEH33P2di5v3UoCXKqTZBKl2gX4MacwVquOkQiXqXL3Ne9Dm6XdpAXadN_vKIMuNKDpFsQGNh0bPdlb0XP_IFMKrRd7DN7lC_lpbEbG_CPncVn-4B-A1ZvmlNvbhz9Xis7xjgLWZx0uIR_4DClRtnSz-pgMUU-ImTorNGlHXEFRtwpphNs6FOcTFVCUpPv_oufHY53yDf0LoWdmJKan9rP412kxI"
            alt="Financial dashboard background"
          />
        </div>
        <div className="relative z-10 w-full flex justify-between items-center text-white">
          <div>
            <h2 className="font-headline-xl text-headline-xl mb-xs">الاشتراكات والمدفوعات</h2>
            <p className="font-body-md text-body-md opacity-90">أدر خططك الدراسية وتابع فواتيرك بكل سهولة</p>
          </div>
          <button
            onClick={() => { setForm({ method: 'cash', status: 'confirmed', payment_date: new Date().toISOString().split('T')[0] }); setDrawer('edit'); }}
            className="bg-secondary text-primary px-md py-sm rounded-lg font-label-md text-label-md font-bold hover:scale-105 transition-transform flex items-center gap-sm"
          >
            <span className="material-symbols-outlined">add_card</span>
            تسجيل دفعة
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col gap-sm">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-md text-label-md">إجمالي المدفوعات</span>
            <span className="material-symbols-outlined text-primary bg-primary-fixed p-sm rounded-lg">account_balance_wallet</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-primary">{confirmedAmount.toLocaleString()} ج.م</div>
          <div className="text-success font-body-sm text-body-sm flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>مؤكدة — {confirmedCount} دفعة</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col gap-sm">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-md text-label-md">المدفوعات المعلقة</span>
            <span className="material-symbols-outlined text-secondary bg-secondary-container p-sm rounded-lg">event_repeat</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-primary">{pendingAmount.toLocaleString()} ج.م</div>
          <div className="text-error font-body-sm text-body-sm flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">priority_high</span>
            <span>{pendingCount} دفعة بانتظار التأكيد</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col gap-sm">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-md text-label-md">إجمالي المدفوعات</span>
            <span className="material-symbols-outlined text-primary bg-primary-fixed p-sm rounded-lg">verified_user</span>
          </div>
          <div className="font-headline-lg text-headline-lg text-primary">{totalAmount.toLocaleString()} ج.م</div>
          <div className="text-on-surface-variant font-body-sm text-body-sm">
            <span>{filtered.length} دفعة في السجل</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left: Payment History Table (2/3) */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
            <div className="p-md border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary">سجل المدفوعات</h3>
              <div className="flex gap-sm">
                <button
                  onClick={exportCSV}
                  className="p-sm border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-on-surface-variant">download</span>
                </button>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="px-md py-sm border-b border-outline-variant flex flex-wrap gap-sm">
              <div className="flex items-center gap-sm bg-surface-container-low rounded-lg px-sm py-xs">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="بحث بالاسم..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-body-md text-on-surface placeholder:text-on-surface-variant/50 w-40"
                />
              </div>
              <div className="flex gap-xs">
                <button
                  onClick={() => setFilterMethod('')}
                  className={`px-sm py-xs rounded-full text-body-sm font-bold transition-all ${
                    !filterMethod
                      ? 'bg-primary text-white'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  جميع الطرق
                </button>
                {PAYMENT_METHODS.slice(0, 4).map(m => (
                  <button
                    key={m.value}
                    onClick={() => setFilterMethod(filterMethod === m.value ? '' : m.value)}
                    className={`px-sm py-xs rounded-full text-body-sm font-bold transition-all ${
                      filterMethod === m.value
                        ? 'bg-primary text-white'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-xs">
                {PAYMENT_STATUSES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setFilterStatus(filterStatus === s.value ? '' : s.value)}
                    className={`px-sm py-xs rounded-full text-body-sm font-bold transition-all ${
                      filterStatus === s.value
                        ? 'bg-primary text-white'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead className="bg-surface-container text-on-surface-variant">
                  <tr>
                    <th className="px-md py-sm font-label-md text-label-md">الطالب</th>
                    <th className="px-md py-sm font-label-md text-label-md">المبلغ</th>
                    <th className="px-md py-sm font-label-md text-label-md">الطريقة</th>
                    <th className="px-md py-sm font-label-md text-label-md">الحالة</th>
                    <th className="px-md py-sm font-label-md text-label-md">رقم المرجع</th>
                    <th className="px-md py-sm font-label-md text-label-md">التاريخ</th>
                    <th className="px-md py-sm font-label-md text-label-md">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-md py-lg text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[48px] text-outline animate-spin">progress_activity</span>
                        <p className="mt-sm">جاري التحميل...</p>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-md py-lg text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[48px] text-outline">payments</span>
                        <p className="mt-sm">لا توجد مدفوعات</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r) => {
                      const status = PAYMENT_STATUSES.find(s => s.value === (r.status || 'confirmed'));
                      return (
                        <tr key={r.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-md py-sm font-body-md text-body-md">{r.student?.full_name || '-'}</td>
                          <td className="px-md py-sm font-body-md text-body-md font-bold text-success">{r.amount?.toLocaleString()} ج.م</td>
                          <td className="px-md py-sm">
                            <span className="px-sm py-xs rounded-full bg-surface-container text-on-surface-variant text-[12px] font-bold">
                              {METHOD_LABELS[r.method] || r.method}
                            </span>
                          </td>
                          <td className="px-md py-sm">
                            <span className={`px-sm py-xs rounded-full text-[12px] font-bold uppercase tracking-wider ${
                              (r.status || 'confirmed') === 'confirmed' ? 'bg-green-100 text-green-700' :
                              r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              r.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {status?.label || 'مؤكد'}
                            </span>
                          </td>
                          <td className="px-md py-sm font-body-sm text-body-sm text-on-surface-variant font-mono">
                            {r.reference_number || r.transaction_id || '-'}
                          </td>
                          <td className="px-md py-sm font-body-md text-body-md">
                            {r.payment_date ? new Date(r.payment_date).toLocaleDateString('ar-EG') : '-'}
                          </td>
                          <td className="px-md py-sm">
                            <div className="flex gap-xs">
                              <button
                                onClick={() => { setForm({ ...r }); setDrawer('edit'); }}
                                className="p-xs text-primary hover:bg-surface-container rounded-lg transition-colors"
                                title="تعديل"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>
                              {(r.status || 'confirmed') !== 'confirmed' && (
                                <button
                                  onClick={() => handleStatusChange(r.id, 'confirmed')}
                                  className="p-xs text-success hover:bg-surface-container rounded-lg transition-colors"
                                  title="تأكيد"
                                >
                                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                </button>
                              )}
                              {r.status !== 'pending' && (r.status || 'confirmed') !== 'confirmed' && (
                                <button
                                  onClick={() => handleStatusChange(r.id, 'pending')}
                                  className="p-xs text-warning hover:bg-surface-container rounded-lg transition-colors"
                                  title="تحويل لمعلق"
                                >
                                  <span className="material-symbols-outlined text-[18px]">pending</span>
                                </button>
                              )}
                              {r.status !== 'rejected' && (
                                <button
                                  onClick={() => handleStatusChange(r.id, 'rejected')}
                                  className="p-xs text-error hover:bg-surface-container rounded-lg transition-colors"
                                  title="رفض"
                                >
                                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                                </button>
                              )}
                              <button
                                onClick={() => setConfirmDelete(r)}
                                className="p-xs text-error hover:bg-surface-container rounded-lg transition-colors"
                                title="حذف"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Summary & Info (1/3) */}
        <div className="lg:col-span-1 space-y-md">
          {/* Payment Summary Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md border-t-4 border-secondary">
            <h3 className="font-headline-md text-headline-md text-primary mb-md">ملخص المدفوعات</h3>
            <div className="flex items-center gap-md mb-md">
              <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest">الإجمالي</h4>
                <p className="font-headline-md text-headline-md text-primary">{totalAmount.toLocaleString()} ج.م</p>
              </div>
            </div>
            <ul className="space-y-sm mb-lg">
              <li className="flex items-center gap-sm font-body-md text-body-md text-on-surface-variant">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                <span>{confirmedCount} دفعة مؤكدة — {confirmedAmount.toLocaleString()} ج.م</span>
              </li>
              <li className="flex items-center gap-sm font-body-md text-body-md text-on-surface-variant">
                <span className="material-symbols-outlined text-yellow-600">check_circle</span>
                <span>{pendingCount} دفعة معلقة — {pendingAmount.toLocaleString()} ج.م</span>
              </li>
              <li className="flex items-center gap-sm font-body-md text-body-md text-on-surface-variant">
                <span className="material-symbols-outlined text-blue-600">check_circle</span>
                <span>{filtered.filter(p => p.status === 'refunded').length} دفعة مستردة</span>
              </li>
            </ul>
            <div className="space-y-sm">
              <button
                onClick={() => { setForm({ method: 'cash', status: 'confirmed', payment_date: new Date().toISOString().split('T')[0] }); setDrawer('edit'); }}
                className="w-full py-sm bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined">add_card</span>
                تسجيل دفعة جديدة
              </button>
              <button
                onClick={exportCSV}
                className="w-full py-sm border border-outline text-on-surface-variant rounded-lg font-bold hover:bg-surface-container transition-all flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined">download</span>
                تصدير CSV
              </button>
            </div>
          </div>

          {/* Secure Payment Info */}
          <div className="bg-primary-container text-on-primary-fixed p-md rounded-xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <span className="material-symbols-outlined text-[120px]">security</span>
            </div>
            <h4 className="font-label-md text-label-md font-bold mb-sm flex items-center gap-sm">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              دفع آمن بنسبة 100%
            </h4>
            <p className="font-body-sm text-body-sm opacity-80 leading-relaxed">جميع عمليات الدفع مشفرة بواسطة معايير الأمان العالمية لحماية بياناتك المالية.</p>
          </div>
        </div>
      </div>

      {/* Drawer for Add/Edit */}
      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title={form.id ? 'تعديل الدفعة' : 'تسجيل دفعة جديدة'} size="lg"
        footer={<div className="flex gap-sm"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-md">
          <Select
            label="الطالب"
            options={students.map(s => ({ value: s.id, label: `${s.full_name} — ${s.national_id || ''}` }))}
            value={form.student_id || ''}
            onChange={(e) => setForm({ ...form, student_id: e.target.value })}
            required
          />

          <Input label="المبلغ (ج.م)" type="number" value={form.amount || ''} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} required />

          <Select
            label="طريقة الدفع"
            options={PAYMENT_METHODS.map(m => ({ value: m.value, label: m.label }))}
            value={form.method || 'cash'}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
          />

          <Select
            label="حالة الدفع"
            options={PAYMENT_STATUSES.map(s => ({ value: s.value, label: s.label }))}
            value={form.status || 'confirmed'}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          />

          {isDigitalMethod && (
            <Input
              label={form.method === 'instapay' ? 'رقم InstaPay' : form.method === 'fawry' ? 'رقم فوري' : form.method === 'transfer' ? 'رقم التحويل' : 'رقم المرجع / المعاملة'}
              value={form.reference_number || ''}
              onChange={(e) => setForm({ ...form, reference_number: e.target.value })}
              placeholder="أدخل رقم المرجع أو رقم المعاملة"
            />
          )}

          <Input label="اسم الدافع ( إن كان غير الطالب)" value={form.paid_by_name || ''} onChange={(e) => setForm({ ...form, paid_by_name: e.target.value })} placeholder="اختياري — اسم الوالد أو الدافع" />

          <Input label="التاريخ" type="date" value={form.payment_date || new Date().toISOString().split('T')[0]} onChange={(e) => setForm({ ...form, payment_date: e.target.value })} />

          <Input label="ملاحظات" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} multiline rows={2} placeholder="أي ملاحظات إضافية" />
        </div>
      </Drawer>

      {/* Confirm Delete Modal */}
      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDelete(confirmDelete?.id)} title="حذف الدفعة" message="هل أنت متأكد من حذف هذه الدفعة؟ لا يمكن التراجع." confirmText="حذف" confirmVariant="danger" />
    </div>
  );
}
