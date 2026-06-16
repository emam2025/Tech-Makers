'use client';

import { useEffect, useState, useCallback } from 'react';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Drawer from '../../../components/ui/Drawer';
import { KPICard } from '../../../components/ui/Card';
import { ConfirmModal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';

const ALERT_TYPES = [
  { value: 'payment_due', label: 'دفعة مستحقة', icon: 'payments', color: 'var(--color-warning)' },
  { value: 'payment_overdue', label: 'دفعة متأخرة', icon: 'warning', color: 'var(--color-danger)' },
  { value: 'absence', label: 'غياب', icon: 'person_off', color: 'var(--color-danger)' },
  { value: 'evaluation', label: 'تقييم', icon: 'star', color: 'var(--color-primary)' },
  { value: 'general', label: 'عام', icon: 'info', color: 'var(--color-text-secondary)' },
];

export default function AlertsPage() {
  const { success, error: toastError } = useToast();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [detailDrawer, setDetailDrawer] = useState(null);
  const [createDrawer, setCreateDrawer] = useState(false);
  const [form, setForm] = useState({ user_id: '', type: 'general', title: '', message: '' });
  const [students, setStudents] = useState([]);
  const [saving, setSaving] = useState(false);
  const [confirmRead, setConfirmRead] = useState(null);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType) params.set('type', filterType);
      if (unreadOnly) params.set('unread', 'true');
      const res = await fetch(`/api/admin/alerts?${params}`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } finally {
      setLoading(false);
    }
  }, [filterType, unreadOnly]);

  useEffect(() => {
    loadAlerts();
    fetch('/api/admin/students').then(r => r.ok ? r.json() : {}).then(d => setStudents(d.students || []));
  }, [loadAlerts]);

  const markAsRead = async (id) => {
    const res = await fetch('/api/admin/alerts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setConfirmRead(null);
      loadAlerts();
      success('تم وضع علامة مقروء');
    } else {
      toastError('فشل التحديث');
    }
  };

  const handleCreate = async () => {
    if (!form.user_id || !form.title || !form.message) {
      toastError('جميع الحقول مطلوبة');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setCreateDrawer(false);
        setForm({ user_id: '', type: 'general', title: '', message: '' });
        loadAlerts();
        success('تم إنشاء التنبيه');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const filtered = alerts.filter((a) => {
    if (!search) return true;
    return (a.title || '').toLowerCase().includes(search.toLowerCase()) ||
           (a.message || '').toLowerCase().includes(search.toLowerCase());
  });

  const unreadCount = alerts.filter(a => !a.read).length;
  const paymentAlerts = alerts.filter(a => ['payment_due', 'payment_overdue'].includes(a.type)).length;
  const absenceAlerts = alerts.filter(a => a.type === 'absence').length;
  const evalAlerts = alerts.filter(a => a.type === 'evaluation').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>التنبيهات</h1><p>إدارة التنبيهات والإشعارات للطلاب والمدربين</p></div>
        <div className="flex gap-3">
          <Button icon="add" onClick={() => setCreateDrawer(true)}>تنبيه جديد</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-base">
        <KPICard icon="notifications_active" iconColor="var(--color-danger)" iconBg="var(--color-danger-light)" value={unreadCount} label="غير مقروءة" />
        <KPICard icon="payments" iconColor="var(--color-warning)" iconBg="var(--color-warning-light)" value={paymentAlerts} label="تنبيهات الدفع" />
        <KPICard icon="person_off" iconColor="var(--color-danger)" iconBg="var(--color-danger-light)" value={absenceAlerts} label="تنبيهات الغياب" />
        <KPICard icon="star" iconColor="var(--color-primary)" iconBg="var(--color-primary-light)" value={evalAlerts} label="تنبيهات التقييم" />
      </div>

      <div className="flex flex-wrap gap-3 mb-xs">
        <Select
          options={[{ value: '', label: 'جميع الأنواع' }, ...ALERT_TYPES.map(t => ({ value: t.value, label: t.label }))]}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-48"
        />
        <button
          onClick={() => setUnreadOnly(!unreadOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors border ${unreadOnly ? 'bg-[var(--color-danger)] text-white border-[var(--color-danger)]' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-dim)]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">{unreadOnly ? 'filter_alt_off' : 'filter_list'}</span>
          {unreadOnly ? 'عرض الكل' : 'غير مقروءة فقط'}
        </button>
        <Input placeholder="بحث..." icon="search" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64" />
      </div>

      {/* Alerts List */}
      <div className="card-admin overflow-hidden">
        <div className="divide-y divide-[var(--color-border-light)]">
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="material-symbols-outlined text-[var(--color-primary)] animate-spin text-[32px]">progress_activity</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--color-text-tertiary)]">
              <span className="material-symbols-outlined text-[48px] mb-2">notifications_off</span>
              <p className="text-sm">لا توجد تنبيهات</p>
            </div>
          ) : filtered.map((alert) => {
            const typeInfo = ALERT_TYPES.find(t => t.value === alert.type) || ALERT_TYPES[4];
            return (
              <div
                key={alert.id}
                className={`p-4 hover:bg-[var(--color-surface-dim)] transition-colors cursor-pointer ${!alert.read ? 'bg-[var(--color-primary-light)]' : ''}`}
                onClick={() => setDetailDrawer(alert)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${typeInfo.color}15` }}>
                    <span className="material-symbols-outlined text-[20px]" style={{ color: typeInfo.color }}>{typeInfo.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-[var(--color-text-primary)]">{alert.title}</span>
                      <Badge>{typeInfo.label}</Badge>
                      {!alert.read && <div className="w-2 h-2 rounded-full bg-[var(--color-danger)]" />}
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">{alert.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {alert.user?.full_name && <span className="text-[10px] text-[var(--color-text-tertiary)]">👤 {alert.user.full_name}</span>}
                      {alert.created_at && <span className="text-[10px] text-[var(--color-text-tertiary)]">{new Date(alert.created_at).toLocaleDateString('ar-EG')}</span>}
                    </div>
                  </div>
                  {!alert.read && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmRead(alert); }}
                      className="p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface)] transition-colors"
                      title="وضع علامة مقروء"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[var(--color-primary)]">mark_email_read</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Drawer */}
      <Drawer isOpen={!!detailDrawer} onClose={() => setDetailDrawer(null)} title="تفاصيل التنبيه" size="lg"
        footer={
          <div className="flex gap-3">
            {detailDrawer && !detailDrawer.read && (
              <Button onClick={() => markAsRead(detailDrawer.id)}>وضع علامة مقروء</Button>
            )}
            <Button variant="outlined" onClick={() => setDetailDrawer(null)}>إغلاق</Button>
          </div>
        }>
        {detailDrawer && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {(() => { const t = ALERT_TYPES.find(t => t.value === detailDrawer.type) || ALERT_TYPES[4]; return <Badge>{t.label}</Badge>; })()}
              {detailDrawer.read ? <Badge variant="success">مقروء</Badge> : <Badge variant="danger">غير مقروء</Badge>}
            </div>

            <div className="p-4 bg-[var(--color-surface-dim)] rounded-[var(--radius-md)]">
              <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-2">{detailDrawer.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{detailDrawer.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {detailDrawer.user?.full_name && (
                <div className="p-3 bg-[var(--color-surface-dim)] rounded-[var(--radius-md)]">
                  <div className="text-[10px] text-[var(--color-text-tertiary)] mb-1">المستخدم</div>
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">{detailDrawer.user.full_name}</div>
                </div>
              )}
              {detailDrawer.created_at && (
                <div className="p-3 bg-[var(--color-surface-dim)] rounded-[var(--radius-md)]">
                  <div className="text-[10px] text-[var(--color-text-tertiary)] mb-1">التاريخ</div>
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">{new Date(detailDrawer.created_at).toLocaleDateString('ar-EG')}</div>
                </div>
              )}
            </div>

            {detailDrawer.link && (
              <div className="p-3 bg-[var(--color-primary-light)] rounded-[var(--radius-md)]">
                <div className="text-[10px] text-[var(--color-text-tertiary)] mb-1">رابط</div>
                <a href={detailDrawer.link} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-primary)] hover:underline">{detailDrawer.link}</a>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Create Drawer */}
      <Drawer isOpen={!!createDrawer} onClose={() => setCreateDrawer(false)} title="تنبيه جديد" size="lg"
        footer={<div className="flex gap-3"><Button onClick={handleCreate} loading={saving}>إرسال</Button><Button variant="outlined" onClick={() => setCreateDrawer(false)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Select
            label="المستخدم"
            options={students.map(s => ({ value: s.id, label: s.full_name }))}
            value={form.user_id}
            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
            required
          />
          <Select
            label="النوع"
            options={ALERT_TYPES.map(t => ({ value: t.value, label: t.label }))}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
          <Input label="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="الرسالة" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} multiline rows={4} required />
        </div>
      </Drawer>

      <ConfirmModal
        isOpen={!!confirmRead}
        onClose={() => setConfirmRead(null)}
        onConfirm={() => markAsRead(confirmRead?.id)}
        title="وضع علامة مقروء"
        message="هل تريد وضع علامة مقروء على هذا التنبيه؟"
        confirmText="نعم، مقروء"
        confirmVariant="primary"
      />
    </div>
  );
}
