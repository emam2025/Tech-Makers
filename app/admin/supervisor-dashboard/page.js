'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SupervisorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [branches, setBranches] = useState([]);
  const [groups, setGroups] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [authRes, branchesRes, groupsRes, trainersRes, studentsRes, sessionsRes] = await Promise.all([
          fetch('/api/admin/auth'),
          fetch('/api/admin/branches').catch(() => ({ ok: false })),
          fetch('/api/admin/groups'),
          fetch('/api/admin/trainers'),
          fetch('/api/admin/students'),
          fetch('/api/admin/sessions'),
        ]);
        if (!authRes.ok) { router.push('/login'); return; }
        const authData = await authRes.json();
        setUser(authData.user);
        setBranches((branchesRes.ok ? await branchesRes.json() : {}).branches || []);
        setGroups((groupsRes.ok ? await groupsRes.json() : {}).groups || []);
        setTrainers((trainersRes.ok ? await trainersRes.json() : {}).trainers || []);
        setStudents((studentsRes.ok ? await studentsRes.json() : {}).students || []);
        setSessions((sessionsRes.ok ? await sessionsRes.json() : {}).sessions || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-md py-lg mb-24">
        <div className="animate-pulse space-y-xs">
          <div className="h-40 bg-surface-container rounded-xl" />
          <div className="grid grid-cols-3 gap-base">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-surface-container rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const activeGroups = groups.filter(g => g.status === 'active').length;
  const activeTrainers = trainers.filter(t => t.status === 'active').length;
  const upcomingSessions = sessions.filter(s => s.status === 'upcoming').length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;

  const kpis = [
    { icon: 'analytics', label: 'الفروع', value: branches.length, badge: `${branches.length} فرع`, badgeBg: 'bg-primary-fixed/20', badgeText: 'text-primary' },
    { icon: 'person_check', label: 'المجموعات النشطة', value: activeGroups, badge: 'نشط', badgeBg: 'bg-green-100', badgeText: 'text-green-600' },
    { icon: 'groups', label: 'المدربين النشطين', value: activeTrainers, badge: `${activeTrainers} مدرب`, badgeBg: 'bg-secondary-container/30', badgeText: 'text-secondary' },
    { icon: 'school', label: 'إجمالي الطلاب', value: students.length, badge: `${students.length} طالب`, badgeBg: 'bg-tertiary-fixed/30', badgeText: 'text-tertiary' },
  ];

  return (
    <div className="max-w-container-max mx-auto px-md py-lg mb-24 space-y-md">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">لوحة تحكم المشرف</h2>
          <p className="font-body-md text-on-surface-variant">
            مرحباً {user?.full_name || 'المشرف'}، إليك ملخص أداء الفروع والمدربين لهذا الأسبوع.
          </p>
        </div>
        <div className="flex gap-sm">
          <Link
            href="/admin/trainers"
            className="px-md py-sm border border-primary text-primary font-label-md rounded hover:bg-surface-container-low transition-colors flex items-center gap-xs"
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            إضافة مدرب
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest p-md rounded-lg border border-outline-variant flex flex-col gap-xs shadow-sm">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary bg-primary-fixed p-2 rounded">{kpi.icon}</span>
              <span className={`font-label-md px-xs py-0.5 rounded ${kpi.badgeBg} ${kpi.badgeText}`}>{kpi.badge}</span>
            </div>
            <span className="font-body-sm text-on-surface-variant mt-sm">{kpi.label}</span>
            <h3 className="font-headline-md text-headline-md text-primary">{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Data Section: Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Sessions Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h4 className="font-label-md text-primary">نظرة على الجلسات</h4>
            <Link href="/admin/sessions" className="text-primary font-label-md cursor-pointer hover:underline">عرض الكل</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant">
                <tr>
                  <th className="p-md font-label-md">الجلسة</th>
                  <th className="p-md font-label-md">المجموعة</th>
                  <th className="p-md font-label-md">المدرب</th>
                  <th className="p-md font-label-md">التاريخ</th>
                  <th className="p-md font-label-md">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-md text-center text-on-surface-variant">لا توجد جلسات</td>
                  </tr>
                ) : sessions.slice(0, 5).map(session => (
                  <tr key={session.id} className="hover:bg-primary-fixed/10 transition-colors">
                    <td className="p-md flex items-center gap-sm">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm">event</span>
                      </div>
                      <span className="font-body-md text-primary">{session.title || 'جلسة'}</span>
                    </td>
                    <td className="p-md font-body-sm">{session.group?.name || '—'}</td>
                    <td className="p-md font-body-sm">{session.trainer?.full_name || '—'}</td>
                    <td className="p-md font-body-sm">{session.date || '—'}</td>
                    <td className="p-md">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${
                        session.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                        session.status === 'upcoming' ? 'bg-primary-fixed/10 text-primary border-primary/20' :
                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
                        {session.status === 'completed' ? 'مكتملة' : session.status === 'upcoming' ? 'قادمة' : session.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Support & Branches */}
        <div className="space-y-md">
          {/* Groups Card */}
          <div className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-md">
            <div className="flex justify-between items-center mb-md">
              <h4 className="font-label-md text-primary">المجموعات</h4>
              <Link href="/admin/groups" className="text-primary font-label-md cursor-pointer hover:underline">عرض الكل</Link>
            </div>
            <div className="space-y-sm">
              {groups.length === 0 ? (
                <div className="text-center py-4 text-on-surface-variant text-sm">لا توجد مجموعات</div>
              ) : groups.slice(0, 4).map(group => {
                const count = Array.isArray(group.student_count) ? group.student_count[0]?.count : (group.student_count || 0);
                return (
                  <div key={group.id} className="p-sm bg-surface-container rounded-lg border border-outline-variant cursor-pointer hover:border-primary transition-colors">
                    <p className="font-label-md text-primary line-clamp-1">{group.name}</p>
                    <div className="flex justify-between items-center mt-xs">
                      <span className="text-[10px] text-on-surface-variant">{count} طالب | {group.trainer?.full_name || 'بدون مدرب'}</span>
                      <span className={`text-[10px] font-bold ${group.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {group.status === 'active' ? 'نشطة' : 'معلقة'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Branch Map/Status Card */}
          <div className="bg-surface-container-lowest border border-outline-variant bg-primary-container rounded-lg shadow-sm p-md text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-label-md text-secondary-fixed">حالة الفروع الجغرافية</h4>
              <div className="mt-md space-y-md">
                {branches.length === 0 ? (
                  <div className="text-center py-4 text-on-primary-container text-sm">لا توجد فروع</div>
                ) : branches.slice(0, 4).map(branch => (
                  <div key={branch.id} className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-secondary-fixed">location_on</span>
                    <div>
                      <p className="font-label-md">{branch.name}</p>
                      <p className="text-[10px] text-on-primary-container">{branch.city || 'فرع'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Attendance & Reporting Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
        {/* Session Status Chart */}
        <div className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-md">
          <h4 className="font-label-md text-primary mb-md">نظرة شاملة على الجلسات</h4>
          <div className="h-64 flex items-end gap-md px-md">
            {[
              { label: 'المكتملة', count: completedSessions, color: 'bg-primary' },
              { label: 'القادمة', count: upcomingSessions, color: 'bg-primary-fixed/40' },
              { label: 'قيد البدء', count: sessions.filter(s => s.status === 'in_progress').length, color: 'bg-secondary' },
              { label: 'الملغاة', count: sessions.filter(s => s.status === 'cancelled').length, color: 'bg-outline' },
              { label: 'الإجمالي', count: sessions.length, color: 'bg-tertiary' },
            ].map((bar, i) => {
              const maxCount = Math.max(sessions.length, 1);
              const heightPct = Math.max((bar.count / maxCount) * 100, 5);
              return (
                <div key={i} className="flex-1 flex flex-col items-center relative group">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {bar.count}
                  </div>
                  <div className={`w-full ${bar.color} rounded-t transition-all`} style={{ height: `${heightPct}%` }}></div>
                  <span className="text-[10px] text-on-surface-variant font-bold mt-2">{bar.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track Distribution */}
        <div className="bg-surface-container-lowest border border-outline-variant bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm p-md flex flex-col justify-between">
          <div>
            <h4 className="font-label-md text-primary mb-xs">توزيع المجموعات حسب الحالات</h4>
            <p className="font-body-sm text-on-surface-variant mb-md">إحصائيات المجموعات النشطة والمعلقة.</p>
            <div className="space-y-md">
              {[
                { label: 'المجموعات النشطة', pct: groups.length ? Math.round((activeGroups / groups.length) * 100) : 0, color: 'bg-primary' },
                { label: 'المجموعات المعلقة', pct: groups.length ? Math.round(((groups.length - activeGroups) / groups.length) * 100) : 0, color: 'bg-secondary' },
                { label: 'المدربين النشطين', pct: trainers.length ? Math.round((activeTrainers / trainers.length) * 100) : 0, color: 'bg-outline' },
              ].map((item, i) => (
                <div key={i} className="space-y-xs">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>{item.label}</span>
                    <span>{item.pct}%</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full transition-all`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/admin/sessions"
            className="w-full py-sm mt-md bg-surface-container text-primary font-label-md rounded border border-outline-variant hover:bg-surface-variant transition-colors text-center block"
          >
            عرض التحليل التفصيلي
          </Link>
        </div>
      </div>
    </div>
  );
}
