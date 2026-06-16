'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Topbar({ user, onMenuToggle }) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetch('/api/admin/messages').then(r => r.ok ? r.json() : {}).then(d => {
      const convos = d.conversations || [];
      const unread = convos.filter(c => {
        const lastMsg = c.last_message;
        return lastMsg && lastMsg.sender_id !== user.id && !lastMsg.read;
      }).length;
      setUnreadMessages(unread);
    }).catch(() => {});
    fetch('/api/admin/notifications').then(r => r.ok ? r.json() : {}).then(d => {
      const notifs = d.notifications || [];
      setUnreadNotifications(notifs.filter(n => !n.is_read).length);
    }).catch(() => {});
  }, [user]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/login');
  };

  return (
    <header className="bg-surface-container-lowest dark:bg-gray-800 sticky top-0 z-50 w-full border-b border-outline-variant dark:border-gray-700 shadow-sm h-16">
      <div className="flex items-center justify-between px-md h-full w-full max-w-container-max mx-auto">
        {/* Left: Menu Toggle (mobile) */}
        <div className="flex items-center gap-sm">
          <button
            onClick={onMenuToggle}
            aria-label="فتح القائمة"
            className="material-symbols-outlined text-primary dark:text-primary p-2 hover:bg-surface-container-high dark:hover:bg-gray-700 rounded-full transition-colors lg:hidden cursor-pointer"
          >
            menu
          </button>
          <div className="flex items-center gap-sm">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-primary text-[20px]">school</span>
            </div>
            <img src="/logo.png" alt="Tech Makers Egypt" className="h-5 w-auto hidden sm:block dark:hidden" />
            <img src="/w- logo.png" alt="Tech Makers Egypt" className="h-5 w-auto hidden dark:block" />
          </div>
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-base">
          {/* Notifications */}
          <button
            onClick={() => router.push('/admin/notifications')}
            aria-label="الإشعارات"
            className="relative p-2 hover:bg-surface-container-high dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-on-surface-variant dark:text-gray-400">notifications</span>
            {unreadNotifications > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-surface-container-lowest dark:ring-gray-800"></span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="قائمة المستخدم"
              aria-expanded={showUserMenu}
              className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-high dark:hover:bg-gray-700 p-1 pr-3 rounded-full transition-colors"
            >
              <div className="text-left hidden md:block">
                <p className="font-label-md text-label-md text-on-surface dark:text-white leading-tight">{user?.full_name || 'المستخدم'}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-gray-400 leading-tight">
                  {user?.role === 'admin' ? 'مدير النظام' : user?.role === 'supervisor' ? 'مشرف' : user?.role === 'trainer' ? 'مدرب' : 'طالب'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary-fixed dark:border-primary/40 bg-primary-fixed/20 dark:bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary dark:text-primary text-[18px]">person</span>
              </div>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute left-0 top-full mt-2 w-48 bg-surface-container-lowest dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-xl shadow-sm z-50 overflow-hidden">
                  <button
                    onClick={() => { router.push('/admin/profile'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface dark:text-white hover:bg-surface-container-high dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    الملف الشخصي
                  </button>
                  <div className="border-t border-outline-variant dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error-container/20 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    تسجيل الخروج
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
