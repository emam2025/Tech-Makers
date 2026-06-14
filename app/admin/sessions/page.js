'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterGroup) params.set('group_id', filterGroup);
      const res = await fetch(`/api/admin/sessions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } finally {
      setLoading(false);
    }
  }, [filterGroup]);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/groups').then(r => r.ok ? r.json() : {}),
      fetch('/api/admin/trainers').then(r => r.ok ? r.json() : {}),
    ]).then(([g, t]) => {
      setGroups(g.groups || []);
      setTrainers(t.trainers || []);
    });
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setDrawer(null); loadSessions(); }
    } finally { setSaving(false); }
  };

  const columns = [
    { key: 'title', label: 'الجلسة', render: (r) => <span className="font-medium">{r.title}</span> },
    { key: 'group', label: 'المجموعة', render: (r) => r.group?.name || '-' },
    { key: 'trainer', label: 'المدرب', render: (r) => r.trainer?.full_name || '-' },
    { key: 'scheduled_date', label: 'التاريخ', render: (r) => r.scheduled_date ? new Date(r.scheduled_date).toLocaleDateString('ar-EG') : '-' },
    { key: 'scheduled_time', label: 'الوقت' },
    { key: 'status', label: 'الحالة', render: (r) => (
      <Badge variant={r.status === 'completed' ? 'success' : r.status === 'cancelled' ? 'danger' : 'warning'}>
        {r.status === 'completed' ? 'مكتملة' : r.status === 'cancelled' ? 'ملغية' : 'مجدولة'}
      </Badge>
    )},
  ];

  const actions = [
    { icon: 'check_circle', label: 'إكمال', onClick: async (r) => {
      await fetch(`/api/admin/sessions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: r.id, status: 'completed' }) });
      loadSessions();
    }},
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>الجلسات</h1><p>إدارة جلسات التعلم</p></div>
        <Button icon="add_circle" onClick={() => { setForm({}); setDrawer('edit'); }}>إضافة جلسة</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Select options={[{ value: '', label: 'جميع المجموعات' }, ...groups.map(g => ({ value: g.id, label: g.name }))]} value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="w-full sm:w-48" />
      </div>

      <DataTable columns={columns} data={sessions} loading={loading} actions={actions} emptyText="لا توجد جلسات" />

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="إضافة جلسة جديدة"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="عنوان الجلسة" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Select label="المجموعة" options={groups.map(g => ({ value: g.id, label: g.name }))} value={form.group_id || ''} onChange={(e) => setForm({ ...form, group_id: e.target.value })} />
          <Select label="المدرب" options={trainers.map(t => ({ value: t.id, label: t.full_name }))} value={form.trainer_id || ''} onChange={(e) => setForm({ ...form, trainer_id: e.target.value })} />
          <Input label="التاريخ" type="date" value={form.scheduled_date || ''} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} />
          <Input label="الوقت" type="time" value={form.scheduled_time || ''} onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })} />
          <Input label="المدة (دقيقة)" type="number" value={form.duration_minutes || ''} onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 60 })} />
          <Input label="الصالة" value={form.room || ''} onChange={(e) => setForm({ ...form, room: e.target.value })} />
        </div>
      </Drawer>
    </div>
  );
}
