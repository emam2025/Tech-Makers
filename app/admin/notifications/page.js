'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

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
      if (res.ok) { setDrawer(null); loadNotifications(); }
    } finally { setSaving(false); }
  };

  const columns = [
    { key: 'title', label: 'العنوان', render: (r) => <span className="font-medium">{r.title}</span> },
    { key: 'body', label: 'المحتوى', render: (r) => <span className="text-sm text-[var(--color-text-secondary)] line-clamp-1">{r.body}</span> },
    { key: 'type', label: 'النوع', render: (r) => (
      <Badge>{r.type === 'info' ? 'معلومات' : r.type === 'warning' ? 'تنبيه' : r.type === 'success' ? 'نجاح' : r.type}</Badge>
    )},
    { key: 'is_read', label: 'القراءة', render: (r) => (
      <Badge variant={r.is_read ? 'success' : 'warning'}>{r.is_read ? 'مقروء' : 'غير مقروء'}</Badge>
    )},
    { key: 'created_at', label: 'التاريخ', render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString('ar-EG') : '-' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>الإشعارات</h1><p>إرسال وإدارة الإشعارات</p></div>
        <Button icon="notifications" onClick={() => { setForm({}); setDrawer('edit'); }}>إرسال إشعار</Button>
      </div>

      <DataTable columns={columns} data={notifications} loading={loading} emptyText="لا توجد إشعارات" />

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="إرسال إشعار"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>إرسال</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="العنوان" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="المحتوى" value={form.body || ''} onChange={(e) => setForm({ ...form, body: e.target.value })} multiline rows={3} required />
          <Select label="النوع" options={[{ value: 'info', label: 'معلومات' }, { value: 'warning', label: 'تنبيه' }, { value: 'success', label: 'نجاح' }]} value={form.type || 'info'} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <Input label="رقم الهوية (اتركه فارغاً للإشعارات العامة)" value={form.recipient_national_id || ''} onChange={(e) => setForm({ ...form, recipient_national_id: e.target.value })} />
        </div>
      </Drawer>
    </div>
  );
}
