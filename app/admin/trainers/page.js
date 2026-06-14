'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';

const SPECIALTIES = [
  { value: 'web', label: 'تطوير ويب' },
  { value: 'mobile', label: 'تطوير موبايل' },
  { value: 'ai', label: 'ذكاء اصطناعي' },
  { value: 'cybersecurity', label: 'أمن سيبراني' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'database', label: 'قواعد بيانات' },
];

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadTrainers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/trainers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTrainers(data.trainers || []);
      }
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(loadTrainers, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [loadTrainers, search]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id ? `/api/admin/trainers/${form.id}` : '/api/admin/trainers';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDrawer(null);
        loadTrainers();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;
    try {
      const res = await fetch(`/api/admin/trainers/${id}`, { method: 'DELETE' });
      if (res.ok) loadTrainers();
    } catch (err) {
      console.error('Delete trainer error:', err);
    }
  };

  const columns = [
    { key: 'full_name', label: 'الاسم', render: (r) => <span className="font-medium">{r.full_name}</span> },
    { key: 'email', label: 'البريد' },
    { key: 'specialty', label: 'التخصص', render: (r) => {
      const s = SPECIALTIES.find(s => s.value === r.specialty);
      return <Badge>{s?.label || r.specialty || '-'}</Badge>;
    }},
    { key: 'status', label: 'الحالة', render: (r) => (
      <Badge variant={r.status === 'active' ? 'success' : r.status === 'inactive' ? 'danger' : 'warning'}>
        {r.status === 'active' ? 'نشط' : r.status === 'inactive' ? 'غير نشط' : 'معلق'}
      </Badge>
    )},
    { key: 'phone', label: 'الهاتف' },
    { key: 'created_at', label: 'تاريخ الإضافة', render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString('ar-EG') : '-' },
  ];

  const actions = [
    { icon: 'edit', label: 'تعديل', onClick: (r) => { setForm(r); setDrawer('edit'); } },
    { icon: 'delete', label: 'حذف', onClick: (r) => handleDelete(r.id, r.full_name), danger: true },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>المدربين</h1>
          <p>إدارة فريق التدريب</p>
        </div>
        <Button icon="person_add" onClick={() => { setForm({}); setDrawer('edit'); }}>إضافة مدرب</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input
          placeholder="بحث بالاسم أو البريد..."
          icon="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>

      <DataTable
        columns={columns}
        data={trainers}
        loading={loading}
        actions={actions}
        emptyText="لا يوجد مدربين"
      />

      <Drawer
        isOpen={!!drawer}
        onClose={() => setDrawer(null)}
        title={form.id ? 'تعديل بيانات المدرب' : 'إضافة مدرب جديد'}
        footer={
          <div className="flex gap-3">
            <Button onClick={handleSave} loading={saving}>حفظ</Button>
            <Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="الاسم الكامل" value={form.full_name || ''} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          <Input label="البريد الإلكتروني" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="رقم الهوية" value={form.national_id || ''} onChange={(e) => setForm({ ...form, national_id: e.target.value })} />
          <Input label="الهاتف" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select label="التخصص" options={SPECIALTIES} value={form.specialty || ''} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
          <Select label="الحالة" options={[{ value: 'active', label: 'نشط' }, { value: 'inactive', label: 'غير نشط' }, { value: 'suspended', label: 'معلق' }]} value={form.status || 'active'} onChange={(e) => setForm({ ...form, status: e.target.value })} />
        </div>
      </Drawer>
    </div>
  );
}
