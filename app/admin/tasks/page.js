'use client';

import { useEffect, useState, useCallback } from 'react';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { ConfirmModal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';

const TASK_TYPES = [
  { value: 'assignment', label: 'واجب' },
  { value: 'quiz', label: 'اختبار' },
  { value: 'project', label: 'مشروع' },
  { value: 'exam', label: 'امتحان' },
];

const STATUS_LABELS = {
  active: 'نشطة', published: 'منشورة', draft: 'مسودة', closed: 'مغلقة',
};

const TASK_STATUS_FILTERS = [
  { value: '', label: 'الكل' },
  { value: 'active', label: 'قيد التنفيذ' },
  { value: 'completed', label: 'تم التسليم' },
  { value: 'pending_review', label: 'بانتظار التقييم' },
];

export default function TasksPage() {
  const { success, error: toastError } = useToast();
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
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
    } finally { setLoading(false); }
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
      if (res.ok) { setDrawer(null); loadTasks(); success(form.id ? 'تم تحديث المهمة' : 'تم إنشاء المهمة'); }
      else { const data = await res.json(); toastError(data.error || 'حدث خطأ'); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/tasks/${deleteId}`, { method: 'DELETE' });
    if (res.ok) { setDeleteId(null); loadTasks(); success('تم حذف المهمة'); }
  };

  const loadSubmissions = async (task) => {
    setGradingTask(task);
    try {
      const res = await fetch(`/api/admin/tasks/submissions?task_id=${task.id}`);
      if (res.ok) { const data = await res.json(); setSubmissions(data.submissions || []); }
    } catch { setSubmissions([]); }
  };

  const handleGrade = async (submissionId) => {
    try {
      const res = await fetch('/api/admin/tasks/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submissionId, score: gradeForm.score, feedback: gradeForm.feedback }),
      });
      if (res.ok) { loadSubmissions(gradingTask); loadTasks(); success('تم التصحيح'); }
    } catch {}
  };

  const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'closed').length;
  const pendingGrading = tasks.reduce((sum, t) => {
    const count = Array.isArray(t.submission_count) ? t.submission_count[0]?.count : (t.submission_count || 0);
    return sum + count;
  }, 0);
  const activeTasks = tasks.filter(t => t.status === 'active' || t.status === 'published').length;
  const avgScore = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const filteredTasks = filterStatus
    ? tasks.filter(t => {
        if (filterStatus === 'active') return t.status === 'active' || t.status === 'published';
        if (filterStatus === 'completed') return t.status === 'completed' || t.status === 'closed';
        if (filterStatus === 'pending_review') return t.status !== 'completed' && t.status !== 'closed';
        return true;
      })
    : tasks;

  const getTrackColor = (type) => {
    const colors = {
      assignment: 'bg-primary-fixed/30 text-primary',
      quiz: 'bg-secondary-container/30 text-secondary',
      project: 'bg-purple-100 text-purple-700',
      exam: 'bg-error-container/30 text-error',
    };
    return colors[type] || 'bg-surface-container text-on-surface';
  };

  const getStatusBadge = (task) => {
    if (task.status === 'completed' || task.status === 'closed') {
      return { label: 'تم التسليم', className: 'bg-primary-fixed/30 text-primary', icon: 'check_circle' };
    }
    if (task.status === 'active' || task.status === 'published') {
      const dueDate = task.due_date ? new Date(task.due_date) : null;
      const now = new Date();
      if (dueDate && dueDate < now) {
        return { label: 'متأخر', className: 'bg-error-container/30 text-error', icon: 'warning' };
      }
      return { label: 'قيد التنفيذ', className: 'bg-secondary-container/20 text-secondary', icon: 'pending_actions' };
    }
    return { label: STATUS_LABELS[task.status] || task.status, className: 'bg-surface-container text-on-surface-variant', icon: 'schedule' };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'بلا موعد';
    return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="max-w-container-max mx-auto px-md py-lg mb-24 md:mb-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-lg gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">إدارة المهام والتكليفات</h2>
          <p className="font-body-md text-on-surface-variant">تابع مهامك الدراسية، سلم ملفاتك، وراجع التقييمات في مكان واحد.</p>
        </div>
        <div className="flex gap-sm">
          <Button icon="filter_list" variant="outlined" onClick={() => {}}>
            تصفية
          </Button>
          <Button icon="history" onClick={() => {}}>
            سجل المهام
          </Button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-lg">
        <div className="bg-surface border border-outline-variant p-md rounded-xl flex flex-col gap-xs">
          <div className="flex justify-between items-center mb-xs">
            <span className="material-symbols-outlined text-primary bg-primary-fixed/30 p-xs rounded-lg">pending_actions</span>
            <span className="text-body-sm text-on-surface-variant">المهام النشطة</span>
          </div>
          <span className="font-headline-md text-headline-md text-primary">{String(activeTasks).padStart(2, '0')}</span>
        </div>
        <div className="bg-surface border border-outline-variant p-md rounded-xl flex flex-col gap-xs">
          <div className="flex justify-between items-center mb-xs">
            <span className="material-symbols-outlined text-secondary bg-secondary-fixed/30 p-xs rounded-lg">schedule</span>
            <span className="text-body-sm text-on-surface-variant">اقترب الموعد</span>
          </div>
          <span className="font-headline-md text-headline-md text-primary">{String(pendingGrading).padStart(2, '0')}</span>
        </div>
        <div className="bg-surface border border-outline-variant p-md rounded-xl flex flex-col gap-xs">
          <div className="flex justify-between items-center mb-xs">
            <span className="material-symbols-outlined text-green-600 bg-green-100 p-xs rounded-lg">check_circle</span>
            <span className="text-body-sm text-on-surface-variant">تم التسليم</span>
          </div>
          <span className="font-headline-md text-headline-md text-primary">{String(completedTasks).padStart(2, '0')}</span>
        </div>
        <div className="bg-surface border border-outline-variant p-md rounded-xl flex flex-col gap-xs">
          <div className="flex justify-between items-center mb-xs">
            <span className="material-symbols-outlined text-purple-600 bg-purple-100 p-xs rounded-lg">grade</span>
            <span className="text-body-sm text-on-surface-variant">متوسط التقييم</span>
          </div>
          <span className="font-headline-md text-headline-md text-primary">{avgScore}%</span>
        </div>
      </div>

      {/* Tasks List Header */}
      <div className="flex items-center justify-between mb-md">
        <h3 className="font-headline-md text-headline-md text-on-surface">المهام الحالية</h3>
        <div className="flex gap-md font-label-md text-on-surface-variant">
          {TASK_STATUS_FILTERS.map(f => (
            <span
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              className={`cursor-pointer transition-colors pb-xs ${
                filterStatus === f.value
                  ? 'text-primary border-b-2 border-primary'
                  : 'hover:text-primary'
              }`}
            >
              {f.label}
            </span>
          ))}
        </div>
      </div>

      {/* Task Cards */}
      {loading ? (
        <div className="space-y-md">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col lg:flex-row animate-pulse">
              <div className="lg:w-1/4 p-md bg-surface-container-low border-l border-outline-variant">
                <div className="h-6 bg-surface-container rounded-full w-24 mb-sm" />
                <div className="h-5 bg-surface-container rounded w-40 mb-xs" />
                <div className="h-4 bg-surface-container rounded w-32" />
              </div>
              <div className="flex-1 p-md">
                <div className="h-4 bg-surface-container rounded w-full mb-sm" />
                <div className="h-4 bg-surface-container rounded w-3/4 mb-md" />
                <div className="flex gap-xs mb-md">
                  <div className="h-6 bg-surface-container rounded w-16" />
                  <div className="h-6 bg-surface-container rounded w-20" />
                </div>
                <div className="border-t border-outline-variant pt-md flex justify-between">
                  <div className="flex -space-x-2 space-x-reverse">
                    <div className="w-8 h-8 rounded-full bg-surface-container" />
                    <div className="w-8 h-8 rounded-full bg-surface-container" />
                  </div>
                  <div className="h-10 bg-surface-container rounded-lg w-28" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-outline-variant rounded-xl">
          <span className="material-symbols-outlined text-[64px] text-outline mb-sm block">assignment</span>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">لا توجد مهام</h3>
          <p className="text-on-surface-variant mb-sm">ابدأ بإنشاء مهمة جديدة</p>
          <Button icon="add_task" onClick={() => { setForm({}); setDrawer('new'); }}>إضافة مهمة</Button>
        </div>
      ) : (
        <div className="space-y-md">
          {filteredTasks.map(task => {
            const count = Array.isArray(task.submission_count) ? task.submission_count[0]?.count : (task.submission_count || 0);
            const typeLabel = TASK_TYPES.find(t => t.value === task.type)?.label || task.type;
            const statusBadge = getStatusBadge(task);
            const group = task.group || groups.find(g => g.id === task.group_id);

            return (
              <div key={task.id} className="task-card bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col lg:flex-row items-stretch">
                {/* Left Sidebar */}
                <div className="lg:w-1/4 p-md bg-surface-container-low flex flex-col justify-between border-l border-outline-variant">
                  <div>
                    <span className={`${statusBadge.className} font-label-md px-sm py-xs rounded-full inline-block mb-sm uppercase tracking-wider`}>
                      {statusBadge.label}
                    </span>
                    <h4 className="font-headline-md text-primary mb-xs">{task.title}</h4>
                    <p className="font-body-sm text-on-surface-variant">{group?.name || 'غير محدد'}</p>
                  </div>
                  <div className="mt-md flex items-center gap-xs text-on-surface-variant font-label-md">
                    <span className="material-symbols-outlined">event</span>
                    {task.status === 'completed' || task.status === 'closed' ? 'تم التسليم' : 'تسليم'}: {formatDate(task.due_date)}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-md flex flex-col justify-between">
                  <div className="mb-md">
                    {task.description && (
                      <p className="font-body-md text-on-surface mb-md">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-xs">
                      <span className={`${getTrackColor(task.type)} px-sm py-xs rounded text-body-sm`}>{typeLabel}</span>
                      <span className="bg-surface-variant px-sm py-xs rounded text-body-sm">التسليمات: {count}</span>
                      <span className="bg-surface-variant px-sm py-xs rounded text-body-sm">الدرجة: {task.max_score || 100}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-md border-t border-outline-variant">
                    <div className="flex items-center gap-sm">
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                        <span className="material-symbols-outlined text-sm">person</span>
                      </div>
                      <span className="font-body-sm text-on-surface-variant">{group?.name || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center gap-sm">
                      <button
                        onClick={() => loadSubmissions(task)}
                        className="bg-primary text-white px-lg py-sm rounded-lg font-label-md flex items-center gap-sm hover:bg-primary-container transition-all"
                      >
                        <span className="material-symbols-outlined">upload_file</span>
                        التصحيح
                      </button>
                      <button
                        onClick={() => { setForm({ ...task }); setDrawer('edit'); }}
                        className="p-sm hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant hover:text-primary"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Drawer */}
      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title={drawer === 'edit' ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="عنوان المهمة" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-1">الوصف</label>
            <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none text-sm resize-none" />
          </div>
          <Select label="المجموعة" options={groups.map(g => ({ value: g.id, label: g.name }))} value={form.group_id || ''} onChange={(e) => setForm({ ...form, group_id: e.target.value })} />
          <Select label="النوع" options={TASK_TYPES} value={form.type || 'assignment'} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <Input label="الموعد النهائي" type="date" value={form.due_date ? form.due_date.split('T')[0] : ''} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          <Input label="الدرجة القصوى" type="number" value={form.max_score || ''} onChange={(e) => setForm({ ...form, max_score: parseInt(e.target.value) || 100 })} />
          <Select label="الحالة" options={[{ value: 'draft', label: 'مسودة' }, { value: 'published', label: 'منشورة' }, { value: 'closed', label: 'مغلقة' }]} value={form.status || 'draft'} onChange={(e) => setForm({ ...form, status: e.target.value })} />
        </div>
      </Drawer>

      {/* Grading Drawer */}
      <Drawer isOpen={!!gradingTask} onClose={() => { setGradingTask(null); setSubmissions([]); }} title={`تصحيح: ${gradingTask?.title || ''}`} size="lg"
        footer={<Button variant="outlined" onClick={() => { setGradingTask(null); setSubmissions([]); }}>إغلاق</Button>}>
        <div className="space-y-3">
          {submissions.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant block mb-2">inbox</span>
              <p className="text-sm text-on-surface-variant">لا توجد تسليمات بعد</p>
            </div>
          ) : submissions.map((sub) => (
            <div key={sub.id} className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-medium text-on-surface">{sub.student?.full_name || '-'}</div>
                  <div className="text-xs text-on-surface-variant">{sub.student?.national_id || ''}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {sub.status === 'graded' ? `تم التصحيح: ${sub.score}/${gradingTask?.max_score || 100}` : 'بانتظار التصحيح'}
                </span>
              </div>
              {sub.submission_text && (
                <div className="bg-surface-container rounded-lg p-3 mb-3 text-sm text-on-surface">{sub.submission_text}</div>
              )}
              {sub.submission_url && (
                <a href={sub.submission_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline mb-3 block">رابط التسليم</a>
              )}
              <div className="text-xs text-on-surface-variant mb-2">
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
                <div className="mt-2 p-2 bg-success/10 rounded text-xs text-on-surface"><strong>ملاحظات:</strong> {sub.feedback}</div>
              )}
            </div>
          ))}
        </div>
      </Drawer>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="حذف المهمة" message="هل أنت متأكد من حذف هذه المهمة؟" confirmText="حذف" confirmVariant="danger" />
    </div>
  );
}
