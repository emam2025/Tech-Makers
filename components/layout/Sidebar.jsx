'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'لوحة التحكم', icon: 'dashboard', href: '/admin', roles: ['admin'] },
  { label: 'لوحة المدرب', icon: 'dashboard', href: '/admin/trainer-dashboard', roles: ['trainer'] },
  { label: 'لوحة المشرف', icon: 'dashboard', href: '/admin/supervisor-dashboard', roles: ['supervisor'] },
  { label: 'الطلاب', icon: 'school', href: '/admin/students', roles: ['admin', 'supervisor', 'trainer'] },
  { label: 'الثانويه العامه', icon: 'school', href: '/admin/high-school', roles: ['admin', 'supervisor', 'trainer'] },
  { label: 'المدربين', icon: 'co_present', href: '/admin/trainers', roles: ['admin', 'supervisor'] },
  { label: 'المشرفين', icon: 'supervisor_account', href: '/admin/supervisors', roles: ['admin'] },
  { label: 'الفروع', icon: 'store', href: '/admin/branches', roles: ['admin', 'supervisor'] },
  { label: 'المجموعات', icon: 'groups', href: '/admin/groups', roles: ['admin', 'supervisor', 'trainer'] },
  { label: 'الجلسات', icon: 'event', href: '/admin/sessions', roles: ['admin', 'supervisor', 'trainer'] },
  { label: 'الحضور', icon: 'fact_check', href: '/admin/attendance', roles: ['admin', 'supervisor', 'trainer'] },
  { label: 'المهام', icon: 'assignment', href: '/admin/tasks', roles: ['admin', 'supervisor', 'trainer', 'student'] },
  { label: 'الاشتراكات', icon: 'card_membership', href: '/admin/subscriptions', roles: ['admin', 'supervisor'] },
  { label: 'خطط الاشتراك', icon: 'card_giftcard', href: '/admin/plans', roles: ['admin', 'supervisor'] },
  { label: 'التقييمات', icon: 'star', href: '/admin/evaluations', roles: ['admin', 'supervisor', 'trainer'] },
  { label: 'المدفوعات', icon: 'payments', href: '/admin/payments', roles: ['admin', 'supervisor'] },
  { label: 'رواتب المدربين', icon: 'payments', href: '/admin/salaries', roles: ['admin'] },
  { label: 'الشهادات', icon: 'workspace_premium', href: '/admin/certificates', roles: ['admin', 'supervisor'] },
  { label: 'الرسائل', icon: 'chat', href: '/admin/messages', roles: ['admin', 'supervisor', 'trainer', 'student'] },
  { label: 'الإشعارات', icon: 'notifications', href: '/admin/notifications', roles: ['admin', 'supervisor', 'trainer', 'student'] },
  { label: 'التنبيهات', icon: 'notifications_active', href: '/admin/alerts', roles: ['admin', 'supervisor'] },
  { label: 'تتبع التقدم', icon: 'timeline', href: '/admin/progress', roles: ['admin', 'supervisor', 'trainer', 'student'] },
  { label: 'المستخدمين', icon: 'manage_accounts', href: '/admin/users', roles: ['admin'] },
  { label: 'طلبات الفريق', icon: 'groups_3', href: '/admin/team', roles: ['admin', 'supervisor'] },
  { label: 'أكواد الاختبار', icon: 'vpn_key', href: '/admin/test-codes', roles: ['admin', 'supervisor'] },
  { label: 'إعدادات النظام', icon: 'settings', href: '/admin/settings', roles: ['admin'] },
];

export default function Sidebar({ collapsed, onToggle, user, onClose }) {
  const pathname = usePathname();
  const role = user?.role || 'student';

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className={`bg-surface-container-lowest dark:bg-gray-800 h-full border-l border-outline-variant dark:border-gray-700 flex flex-col transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center gap-sm px-5 py-5 border-b border-outline-variant dark:border-gray-700 min-h-[72px]">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-on-primary text-[20px]">school</span>
        </div>
        {!collapsed && (
          <div className="flex-1 overflow-hidden">
            <div className="font-label-md text-on-surface truncate">TKA-Egypt</div>
            <div className="font-body-sm text-on-surface-variant truncate text-xs">Academy Management</div>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} aria-label="إغلاق القائمة" className="lg:hidden p-1.5 rounded-lg hover:bg-surface-container-high dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[20px] dark:text-gray-300">close</span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-sm mx-3 mb-1 px-3 py-2.5 rounded-lg font-body-md text-sm transition-colors ${
                isActive
                  ? 'bg-primary-container dark:bg-primary/20 text-on-primary-container dark:text-primary font-medium'
                  : 'text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-high dark:hover:bg-gray-700 hover:text-on-surface dark:hover:text-white'
              } ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="material-symbols-outlined text-[20px] dark:text-gray-300">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-outline-variant dark:border-gray-700 p-3">
        <Link href="/admin/profile" className={`flex items-center gap-sm px-3 py-2.5 rounded-lg hover:bg-surface-container-high dark:hover:bg-gray-700 transition-colors ${collapsed ? 'justify-center px-2' : ''}`} title={collapsed ? 'الملف الشخصي' : undefined}>
          <div className="w-8 h-8 rounded-full bg-primary-fixed/20 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-[16px]">person</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="font-label-md text-on-surface dark:text-white truncate text-sm">
                {user?.full_name || 'المستخدم'}
              </div>
              <div className="font-body-sm text-on-surface-variant dark:text-gray-400 truncate text-xs">
                {role === 'admin' ? 'مدير' : role === 'supervisor' ? 'مشرف' : role === 'trainer' ? 'مدرب' : 'طالب'}
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -left-3 top-20 w-6 h-6 bg-surface-container-lowest dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-surface-container-high dark:hover:bg-gray-700 transition-colors cursor-pointer z-50 hidden lg:flex"
      >
        <span className="material-symbols-outlined text-[14px] text-on-surface-variant dark:text-gray-400">
          {collapsed ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>
    </aside>
  );
}
