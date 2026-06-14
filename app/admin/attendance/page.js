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
  const [loading, setLoading] = useState(true);
  const [filterSession, setFilterSession] = useState('');
  const [drawer, setDrawer] = useState(null);
  const [selectedSession, setSelectedSession] = useState('');
  const [records, setRecords] = useState([]);
  const [saving, setSaving] = useState(false);

  const loadAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterSession) params.set('session_id', filterSession);
      const res = await fetch(`/api/admin/attendance?${params}`);
      if (res.ok) {
        const data = await res.json();
        setAttendance(data.attendance || []);
      }
    } finally {
      setLoading(false);
    }
  }, [filterSession]);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/sessions').then(r => r.ok ? r.json() : {}),
      fetch('/api/admin/students').then(r => r.ok ? r.json() : {}),
    ]).then(([s, st]) => {
      setSessions(s.sessions || []);
      setStudents(st.students || []);
    });
  }, []);

  useEffect(() => { loadAttendance(); }, [loadAttendance]);

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

  const columns = [
    { key: 'student', label: 'الطالب', render: (r) => <span className="font-medium">{r.student?.full_name || '-'}</span> },
    { key: 'session', label: 'الجلسة', render: (r) => r.session?.title || '-' },
    { key: 'status', label: 'الحالة', render: (r) => (
      <Badge variant={r.status === 'present' ? 'success' : r.status === 'absent' ? 'danger' : 'warning'}>
        {r.status === 'present' ? 'حاضر' : r.status === 'absent' ? 'غائب' : 'متأخر'}
      </Badge>
    )},
    { key: 'notes', label: 'ملاحظات' },
    { key: 'created_at', label: 'التاريخ', render: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString('ar-EG') : '-' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>الحضور والغياب</h1><p>تسجيل ومتابعة حضور الطلاب</p></div>
        <Button icon="fact_check" onClick={() => {
          setSelectedSession('');
          setRecords(students.map(s => ({ student_id: s.id, student_name: s.full_name, status: 'present', notes: '' })));
          setDrawer('edit');
        }}>تسجيل حضور</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Select options={[{ value: '', label: 'جميع الجلسات' }, ...sessions.map(s => ({ value: s.id, label: `${s.title} — ${s.scheduled_date || ''}` }))]} value={filterSession} onChange={(e) => setFilterSession(e.target.value)} className="w-full sm:w-64" />
      </div>

      <DataTable columns={columns} data={attendance} loading={loading} emptyText="لا توجد سجلات حضور" />

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="تسجيل الحضور"
        footer={<div className="flex gap-3"><Button onClick={handleSave} loading={saving}>حفظ</Button><Button variant="outlined" onClick={() => setDrawer(null)}>إلغاء</Button></div>}>
        <div className="space-y-4">
          <Select label="الجلسة" options={sessions.map(s => ({ value: s.id, label: `${s.title} — ${s.scheduled_date || ''}` }))} value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)} />
          <div className="space-y-2">
            {records.map((r, i) => (
              <div key={r.student_id} className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-surface)]">
                <span className="text-sm font-medium flex-1">{r.student_name}</span>
                <Select options={[{ value: 'present', label: 'حاضر' }, { value: 'absent', label: 'غائب' }, { value: 'late', label: 'متأخر' }]} value={r.status} onChange={(e) => {
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
