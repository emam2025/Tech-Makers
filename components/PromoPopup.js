"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PromoPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('promo-dismissed')
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    setShow(false)
    sessionStorage.setItem('promo-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={dismiss}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-[scaleIn_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button onClick={dismiss} aria-label="إغلاق" className="absolute top-4 left-4 z-10 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
          <span className="material-symbols-outlined text-gray-500 text-lg">close</span>
        </button>

        {/* Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1 bg-tertiary/10 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-sm">local_offer</span>
            عرض حصري
          </span>
        </div>

        {/* Header — clean white with yellow accent icon */}
        <div className="pt-12 pb-6 px-8 text-center">
          <div className="w-14 h-14 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-tertiary text-3xl">celebration</span>
          </div>
          <h2 className="text-on-surface text-xl font-bold mb-1">
            سجّل في <span className="text-tertiary">تك ميكرز مصر</span>
          </h2>
          <p className="text-on-surface-variant text-sm">واحصل على مميزات حصرية</p>
        </div>

        {/* Divider */}
        <div className="mx-8 border-t border-gray-100" />

        {/* Content — clean cards */}
        <div className="px-8 py-6">
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3 bg-surface-container-lowest rounded-xl p-4">
              <div className="w-9 h-9 bg-tertiary/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-tertiary text-xl">calculate</span>
              </div>
              <div>
                <p className="font-bold text-sm text-on-surface">كورس Techno Math مجاناً</p>
                <p className="text-xs text-on-surface-variant mt-0.5">3 شهور برنامج الحساب الذهني هدية لك</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-surface-container-lowest rounded-xl p-4">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-primary text-xl">translate</span>
              </div>
              <div>
                <p className="font-bold text-sm text-on-surface">اختبار تحديد مستوى إنجليزي</p>
                <p className="text-xs text-on-surface-variant mt-0.5">تقييم مجاني لمستوى لغتك الإنجليزية</p>
              </div>
            </div>
          </div>

          {/* CTA — yellow */}
          <Link
            href="/tracks"
            onClick={dismiss}
            className="block w-full text-center bg-tertiary text-primary-deep py-3.5 rounded-xl font-bold text-base hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
          >
            استكشف المسارات وسجّل الآن
          </Link>

          <button onClick={dismiss} className="w-full text-center text-on-surface-variant text-xs mt-4 hover:text-primary transition-colors">
            ربما لاحقاً
          </button>
        </div>
      </div>
    </div>
  )
}
