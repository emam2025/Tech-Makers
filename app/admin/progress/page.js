'use client';

import { useEffect, useState, useCallback } from 'react';

export default function ProgressPage() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [events, setEvents] = useState([]);
  const [showDetail, setShowDetail] = useState(false);

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
        setSelectedStudent(data.progress);
        setEvents(data.events || []);
        setShowDetail(true);
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
      session_attended: 'text-green-600 bg-green-50',
      session_missed: 'text-error bg-error/10',
      task_submitted: 'text-primary bg-primary-fixed/20',
      task_graded: 'text-primary bg-primary-fixed/20',
      evaluation: 'text-secondary bg-secondary-fixed/20',
      level_up: 'text-secondary bg-secondary-fixed/20',
      payment: 'text-green-600 bg-green-50',
      other: 'text-on-surface-variant bg-surface-container',
    };
    return colors[type] || 'text-on-surface-variant bg-surface-container';
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

  const stats = (() => {
    const total = progress.length;
    const avgProgress = total
      ? Math.round(progress.reduce((s, p) => s + (p.overall_progress || 0), 0) / total)
      : 0;
    const lateStudents = progress.filter((p) => (p.overall_progress || 0) < 40);
    const activeToday = progress.filter((p) => {
      if (!p.last_active) return false;
      const d = new Date(p.last_active);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    }).length;
    return { total, avgProgress, lateCount: lateStudents.length, activeToday, lateStudents };
  })();

  const levelGroups = (() => {
    const groups = {};
    progress.forEach((p) => {
      const level = p.current_level || 'غير محدد';
      if (!groups[level]) groups[level] = { name: level, count: 0, totalProgress: 0 };
      groups[level].count++;
      groups[level].totalProgress += p.overall_progress || 0;
    });
    return Object.values(groups).map((g) => ({
      ...g,
      avgProgress: g.count ? Math.round(g.totalProgress / g.count) : 0,
    }));
  })();

  const maxLevelCount = Math.max(...levelGroups.map((l) => l.count), 1);

  const filteredProgress = progress.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.student?.full_name || '').toLowerCase().includes(q) ||
      (p.student?.track || '').toLowerCase().includes(q) ||
      (p.current_level || '').toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (avgProgress) => {
    if (avgProgress >= 80) return { text: 'نشط جداً', className: 'bg-green-100 text-green-700' };
    if (avgProgress >= 60) return { text: 'معدل طبيعي', className: 'bg-yellow-100 text-yellow-700' };
    return { text: 'متأخر', className: 'bg-error-container text-error' };
  };

  const getProgressColor = (val) => {
    if (val >= 80) return 'bg-green-500';
    if (val >= 60) return 'bg-secondary';
    return 'bg-error';
  };

  return (
    <div className="max-w-container-max mx-auto px-md py-lg space-y-gutter">
      {/* Summary Stats (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Total Students */}
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col gap-xs shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant font-label-md text-label-md">إجمالي الطلاب</span>
            <span className="material-symbols-outlined text-primary">groups</span>
          </div>
          <p className="font-headline-lg text-headline-lg text-primary">{stats.total.toLocaleString('ar-EG')}</p>
          <div className="flex items-center gap-xs text-xs text-green-600">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            <span>متابعة شاملة</span>
          </div>
        </div>

        {/* Average Achievement */}
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col gap-xs shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant font-label-md text-label-md">متوسط الإنجاز</span>
            <span className="material-symbols-outlined text-secondary">star</span>
          </div>
          <p className="font-headline-lg text-headline-lg text-primary">{stats.avgProgress}%</p>
          <div className="w-full bg-surface-variant h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-secondary h-full" style={{ width: `${stats.avgProgress}%` }} />
          </div>
        </div>

        {/* Late Students */}
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col gap-xs shadow-sm hover:shadow-md transition-all border-l-4 border-error">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant font-label-md text-label-md">طلاب متأخرون</span>
            <span className="material-symbols-outlined text-error">warning</span>
          </div>
          <p className="font-headline-lg text-headline-lg text-error">{stats.lateCount}</p>
          <span className="text-xs text-on-surface-variant">بحاجة لتدخل فوري</span>
        </div>

        {/* Daily Activity */}
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col gap-xs shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant font-label-md text-label-md">النشاط اليومي</span>
            <span className="material-symbols-outlined text-primary">insights</span>
          </div>
          <p className="font-headline-lg text-headline-lg text-primary">{stats.activeToday}</p>
          <span className="text-xs text-on-surface-variant">تسجيل نشاط اليوم</span>
        </div>
      </div>

      {/* Distribution & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Levels Distribution Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
          <div className="flex items-center justify-between mb-lg">
            <h3 className="font-headline-md text-headline-md text-primary">توزيع مستويات الطلاب</h3>
          </div>
          {levelGroups.length > 0 ? (
            <div className="relative h-64 w-full flex items-end justify-between gap-base px-lg">
              {levelGroups.slice(0, 6).map((level, i) => {
                const height = (level.count / maxLevelCount) * 100;
                const opacityValues = [20, 40, 60, 80, 90, 100];
                const opacity = opacityValues[i % opacityValues.length];
                return (
                  <div key={i} className="flex flex-col items-center gap-base flex-1">
                    <div
                      className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary/90 cursor-help relative group"
                      style={{ height: `${Math.max(height, 8)}%`, opacity: opacity / 100 }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface text-xs px-2 py-1 rounded whitespace-nowrap">
                        {level.count}
                      </div>
                    </div>
                    <span className="text-xs font-label-md text-center leading-tight">{level.name}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-on-surface-variant text-sm">
              {loading ? 'جاري التحميل...' : 'لا توجد بيانات كافية'}
            </div>
          )}
        </div>

        {/* Urgent Alerts / Late Students */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm border-t-4 border-error">
          <h3 className="font-headline-md text-headline-md text-error mb-base flex items-center gap-xs">
            <span className="material-symbols-outlined">notification_important</span>
            تنبيهات التأخر
          </h3>
          <p className="text-on-surface-variant text-sm mb-md">طلاب لم يكملوا المهام المطلوبة</p>
          <div className="space-y-sm max-h-[300px] overflow-y-auto custom-scrollbar pr-base">
            {stats.lateStudents.length > 0 ? (
              stats.lateStudents.slice(0, 5).map((s, i) => {
                const name = s.student?.full_name || 'طالب';
                const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('');
                return (
                  <div
                    key={i}
                    className="p-sm bg-error/5 rounded-lg flex items-center justify-between group hover:bg-error/10 transition-colors cursor-pointer"
                    onClick={() => openStudent(s.student_id)}
                  >
                    <div className="flex items-center gap-sm">
                      <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center text-error font-bold text-xs">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{name}</p>
                        <p className="text-xs text-on-surface-variant">
                          التقدم: {s.overall_progress || 0}% {s.current_level ? `- ${s.current_level}` : ''}
                        </p>
                      </div>
                    </div>
                    <button className="p-xs text-error opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-xl">send</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-4">لا يوجد متأخرون</p>
            )}
          </div>
          {stats.lateStudents.length > 5 && (
            <button
              className="w-full mt-md py-base text-primary font-bold text-sm border-t border-outline-variant hover:text-secondary-container transition-colors"
              onClick={() => setSearchQuery('')}
            >
              عرض جميع المتأخرين ({stats.lateCount})
            </button>
          )}
        </div>
      </div>

      {/* Detailed Analysis Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-md flex flex-wrap items-center justify-between gap-md border-b border-outline-variant">
          <h3 className="font-headline-md text-headline-md text-primary">تفاصيل تقدم المستويات</h3>
          <div className="flex gap-base flex-wrap">
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                className="pr-10 pl-4 py-2 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-sm w-64"
                placeholder="بحث عن طالب أو مستوى..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-lg text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] text-outline mb-sm block animate-spin">progress_activity</span>
              جاري تحميل البيانات...
            </div>
          ) : filteredProgress.length === 0 ? (
            <div className="p-lg text-center">
              <span className="material-symbols-outlined text-[64px] text-outline mb-sm block">school</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">لا توجد بيانات</h3>
              <p className="text-on-surface-variant text-sm">لم يتم العثور على نتائج مطابقة</p>
            </div>
          ) : (
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-surface-container/50">
                  <th className="px-md py-4 font-label-md text-on-surface-variant">الطالب</th>
                  <th className="px-md py-4 font-label-md text-on-surface-variant">المسار</th>
                  <th className="px-md py-4 font-label-md text-on-surface-variant">نسبة الإنجاز</th>
                  <th className="px-md py-4 font-label-md text-on-surface-variant">الحضور</th>
                  <th className="px-md py-4 font-label-md text-on-surface-variant">المهام</th>
                  <th className="px-md py-4 font-label-md text-on-surface-variant">المستوى</th>
                  <th className="px-md py-4 font-label-md text-on-surface-variant">الحالة</th>
                  <th className="px-md py-4 font-label-md text-on-surface-variant">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredProgress.map((row, i) => {
                  const progressVal = row.overall_progress || 0;
                  const attendanceVal = row.attendance_rate || 0;
                  const status = getStatusBadge(progressVal);
                  return (
                    <tr key={i} className="hover:bg-primary-fixed/10 transition-colors">
                      <td className="px-md py-4">
                        <div className="flex items-center gap-sm">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <span className="material-symbols-outlined">person</span>
                          </div>
                          <div>
                            <p className="font-bold text-primary">{row.student?.full_name || '-'}</p>
                            <p className="text-xs text-on-surface-variant">{row.student?.track || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-md py-4">
                        <span className="px-3 py-1 bg-primary-fixed/20 text-primary rounded-full text-xs font-bold">
                          {row.student?.track || '-'}
                        </span>
                      </td>
                      <td className="px-md py-4">
                        <div className="flex items-center gap-sm">
                          <div className="flex-1 bg-surface-variant h-2 rounded-full overflow-hidden min-w-[80px]">
                            <div
                              className={`h-full ${getProgressColor(progressVal)} rounded-full transition-all`}
                              style={{ width: `${progressVal}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-on-surface">{progressVal}%</span>
                        </div>
                      </td>
                      <td className="px-md py-4 text-sm font-bold text-primary">{attendanceVal}%</td>
                      <td className="px-md py-4 text-sm">{row.tasks_completed || 0}/{row.tasks_total || 0}</td>
                      <td className="px-md py-4">
                        <span className="px-3 py-1 bg-primary-fixed/20 text-primary rounded-full text-xs font-bold">
                          {row.current_level || '-'}
                        </span>
                      </td>
                      <td className="px-md py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.className}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-md py-4">
                        <button
                          className="p-xs text-primary-container hover:bg-primary/10 rounded"
                          onClick={() => openStudent(row.student_id)}
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Student Detail Drawer */}
      {showDetail && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDetail(false)} />
          <div className="relative bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="p-md border-b border-outline-variant flex items-center justify-between sticky top-0 bg-surface-container-lowest z-10">
              <h3 className="font-headline-md text-headline-md text-primary">تفاصيل التقدم</h3>
              <button
                className="p-sm hover:bg-surface-container-high rounded-full transition-colors"
                onClick={() => setShowDetail(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-md space-y-md">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col gap-xs shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant font-label-md text-label-md">التقدم الكلي</span>
                    <span className="material-symbols-outlined text-primary">trending_up</span>
                  </div>
                  <p className="font-headline-lg text-headline-lg text-primary">{selectedStudent.overall_progress || 0}%</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col gap-xs shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant font-label-md text-label-md">نسبة الحضور</span>
                    <span className="material-symbols-outlined text-green-600">fact_check</span>
                  </div>
                  <p className="font-headline-lg text-headline-lg text-green-600">{selectedStudent.attendance_rate || 0}%</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col gap-xs shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant font-label-md text-label-md">مهام مكتملة</span>
                    <span className="material-symbols-outlined text-secondary">assignment</span>
                  </div>
                  <p className="font-headline-lg text-headline-lg text-secondary">{selectedStudent.completed_tasks || 0}</p>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col gap-xs shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant font-label-md text-label-md">المستوى الحالي</span>
                    <span className="material-symbols-outlined text-primary">school</span>
                  </div>
                  <p className="font-headline-lg text-headline-lg text-primary">{selectedStudent.current_level || '-'}</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm">
                <h4 className="font-headline-md text-headline-md text-on-surface mb-md">تفاصيل التقدم</h4>
                <div className="space-y-md">
                  {[
                    { label: 'الحضور', value: selectedStudent.attendance_rate || 0, color: 'bg-green-500' },
                    { label: 'إنجاز المهام', value: selectedStudent.task_completion_rate || 0, color: 'bg-primary' },
                    { label: 'متوسط الدرجات', value: selectedStudent.average_score || 0, color: 'bg-secondary' },
                    { label: 'تقدم المستوى', value: selectedStudent.level_progress || 0, color: 'bg-primary' },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-on-surface-variant">{bar.label}</span>
                        <span className="font-medium text-on-surface">{bar.value}%</span>
                      </div>
                      <div className="h-2 bg-surface-variant rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${bar.color}`}
                          style={{ width: `${bar.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-sm">
                <h4 className="font-headline-md text-headline-md text-on-surface mb-md">سجل الأحداث</h4>
                <div className="relative">
                  <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-outline-variant" />
                  <div className="space-y-md">
                    {events.map((e, i) => (
                      <div key={i} className="flex items-start gap-4 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${eventColor(e.event_type)}`}>
                          <span className="material-symbols-outlined text-[16px]">{eventIcon(e.event_type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-on-surface">{eventLabel(e.event_type)}</span>
                            {e.score !== null && e.score !== undefined && (
                              <span className="px-2 py-0.5 bg-primary-fixed/20 text-primary rounded text-[10px] font-bold">
                                {e.score} نقطة
                              </span>
                            )}
                          </div>
                          {e.event_description && (
                            <p className="text-xs text-on-surface-variant">{e.event_description}</p>
                          )}
                          <p className="text-[10px] text-on-surface-variant mt-0.5">
                            {e.created_at ? new Date(e.created_at).toLocaleString('ar-EG') : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                    {events.length === 0 && (
                      <p className="text-sm text-on-surface-variant text-center py-4">لا توجد أحداث بعد</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
