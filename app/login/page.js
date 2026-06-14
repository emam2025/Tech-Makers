'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'حدث خطأ أثناء تسجيل الدخول');
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch {
      setError('خطأ في الاتصال بالخادم');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-deep via-primary to-[#1a3fa0] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 mb-4">
            <span className="material-symbols-outlined text-white text-3xl">admin_panel_settings</span>
          </div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-2">إدارة الموقع</h1>
          <p className="text-white/70 font-body-md text-sm">Tech Makers Egypt — لوحة التحكم</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-32 shadow-elegant p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl">login</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">تسجيل الدخول</h2>
          </div>

          {error && (
            <div className="bg-error-container/30 border-r-4 border-error rounded-xl p-4 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-error text-xl">error</span>
              <p className="text-on-error-container text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pr-12 pl-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">كلمة المرور</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pr-12 pl-4 py-3 rounded-xl border border-outline-variant/50 bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">login</span>
                  دخول
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
              العودة للموقع
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
