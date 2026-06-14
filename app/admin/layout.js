'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/admin', label: 'لوحة التحكم', icon: 'dashboard' },
  { href: '/admin/students', label: 'الطلاب', icon: 'school' },
  { href: '/admin/team', label: 'طلبات الفريق', icon: 'groups' },
  { href: '/admin/users', label: 'المستخدمين', icon: 'manage_accounts', adminOnly: true },
  { href: '/admin/test-codes', label: 'أكواد الاختبار', icon: 'vpn_key' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/admin/auth');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  async function handleLogout() {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {}
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
          <p className="text-on-surface-variant font-body-md">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const filteredNav = NAV_ITEMS.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-surface flex" dir="rtl">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-[280px] bg-white border-l border-outline-variant/30 shadow-lg z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-outline-variant/20">
            <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">admin_panel_settings</span>
              </div>
              <div>
                <div className="font-headline-lg text-headline-lg text-primary">إدارة الموقع</div>
                <div className="text-xs text-on-surface-variant">Tech Makers Egypt</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="flex flex-col gap-1">
              {filteredNav.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-body-md text-sm ${
                        isActive
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info + logout */}
          <div className="p-4 border-t border-outline-variant/20">
            <Link href="/admin/profile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 mb-3 px-2 py-2 rounded-xl hover:bg-surface-container-high transition-colors">
              {user?.profile_photo ? (
                <img src={user.profile_photo} alt="" className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">person</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-on-surface truncate">{user?.full_name || 'مستخدم'}</div>
                <div className="text-xs text-on-surface-variant truncate">{user?.role === 'admin' ? 'مدير' : 'مشرف'}</div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-lg">chevron_left</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-error hover:bg-error-container/30 transition-colors text-sm font-medium"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:mr-0">
        {/* Top bar */}
        <header className="bg-white border-b border-outline-variant/30 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-surface-container-high rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="فتح القائمة"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">shield</span>
              <span className="font-headline-md text-headline-md text-on-surface hidden sm:inline">لوحة الإدارة</span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-surface-container-high transition-colors text-sm text-on-surface-variant"
              target="_blank"
            >
              <span className="material-symbols-outlined text-lg">open_in_new</span>
              <span className="hidden sm:inline">الموقع</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
