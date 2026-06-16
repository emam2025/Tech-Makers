'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KPIRowSkeleton } from '../../components/ui/Skeleton';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [authRes, studentsRes, teamRes, codesRes, groupsRes, sessionsRes, paymentsRes, subscriptionsRes] = await Promise.all([
          fetch('/api/admin/auth'),
          fetch('/api/admin/students'),
          fetch('/api/admin/team'),
          fetch('/api/admin/test-codes'),
          fetch('/api/admin/groups').catch(() => ({ ok: false })),
          fetch('/api/admin/sessions').catch(() => ({ ok: false })),
          fetch('/api/admin/payments').catch(() => ({ ok: false })),
          fetch('/api/admin/subscriptions').catch(() => ({ ok: false })),
        ]);

        if (!authRes.ok) { router.push('/login'); return; }
        const authData = await authRes.json();
        setUser(authData.user);

        const studentsData = studentsRes.ok ? await studentsRes.json() : { students: [] };
        const teamData = teamRes.ok ? await teamRes.json() : { applications: [] };
        const codesData = codesRes.ok ? await codesRes.json() : { codes: [] };
        const groupsData = groupsRes.ok ? await groupsRes.json() : { groups: [] };
        const sessionsData = sessionsRes.ok ? await sessionsRes.json() : { sessions: [] };
        const paymentsData = paymentsRes.ok ? await paymentsRes.json() : { payments: [] };
        const subsData = subscriptionsRes.ok ? await subscriptionsRes.json() : { subscriptions: [] };

        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        const activeCodes = codesData.codes?.filter(c => !c.used && (!c.expires_at || new Date(c.expires_at) > now)).length || 0;
        const pendingTeam = teamData.applications?.filter(a => a.status === 'pending').length || 0;
        const activeStudents = studentsData.students?.filter(s => s.status === 'accepted' || s.status === 'pending').length || 0;

        const payments = paymentsData.payments || [];
        const totalRevenue = payments.filter(p => (p.status || 'confirmed') === 'confirmed').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        const thisMonthRevenue = payments.filter(p => {
          const d = new Date(p.payment_date);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear && (p.status || 'confirmed') === 'confirmed';
        }).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        const pendingPayments = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        const pendingCount = payments.filter(p => p.status === 'pending').length;
        const subscriptions = subsData.subscriptions || [];
        const activeSubs = subscriptions.filter(s => s.status === 'active').length;
        const expiredSubs = subscriptions.filter(s => s.status === 'expired').length;

        setStats({
          students: studentsData.students?.length || 0,
          activeStudents,
          team: teamData.applications?.length || 0,
          pendingTeam,
          testCodes: codesData.codes?.length || 0,
          activeCodes,
          groups: groupsData.groups?.length || 0,
          sessions: sessionsData.sessions?.length || 0,
          totalRevenue,
          thisMonthRevenue,
          pendingPayments,
          pendingPaymentCount: pendingCount,
          activeSubs,
          expiredSubs,
        });

        const activity = [];
        (studentsData.students || []).slice(0, 3).forEach(s => {
          if (s.created_at) {
            const diff = now - new Date(s.created_at);
            if (diff < 7 * 24 * 60 * 60 * 1000) {
              activity.push({ icon: 'person_add', text: `تمت إضافة ${s.full_name || 'طالب'} كطالب جديد`, time: formatTimeAgo(s.created_at), color: 'bg-primary-fixed/40', iconColor: 'text-primary', date: new Date(s.created_at) });
            }
          }
        });
        (sessionsData.sessions || []).slice(0, 3).forEach(s => {
          if (s.scheduled_date) {
            activity.push({ icon: 'event', text: `جلسة "${s.title || 'بدون عنوان'}" ${s.status === 'completed' ? 'مكتملة' : 'مجدولة'}`, time: s.scheduled_date, color: s.status === 'completed' ? 'bg-success/10' : 'bg-primary-fixed/40', iconColor: s.status === 'completed' ? 'text-success' : 'text-primary', date: new Date(s.scheduled_date) });
          }
        });
        payments.slice(0, 3).forEach(p => {
          if (p.payment_date) {
            activity.push({ icon: 'payments', text: `سدد ${p.student?.full_name || 'طالب'} اشتراك الشهر`, time: formatTimeAgo(p.payment_date), color: 'bg-secondary-fixed/40', iconColor: 'text-secondary', date: new Date(p.payment_date) });
          }
        });
        activity.sort((a, b) => (b.date || 0) - (a.date || 0));
        setRecentActivity(activity.slice(0, 5));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return <div className="max-w-container-max mx-auto px-md py-lg"><KPIRowSkeleton /></div>;
  }

  function formatTimeAgo(dateStr) {
    const diff = new Date() - new Date(dateStr);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return days < 7 ? `منذ ${days} يوم` : new Date(dateStr).toLocaleDateString('ar-EG');
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-container-max mx-auto px-md py-lg mb-24">
      {/* Dashboard Header */}
      <div className="mb-lg">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">لوحة التحكم الرئيسية</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">أهلاً بك مجدداً، إليك ملخص أداء الأكاديمية اليوم.</p>
      </div>

      {/* KPI Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md mb-xl">
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="bg-primary-fixed/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <span className="text-success font-label-md text-label-md flex items-center bg-success/10 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">إجمالي الطلاب</p>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{(stats?.students || 0).toLocaleString()}</h3>
        </div>
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="bg-secondary-container/30 p-2 rounded-lg">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            </div>
            <span className="text-on-surface-variant font-label-md text-label-md">مستقر</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">المجموعات النشطة</p>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{stats?.groups || 0}</h3>
        </div>
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="bg-tertiary-fixed/30 p-2 rounded-lg">
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            </div>
            <span className="text-success font-label-md text-label-md flex items-center bg-success/10 px-2 py-0.5 rounded-full">+8%</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">الإيرادات الشهرية</p>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{(stats?.thisMonthRevenue || 0).toLocaleString()} ج.م</h3>
        </div>
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant shadow-sm flex flex-col gap-xs hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="bg-error-container/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
            </div>
            <span className="text-error font-label-md text-label-md flex items-center bg-error/10 px-2 py-0.5 rounded-full">-2%</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">معدل الحضور</p>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">92%</h3>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-md">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-md">
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-base">
            <Link href="/admin/students" className="bg-primary text-on-primary p-md rounded-xl flex flex-col items-center justify-center gap-xs hover:bg-primary-container transition-all active:scale-95 group">
              <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">person_add</span>
              <span className="font-label-md text-label-md">طالب جديد</span>
            </Link>
            <Link href="/admin/groups" className="bg-secondary-container text-on-secondary-container p-md rounded-xl flex flex-col items-center justify-center gap-xs hover:opacity-90 transition-all active:scale-95 group">
              <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">group_add</span>
              <span className="font-label-md text-label-md">إنشاء مجموعة</span>
            </Link>
            <Link href="/admin/sessions" className="bg-surface-container-lowest border border-outline-variant text-primary p-md rounded-xl flex flex-col items-center justify-center gap-xs hover:bg-surface-container-high transition-all active:scale-95 group">
              <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">calendar_add_on</span>
              <span className="font-label-md text-label-md">جلسة جديدة</span>
            </Link>
            <Link href="/admin/payments" className="bg-surface-container-lowest border border-outline-variant text-primary p-md rounded-xl flex flex-col items-center justify-center gap-xs hover:bg-surface-container-high transition-all active:scale-95 group">
              <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">add_card</span>
              <span className="font-label-md text-label-md">تسجيل دفع</span>
            </Link>
          </div>

          {/* Insights Card */}
          <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm overflow-hidden relative border border-outline-variant">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/10 rounded-bl-full -mr-16 -mt-16"></div>
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <h2 className="font-headline-md text-headline-md text-primary">رؤى ذكية</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="bg-error-container/10 border border-error/20 p-md rounded-xl flex items-center gap-md">
                <div className="bg-error text-on-error w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-error">طلاب متعثرون</h4>
                  <p className="font-body-md text-body-md text-on-surface">34 طالباً بحاجة لاهتمامك</p>
                  <Link href="/admin/students" className="font-label-md text-label-md text-primary underline mt-1 block">عرض القائمة</Link>
                </div>
              </div>
              <div className="bg-primary-fixed/10 border border-primary/10 p-md rounded-xl flex items-center gap-md">
                <div className="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-primary">جلسات اليوم</h4>
                  <p className="font-body-md text-body-md text-on-surface">8 جلسات مقررة اليوم</p>
                  <Link href="/admin/sessions" className="font-label-md text-label-md text-primary underline mt-1 block">عرض الجدول</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-sm">
            <div className="flex justify-between items-center mb-md">
              <h2 className="font-headline-md text-headline-md text-primary">النشاط الأخير</h2>
              <Link href="/admin/notifications" className="text-primary font-label-md text-label-md hover:underline">عرض الكل</Link>
            </div>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-4 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[32px] block mb-2">history</span>
                  لا يوجد نشاط حديث
                </div>
              ) : recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-md pb-4 border-b border-outline-variant last:border-0 last:pb-0">
                  <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
                    <span className={`material-symbols-outlined ${activity.iconColor}`}>{activity.icon}</span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-body-md text-body-md text-on-surface">{activity.text}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Cards */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-md">
          {/* Today Schedule */}
          <div className="bg-primary text-on-primary rounded-xl p-md shadow-lg">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-headline-md text-headline-md">اليوم</h3>
              <span className="font-body-md text-body-md opacity-80">{dateStr}</span>
            </div>
            <div className="space-y-md">
              <div className="bg-white/10 p-sm rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-base">
                  <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                  <span className="font-label-md text-label-md">رياضيات - مستوى متقدم</span>
                </div>
                <span className="font-body-sm text-body-sm opacity-80">04:00 م</span>
              </div>
              <div className="bg-white/10 p-sm rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-base">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <span className="font-label-md text-label-md">لغة عربية - المستوى 2</span>
                </div>
                <span className="font-body-sm text-body-sm opacity-80">06:00 م</span>
              </div>
              <div className="bg-white/10 p-sm rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-base">
                  <span className="w-2 h-2 rounded-full bg-surface-bright"></span>
                  <span className="font-label-md text-label-md">اجتماع المعلمين</span>
                </div>
                <span className="font-body-sm text-body-sm opacity-80">08:00 م</span>
              </div>
            </div>
            <Link href="/admin/sessions" className="w-full mt-md bg-secondary-fixed text-on-secondary-fixed py-2 rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity text-center block">إدارة الجدول</Link>
          </div>

          {/* Performance Card */}
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-sm">
            <h3 className="font-headline-md text-headline-md text-primary mb-md">الأداء العام</h3>
            <div className="flex items-center justify-center py-base">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="12"></circle>
                  <circle className="text-primary" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset="54.6" strokeWidth="12"></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-headline-md font-bold text-primary">85%</span>
                </div>
              </div>
            </div>
            <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-base">نسبة رضاء الطلاب عن المحاضرين</p>
          </div>
        </div>
      </div>
    </div>
  );
}
