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
      const res = await fetch('/api/admin/progress');
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
      const res = await fetch(`/api/admin/progress?student_id=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setStudentProgress(data.progress);
        setEvents(data.events || []);
        setDrawer('detail');
      }
    } catch (err) {}
  };

  const eventIcon = (type) => {
    const icons = {
      session_attended: 'fact_check',
      session_missed: 'event_busy',
      task_submitted: 'assignment',
      task_graded: 'grading',
      evaluation: 'assessment',
      level_up: 'trending_up',
      payment: 'payments',
      other: 'event',
    };
    return icons[type] || 'event';
  };

  const eventColor = (type) => {
    const colors = {
      session_attended: 'var(--color-success)',
      session_missed: 'var(--color-danger)',
      task_submitted: 'var(--color-info)',
      task_graded: 'var(--color-primary)',
      evaluation: 'var(--color-secondary)',
      level_up: 'var(--color-warning)',
      payment: 'var(--color-success)',
      other: 'var(--color-text-tertiary)',
    };
    return colors[type] || 'var(--color-text-tertiary)';
  };

  const eventLabel = (type) => {
    const labels = {
      session_attended: 'حضر جلسة',
      session_missed: 'غاب عن جلسة',
      task_submitted: 'سلّم مهمة',
      task_graded: 'تم التصحيح',
      evaluation: 'تقييم',
      level_up: 'ارتقاء مستوى',
      payment: 'دفعة',
      other: 'حدث آخر',
    };
    return labels[type] || type;
  };

  const columns = [
    { key: 'student', label: 'الطالب', render: (r) => <span className="font-medium">{r.student?.full_name || '-'}</span> },
    { key: 'track', label: 'المسار', render: (r) => <Badge>{r.student?.track || '-'}</Badge> },
    { key: 'overall_progress', label: 'التقدم', render: (r) => {
      const val = r.overall_progress || 0;
      return (
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-[var(--color-surface-dim)] rounded-full overflow-hidden">
            <div className="h-full bg-[var(--color-primary)] rounded-full transition-all" style={{ width: `${val}%` }} />
          </div>
          <span className="text-xs font-medium">{val}%</span>
        </div>
      );
    }},
    { key: 'attendance_rate', label: 'الحضور', render: (r) => {
      const val = r.attendance_rate || 0;
      const color = val >= 80 ? 'var(--color-success)' : val >= 60 ? 'var(--color-warning)' : 'var(--color-danger)';
      return <span style={{ color, fontWeight: 600 }}>{val}%</span>;
    }},
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

      <Drawer isOpen={!!drawer} onClose={() => setDrawer(null)} title="تفاصيل التقدم" size="lg"
        footer={<Button variant="outlined" onClick={() => setDrawer(null)}>إغلاق</Button>}>
        {studentProgress && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="card-admin p-4 text-center">
                <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{studentProgress.overall_progress || 0}%</div>
                <div className="text-[11px] text-[var(--color-text-tertiary)]">التقدم الكلي</div>
              </div>
              <div className="card-admin p-4 text-center">
                <div className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>{studentProgress.attendance_rate || 0}%</div>
                <div className="text-[11px] text-[var(--color-text-tertiary)]">نسبة الحضور</div>
              </div>
              <div className="card-admin p-4 text-center">
                <div className="text-2xl font-bold" style={{ color: 'var(--color-secondary)' }}>{studentProgress.completed_tasks || 0}</div>
                <div className="text-[11px] text-[var(--color-text-tertiary)]">مهام مكتملة</div>
              </div>
              <div className="card-admin p-4 text-center">
                <div className="text-2xl font-bold" style={{ color: 'var(--color-info)' }}>{studentProgress.current_level || '-'}</div>
                <div className="text-[11px] text-[var(--color-text-tertiary)]">المستوى الحالي</div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="card-admin p-5">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">تفاصيل التقدم</h3>
              <div className="space-y-4">
                {[
                  { label: 'الحضور', value: studentProgress.attendance_rate || 0, color: 'var(--color-success)' },
                  { label: 'إنجاز المهام', value: studentProgress.task_completion_rate || 0, color: 'var(--color-primary)' },
                  { label: 'متوسط الدرجات', value: studentProgress.average_score || 0, color: 'var(--color-secondary)' },
                  { label: 'تقدم المستوى', value: studentProgress.level_progress || 0, color: 'var(--color-info)' },
                ].map(bar => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--color-text-secondary)]">{bar.label}</span>
                      <span className="font-medium text-[var(--color-text-primary)]">{bar.value}%</span>
                    </div>
                    <div className="h-2 bg-[var(--color-surface-dim)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${bar.value}%`, background: bar.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="card-admin p-5">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">سجل الأحداث</h3>
              <div className="relative">
                <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-[var(--color-border-light)]" />
                <div className="space-y-4">
                  {events.map((e, i) => {
                    const color = eventColor(e.event_type);
                    return (
                      <div key={i} className="flex items-start gap-4 relative">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10" style={{ background: `${color}20` }}>
                          <span className="material-symbols-outlined text-[16px]" style={{ color }}>{eventIcon(e.event_type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-[var(--color-text-primary)]">{eventLabel(e.event_type)}</span>
                            {e.score !== null && e.score !== undefined && (
                              <Badge variant="info">{e.score} نقطة</Badge>
                            )}
                          </div>
                          {e.event_description && (
                            <p className="text-xs text-[var(--color-text-secondary)]">{e.event_description}</p>
                          )}
                          <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
                            {e.created_at ? new Date(e.created_at).toLocaleString('ar-EG') : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {events.length === 0 && (
                    <p className="text-sm text-[var(--color-text-tertiary)] text-center py-4">لا توجد أحداث بعد</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
