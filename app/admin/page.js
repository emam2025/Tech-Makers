'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ students: 0, team: 0, testCodes: 0, activeCodes: 0 });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [authRes, studentsRes, teamRes, codesRes] = await Promise.all([
          fetch('/api/admin/auth'),
          fetch('/api/admin/students'),
          fetch('/api/admin/team'),
          fetch('/api/admin/test-codes'),
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

        const now = new Date();
        const activeCodes = codesData.codes?.filter(c => !c.used && (!c.expires_at || new Date(c.expires_at) > now)).length || 0;

        setStats({
          students: studentsData.students?.length || 0,
          team: teamData.applications?.length || 0,
          testCodes: codesData.codes?.length || 0,
          activeCodes,
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
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  const statCards = [
    { label: 'إجمالي الطلاب', value: stats.students, icon: 'school', color: 'bg-primary/10 text-primary', href: '/admin/students' },
    { label: 'طلبات الفريق', value: stats.team, icon: 'groups', color: 'bg-secondary/10 text-secondary', href: '/admin/team' },
    { label: 'أكواد الاختبار', value: stats.testCodes, icon: 'vpn_key', color: 'bg-tertiary/10 text-tertiary', href: '/admin/test-codes' },
    { label: 'أكواد نشطة', value: stats.activeCodes, icon: 'check_circle', color: 'bg-success/10 text-success', href: '/admin/test-codes' },
  ];

  const quickLinks = [
    { label: 'إدارة الطلاب', desc: 'عرض وتعديل بيانات الطلاب المسجلين', icon: 'school', href: '/admin/students', color: 'from-primary/10 to-primary/5 border-primary/20' },
    { label: 'طلبات الفريق', desc: 'مراجعة طلبات الانضمام للفريق', icon: 'groups', href: '/admin/team', color: 'from-secondary/10 to-secondary/5 border-secondary/20' },
    { label: 'أكواد الاختبار', desc: 'إنشاء وإدارة أكواد اختبار التحديد', icon: 'vpn_key', href: '/admin/test-codes', color: 'from-tertiary/10 to-tertiary/5 border-tertiary/20' },
  ];

  if (user?.role === 'admin') {
    quickLinks.push({
      label: 'إدارة المستخدمين',
      desc: 'إضافة وتعديل وحذف مستخدمي الإدارة',
      icon: 'manage_accounts',
      href: '/admin/users',
      color: 'from-error/10 to-error/5 border-error/20',
    });
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-1">
          مرحباً، {user?.full_name || 'مستخدم'}
        </h1>
        <p className="text-on-surface-variant font-body-md text-sm">
          لوحة إدارة Tech Makers Egypt — {user?.role === 'admin' ? 'مدير' : 'مشرف'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-24 p-4 md:p-6 border border-outline-variant/20 hover-lift group"
          >
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              <span className="material-symbols-outlined text-xl">{card.icon}</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-on-surface mb-1">{card.value}</div>
            <div className="text-xs md:text-sm text-on-surface-variant font-body-md">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">الإجراءات السريعة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`bg-gradient-to-br ${link.color} border rounded-24 p-5 md:p-6 hover-lift group`}
            >
              <span className="material-symbols-outlined text-3xl md:text-4xl mb-3 block group-hover:scale-110 transition-transform">{link.icon}</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{link.label}</h3>
              <p className="text-xs md:text-sm text-on-surface-variant font-body-md">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
