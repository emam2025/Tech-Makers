'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const token = params.get('access_token');
      if (token) {
        setAccessToken(token);
        return;
      }
    }
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      setAccessToken(token);
      return;
    }
    setError('رمز إعادة التعيين غير صالح أو منتهي الصلاحية');
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تتكون من 6 أحرف على الأقل');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, access_token: accessToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'فشل تحديث كلمة المرور');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-deep via-primary to-[#1a3fa0] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Tech Makers Egypt" className="mx-auto mb-4 h-8 w-auto dark:hidden" />
          <img src="/w- logo.png" alt="Tech Makers Egypt" className="mx-auto mb-4 h-8 w-auto hidden dark:block" />
        </div>

        <div className="bg-blue-50 dark:bg-gray-800 rounded-32 p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
          {success ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-success text-2xl">check_circle</span>
                <h2 className="font-headline-lg text-headline-lg text-gray-900 dark:text-white">تم التحديث</h2>
              </div>
              <div className="bg-success/10 border-r-4 border-success rounded-xl p-4 mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-success text-xl">lock</span>
                <p className="text-on-surface text-sm font-medium">تم تحديث كلمة المرور بنجاح</p>
              </div>
              <Link
                href="/login"
                className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">login</span>
                تسجيل الدخول
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">lock_reset</span>
                <h2 className="font-headline-lg text-headline-lg text-gray-900 dark:text-white">إعادة تعيين كلمة المرور</h2>
              </div>

              {!accessToken && !error && (
                <div className="bg-warning-container/30 border-r-4 border-warning rounded-xl p-4 mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-warning text-xl">hourglass_empty</span>
                  <p className="text-on-surface text-sm font-medium">جاري التحقق من رمز إعادة التعيين...</p>
                </div>
              )}

              {error && (
                <div className="bg-error-container/30 border-r-4 border-error rounded-xl p-4 mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-error text-xl">error</span>
                  <p className="text-on-error-container text-sm font-medium">{error}</p>
                </div>
              )}

              {accessToken && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">كلمة المرور الجديدة</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl">lock</span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">تأكيد كلمة المرور الجديدة</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl">lock</span>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
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
                        جاري التحديث...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xl">lock_reset</span>
                        تحديث كلمة المرور
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
