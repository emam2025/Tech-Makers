'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { ConfirmModal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';

const TRACKS = [
  { value: 'a', label: 'Track A' },
  { value: 'b', label: 'Track B' },
  { value: 'c', label: 'Track C' },
  { value: 'technomath', label: 'Techno Math' },
  { value: 'techenglish', label: 'Tech English' },
];

const TRACK_COLORS = {
  a: { bg: 'bg-success/10', text: 'text-success', border: 'bg-success' },
  b: { bg: 'bg-primary-fixed/20', text: 'text-primary', border: 'bg-primary' },
  c: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'bg-purple-500' },
  technomath: { bg: 'bg-secondary-container/30', text: 'text-secondary', border: 'bg-secondary' },
  techenglish: { bg: 'bg-tertiary-fixed/30', text: 'text-tertiary', border: 'bg-tertiary' },
};

const LEVELS = [
  { value: 'beginner', label: 'مبتدئ' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'advanced', label: 'متقدم' },
];

const DAYS = [
  { value: 'sat', label: 'السبت' },
  { value: 'sun', label: 'الأحد' },
  { value: 'mon', label: 'الإثنين' },
  { value: 'tue', label: 'الثلاثاء' },
  { value: 'wed', label: 'الأربعاء' },
  { value: 'thu', label: 'الخميس' },
  { value: 'fri', label: 'الجمعة' },
];

const DAY_MAP = { sat: 'السبت', sun: 'الأحد', mon: 'الإثنين', tue: 'الثلاثاء', wed: 'الأربعاء', thu: 'الخميس', fri: 'الجمعة' };

