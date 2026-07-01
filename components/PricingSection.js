import Link from 'next/link';

export default function PricingSection() {
  return (
    <>
      <section className="section-padding bg-[var(--color-surface-dim)]" id="plans">
        <div className="max-w-4xl mx-auto px-4">
          <div className="public-card p-3.5 md:p-4 mb-6 bg-[var(--color-surface)]">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">volunteer_activism</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-0.5">جزء من القيمة الفعلية</h3>
                <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed">الاشتراك المدفوع هو جزء من القيمة الفعلية للبرنامج فقط — حيث إن برنامج Tech Makers Egypt ممول جزئياً من TKA-Egypt بأكثر من 40% من تكلفة البرنامج الفعلية. الحمد لله، ده بيمكننا من تقديم تعليم بجودة عالية وسعر في متناول كل أسرة مصرية.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { plan: 'اشتراك شهري', tag: 'مناسبة للتجربة', icon: 'calendar_month', features: ['وصول كامل للمحتوى', 'متابعة أسبوعية', 'دعم واتساب'] },
              { plan: 'اشتراك ربع سنوي', tag: 'الأكثر اختياراً', icon: 'analytics', features: ['كل مميزات الشهري', 'شهادة معتمدة', 'تقييم دوري', 'خصم 10%'], popular: true },
              { plan: 'اشتراك سنوي', tag: 'الأوفر والأشمل', icon: 'emoji_events', features: ['كل مميزات الربع سنوي', 'مسابقات حصرية', 'إخصائي سلوك', 'خصم 20%'] },
            ].map((p, i) => (
              <div key={i} className={`public-card p-4 text-center relative ${p.popular ? 'ring-2 ring-[#f59e0b] shadow-xl' : ''}`}>
                {p.popular && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#f59e0b] text-white text-xs font-bold px-3 py-0.5 rounded-full">الأكثر اختياراً</div>}
                <div className="w-10 h-10 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-primary text-lg">{p.icon}</span>
                </div>
                <span className="inline-block bg-[#f59e0b]/10 text-[#b45309] text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">{p.tag}</span>
                <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-3">{p.plan}</h3>
                <ul className="space-y-1.5 mb-4 text-right">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                      <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`w-full block text-center py-2 rounded-lg font-bold text-sm transition-all ${p.popular ? 'bg-[#f59e0b] text-[#1a3fa0] shadow-lg shadow-amber-200 hover:shadow-xl' : 'bg-primary text-white hover:opacity-90'}`}>
                  اختر الخطة
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-[var(--color-text-secondary)] text-xs mt-4">الأسعار بتختلف حسب المسار — هتختار ويظهرلك كل التفاصيل</p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 text-center text-white" style={{ background: 'linear-gradient(135deg, #1a3fa0 0%, #2F6FE4 50%, #5f8ef8 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">الدفعة الخامسة ابتدت</h2>
          <p className="text-white/80 text-base md:text-lg mb-8">سجّل ابنك في Tech Makers دلوقتي — مقاعد محدودة في كل دفعة</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-[#f59e0b] text-[#1a3fa0] px-8 py-3.5 rounded-full font-bold text-base shadow-xl shadow-[#f59e0b]/20 hover:scale-105 active:scale-95 transition-all">
              <span className="material-symbols-outlined">app_registration</span>
              سجّل الآن
            </Link>
            <Link href="/tracks" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-white/15 transition-all">
              <span className="material-symbols-outlined">explore</span>
              استكشف المسارات
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
