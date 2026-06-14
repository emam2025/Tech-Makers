'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterGroup) params.set('group_id', filterGroup);
      const res = await fetch(`/api/admin/tasks?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } finally {
      setLoading(false);
    }
  }, [filterGroup]);

  useEffect(() => {
    fetch('/api/admin/groups').then(r => r.ok ? r.json() : {}).then(d => setGroups(d.groups || []));
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setDrawer(null); loadTasks(); }
    } finally { setSaving(false); }
  };

  const columns = [
    { key: 'title', label: 'المهمة', render: (r) => <span className="font-medium">{r.title}</span> },
    { key: 'group', label: 'المجموعة', render: (r) => r.group?.name || '-' },
    { key: 'type', label: 'النوع', render: (r) => (
      <Badge>{r.type === 'assignment' ? 'واجب' : r.type === 'quiz' ? 'اختبار' : r.type === 'project' ? 'مشروع' : r.type}</Badge>
    )},
    { key: 'due_date', label: 'الموعد النهائي', render: (r) => r.due_date ? new Date(r.due_date).toLocaleDateString('ar-EG') : '-' },
    { key: 'submission_count', label: 'التسليمات', render: (r) => {
      const count = Array.isArray(r.submission_count) ? r.submission_count[0]?.count : r.submission_count || 0;
      return <Badge variant="info">{count}</Badge>;
    }},
    { key: 'status', label: 'الحالة', render: (r) => (
      <Badge variant={r.status === 'active' ? 'success' : r.status === 'closed' ? 'danger' : 'warning'}>
        {r.status === 'active' ? 'نشطة' : r.status === 'closed' ? 'مغلقة' : 'مسودة'}
      </Badge>
    )},
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>المهام</h1><p>إدارة المهام والواجبات</p></div>
        <Button icon="add_task" onClick={() => { setForm({}); setDrawer('edit'); }}>إضافة مهمة</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Select options={[{ value: '', label: 'جميع المجموعات' }, ...groups.map(g => ({ value: g.id, label: g.name }))]} value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="w-full sm:w-48" />
      </div>

      <DataTable columns={columns} data={tasks} loading={loading} emptyText="لا توجد مهام" />

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="إضافة مهمة جديدة"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="عنوان المهمة" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="الوصف" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} multiline rows={3} />
          <Select label="المجموعة" options={groups.map(g => ({ value: g.id, label: g.name }))} value={form.group_id || ''} onChange={(e) => setForm({ ...form, group_id: e.target.value })} />
          <Select label="النوع" options={[{ value: 'assignment', label: 'واجب' }, { value: 'quiz', label: 'اختبار' }, { value: 'project', label: 'مشروع' }]} value={form.type || 'assignment'} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <Input label="الموعد النهائي" type="date" value={form.due_date || ''} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          <Input label="الدرجة القصوى" type="number" value={form.max_score || ''} onChange={(e) => setForm({ ...form, max_score: parseInt(e.target.value) || 100 })} />
        </div>
      </Drawer>
    </div>
  );
}