export default function GroupsPage() {
  const { success, error: toastError } = useToast();
  const [groups, setGroups] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTrack, setFilterTrack] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [manageStudents, setManageStudents] = useState(null);
  const [groupStudents, setGroupStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [addStudentId, setAddStudentId] = useState('');

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
    fetch('/api/admin/students').then(r => r.ok ? r.json() : {}).then(d => setAllStudents(d.students || []));
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
        success(form.id ? 'تم تحديث المجموعة' : 'تم إنشاء المجموعة');
      } else {
        const data = await res.json();
        toastError(data.error || 'حدث خطأ');
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/admin/groups/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setConfirmDelete(null);
      loadGroups();
      success('تم حذف المجموعة');
    } else {
      toastError('فشل الحذف');
    }
  };

  const loadGroupStudents = async (group) => {
    setManageStudents(group);
    setLoadingStudents(true);
    try {
      const res = await fetch(`/api/admin/groups/${group.id}`);
      if (res.ok) {
        const data = await res.json();
        setGroupStudents(data.group?.students || []);
      }
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleAddStudent = async () => {
    if (!addStudentId || !manageStudents) return;
    try {
      const res = await fetch('/api/admin/group-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group_id: manageStudents.id, student_id: addStudentId }),
      });
      if (res.ok) {
        setAddStudentId('');
        loadGroupStudents(manageStudents);
        loadGroups();
        success('تمت إضافة الطالب');
      } else {
        const data = await res.json();
        toastError(data.error || 'فشل الإضافة');
      }
    } catch { toastError('خطأ في الشبكة'); }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!manageStudents) return;
    try {
      const res = await fetch(`/api/admin/group-students?group_id=${manageStudents.id}&student_id=${studentId}`, { method: 'DELETE' });
      if (res.ok) {
        loadGroupStudents(manageStudents);
        loadGroups();
        success('تمت إزالة الطالب');
      } else {
        toastError('فشل الإزالة');
      }
    } catch { toastError('خطأ في الشبكة'); }
  };

  const assignedStudentIds = new Set(groupStudents.map(s => s.student_id));
  const availableStudents = allStudents.filter(s => !assignedStudentIds.has(s.id));

  const filteredGroups = filterDay
    ? groups.filter(g => {
        const sched = g.schedule || g.days || '';
        if (Array.isArray(sched)) return sched.includes(filterDay);
        return String(sched).toLowerCase().includes(DAY_MAP[filterDay]?.toLowerCase() || filterDay);
      })
    : groups;

  return (
    <div className="max-w-container-max mx-auto px-md py-lg mb-24">
      {/* Header Section */}
      <div className="mb-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">إدارة المجموعات</h2>
            <p className="font-body-md text-on-surface-variant">استعرض ونظم مجموعات الطلاب الحالية والمسارات التعليمية.</p>
          </div>
          <Button icon="add" onClick={() => { setForm({}); setDrawer('edit'); }}>إضافة مجموعة</Button>
        </div>
        {/* Filters & Search */}
        <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant flex flex-col lg:flex-row gap-md items-center">
          <div className="relative w-full lg:max-w-md">
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              placeholder="البحث عن اسم المجموعة..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-surface rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md"
            />
          </div>
          <div className="flex flex-wrap gap-base w-full lg:w-auto">
            <select
              value={filterTrack}
              onChange={e => setFilterTrack(e.target.value)}
              className="flex-1 lg:w-48 p-3 bg-surface rounded-lg border border-outline-variant font-body-md text-on-surface-variant focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">كل المسارات</option>
              {TRACKS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select
              value={filterDay}
              onChange={e => setFilterDay(e.target.value)}
              className="flex-1 lg:w-48 p-3 bg-surface rounded-lg border border-outline-variant font-body-md text-on-surface-variant focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">كل الأيام</option>
              {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <button className="bg-surface-container-high px-md py-3 rounded-lg flex items-center gap-base font-label-md text-primary hover:bg-outline-variant transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
              تصفية
            </button>
          </div>
        </div>
      </div>

      {/* Groups Bento Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md animate-pulse">
              <div className="h-2 bg-surface-container rounded w-full mb-4" />
              <div className="h-6 bg-surface-container rounded w-1/3 mb-2" />
              <div className="h-4 bg-surface-container rounded w-1/2 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-surface-container rounded w-3/4" />
                <div className="h-3 bg-surface-container rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant">
          <span className="material-symbols-outlined text-[64px] text-outline mb-4 block">group</span>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">لا توجد مجموعات</h3>
          <p className="text-on-surface-variant mb-4">ابدأ بإنشاء مجموعة جديدة</p>
          <Button icon="add" onClick={() => { setForm({}); setDrawer('edit'); }}>إضافة مجموعة</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {filteredGroups.map(group => {
            const tc = TRACK_COLORS[group.track] || TRACK_COLORS.a;
            const count = Array.isArray(group.student_count) ? group.student_count[0]?.count : (group.student_count || 0);
            const trackLabel = TRACKS.find(t => t.value === group.track)?.label || group.track || '';
            return (
              <div key={group.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                <div className={`h-2 ${tc.border} w-full`} />
                <div className="p-md">
                  <div className="flex justify-between items-start mb-md">
                    <div>
                      <span className={`${tc.bg} ${tc.text} px-3 py-1 rounded-full text-xs font-bold mb-xs inline-block`}>{trackLabel}</span>
                      <h3 className="font-headline-md text-primary">{group.name}</h3>
                    </div>
                    <button className="text-outline hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                  <div className="space-y-sm mb-md">
                    <div className="flex items-center gap-base text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">person</span>
                      <span className="font-body-sm">المدرب: <strong>{group.trainer?.full_name || 'غير محدد'}</strong></span>
                    </div>
                    <div className="flex items-center gap-base text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">group</span>
                      <span className="font-body-sm">عدد الطلاب: <strong>{count} طالب</strong></span>
                    </div>
                    <div className="flex items-center gap-base text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">event</span>
                      <span className="font-body-sm">الحالة: <strong className={group.status === 'active' ? 'text-success' : 'text-on-surface-variant'}>{group.status === 'active' ? 'نشطة' : group.status === 'completed' ? 'مكتملة' : 'معلقة'}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-base pt-md border-t border-outline-variant">
                    <Link
                      href={`/admin/groups/${group.id}/room`}
                      className="flex-1 bg-primary text-on-primary py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity text-center"
                    >
                      التفاصيل
                    </Link>
                    <button
                      onClick={() => { setForm(group); setDrawer('edit'); }}
                      className="w-10 h-10 border border-outline-variant rounded-lg flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => { setForm({}); setDrawer('edit'); }}
        className="fixed bottom-20 lg:bottom-10 left-10 w-16 h-16 bg-secondary text-primary rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>

      {/* Create/Edit Drawer */}
      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title={form.id ? 'تعديل المجموعة' : 'إضافة مجموعة جديدة'}
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Input label="اسم المجموعة" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Select label="المسار" options={TRACKS} value={form.track || ''} onChange={(e) => setForm({ ...form, track: e.target.value })} />
          <Input label="اسم البرنامج" value={form.program_name || ''} onChange={(e) => setForm({ ...form, program_name: e.target.value })} placeholder="مثال: CS50, Python Basics" />
          <Select label="المستوى" options={LEVELS} value={form.level || 'beginner'} onChange={(e) => setForm({ ...form, level: e.target.value })} />
          <Select label="المدرب" options={trainers.map(t => ({ value: t.id, label: t.full_name }))} value={form.trainer_id || ''} onChange={(e) => setForm({ ...form, trainer_id: e.target.value })} />
          <Input label="الحد الأقصى للطلاب" type="number" value={form.max_students || ''} onChange={(e) => setForm({ ...form, max_students: parseInt(e.target.value) || 0 })} />
          <Select label="الحالة" options={[{ value: 'active', label: 'نشطة' }, { value: 'completed', label: 'مكتملة' }, { value: 'suspended', label: 'معلقة' }]} value={form.status || 'active'} onChange={(e) => setForm({ ...form, status: e.target.value })} />
        </div>
      </Drawer>

      {/* Manage Students Drawer */}
      <Drawer isOpen={!!manageStudents} onClose={() => { setManageStudents(null); setGroupStudents([]); }}
        title={`إدارة طلاب — ${manageStudents?.name || ''}`} size="lg"
        footer={<Button variant="outlined" onClick={() => { setManageStudents(null); setGroupStudents([]); }}>إغلاق</Button>}>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Select
              options={[{ value: '', label: 'اختر طالب...' }, ...availableStudents.map(s => ({ value: s.id, label: `${s.full_name} — ${s.national_id || ''}` }))]}
              value={addStudentId}
              onChange={(e) => setAddStudentId(e.target.value)}
              className="flex-1"
            />
            <Button icon="person_add" onClick={handleAddStudent} disabled={!addStudentId}>إضافة</Button>
          </div>

          {loadingStudents ? (
            <div className="text-center py-8 text-on-surface-variant">جاري التحميل...</div>
          ) : groupStudents.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant block mb-2">group</span>
              <p className="text-sm text-on-surface-variant">لا يوجد طلاب في هذه المجموعة</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm font-medium text-on-surface-variant mb-2">
                عدد الطلاب: {groupStudents.length}{manageStudents?.max_students ? ` / ${manageStudents.max_students}` : ''}
              </div>
              {groupStudents.map((gs) => (
                <div key={gs.student_id} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant">
                  <div>
                    <div className="text-sm font-medium text-on-surface">{gs.student?.full_name || '-'}</div>
                    <div className="text-xs text-on-surface-variant">{gs.student?.phone || ''}</div>
                  </div>
                  <Button icon="person_remove" variant="ghost" size="sm" onClick={() => handleRemoveStudent(gs.student_id)} className="text-error" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Drawer>

      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => handleDelete(confirmDelete?.id)} title="حذف المجموعة" message={`هل أنت متأكد من حذف "${confirmDelete?.name}"؟`} confirmText="حذف" confirmVariant="danger" />
    </div>
  );
}
