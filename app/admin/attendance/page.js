'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import Drawer from '../../../components/ui/Drawer';
import Input from '../../../components/ui/Input';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSession, setFilterSession] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [records, setRecords] = useState([]);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, excused: 0, total: 0 });

  const loadAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterSession) params.set('session_id', filterSession);
      if (filterGroup) params.set('group_id', filterGroup);
      const res = await fetch(`/api/admin/attendance?${params}`);
      if (res.ok) {
        const data = await res.json();
        const list = data.attendance || [];
        setAttendance(list);
        const s = { present: 0, absent: 0, late: 0, excused: 0, total: list.length };
        list.forEach(a => { if (s[a.status] !== undefined) s[a.status]++; });
        setStats(s);
      }
    } finally {
      setLoading(false);
    }
  }, [filterSession, filterGroup]);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/sessions').then(r => r.ok ? r.json() : {}),
      fetch('/api/admin/students').then(r => r.ok ? r.json() : {}),
      fetch('/api/admin/groups').then(r => r.ok ? r.json() : {}),
    ]).then(([s, st, g]) => {
      setSessions(s.sessions || []);
      setStudents(st.students || []);
      setGroups(g.groups || []);
    });
  }, []);

  useEffect(() => { loadAttendance(); }, [loadAttendance]);

  const loadGroupStudents = async (groupId) => {
    if (!groupId) { setRecords([]); return; }
    try {
      const res = await fetch(`/api/admin/groups/${groupId}`);
      if (res.ok) {
        const data = await res.json();
        const members = data.group?.students?.map(gs => ({
          student_id: gs.student_id,
          student_name: gs.student?.full_name || '-',
          status: 'present',
          notes: '',
        })) || [];
        setRecords(members);
      }
    } catch (err) {}
  };

  const handleSave = async () => {
    if (!selectedSession || !records.length) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: selectedSession, records }),
      });
      if (res.ok) { setDrawer(null); loadAttendance(); }
    } finally { setSaving(false); }
  };

  const exportCSV = () => {
    const headers = ['الطالب', 'رقم الهوية', 'الجلسة', 'التاريخ', 'الحالة', 'ملاحظات'];
    const rows = attendance.map(a => [
      a.student?.full_name || '',
      a.student?.national_id || '',
      a.session?.title || '',
      a.session?.scheduled_date || '',
      a.status === 'present' ? 'حاضر' : a.status === 'absent' ? 'غائب' : a.status === 'late' ? 'متأخر' : a.status === 'excused' ? 'معذور' : a.status,
      a.notes || '',
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>الحضور والغياب</h1><p>تسجيل ومتابعة حضور الطلاب</p></div>
        <div className="flex gap-2">
          <Button variant="outlined" icon="download" onClick={exportCSV}>تصدير CSV</Button>
          <Button icon="fact_check" onClick={() => {
            setSelectedSession('');
            setSelectedGroup('');
            setRecords(students.map(s => ({ student_id: s.id, student_name: s.full_name, status: 'present', notes: '' })));
            setDrawer('edit');
          }}>تسجيل حضور</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="card-admin p-3 text-center">
          <div className="text-lg font-bold" style={{ color: 'var(--color-success)' }}>{stats.present}</div>
          <div className="text-[11px] text-[var(--color-text-tertiary)]">حاضر</div>
        </div>
        <div className="card-admin p-3 text-center">
          <div className="text-lg font-bold" style={{ color: 'var(--color-danger)' }}>{stats.absent}</div>
          <div className="text-[11px] text-[var(--color-text-tertiary)]">غائب</div>
        </div>
        <div className="card-admin p-3 text-center">
          <div className="text-lg font-bold" style={{ color: 'var(--color-warning)' }}>{stats.late}</div>
          <div className="text-[11px] text-[var(--color-text-tertiary)]">متأخر</div>
        </div>
        <div className="card-admin p-3 text-center">
          <div className="text-lg font-bold" style={{ color: 'var(--color-info)' }}>{stats.excused}</div>
          <div className="text-[11px] text-[var(--color-text-tertiary)]">معذور</div>
        </div>
      </div>

      {/* Attendance Bar */}
      {stats.total > 0 && (
        <div className="mb-4 card-admin p-3">
          <div className="flex gap-1 h-3 rounded-full overflow-hidden">
            <div style={{ width: `${(stats.present / stats.total) * 100}%`, background: 'var(--color-success)' }} />
            <div style={{ width: `${(stats.late / stats.total) * 100}%`, background: 'var(--color-warning)' }} />
            <div style={{ width: `${(stats.absent / stats.total) * 100}%`, background: 'var(--color-danger)' }} />
            <div style={{ width: `${(stats.excused / stats.total) * 100}%`, background: 'var(--color-info)' }} />
          </div>
          <div className="flex gap-4 mt-2 text-[11px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-success)' }} /> {Math.round((stats.present / stats.total) * 100)}%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-warning)' }} /> {Math.round((stats.late / stats.total) * 100)}%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-danger)' }} /> {Math.round((stats.absent / stats.total) * 100)}%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-info)' }} /> {Math.round((stats.excused / stats.total) * 100)}%</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Select options={[{ value: '', label: 'جميع الجلسات' }, ...sessions.map(s => ({ value: s.id, label: `${s.title} — ${s.scheduled_date || ''}` }))]} value={filterSession} onChange={(e) => setFilterSession(e.target.value)} className="w-full sm:w-64" />
        <Select options={[{ value: '', label: 'جميع المجموعات' }, ...groups.map(g => ({ value: g.id, label: g.name }))]} value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)} className="w-full sm:w-48" />
      </div>

      <DataTable columns={[
        { key: 'student', label: 'الطالب', render: (r) => <span className="font-medium">{r.student?.full_name || '-'}</span> },
        { key: 'session', label: 'الجلسة', render: (r) => r.session?.title || '-' },
        { key: 'status', label: 'الحالة', render: (r) => (
          <Badge variant={r.status === 'present' ? 'success' : r.status === 'absent' ? 'danger' : r.status === 'late' ? 'warning' : 'info'}>
            {r.status === 'present' ? 'حاضر' : r.status === 'absent' ? 'غائب' : r.status === 'late' ? 'متأخر' : 'معذور'}
          </Badge>
        )},
        { key: 'notes', label: 'ملاحظات' },
        { key: 'created_at', label: 'التاريخ', render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString('ar-EG') : '-' },
      ]} data={attendance} loading={loading} emptyText="لا توجد سجلات حضور" />

      {/* Register Drawer */}
      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="تسجيل الحضور"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Select label="الجلسة" options={sessions.map(s => ({ value: s.id, label: `${s.title} — ${s.scheduled_date || ''}` }))} value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)} />
          <Select label="المجموعة (اختياري)" options={[{ value: '', label: 'جميع الطلاب' }, ...groups.map(g => ({ value: g.id, label: g.name }))]} value={selectedGroup} onChange={(e) => { setSelectedGroup(e.target.value); loadGroupStudents(e.target.value); }} />
          <div className="space-y-2">
            {records.length === 0 && <p className="text-sm text-[var(--color-text-tertiary)] text-center py-4">اختر جلسة ومجموعة</p>}
            {records.map((r, i) => (
              <div key={r.student_id} className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-surface)]">
                <span className="text-sm font-medium flex-1">{r.student_name}</span>
                <Select options={[{ value: 'present', label: 'حاضر' }, { value: 'absent', label: 'غائب' }, { value: 'late', label: 'متأخر' }, { value: 'excused', label: 'معذور' }]} value={r.status} onChange={(e) => {
                  const newRecords = [...records];
                  newRecords[i].status = e.target.value;
                  setRecords(newRecords);
                }} className="w-28" />
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
