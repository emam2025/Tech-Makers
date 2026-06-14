'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Topbar({ user, onMenuToggle }) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/login');
  };

  return (
    <header className="admin-topbar">
      {/* Left: Menu Toggle + Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          aria-label="فتح القائمة"
          className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-dim)] lg:hidden cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] text-[var(--color-text-secondary)]">menu</span>
        </button>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          onClick={() => router.push('/admin/notifications')}
          aria-label="الإشعارات"
          className="relative p-2 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-dim)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] text-[var(--color-text-secondary)]">notifications</span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="قائمة المستخدم"
            aria-expanded={showUserMenu}
            className="flex items-center gap-2 p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-dim)] cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px] text-[var(--color-primary)]">person</span>
            </div>
            <span className="text-sm font-medium text-[var(--color-text-primary)] hidden sm:block">
              {user?.full_name || 'المستخدم'}
            </span>
            <span className="material-symbols-outlined text-[16px] text-[var(--color-text-tertiary)]">expand_more</span>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute left-0 top-full mt-2 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-elevated)] z-50 overflow-hidden">
                <button
                  onClick={() => { router.push('/admin/profile'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-surface-dim)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  الملف الشخصي
                </button>
                <div className="border-t border-[var(--color-border-subtle)]" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  تسجيل الخروج
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
