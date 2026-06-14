'use client';

import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import Drawer from '../../../components/ui/Drawer';
import Button from '../../../components/ui/Button';

export default function ProgressPage() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(null);
  const [studentProgress, setStudentProgress] = useState(null);
  const [events, setEvents] = useState([]);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/progress/overview');
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProgress(); }, [loadProgress]);

  const openStudent = async (studentId) => {
    try {
      const res = await fetch(`/api/admin/progress/${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setStudentProgress(data.progress);
        setEvents(data.events || []);
        setDrawer('detail');
      }
    } catch (err) {}
  };

  const columns = [
    { key: 'student', label: 'الطالب', render: (r) => <span className="font-medium">{r.student?.full_name || '-'}</span> },
    { key: 'track', label: 'المسار', render: (r) => <Badge>{r.student?.track || '-'}</Badge> },
    { key: 'overall_progress', label: 'التقدم', render: (r) => {
      const val = r.overall_progress || 0;
      return (
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-[var(--color-surface-dim)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${val}%` }} />
          </div>
          <span className="text-xs font-medium">{val}%</span>
        </div>
      );
    }},
    { key: 'attendance_rate', label: 'الحضور', render: (r) => `${r.attendance_rate || 0}%` },
    { key: 'tasks_completed', label: 'المهام', render: (r) => `${r.tasks_completed || 0}/${r.tasks_total || 0}` },
    { key: 'level', label: 'المستوى', render: (r) => <Badge variant="info">{r.current_level || '-'}</Badge> },
  ];

  const actions = [
    { icon: 'visibility', label: 'تفاصيل', onClick: (r) => openStudent(r.student_id) },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div><h1>تقدم الطلاب</h1><p>متابعة أداء وتقدم الطلاب</p></div>
      </div>

      <DataTable columns={columns} data={progress} loading={loading} actions={actions} emptyText="لا توجد بيانات تقدم" />

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="تفاصيل التقدم" fullScreen>
        {studentProgress && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-admin p-4 text-center">
                <div className="text-2xl font-bold text-[var(--color-primary)]">{studentProgress.overall_progress || 0}%</div>
                <div className="text-xs text-[var(--color-text-tertiary)]">التقدم الكلي</div>
              </div>
              <div className="card-admin p-4 text-center">
                <div className="text-2xl font-bold text-[var(--color-success)]">{studentProgress.attendance_rate || 0}%</div>
                <div className="text-xs text-[var(--color-text-tertiary)]">نسبة الحضور</div>
              </div>
              <div className="card-admin p-4 text-center">
                <div className="text-2xl font-bold text-[var(--color-secondary)]">{studentProgress.tasks_completed || 0}</div>
                <div className="text-xs text-[var(--color-text-tertiary)]">مهام مكتملة</div>
              </div>
              <div className="card-admin p-4 text-center">
                <div className="text-2xl font-bold text-[var(--color-info)]">{studentProgress.current_level || '-'}</div>
                <div className="text-xs text-[var(--color-text-tertiary)]">المستوى الحالي</div>
              </div>
            </div>

            <div className="card-admin p-5">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-3">سجل الأحداث</h3>
              <div className="space-y-2">
                {events.map((e, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[14px] text-[var(--color-primary)]">
                        {e.event_type === 'attendance' ? 'fact_check' : e.event_type === 'task' ? 'assignment' : 'event'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--color-text-primary)]">{e.description || e.event_type}</p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">{e.created_at ? new Date(e.created_at).toLocaleDateString('ar-EG') : ''}</p>
                    </div>
                  </div>
                ))}
                {events.length === 0 && <p className="text-sm text-[var(--color-text-tertiary)] text-center py-4">لا توجد أحداث</p>}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
