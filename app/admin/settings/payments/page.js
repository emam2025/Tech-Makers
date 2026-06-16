'use client';

import { useEffect, useState, useCallback } from 'react';
import Button from '../../../../components/ui/Button';
import Badge from '../../../../components/ui/Badge';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Drawer from '../../../../components/ui/Drawer';
import { KPICard } from '../../../../components/ui/Card';
import { ConfirmModal } from '../../../../components/ui/Modal';
import { useToast } from '../../../../components/ui/Toast';

const GATEWAY_TYPES = [
  { value: 'wallet', label: 'محفظة إلكترونية', icon: 'account_balance_wallet', color: 'var(--color-success)' },
  { value: 'visa', label: 'فيزا / ماستركارد', icon: 'credit_card', color: 'var(--color-primary)' },
  { value: 'fawry', label: 'فوري', icon: 'qr_code', color: 'var(--color-warning)' },
  { value: 'instapay', label: 'انستاباي', icon: 'send', color: 'var(--color-info)' },
  { value: 'link', label: 'رابط دفع', icon: 'link', color: 'var(--color-secondary)' },
  { value: 'bank_transfer', label: 'تحويل بنكي', icon: 'account_balance', color: 'var(--color-text-secondary)' },
  { value: 'other', label: 'أخرى', icon: 'more_horiz', color: 'var(--color-text-tertiary)' },
];

