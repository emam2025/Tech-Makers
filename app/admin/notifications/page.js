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

export default function NotificationsPage() {
  const { success, error: toastError } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRead, setFilterRead] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDrawer(null);
        loadNotifications();
        success('تم إرسال الإشعار');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const toggleRead = async (notification) => {
    const res = await fetch(`/api/admin/notifications/${notification.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_read: !notification.is_read }),
    });
    if (res.ok) {
      loadNotifications();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/notifications/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(null);
      loadNotifications();
      success('تم حذف الإشعار');
    } else {
      toastError('فشل الحذف');
    }
  };

  const filtered = notifications.filter((n) => {
    const matchSearch = !search || (n.title || '').includes(search) || (n.body || '').includes(search);
    const matchType = !filterType || n.type === filterType;
    const matchRead = filterRead === '' ? true : (filterRead === 'read' ? n.is_read : !n.is_read);
    return matchSearch && matchType && matchRead;
  });

  const totalCount = notifications.length;
  const unreadCount = notifications.filter(n => !n.is_read).length;
  const infoCount = notifications.filter(n => n.type === 'info').length;
  const warningCount = notifications.filter(n => n.type === 'warning').length;

  const columns = [
    { key: 'title', label: 'العنوان', render: (r) => <span className={`font-medium ${!r.is_read ? 'text-[var(--color-primary)]' : ''}`}>{r.title}</span> },
    { key: 'body', label: 'المحتوى', render: (r) => <span className="text-sm text-[var(--color-text-secondary)] line-clamp-1">{r.body}</span> },
    { key: 'type', label: 'النوع', render: (r) => (
      <Badge variant={r.type === 'info' ? 'info' : r.type === 'warning' ? 'warning' : r.type === 'success' ? 'success' : 'default'}>
        {r.type === 'info' ? 'معلومات' : r.type === 'warning' ? 'تنبيه' : r.type === 'success' ? 'نجاح' : r.type}
      </Badge>
    )},
    { key: 'is_read', label: 'القراءة', render: (r) => (
      <Badge variant={r.is_read ? 'success' : 'warning'}>{r.is_read ? 'مقروء' : 'غير مقروء'}</Badge>
    )},
    { key: 'created_at', label: 'التاريخ', render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString('ar-EG') : '-' },
  ];

  const actions = [
    { icon: 'mark_email_read', label: 'تغيير حالة القراءة', onClick: (r) => toggleRead(r) },
    { icon: 'delete', label: 'حذف', onClick: (r) => setConfirmDelete(r), danger: true },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>الإشعارات</h1><p>إرسال وإدارة الإشعارات</p></div>
        <Button icon="notifications" onClick={() => { setForm({}); setDrawer('edit'); }}>إرسال إشعار</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon="notifications" iconColor="var(--color-primary)" iconBg="var(--color-primary-light)" value={totalCount} label="إجمالي الإشعارات" />
        <KPICard icon="mark_email_unread" iconColor="var(--color-warning)" iconBg="var(--color-warning-light)" value={unreadCount} label="غير مقروء" />
        <KPICard icon="info" iconColor="var(--color-info)" iconBg="var(--color-info-light)" value={infoCount} label="معلومات" />
        <KPICard icon="warning" iconColor="var(--color-danger)" iconBg="var(--color-danger-light)" value={warningCount} label="تنبيهات" />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input placeholder="بحث في العنوان أو المحتوى..." icon="search" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64" />
        <Select options={[{ value: '', label: 'جميع الأنواع' }, { value: 'info', label: 'معلومات' }, { value: 'warning', label: 'تنبيه' }, { value: 'success', label: 'نجاح' }]} value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full sm:w-40" />
        <Select options={[{ value: '', label: 'جميع الحالات' }, { value: 'unread', label: 'غير مقروء' }, { value: 'read', label: 'مقروء' }]} value={filterRead} onChange={(e) => setFilterRead(e.target.value)} className="w-full sm:w-40" />
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} actions={actions} emptyText="لا توجد إشعارات" searchable={['title', 'body']} />

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="إرسال إشعار"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>إرسال</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="العنوان" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="المحتوى" value={form.body || ''} onChange={(e) => setForm({ ...form, body: e.target.value })} multiline rows={3} required />
          <Select label="النوع" options={[{ value: 'info', label: 'معلومات' }, { value: 'warning', label: 'تنبيه' }, { value: 'success', label: 'نجاح' }]} value={form.type || 'info'} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <Input label="رقم الهوية (اتركه فارغاً للإشعارات العامة)" value={form.recipient_national_id || ''} onChange={(e) => setForm({ ...form, recipient_national_id: e.target.value })} />
        </div>
      </Drawer>

      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDelete(confirmDelete?.id)} title="حذف الإشعار" message="هل أنت متأكد من حذف هذا الإشعار؟" confirmLabel="حذف" danger />
    </div>
  );
}
