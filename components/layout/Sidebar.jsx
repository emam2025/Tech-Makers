'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'لوحة التحكم', icon: 'dashboard', href: '/admin', roles: ['admin', 'supervisor', 'trainer', 'student'] },
  { label: 'الطلاب', icon: 'school', href: '/admin/students', roles: ['admin', 'supervisor', 'trainer'] },
  { label: 'المدربين', icon: 'co_present', href: '/admin/trainers', roles: ['admin', 'supervisor'] },
  { label: 'المشرفين', icon: 'supervisor_account', href: '/admin/supervisors', roles: ['admin'] },
  { label: 'المجموعات', icon: 'groups', href: '/admin/groups', roles: ['admin', 'supervisor', 'trainer'] },
  { label: 'الجلسات', icon: 'event', href: '/admin/sessions', roles: ['admin', 'supervisor', 'trainer'] },
  { label: 'الحضور', icon: 'fact_check', href: '/admin/attendance', roles: ['admin', 'supervisor', 'trainer'] },
  { label: 'المهام', icon: 'assignment', href: '/admin/tasks', roles: ['admin', 'supervisor', 'trainer', 'student'] },
  { label: 'الاشتراكات', icon: 'card_membership', href: '/admin/subscriptions', roles: ['admin', 'supervisor'] },
  { label: 'المدفوعات', icon: 'payments', href: '/admin/payments', roles: ['admin', 'supervisor'] },
  { label: 'الرسائل', icon: 'chat', href: '/admin/messages', roles: ['admin', 'supervisor', 'trainer', 'student'] },
  { label: 'الإشعارات', icon: 'notifications', href: '/admin/notifications', roles: ['admin', 'supervisor', 'trainer', 'student'] },
  { label: 'تتبع التقدم', icon: 'timeline', href: '/admin/progress', roles: ['admin', 'supervisor', 'trainer', 'student'] },
  { label: 'المستخدمين', icon: 'manage_accounts', href: '/admin/users', roles: ['admin'] },
  { label: 'طلبات الفريق', icon: 'groups_3', href: '/admin/team', roles: ['admin', 'supervisor'] },
  { label: 'أكواد الاختبار', icon: 'vpn_key', href: '/admin/test-codes', roles: ['admin', 'supervisor'] },
];

export default function Sidebar({ collapsed, onToggle, user }) {
  const pathname = usePathname();
  const role = user?.role || 'student';

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--color-border-subtle)]">
        <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-white text-[20px]">academy</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-[var(--color-text-primary)] truncate">TKA-Egypt</div>
            <div className="text-[10px] text-[var(--color-text-tertiary)] truncate">Academy Management</div>
          </div>
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
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-[var(--color-border-subtle)] p-3">
        <Link href="/admin/profile" className="sidebar-item" title={collapsed ? 'الملف الشخصي' : undefined}>
          <span className="material-symbols-outlined">person</span>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                {user?.full_name || 'المستخدم'}
              </div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] truncate">
                {role === 'admin' ? 'مدير' : role === 'supervisor' ? 'مشرف' : role === 'trainer' ? 'مدرب' : 'طالب'}
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -left-3 top-20 w-6 h-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full flex items-center justify-center hover:bg-[var(--color-surface-dim)] transition-colors cursor-pointer z-50 hidden lg:flex"
      >
        <span className="material-symbols-outlined text-[14px] text-[var(--color-text-secondary)]">
          {collapsed ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>
    </aside>
  );
}
