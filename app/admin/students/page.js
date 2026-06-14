'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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

const STATUSES = [
  { value: 'pending', label: 'قيد المراجعة', color: 'var(--color-warning)' },
  { value: 'accepted', label: 'مقبول', color: 'var(--color-success)' },
  { value: 'rejected', label: 'مرفوض', color: 'var(--color-danger)' },
];

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTrack, setFilterTrack] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState([]);
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterTrack) params.set('track', filterTrack);
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/admin/students?${params}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } finally {
      setLoading(false);
    }
  }, [search, filterTrack, filterStatus]);

  useEffect(() => {
    const t = setTimeout(loadStudents, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [loadStudents, search]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id ? `/api/admin/students/${form.id}` : '/api/admin/students';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDrawer(null);
        loadStudents();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/students/${id}`, { method: 'DELETE' });
    setConfirmDelete(null);
    loadStudents();
  };

  const columns = [
    { key: 'full_name', label: 'الاسم', render: (r) => <span className="font-medium">{r.full_name}</span> },
    { key: 'national_id', label: 'رقم الهوية' },
    { key: 'track', label: 'المسار', render: (r) => {
      const t = TRACKS.find(t => t.value === r.track);
      return <Badge>{t?.label || r.track || '-'}</Badge>;
    }},
    { key: 'status', label: 'الحالة', render: (r) => {
      const s = STATUSES.find(s => s.value === r.status);
      return <Badge variant={r.status === 'accepted' ? 'success' : r.status === 'rejected' ? 'danger' : 'warning'}>{s?.label || r.status}</Badge>;
    }},
    { key: 'phone', label: 'الهاتف' },
    { key: 'created_at', label: 'تاريخ التسجيل', render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString('ar-EG') : '-' },
  ];

  const actions = [
    { icon: 'edit', label: 'تعديل', onClick: (r) => { setForm(r); setDrawer('edit'); } },
    { icon: 'delete', label: 'حذف', onClick: (r) => setConfirmDelete(r), color: 'var(--color-danger)' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>الطلاب</h1>
          <p>إدارة بيانات الطلاب المسجلين</p>
        </div>
        <Button icon="person_add" onClick={() => { setForm({}); setDrawer('edit'); }}>إضافة طالب</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Input
          placeholder="بحث بالاسم أو رقم الهوية..."
          icon="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select
          options={[{ value: '', label: 'جميع المسارات' }, ...TRACKS]}
          value={filterTrack}
          onChange={(e) => setFilterTrack(e.target.value)}
          className="w-full sm:w-40"
        />
        <Select
          options={[{ value: '', label: 'جميع الحالات' }, ...STATUSES]}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-40"
        />
      </div>

      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        actions={actions}
        selected={selected}
        onSelect={setSelected}
        emptyText="لا يوجد طلاب مسجلين"
      />

      {/* Drawer */}
      <Drawer
        isOpen={!!drawer}
        onClose={() => setDrawer(null)}
        title={form.id ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
        footer={
          <div className="flex gap-3">
            <Button onClick={handleSave} loading={saving}>حفظ</Button>
            <Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="الاسم الكامل" value={form.full_name || ''} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          <Input label="رقم الهوية" value={form.national_id || ''} onChange={(e) => setForm({ ...form, national_id: e.target.value })} required />
          <Input label="البريد الإلكتروني" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="الهاتف" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="واتساب" value={form.whatsapp || ''} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          <Select label="المسار" options={TRACKS} value={form.track || ''} onChange={(e) => setForm({ ...form, track: e.target.value })} />
          <Select label="الحالة" options={STATUSES} value={form.status || 'pending'} onChange={(e) => setForm({ ...form, status: e.target.value })} />
          <Input label="المستوى الدراسي" value={form.grade || ''} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
          <Input label="المحافظة" value={form.governorate || ''} onChange={(e) => setForm({ ...form, governorate: e.target.value })} />
        </div>
      </Drawer>

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete?.id)}
        title="حذف الطالب"
        message={`هل أنت متأكد من حذف "${confirmDelete?.full_name}"؟`}
        confirmLabel="حذف"
        danger
      />
    </div>
  );
}
