'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KPICard } from '../../components/ui/Card';
import { KPIRowSkeleton } from '../../components/ui/Skeleton';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [authRes, studentsRes, teamRes, codesRes, groupsRes, sessionsRes] = await Promise.all([
          fetch('/api/admin/auth'),
          fetch('/api/admin/students'),
          fetch('/api/admin/team'),
          fetch('/api/admin/test-codes'),
          fetch('/api/admin/groups').catch(() => ({ ok: false })),
          fetch('/api/admin/sessions').catch(() => ({ ok: false })),
        ]);

        if (!authRes.ok) {
          router.push('/login');
          return;
        }

        const authData = await authRes.json();
        setUser(authData.user);

        const studentsData = studentsRes.ok ? await studentsRes.json() : { students: [] };
        const teamData = teamRes.ok ? await teamRes.json() : { applications: [] };
        const codesData = codesRes.ok ? await codesRes.json() : { codes: [] };
        const groupsData = groupsRes.ok ? await groupsRes.json() : { groups: [] };
        const sessionsData = sessionsRes.ok ? await sessionsRes.json() : { sessions: [] };

        const now = new Date();
        const activeCodes = codesData.codes?.filter(c => !c.used && (!c.expires_at || new Date(c.expires_at) > now)).length || 0;
        const pendingTeam = teamData.applications?.filter(a => a.status === 'pending').length || 0;
        const activeStudents = studentsData.students?.filter(s => s.status === 'accepted' || s.status === 'pending').length || 0;

        setStats({
          students: studentsData.students?.length || 0,
          activeStudents,
          team: teamData.applications?.length || 0,
          pendingTeam,
          testCodes: codesData.codes?.length || 0,
          activeCodes,
          groups: groupsData.groups?.length || 0,
          sessions: sessionsData.sessions?.length || 0,
        });
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="page-container">
        <KPIRowSkeleton />
      </div>
    );
  }

  const roleLabel = user?.role === 'admin' ? 'مدير' : user?.role === 'supervisor' ? 'مشرف' : 'مدرب';

  const quickActions = [
    { label: 'إضافة طالب', icon: 'person_add', href: '/admin/students', color: 'var(--color-primary)' },
    { label: 'إنشاء مجموعة', icon: 'group_add', href: '/admin/groups', color: 'var(--color-success)' },
    { label: 'إنشاء جلسة', icon: 'event', href: '/admin/sessions', color: 'var(--color-secondary)' },
    { label: 'تسجيل حضور', icon: 'fact_check', href: '/admin/attendance', color: 'var(--color-info)' },
  ];

  const recentActivity = [
    { icon: 'person_add', text: 'طالب جديد سجل في المسار', time: 'منذ 5 دقائق', color: 'var(--color-primary)' },
    { icon: 'payment', text: 'دفعة جديدة تم تسجيلها', time: 'منذ 15 دقيقة', color: 'var(--color-success)' },
    { icon: 'event', text: 'جلسة Track A-1 مكتملة', time: 'منذ ساعة', color: 'var(--color-secondary)' },
    { icon: 'assignment', text: 'مهمة جديدة تم تعيينها', time: 'منذ 3 ساعات', color: 'var(--color-info)' },
  ];

  return (
    <div className="page-container">
      {/* Welcome */}
      <div className="page-header">
        <div>
          <h1>مرحباً، {user?.full_name || 'مستخدم'}</h1>
          <p>نظرة عامة على أكاديمية TKA-Egypt — {roleLabel}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon="school"
          iconColor="var(--color-primary)"
          iconBg="var(--color-primary-light)"
          value={stats?.students || 0}
          label="إجمالي الطلاب"
          trend={stats?.activeStudents ? `${stats.activeStudents} نشط` : undefined}
          trendDir="up"
        />
        <KPICard
          icon="groups"
          iconColor="var(--color-success)"
          iconBg="var(--color-success-light)"
          value={stats?.groups || 0}
          label="المجموعات"
          trend={stats?.sessions ? `${stats.sessions} جلسة` : undefined}
          trendDir="up"
        />
        <KPICard
          icon="payments"
          iconColor="var(--color-secondary)"
          iconBg="var(--color-secondary-light)"
          value={stats?.team || 0}
          label="طلبات الفريق"
          trend={stats?.pendingTeam ? `${stats.pendingTeam} معلق` : undefined}
          trendDir="up"
        />
        <KPICard
          icon="vpn_key"
          iconColor="var(--color-tertiary)"
          iconBg="var(--color-tertiary-light)"
          value={stats?.activeCodes || 0}
          label="أكواد نشطة"
          trend={`${stats?.testCodes || 0} إجمالي`}
          trendDir="up"
        />
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card-admin p-5">
          <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] hover:bg-[var(--color-surface-dim)] transition-colors group"
              >
                <div
                  className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center"
                  style={{ background: `${action.color}15` }}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ color: action.color }}>
                    {action.icon}
                  </span>
                </div>
                <span className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-admin p-5">
          <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-4">النشاط الأخير</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${activity.color}15` }}
                >
                  <span className="material-symbols-outlined text-[16px]" style={{ color: activity.color }}>
                    {activity.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-text-primary)]">{activity.text}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-4">الوحدات</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { label: 'الطلاب', icon: 'school', href: '/admin/students', color: 'var(--color-primary)' },
            { label: 'المدربين', icon: 'co_present', href: '/admin/trainers', color: 'var(--color-success)' },
            { label: 'المجموعات', icon: 'groups', href: '/admin/groups', color: 'var(--color-info)' },
            { label: 'الجلسات', icon: 'event', href: '/admin/sessions', color: 'var(--color-secondary)' },
            { label: 'الحضور', icon: 'fact_check', href: '/admin/attendance', color: 'var(--color-warning)' },
            { label: 'المهام', icon: 'assignment', href: '/admin/tasks', color: 'var(--color-danger)' },
            { label: 'الاشتراكات', icon: 'card_membership', href: '/admin/subscriptions', color: 'var(--color-primary)' },
            { label: 'المدفوعات', icon: 'payments', href: '/admin/payments', color: 'var(--color-success)' },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="card-admin p-4 hover:shadow-[var(--shadow-medium)] transition-all group"
            >
              <span className="material-symbols-outlined text-[28px] mb-2 block group-hover:scale-110 transition-transform" style={{ color: mod.color }}>
                {mod.icon}
              </span>
              <span className="text-sm font-medium text-[var(--color-text-primary)]">{mod.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