export default function PaymentsSettingsPage() {
  const { success, error: toastError } = useToast();
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterType, setFilterType] = useState('');

  const loadGateways = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType) params.set('type', filterType);
      const res = await fetch(`/api/admin/payment-gateways?${params}`);
      if (res.ok) {
        const data = await res.json();
        setGateways(data.gateways || []);
      }
    } finally { setLoading(false); }
  }, [filterType]);

  useEffect(() => { loadGateways(); }, [loadGateways]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/payment-gateways', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDrawer(null);
        loadGateways();
        success(form.id ? 'تم تحديث بوابة الدفع' : 'تم إضافة بوابة الدفع');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/payment-gateways?id=${id}`, { method: 'DELETE' });
    if (res.ok) { setConfirmDelete(null); loadGateways(); success('تم الحذف'); }
    else { toastError('فشل الحذف'); }
  };

  const toggleActive = async (gw) => {
    const res = await fetch('/api/admin/payment-gateways', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: gw.id, is_active: !gw.is_active }),
    });
    if (res.ok) { loadGateways(); success(gw.is_active ? 'تم التعطيل' : 'تم التفعيل'); }
  };

  const activeCount = gateways.filter(g => g.is_active).length;
  const walletCount = gateways.filter(g => g.type === 'wallet').length;
  const visaCount = gateways.filter(g => g.type === 'visa').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>بوابات الدفع</h1><p>إدارة المحافظ الإلكترونية وطرق الدفع</p></div>
        <Button icon="add" onClick={() => { setForm({ type: 'wallet', is_active: true, sort_order: 0, details: {} }); setDrawer('edit'); }}>بوابة جديدة</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KPICard icon="account_balance_wallet" iconColor="var(--color-success)" iconBg="var(--color-success-light)" value={gateways.length} label="إجمالي البوابات" />
        <KPICard icon="check_circle" iconColor="var(--color-success)" iconBg="var(--color-success-light)" value={activeCount} label="نشطة" />
        <KPICard icon="account_balance_wallet" iconColor="var(--color-primary)" iconBg="var(--color-primary-light)" value={walletCount} label="محافظ" />
        <KPICard icon="credit_card" iconColor="var(--color-warning)" iconBg="var(--color-warning-light)" value={visaCount} label="فيزا" />
      </div>

      <div className="flex gap-3 mb-4">
        <Select options={[{ value: '', label: 'جميع الأنواع' }, ...GATEWAY_TYPES]} value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full sm:w-48" />
      </div>

      {/* Gateways List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="material-symbols-outlined text-[var(--color-primary)] animate-spin text-[32px]">progress_activity</span>
          </div>
        ) : gateways.length === 0 ? (
          <div className="card-admin text-center py-12">
            <span className="material-symbols-outlined text-[48px] text-[var(--color-text-tertiary)]">account_balance_wallet</span>
            <p className="text-sm text-[var(--color-text-tertiary)] mt-2">لا توجد بوابات دفع</p>
          </div>
        ) : gateways.map((gw) => {
          const typeInfo = GATEWAY_TYPES.find(t => t.value === gw.type) || GATEWAY_TYPES[6];
          const details = typeof gw.details === 'string' ? JSON.parse(gw.details || '{}') : (gw.details || {});
          return (
            <div key={gw.id} className={`card-admin p-4 ${!gw.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${typeInfo.color}15` }}>
                  <span className="material-symbols-outlined text-[24px]" style={{ color: typeInfo.color }}>{typeInfo.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">{gw.name}</span>
                    <Badge>{typeInfo.label}</Badge>
                    <Badge variant={gw.is_active ? 'success' : 'default'}>{gw.is_active ? 'نشط' : 'معطل'}</Badge>
                  </div>
                  {gw.instructions && <p className="text-xs text-[var(--color-text-tertiary)] mt-1 line-clamp-1">{gw.instructions}</p>}
                  {Object.keys(details).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.entries(details).map(([k, v]) => (
                        <span key={k} className="text-[10px] bg-[var(--color-surface-dim)] px-2 py-0.5 rounded-full text-[var(--color-text-secondary)]">
                          {k}: {typeof v === 'string' ? v : JSON.stringify(v)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" icon="edit" onClick={() => { setForm({ ...gw, details: typeof gw.details === 'string' ? JSON.parse(gw.details || '{}') : gw.details }); setDrawer('edit'); }}>تعديل</Button>
                  <Button size="sm" variant="ghost" icon={gw.is_active ? 'toggle_off' : 'toggle_on'} onClick={() => toggleActive(gw)} />
                  <Button size="sm" variant="ghost" icon="delete" className="text-[var(--color-danger)]" onClick={() => setConfirmDelete(gw)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Drawer */}
      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title={form.id ? 'تعديل بوابة الدفع' : 'بوابة دفع جديدة'} size="lg"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="اسم بوابة الدفع" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="مثال: فودافون كاش — 01012345678" />
          <Select label="النوع" options={GATEWAY_TYPES} value={form.type || 'wallet'} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <Input label="أيقونة (Material Symbol)" value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="account_balance_wallet" />
          <Input label="تعليمات الدفع" value={form.instructions || ''} onChange={(e) => setForm({ ...form, instructions: e.target.value })} multiline rows={3} placeholder="أرسل المبلغ إلى... ثم أرسل الإثبات..." />
          <Input label="رقم الهاتف / الحساب" value={form.details?.phone || form.details?.account || ''} onChange={(e) => setForm({ ...form, details: { ...form.details, phone: e.target.value } })} placeholder="01012345678" />
          <Input label="الاسم على الحساب" value={form.details?.account_name || ''} onChange={(e) => setForm({ ...form, details: { ...form.details, account_name: e.target.value } })} placeholder="الاسم كما هو بالبنك" />
          <Input label="رابط InstaPay (اختياري)" value={form.details?.instapay_link || ''} onChange={(e) => setForm({ ...form, details: { ...form.details, instapay_link: e.target.value } })} placeholder="https://ipn.eg/..." />
          <Input label="رابط الفاتورة / QR (اختياري)" value={form.details?.qr_link || ''} onChange={(e) => setForm({ ...form, details: { ...form.details, qr_link: e.target.value } })} placeholder="https://..." />
          <Input label="الأولوية" type="number" value={form.sort_order || 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
          <label className="flex items-center gap-3 p-3 bg-[var(--color-surface-dim)] rounded-[var(--radius-md)] cursor-pointer">
            <input type="checkbox" checked={form.is_active !== false} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4" />
            <span className="text-sm font-medium text-[var(--color-text-primary)]">نشط</span>
          </label>
        </div>
      </Drawer>

      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDelete(confirmDelete?.id)} title="حذف بوابة الدفع" message={`هل أنت متأكد من حذف "${confirmDelete?.name}"؟`} confirmText="حذف" confirmVariant="danger" />
    </div>
  );
}
