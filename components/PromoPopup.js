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
        className="relative bg-gradient-to-br from-white via-amber-50 to-yellow-50 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-tertiary/30 animate-[scaleIn_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button onClick={dismiss} className="absolute top-3 left-3 z-10 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-tertiary to-amber-500 text-primary-deep text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            <span className="material-symbols-outlined text-sm">local_offer</span>
            عرض حصري
          </span>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-br from-tertiary to-amber-500 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-white text-3xl">celebration</span>
          </div>
          <h2 className="text-white text-xl font-bold mb-1">سجّل في تك ميكرز مصر</h2>
          <p className="text-white/80 text-sm">واحصل على مميزات حصرية</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 bg-white rounded-xl p-3 border border-tertiary/20">
              <div className="w-8 h-8 bg-tertiary/15 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-tertiary text-lg">calculate</span>
              </div>
              <div>
                <p className="font-bold text-sm text-amber-700">كورس Techno Math مجاناً</p>
                <p className="text-xs text-on-surface-variant">3 شهور برنامج الحساب الذهني هدية لك</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl p-3 border border-primary/20">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-primary text-lg">translate</span>
              </div>
              <div>
                <p className="font-bold text-sm text-primary">اختبار تحديد مستوى إنجليزي</p>
                <p className="text-xs text-on-surface-variant">تقييم مجاني لمستوى لغتك الإنجليزية</p>
              </div>
            </div>
          </div>

          <Link
            href="/tracks"
            onClick={dismiss}
            className="block w-full text-center bg-tertiary text-primary-deep py-3 rounded-xl font-bold text-base hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
          >
            استكشف المسارات وسجّل الآن
          </Link>

          <button onClick={dismiss} className="w-full text-center text-on-surface-variant text-xs mt-3 hover:text-primary transition-colors">
            ربما لاحقاً
          </button>
        </div>
      </div>
    </div>
  )
}
