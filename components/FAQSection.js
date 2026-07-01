import Link from 'next/link';

export default function FAQSection() {
  return (
    <section className="section-padding" id="extras">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">مش بس برمجة — بنهتم بكل جوانب طفلك</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="public-card p-3.5 group">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-[#b45309] text-sm">local_offer</span>
              <span className="inline-block bg-[#f59e0b]/20 text-[#b45309] text-xs font-bold px-2 py-0.5 rounded-full">عرض حصري</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-lg">calculate</span>
            </div>
            <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-1">Techno Math</h3>
            <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed mb-2">حساب ذهني من العداد للسرعة الاحترافية — 12 شهر، من 8 لـ 15 سنة.</p>
            <Link href="/technomath" className="flex items-center gap-1.5 text-[#b45309] font-bold text-xs">
              <span>اكتشف البرنامج</span>
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </Link>
          </div>

          <div className="public-card p-3.5 group">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-blue-600 text-sm">translate</span>
              <span className="inline-block bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">جديد</span>
              <span className="inline-block bg-[#f59e0b]/20 text-[#b45309] text-xs font-bold px-2 py-0.5 rounded-full">حصري</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-lg">translate</span>
            </div>
            <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-1">Tech English</h3>
            <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed mb-2">إنجليزية التكنولوجيا — مش للمدرسة بس، لعالم البرمجة. 12 شهر من A1 لـ B2.</p>
            <Link href="/techenglish" className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
              <span>اكتشف البرنامج</span>
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </Link>
          </div>

          <div className="public-card p-3.5 group">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-emerald-600 text-sm">shield</span>
              <span className="inline-block bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full">مضمّن</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-blue-600 text-lg">shield</span>
            </div>
            <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-1">إخصائي سلوكي</h3>
            <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed mb-2">متابع نفسية للطالب — يساعدك يتعامل مع الضغوط ويكون واثق من نفسه</p>
            <p className="text-emerald-600 font-semibold text-xs">مشمول في الباقة الأساسية</p>
          </div>

          <div className="public-card p-3.5 group">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-primary text-sm">favorite</span>
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">مدعوم من TKA-Egypt</span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-lg">favorite</span>
            </div>
            <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-1">جزء من التكلفة على حسابنا</h3>
            <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed mb-2">عشان التعليم يوصل لكل طفل مصري</p>
            <p className="text-primary font-semibold text-xs">دعم مستمر للأهالي</p>
          </div>
        </div>
      </div>
    </section>
  );
}
