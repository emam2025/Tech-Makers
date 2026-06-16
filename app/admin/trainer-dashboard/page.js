'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TrainerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [authRes, groupsRes, sessionsRes, tasksRes, studentsRes] = await Promise.all([
          fetch('/api/admin/auth'),
          fetch('/api/admin/groups'),
          fetch('/api/admin/sessions'),
          fetch('/api/admin/tasks'),
          fetch('/api/admin/students'),
        ]);
        if (!authRes.ok) { router.push('/login'); return; }
        const authData = await authRes.json();
        setUser(authData.user);
        setGroups((groupsRes.ok ? await groupsRes.json() : {}).groups || []);
        setSessions((sessionsRes.ok ? await sessionsRes.json() : {}).sessions || []);
        setTasks((tasksRes.ok ? await tasksRes.json() : {}).tasks || []);
        setStudents((studentsRes.ok ? await studentsRes.json() : {}).students || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-md py-lg mb-24">
        <div className="animate-pulse space-y-md">
          <div className="h-40 bg-surface-container rounded-xl" />
          <div className="grid grid-cols-3 gap-md">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-surface-container rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const now = new Date();
  const todaySessions = sessions.filter(s => {
    if (!s.scheduled_date) return false;
    const d = new Date(s.scheduled_date);
    return d.toDateString() === now.toDateString();
  });
  const upcomingSessions = sessions.filter(s => s.status === 'upcoming').slice(0, 5);
  const pendingTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'closed');
  const totalStudents = students.length;
  const pendingGrading = tasks.reduce((sum, t) => {
    const count = Array.isArray(t.submission_count) ? t.submission_count[0]?.count : (t.submission_count || 0);
    return sum + count;
  }, 0);

  const nextSession = upcomingSessions[0];
  const nextSessionTime = nextSession?.scheduled_date ? new Date(nextSession.scheduled_date) : null;
  const timeUntilNext = nextSessionTime ? Math.max(0, Math.floor((nextSessionTime - now) / 60000)) : 0;

  return (
    <div className="max-w-container-max mx-auto px-md py-lg mb-24 space-y-lg">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-lg">
        <div className="md:col-span-2 relative overflow-hidden rounded-xl bg-primary text-on-primary p-md flex flex-col justify-between shadow-lg">
          <div className="relative z-10">
            <h2 className="font-headline-md text-headline-md mb-xs">الجلسة القادمة: {nextSession?.title || 'لا توجد جلسات'}</h2>
            <p className="text-primary-fixed opacity-80 text-body-sm mb-sm">
              {nextSessionTime
                ? `تبدأ خلال ${timeUntilNext > 60 ? Math.floor(timeUntilNext / 60) + ' ساعة' : timeUntilNext + ' دقيقة'}`
                : 'لا توجد جلسات قادمة'}
            </p>
          </div>
          {nextSession && (
            <Link href={`/admin/groups/${nextSession.group_id}/room`} className="relative z-10 w-full md:w-fit bg-secondary-fixed text-on-secondary-fixed px-md py-sm rounded-lg font-bold hover:scale-105 transition-transform flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined">assignment_turned_in</span>
              تحضير الطلاب الآن
            </Link>
          )}
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col justify-center">
          <div className="flex items-center gap-xs mb-xs text-primary">
            <span className="material-symbols-outlined">group</span>
            <span className="font-label-md text-label-md">إجمالي الطلاب</span>
          </div>
          <h3 className="font-headline-xl text-headline-xl text-primary">{totalStudents}</h3>
          <p className="text-body-sm text-success flex items-center gap-1 mt-xs">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            نشط حالياً
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col justify-center">
          <div className="flex items-center gap-xs mb-xs text-secondary">
            <span className="material-symbols-outlined">pending_actions</span>
            <span className="font-label-md text-label-md">مهام قيد التصحيح</span>
          </div>
          <h3 className="font-headline-xl text-headline-xl text-secondary">{pendingGrading}</h3>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-xs">
            <div className="bg-secondary h-1.5 rounded-full" style={{ width: `${pendingGrading > 0 ? 65 : 0}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-md">
          {/* Today's Schedule */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            <div className="flex items-center justify-between mb-md">
              <h2 className="font-headline-md text-headline-md text-primary">جدول حصص اليوم</h2>
              <Link href="/admin/sessions" className="text-primary font-label-md hover:underline">عرض الجدول الكامل</Link>
            </div>
            <div className="space-y-xs">
              {todaySessions.length === 0 ? (
                <div className="text-center py-lg text-on-surface-variant">
                  <span className="material-symbols-outlined text-[40px] block mb-xs">event_busy</span>
                  لا توجد حصص مقررة اليوم
                </div>
              ) : todaySessions.map(session => (
                <div key={session.id} className="group flex items-center gap-md p-md border border-transparent hover:border-outline-variant hover:bg-surface-container-low rounded-lg transition-all">
                  <div className="flex flex-col items-center justify-center bg-surface-container-high rounded-lg min-w-[64px] py-xs">
                    <span className="font-bold text-primary">{new Date(session.scheduled_date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-xs text-on-surface-variant">{new Date(session.scheduled_date).getHours() < 12 ? 'صباحاً' : 'مساءً'}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-primary">{session.title}</h4>
                    <p className="text-body-sm text-on-surface-variant">{session.group?.name || 'مجموعة'}</p>
                  </div>
                  <span className={`hidden md:flex items-center gap-1 px-base py-xs rounded-full text-xs font-bold ${
                    session.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${session.status === 'completed' ? 'bg-green-500' : 'bg-surface-container'}`} />
                    {session.status === 'completed' ? 'مكتملة' : 'مجدولة'}
                  </span>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors cursor-pointer">chevron_left</span>
                </div>
              ))}
            </div>
          </section>

          {/* Groups List */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            <div className="flex items-center justify-between mb-md">
              <h2 className="font-headline-md text-headline-md text-primary">المجموعات المسؤولة عنها</h2>
              <Link href="/admin/groups" className="bg-primary-fixed-dim text-on-primary-fixed-variant px-sm py-xs rounded-lg text-xs font-bold">إدارة المجموعات</Link>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {groups.length === 0 ? (
                <div className="col-span-2 text-center py-lg text-on-surface-variant">لا توجد مجموعات محددة</div>
              ) : groups.slice(0, 4).map(group => {
                const count = Array.isArray(group.student_count) ? group.student_count[0]?.count : (group.student_count || 0);
                const colors = ['bg-primary-fixed', 'bg-secondary-fixed', 'bg-tertiary-fixed'];
                const avatars = Array.from({ length: Math.min(3, count) }, (_, i) => i);
                return (
                  <div key={group.id} className="p-md rounded-xl border border-outline-variant hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-sm">
                      <div>
                        <h4 className="font-bold text-primary">{group.name}</h4>
                        <p className="text-xs text-on-surface-variant">{count} طالب</p>
                      </div>
                      <span className="material-symbols-outlined text-secondary-fixed-dim">stars</span>
                    </div>
                    {avatars.length > 0 && (
                      <div className="flex -space-x-2 space-x-reverse mb-base">
                        {avatars.map(i => (
                          <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${colors[i]} flex items-center justify-center text-[10px] font-bold`}>
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                        {count > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-[10px] font-bold">
                            +{count - 3}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs pt-base border-t border-outline-variant">
                      <span className="text-on-surface-variant">نسبة الحضور: {group.attendance_rate || '—'}%</span>
                      <Link href={`/admin/groups/${group.id}/room`} className="text-primary font-bold cursor-pointer">التفاصيل</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Side Alerts */}
        <div className="space-y-md">
          {/* Grading Alerts */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="bg-secondary-fixed p-base flex items-center gap-base">
              <span className="material-symbols-outlined text-on-secondary-fixed">priority_high</span>
              <span className="font-bold text-on-secondary-fixed">تنبيهات التصحيح</span>
            </div>
            <div className="p-md divide-y divide-outline-variant">
              {pendingGrading > 0 ? (
                <>
                  <div className="py-sm first:pt-0">
                    <p className="text-primary font-bold text-sm">تسليمات بانتظار التصحيح</p>
                    <p className="text-body-sm text-on-surface-variant mb-base">هناك {pendingGrading} تسليمات بانتظار المراجعة</p>
                    <Link href="/admin/tasks" className="w-full text-center py-xs bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors block">
                      بدء التصحيح
                    </Link>
                  </div>
                  <div className="py-sm last:pb-0">
                    <p className="text-primary font-bold text-sm">مراجعات الدرجات</p>
                    <p className="text-body-sm text-on-surface-variant">طلاب يطلبون مراجعة درجاتهم</p>
                    <div className="flex gap-base mt-base">
                      <Link href="/admin/evaluations" className="flex-1 text-center py-xs border border-primary text-primary rounded-lg text-xs font-bold">المراجعة</Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-sm text-center text-on-surface-variant text-body-sm">لا توجد تسليمات بانتظار التصحيح</div>
              )}
            </div>
          </div>

          {/* Attendance Chart */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            <h3 className="font-bold text-primary mb-md">معدل الحضور الأسبوعي</h3>
            <div className="flex items-end justify-between h-32 gap-xs px-xs">
              {[60, 45, 85, 70, 95].map((h, i) => (
                <div key={i} className={`w-full rounded-t-sm relative group ${i === 2 ? 'bg-primary' : i === 4 ? 'bg-secondary' : 'bg-surface-container-high'}`} style={{ height: `${h}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{h}%</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant mt-base border-t border-outline-variant pt-base">
              <span>الأحد</span><span>الاثنين</span><span>الثلاثاء</span><span>الأربعاء</span><span>الخميس</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
            <h3 className="font-bold text-primary mb-sm">روابط سريعة</h3>
            <div className="space-y-xs">
              <Link href="/admin/sessions" className="flex items-center gap-xs p-xs rounded-lg hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-primary">event</span>
                <span className="font-label-md text-label-md">الجلسات</span>
              </Link>
              <Link href="/admin/tasks" className="flex items-center gap-xs p-xs rounded-lg hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-primary">assignment</span>
                <span className="font-label-md text-label-md">المهام</span>
              </Link>
              <Link href="/admin/attendance" className="flex items-center gap-xs p-xs rounded-lg hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-primary">event_available</span>
                <span className="font-label-md text-label-md">الحضور</span>
              </Link>
              <Link href="/admin/profile" className="flex items-center gap-xs p-xs rounded-lg hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-primary">account_circle</span>
                <span className="font-label-md text-label-md">الملف الشخصي</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <Link href="/admin/attendance" className="fixed bottom-24 left-md lg:bottom-md lg:left-md bg-secondary text-on-secondary w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group">
        <span className="material-symbols-outlined">how_to_reg</span>
        <span className="absolute right-full mr-sm bg-primary text-white text-xs px-base py-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden lg:block">
          تحضير سريع
        </span>
      </Link>
    </div>
  );
}
