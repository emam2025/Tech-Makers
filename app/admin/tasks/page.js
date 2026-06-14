'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import { ConfirmModal } from '../../../components/ui/Modal';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [submissions, setSubmissions] = useState([]);
  const [gradingTask, setGradingTask] = useState(null);
  const [gradeForm, setGradeForm] = useState({});

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
      const url = form.id ? `/api/admin/tasks/${form.id}` : '/api/admin/tasks';
      const res = await fetch(url, {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setDrawer(null); loadTasks(); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/tasks/${deleteId}`, { method: 'DELETE' });
      if (res.ok) { setDeleteId(null); loadTasks(); }
    } catch {}
  };

  const loadSubmissions = async (task) => {
    setGradingTask(task);
    try {
      const res = await fetch(`/api/admin/tasks/submissions?task_id=${task.id}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch {
      setSubmissions([]);
    }
  };

  const handleGrade = async (submissionId) => {
    try {
      const res = await fetch('/api/admin/tasks/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submissionId, score: gradeForm.score, feedback: gradeForm.feedback }),
      });
      if (res.ok) {
        loadSubmissions(gradingTask);
        loadTasks();
      }
    } catch {}
  };

  const columns = [
    { key: 'title', label: 'المهمة', render: (r) => <span className="font-medium">{r.title}</span> },
    { key: 'group', label: 'المجموعة', render: (r) => r.group?.name || '-' },
    { key: 'type', label: 'النوع', render: (r) => (
      <Badge>{r.type === 'assignment' ? 'واجب' : r.type === 'quiz' ? 'اختبار' : r.type === 'project' ? 'مشروع' : r.type === 'exam' ? 'امتحان' : r.type}</Badge>
    )},
    { key: 'due_date', label: 'الموعد النهائي', render: (r) => r.due_date ? new Date(r.due_date).toLocaleDateString('ar-EG') : '-' },
    { key: 'max_score', label: 'الدرجة القصوى', render: (r) => r.max_score || 100 },
    { key: 'submission_count', label: 'التسليمات', render: (r) => {
      const count = Array.isArray(r.submission_count) ? r.submission_count[0]?.count : r.submission_count || 0;
      return <Badge variant="info">{count}</Badge>;
    }},
    { key: 'status', label: 'الحالة', render: (r) => (
      <Badge variant={r.status === 'active' || r.status === 'published' ? 'success' : r.status === 'closed' ? 'danger' : 'warning'}>
        {r.status === 'active' || r.status === 'published' ? 'نشطة' : r.status === 'closed' ? 'مغلقة' : 'مسودة'}
      </Badge>
    )},
  ];

  const actions = [
    { icon: 'grading', label: 'تصحيح', onClick: (r) => loadSubmissions(r) },
    { icon: 'edit', label: 'تعديل', onClick: (r) => { setForm({ ...r }); setDrawer('edit'); } },
    { icon: 'delete', label: 'حذف', onClick: (r) => setDeleteId(r.id) },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>المهام</h1><p>إدارة المهام والواجبات والتصحيح</p></div>
        <Button icon="add_task" onClick={() => { setForm({}); setDrawer('new'); }}>إضافة مهمة</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Select options={[{ value: '', label: 'جميع المجموعات' }, ...groups.map(g => ({ value: g.id, label: g.name }))]} value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="w-full sm:w-48" />
      </div>

      <DataTable columns={columns} data={tasks} loading={loading} actions={actions} emptyText="لا توجد مهام" />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="حذف المهمة"
        message="هل أنت متأكد من حذف هذه المهمة؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
      />

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title={drawer === 'edit' ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="عنوان المهمة" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="الوصف" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} multiline rows={3} />
          <Select label="المجموعة" options={groups.map(g => ({ value: g.id, label: g.name }))} value={form.group_id || ''} onChange={(e) => setForm({ ...form, group_id: e.target.value })} />
          <Select label="النوع" options={[{ value: 'assignment', label: 'واجب' }, { value: 'quiz', label: 'اختبار' }, { value: 'project', label: 'مشروع' }, { value: 'exam', label: 'امتحان' }]} value={form.type || 'assignment'} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <Input label="الموعد النهائي" type="date" value={form.due_date ? form.due_date.split('T')[0] : ''} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          <Input label="الدرجة القصوى" type="number" value={form.max_score || ''} onChange={(e) => setForm({ ...form, max_score: parseInt(e.target.value) || 100 })} />
          <Select label="الحالة" options={[{ value: 'draft', label: 'مسودة' }, { value: 'published', label: 'منشورة' }, { value: 'closed', label: 'مغلقة' }]} value={form.status || 'draft'} onChange={(e) => setForm({ ...form, status: e.target.value })} />
        </div>
      </Drawer>

      <Drawer isOpen={!!gradingTask} onClose={() => { setGradingTask(null); setSubmissions([]); }} title={`تصحيح: ${gradingTask?.title || ''}`} size="lg"
        footer={<Button variant="outlined" onClick={() => { setGradingTask(null); setSubmissions([]); }}>إغلاق</Button>}>
        <div className="space-y-3">
          {submissions.length === 0 && (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-[48px] text-[var(--color-text-tertiary)]">inbox</span>
              <p className="text-sm text-[var(--color-text-tertiary)] mt-2">لا توجد تسليمات بعد</p>
            </div>
          )}
          {submissions.map((sub) => (
            <div key={sub.id} className="card-admin p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">{sub.student?.full_name || '-'}</div>
                  <div className="text-xs text-[var(--color-text-tertiary)]">{sub.student?.national_id || ''}</div>
                </div>
                <Badge variant={sub.status === 'graded' ? 'success' : 'warning'}>
                  {sub.status === 'graded' ? `تم التصحيح: ${sub.score}/${gradingTask?.max_score || 100}` : 'بانتظار التصحيح'}
                </Badge>
              </div>
              {sub.submission_text && (
                <div className="bg-[var(--color-surface-dim)] rounded-[var(--radius-md)] p-3 mb-3 text-sm text-[var(--color-text-primary)]">
                  {sub.submission_text}
                </div>
              )}
              {sub.submission_url && (
                <a href={sub.submission_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-primary)] underline mb-3 block">
                  رابط التسليم
                </a>
              )}
              <div className="text-xs text-[var(--color-text-tertiary)] mb-2">
                تم التسليم: {sub.submitted_at ? new Date(sub.submitted_at).toLocaleString('ar-EG') : '-'}
              </div>
              {sub.status !== 'graded' && (
                <div className="flex gap-2 items-end">
                  <Input label={`الدرجة (/${gradingTask?.max_score || 100})`} type="number" value={gradeForm.score || ''} onChange={(e) => setGradeForm({ ...gradeForm, score: parseInt(e.target.value) })} className="w-28" />
                  <Input label="ملاحظات" value={gradeForm.feedback || ''} onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })} className="flex-1" />
                  <Button onClick={() => handleGrade(sub.id)}>تصحيح</Button>
                </div>
              )}
              {sub.status === 'graded' && sub.feedback && (
                <div className="mt-2 p-2 bg-[var(--color-success-light)] rounded text-xs text-[var(--color-text-primary)]">
                  <strong>ملاحظات:</strong> {sub.feedback}
                </div>
              )}
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
