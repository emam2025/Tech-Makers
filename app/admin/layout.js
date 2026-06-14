'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import { ToastProvider } from '../../components/ui/Toast';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/admin/auth');
        if (!res.ok) { router.push('/login'); return; }
        const data = await res.json();
        setUser(data.user);
      } catch { router.push('/login'); }
      finally { setLoading(false); }
    }
    fetchUser();
  }, [router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Body scroll lock when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[var(--color-primary)] text-[40px] animate-spin">progress_activity</span>
          <p className="text-[var(--color-text-secondary)] text-sm">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="admin-layout-root min-h-screen bg-[var(--color-bg)] flex overflow-x-hidden" dir="rtl">
        {/* Mobile overlay */}
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>

        {/* Sidebar */}
        <div className={`fixed lg:sticky inset-y-0 right-0 z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} user={user} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <div className={`flex-1 flex flex-col min-h-screen admin-main-content ${collapsed ? 'admin-main-collapsed' : ''}`}>
          <Topbar user={user} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
