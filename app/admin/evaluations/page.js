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

const EVALUATION_TYPES = [
  { value: 'periodic', label: 'دوري' },
  { value: 'session', label: 'جلسة' },
  { value: 'monthly', label: 'شهري' },
  { value: 'final', label: 'نهائي' },
];

const SCORE_FIELDS = [
  { key: 'technical_score', label: 'المهارات التقنية' },
  { key: 'attendance_score', label: 'الحضور والمشاركة' },
  { key: 'participation_score', label: 'المبادرة والمشاركة' },
  { key: 'behavior_score', label: 'السلوك والأخلاق' },
  { key: 'effort_score', label: 'الجهد والاجتهاد' },
];

function ScoreBar({ score, max = 10 }) {
  const pct = score ? (score / max) * 100 : 0;
  const color = score >= 8 ? 'text-success' : score >= 5 ? 'text-secondary' : 'text-error';
  const barColor = score >= 8 ? 'bg-success' : score >= 5 ? 'bg-secondary' : 'bg-error';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold min-w-[32px] text-center ${color}`}>{score || '-'}/10</span>
    </div>
  );
}

export default function EvaluationsPage() {
  const { success, error: toastError } = useToast();
  const [evaluations, setEvaluations] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [detailDrawer, setDetailDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadEvaluations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterGroup) params.set('group_id', filterGroup);
      const res = await fetch(`/api/admin/evaluations?${params}`);
      if (res.ok) {
        const data = await res.json();
        setEvaluations(data.evaluations || []);
      }
    } finally {
      setLoading(false);
    }
  }, [filterGroup]);

  useEffect(() => {
    loadEvaluations();
    fetch('/api/admin/students').then(r => r.ok ? r.json() : {}).then(d => setStudents(d.students || []));
    fetch('/api/admin/groups').then(r => r.ok ? r.json() : {}).then(d => setGroups(d.groups || []));
  }, [loadEvaluations]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = form.id ? `/api/admin/evaluations/${form.id}` : '/api/admin/evaluations';
      const res = await fetch(url, {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setDrawer(null);
        loadEvaluations();
        success(form.id ? 'تم تحديث التقييم' : 'تم إضافة التقييم');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/evaluations/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(null);
      loadEvaluations();
      success('تم حذف التقييم');
    } else {
      toastError('فشل الحذف');
    }
  };

  const filtered = evaluations.filter((e) => {
    const matchSearch = !search || (e.student?.full_name || '').toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const avgScore = filtered.length ? (filtered.reduce((sum, e) => sum + (parseFloat(e.overall_score) || 0), 0) / filtered.length).toFixed(1) : 0;
  const highScores = filtered.filter(e => parseFloat(e.overall_score) >= 8).length;
  const lowScores = filtered.filter(e => parseFloat(e.overall_score) < 5).length;

  const columns = [
    { key: 'student', label: 'الطالب', render: (r) => <span className="font-medium">{r.student?.full_name || '-'}</span> },
    { key: 'group', label: 'المجموعة', render: (r) => r.group?.name || '-' },
    { key: 'evaluation_type', label: 'النوع', render: (r) => {
      const t = EVALUATION_TYPES.find(t => t.value === r.evaluation_type);
      return <Badge>{t?.label || r.evaluation_type}</Badge>;
    }},
    { key: 'overall_score', label: 'المتوسط', render: (r) => (
      <span className={`font-bold ${parseFloat(r.overall_score) >= 8 ? 'text-[var(--color-success)]' : parseFloat(r.overall_score) >= 5 ? 'text-[var(--color-warning)]' : 'text-[var(--color-danger)]'}`}>
        {r.overall_score || '-'}/10
      </span>
    )},
    { key: 'evaluation_date', label: 'التاريخ', render: (r) => r.evaluation_date ? new Date(r.evaluation_date).toLocaleDateString('ar-EG') : '-' },
  ];

  const actions = [
    { icon: 'visibility', label: 'تفاصيل', onClick: (r) => setDetailDrawer(r) },
    { icon: 'edit', label: 'تعديل', onClick: (r) => { setForm({ ...r }); setDrawer('edit'); } },
    { icon: 'delete', label: 'حذف', onClick: (r) => setConfirmDelete(r), danger: true },
  ];

  const openNewEval = () => {
    setForm({
      evaluation_type: 'periodic',
      evaluation_date: new Date().toISOString().split('T')[0],
    });
    setDrawer('edit');
  };

  return (
    <div className="max-w-container-max mx-auto px-md py-lg mb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-base mb-sm">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">التقييمات</h1>
          <p className="font-body-md text-on-surface-variant">تقييم أداء الطلاب والتقدم</p>
        </div>
        <Button icon="star" onClick={openNewEval}>إضافة تقييم</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-base mb-sm">
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex items-center gap-base">
          <div className="bg-secondary-fixed/30 p-sm rounded-lg"><span className="material-symbols-outlined text-secondary">star</span></div>
          <div><p className="font-body-sm text-on-surface-variant">متوسط التقييم</p><h3 className="font-headline-md text-on-surface font-bold">{avgScore}</h3></div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex items-center gap-base">
          <div className="bg-success/10 p-sm rounded-lg"><span className="material-symbols-outlined text-success">trending_up</span></div>
          <div><p className="font-body-sm text-on-surface-variant">ممتاز (8+)</p><h3 className="font-headline-md text-on-surface font-bold">{highScores}</h3></div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex items-center gap-base">
          <div className="bg-error/10 p-sm rounded-lg"><span className="material-symbols-outlined text-error">trending_down</span></div>
          <div><p className="font-body-sm text-on-surface-variant">يحتاج تحسين (&lt;5)</p><h3 className="font-headline-md text-on-surface font-bold">{lowScores}</h3></div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex items-center gap-base">
          <div className="bg-primary-fixed/20 p-sm rounded-lg"><span className="material-symbols-outlined text-primary">assessment</span></div>
          <div><p className="font-body-sm text-on-surface-variant">إجمالي التقييمات</p><h3 className="font-headline-md text-on-surface font-bold">{filtered.length}</h3></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-sm">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
          <input type="text" placeholder="بحث بالاسم..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pr-10 pl-4 py-3 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none text-sm" />
        </div>
        <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="p-3 bg-surface rounded-lg border border-outline-variant text-sm focus:ring-2 focus:ring-primary outline-none">
          <option value="">جميع المجموعات</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} actions={actions} emptyText="لا توجد تقييمات" />

      {/* Create/Edit Drawer */}
      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title={form.id ? 'تعديل التقييم' : 'تقييم طالب جديد'} size="lg"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Select label="الطالب" options={students.map(s => ({ value: s.id, label: `${s.full_name} — ${s.national_id || ''}` }))} value={form.student_id || ''} onChange={(e) => setForm({ ...form, student_id: e.target.value })} required />
          <Select label="المجموعة" options={groups.map(g => ({ value: g.id, label: g.name }))} value={form.group_id || ''} onChange={(e) => setForm({ ...form, group_id: e.target.value })} />
          <Select label="نوع التقييم" options={EVALUATION_TYPES} value={form.evaluation_type || 'periodic'} onChange={(e) => setForm({ ...form, evaluation_type: e.target.value })} />
          <Input label="تاريخ التقييم" type="date" value={form.evaluation_date || new Date().toISOString().split('T')[0]} onChange={(e) => setForm({ ...form, evaluation_date: e.target.value })} />

          <div className="border-t border-outline-variant pt-4">
            <h4 className="text-sm font-bold text-on-surface mb-3">درجات التقييم (1-10)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SCORE_FIELDS.map(f => (
                <Input key={f.key} label={f.label} type="number" min="1" max="10" value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: parseInt(e.target.value) || null })} />
              ))}
            </div>
          </div>

          <div className="border-t border-outline-variant pt-4">
            <h4 className="text-sm font-bold text-on-surface mb-3">ملاحظات</h4>
            <Input label="نقاط القوة" value={form.strengths || ''} onChange={(e) => setForm({ ...form, strengths: e.target.value })} multiline rows={2} placeholder="ما الذي أتقنه الطالب؟" />
            <Input label="نقاط الضعف" value={form.weaknesses || ''} onChange={(e) => setForm({ ...form, weaknesses: e.target.value })} multiline rows={2} placeholder="ما الذي يحتاج تحسين؟" />
            <Input label="التوصيات" value={form.recommendations || ''} onChange={(e) => setForm({ ...form, recommendations: e.target.value })} multiline rows={2} placeholder="خطوات مقترحة للتحسين" />
            <Input label="ملاحظات عامة" value={form.general_notes || ''} onChange={(e) => setForm({ ...form, general_notes: e.target.value })} multiline rows={2} />
          </div>
        </div>
      </Drawer>

      {/* Detail Drawer */}
      <Drawer isOpen={!!detailDrawer} onClose={() => setDetailDrawer(null)} title={`تقييم — ${detailDrawer?.student?.full_name || ''}`} size="lg"
        footer={<Button variant="outlined" onClick={() => setDetailDrawer(null)}>إغلاق</Button>}>
        {detailDrawer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Badge>{EVALUATION_TYPES.find(t => t.value === detailDrawer.evaluation_type)?.label || detailDrawer.evaluation_type}</Badge>
              <span className="text-sm text-on-surface-variant">{detailDrawer.evaluation_date}</span>
              {detailDrawer.evaluator && <span className="text-sm text-on-surface-variant">المقيّم: {detailDrawer.evaluator.full_name}</span>}
            </div>

            <div>
              <h4 className="text-sm font-bold text-on-surface mb-3">الدرجات</h4>
              <div className="space-y-2">
                {SCORE_FIELDS.map(f => (
                  <div key={f.key} className="flex items-center gap-3">
                    <span className="text-sm text-on-surface-variant w-32">{f.label}</span>
                    <ScoreBar score={detailDrawer[f.key]} />
                  </div>
                ))}
              </div>
              {detailDrawer.overall_score && (
                <div className="mt-3 p-3 bg-surface-container rounded-lg flex items-center justify-between">
                  <span className="text-sm font-bold text-on-surface">المتوسط العام</span>
                  <span className={`text-lg font-bold ${parseFloat(detailDrawer.overall_score) >= 8 ? 'text-success' : parseFloat(detailDrawer.overall_score) >= 5 ? 'text-secondary' : 'text-error'}`}>
                    {detailDrawer.overall_score}/10
                  </span>
                </div>
              )}
            </div>

            {(detailDrawer.strengths || detailDrawer.weaknesses || detailDrawer.recommendations || detailDrawer.general_notes) && (
              <div>
                <h4 className="text-sm font-bold text-on-surface mb-3">ملاحظات</h4>
                <div className="space-y-3">
                  {detailDrawer.strengths && <div className="p-3 bg-success/10 rounded-lg"><div className="text-xs font-bold text-success mb-1">نقاط القوة</div><div className="text-sm text-on-surface">{detailDrawer.strengths}</div></div>}
                  {detailDrawer.weaknesses && <div className="p-3 bg-secondary-fixed/20 rounded-lg"><div className="text-xs font-bold text-secondary mb-1">نقاط الضعف</div><div className="text-sm text-on-surface">{detailDrawer.weaknesses}</div></div>}
                  {detailDrawer.recommendations && <div className="p-3 bg-primary-fixed/10 rounded-lg"><div className="text-xs font-bold text-primary mb-1">التوصيات</div><div className="text-sm text-on-surface">{detailDrawer.recommendations}</div></div>}
                  {detailDrawer.general_notes && <div className="p-3 bg-surface-container-low rounded-lg"><div className="text-xs font-bold text-on-surface-variant mb-1">ملاحظات عامة</div><div className="text-sm text-on-surface">{detailDrawer.general_notes}</div></div>}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDelete(confirmDelete?.id)} title="حذف التقييم" message="هل أنت متأكد من حذف هذا التقييم؟" confirmText="حذف" confirmVariant="danger" />
    </div>
  );
}
