'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import { ConfirmModal } from '../../../components/ui/Modal';

const TRACKS = [
  { value: 'a', label: 'Track A' },
  { value: 'b', label: 'Track B' },
  { value: 'c', label: 'Track C' },
  { value: 'technomath', label: 'Techno Math' },
  { value: 'techenglish', label: 'Tech English' },
];

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTrack, setFilterTrack] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterTrack) params.set('track', filterTrack);
      const res = await fetch(`/api/admin/groups?${params}`);
      if (res.ok) {
        const data = await res.json();
        setGroups(data.groups || []);
      }
    } finally {
      setLoading(false);
    }
  }, [search, filterTrack]);

  useEffect(() => {
    fetch('/api/admin/trainers').then(r => r.ok ? r.json() : {}).then(d => setTrainers(d.trainers || []));
  }, []);

  useEffect(() => {
    const t = setTimeout(loadGroups, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [loadGroups, search]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id ? `/api/admin/groups/${form.id}` : '/api/admin/groups';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDrawer(null);
        loadGroups();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/groups/${id}`, { method: 'DELETE' });
    setConfirmDelete(null);
    loadGroups();
  };

  const columns = [
    { key: 'name', label: 'اسم المجموعة', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'track', label: 'المسار', render: (r) => {
      const t = TRACKS.find(t => t.value === r.track);
      return <Badge>{t?.label || r.track || '-'}</Badge>;
    }},
    { key: 'trainer', label: 'المدرب', render: (r) => r.trainer?.full_name || '-' },
    { key: 'student_count', label: 'عدد الطلاب', render: (r) => {
      const count = Array.isArray(r.student_count) ? r.student_count[0]?.count : r.student_count || 0;
      return <Badge variant="info">{count}</Badge>;
    }},
    { key: 'status', label: 'الحالة', render: (r) => (
      <Badge variant={r.status === 'active' ? 'success' : r.status === 'completed' ? 'info' : 'warning'}>
        {r.status === 'active' ? 'نشطة' : r.status === 'completed' ? 'مكتملة' : 'معلقة'}
      </Badge>
    )},
  ];

  const actions = [
    { icon: 'edit', label: 'تعديل', onClick: (r) => { setForm(r); setDrawer('edit'); } },
    { icon: 'delete', label: 'حذف', onClick: (r) => setConfirmDelete(r), color: 'var(--color-danger)' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>المجموعات</h1>
          <p>إدارة مجموعات الطلاب والمدربين</p>
        </div>
        <Button icon="group_add" onClick={() => { setForm({}); setDrawer('edit'); }}>إضافة مجموعة</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input placeholder="بحث بالاسم..." icon="search" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64" />
        <Select options={[{ value: '', label: 'جميع المسارات' }, ...TRACKS]} value={filterTrack} onChange={(e) => setFilterTrack(e.target.value)} className="w-full sm:w-40" />
      </div>

      <DataTable columns={columns} data={groups} loading={loading} actions={actions} emptyText="لا توجد مجموعات" />

      <Drawer
        isOpen={!!drawer}
        onClose={() => setDrawer(null)}
        title={form.id ? 'تعديل المجموعة' : 'إضافة مجموعة جديدة'}
        footer={
          <div className="flex gap-3">
            <Button onClick={handleSave} loading={saving}>حفظ</Button>
            <Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="اسم المجموعة" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Select label="المسار" options={TRACKS} value={form.track || ''} onChange={(e) => setForm({ ...form, track: e.target.value })} />
          <Select label="المدرب" options={trainers.map(t => ({ value: t.id, label: t.full_name }))} value={form.trainer_id || ''} onChange={(e) => setForm({ ...form, trainer_id: e.target.value })} />
          <Input label="الحد الأقصى للطلاب" type="number" value={form.max_students || ''} onChange={(e) => setForm({ ...form, max_students: parseInt(e.target.value) || 0 })} />
          <Select label="الحالة" options={[{ value: 'active', label: 'نشطة' }, { value: 'completed', label: 'مكتملة' }, { value: 'suspended', label: 'معلقة' }]} value={form.status || 'active'} onChange={(e) => setForm({ ...form, status: e.target.value })} />
        </div>
      </Drawer>

      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDelete(confirmDelete?.id)} title="حذف المجموعة" message={`هل أنت متأكد من حذف "${confirmDelete?.name}"؟`} confirmLabel="حذف" danger />
    </div>
  );
}
