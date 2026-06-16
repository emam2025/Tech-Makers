import Link from 'next/link';
import Image from 'next/image';


export const metadata = {
  title: 'Tech Makers Egypt — الدفعة الخامسة 2026',
  description: 'برنامج Tech Makers Egypt — الدفعة الخامسة 2026. برنامج تدريبي مصري للأطفال والناشئين من 8 إلى 20 سنة في البرمجة والذكاء الاصطناعي.',
  openGraph: {
    title: 'Tech Makers Egypt — الدفعة الخامسة 2026',
    description: 'برنامج تدريبي مصري للأطفال والناشئين من 8 إلى 20 سنة — يحوّل حب التكنولوجيا لمشاريع حقيقية.',
    url: 'https://tka-egypt.com',
  },
};

export default function HomePage() {
  return (
    <>
      {/* HERO — بوستر الدفعة الخامسة 2026 */}
      <section role="banner" aria-label="Hero" className="relative min-h-[90vh] md:min-h-[85vh] flex items-center pt-20 md:pt-24 px-4 md:px-margin-desktop text-white overflow-hidden">
        {/* Tech gradient background */}
        <div className="absolute inset-0 bg-gradient-to-bl from-[#6b8aff] via-[#2F6FE4] to-[#0f2d6e]"></div>
        {/* Decorative tech elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#f59e0b]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        </div>
        <div className="max-w-container-max mx-auto relative z-10 w-full py-12 md:py-20">
          {/* Mobile layout — centered poster */}
          <div className="flex flex-col items-center text-center gap-6 md:hidden">
            {/* Batch badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#f59e0b] w-fit rounded-full">
              <span className="material-symbols-outlined text-[#1a3fa0] text-lg">military_tech</span>
              <span className="text-[#1a3fa0] font-bold text-sm">الدفعة الخامسة — يونيو 2026</span>
            </div>

            {/* Main heading — large centered */}
            <h1 className="text-[13vw] sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.2] tracking-tight">
              من <span className="text-[#f59e0b]">مستهلك</span> للتكنولوجيا
              <br />إلى <span className="text-[#f59e0b]">صانع</span> ومطور و<span className="text-[#f59e0b]">قائد</span>
            </h1>

            <p className="text-white/60 text-lg font-medium">Tech Makers • Building Future Tech Leaders</p>

            {/* Age groups */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { age: '8–11', color: 'bg-emerald-500' },
                { age: '12–15', color: 'bg-blue-500' },
                { age: '16–20', color: 'bg-purple-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                  <div className={`w-2.5 h-2.5 ${item.color} rounded-full`}></div>
                  <span className="font-bold text-sm">{item.age} سنة</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-row justify-center gap-1.5 w-full mt-2">
              <Link href="/#plans" className="inline-flex items-center justify-center gap-1 bg-[#f59e0b] text-[#1a3fa0] px-2.5 py-1.5 rounded-full font-black text-xs shadow-lg shadow-[#f59e0b]/30 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-sm">app_registration</span>
                سجّل الآن
              </Link>
              <Link href="/tracks" className="inline-flex items-center justify-center gap-1 border-2 border-white/30 text-white px-2.5 py-1.5 rounded-full font-bold text-xs hover:bg-white/10 transition-all">
                <span className="material-symbols-outlined text-sm">explore</span>
                استكشف المسارات
              </Link>
            </div>
          </div>

          {/* Desktop layout — two columns */}
          <div className="hidden md:grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Right side — Main poster content (RTL) */}
            <div className="flex flex-col gap-6 order-1 lg:order-1">
              {/* Batch badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#f59e0b] w-fit rounded-full">
                <span className="material-symbols-outlined text-[#1a3fa0] text-lg">military_tech</span>
                <span className="text-[#1a3fa0] font-bold text-sm">الدفعة الخامسة — يونيو 2026</span>
              </div>

              {/* Main heading — bold poster style */}
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.2] tracking-tight">
                من <span className="text-[#f59e0b]">مستهلك</span> للتكنولوجيا
                <br />إلى <span className="text-[#f59e0b]">صانع</span> ومطور و<span className="text-[#f59e0b]">قائد</span>
              </h1>

              <p className="text-white/60 text-lg md:text-xl font-medium">Tech Makers • Building Future Tech Leaders</p>

              {/* Age groups — pill style */}
              <div className="flex flex-wrap gap-3">
                {[
                  { age: '8–11', color: 'bg-emerald-500' },
                  { age: '12–15', color: 'bg-blue-500' },
                  { age: '16–20', color: 'bg-purple-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                    <div className={`w-2.5 h-2.5 ${item.color} rounded-full`}></div>
                    <span className="font-bold text-sm">{item.age} سنة</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-row gap-2 mt-2">
                <Link href="/#plans" className="inline-flex items-center justify-center gap-1.5 bg-[#f59e0b] text-[#1a3fa0] px-5 py-2.5 rounded-full font-black text-sm shadow-xl shadow-[#f59e0b]/30 hover:scale-105 active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-base">app_registration</span>
                  سجّل الآن
                </Link>
                <Link href="/tracks" className="inline-flex items-center justify-center gap-1.5 border-2 border-white/30 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-base">explore</span>
                  استكشف المسارات
                </Link>
              </div>
            </div>

            {/* Left side — Circular hero image with emojis */}
            <div className="flex flex-col items-center order-2 lg:order-2">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[#f59e0b]/20 rounded-full blur-3xl scale-110"></div>
                {/* Main circular image */}
                <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  <Image src="/hero.jpeg" alt="Tech Makers Egypt" fill sizes="(max-width: 1024px) 320px, 384px" priority style={{ objectFit: 'cover' }} />
                </div>
                {/* Emojis */}
                <div className="absolute -top-4 -right-2 md:-top-6 md:-right-4 text-4xl md:text-5xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>🚀</div>
                <div className="absolute -bottom-4 -left-2 md:-bottom-6 md:-left-4 text-4xl md:text-5xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3s' }}>🤖</div>
                {/* Floating badges */}
                <div className="absolute top-8 -left-6 md:top-12 md:-left-10 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                  <span className="text-xs md:text-sm font-bold">AI</span>
                </div>
                <div className="absolute bottom-8 -right-6 md:bottom-12 md:-right-10 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                  <span className="text-xs md:text-sm font-bold">Code</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* مميزات البرنامج */}
      <section className="section-padding" id="features">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-2 rounded-full mb-4">مميزات البرنامج</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">ليه Tech Makers؟</h2>
            <p className="text-[var(--color-text-secondary)] text-base md:text-lg max-w-2xl mx-auto">برنامج متكامل يجمع بين البرمجة والذكاء الاصطناعي وتطوير المهارات الشخصية</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: 'code', title: 'برمجة حقيقية', desc: 'تعلم البرمجة من الصفر للاحتراف مع مشاريع تطبيقية', cls: 'bg-blue-50 text-blue-600 border-blue-100' },
              { icon: 'smart_toy', title: 'ذكاء اصطناعي', desc: 'تطبيقات عملية على الذكاء الاصطناعي وتعلم الآلات', cls: 'bg-purple-50 text-purple-600 border-purple-100' },
              { icon: 'psychology', title: 'تفكير منطقي', desc: 'تطوير مهارات التفكير المنطقي وحل المشكلات', cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
              { icon: 'emoji_events', title: 'شهادات معتمدة', desc: 'شهادة دولية معتمدة بعد إنهاء كل برنامج', cls: 'bg-amber-50 text-amber-600 border-amber-100' },
              { icon: 'groups', title: 'مشاريع فريقية', desc: 'عمل مشاريع حقيقية مع زملاء في فريق', cls: 'bg-rose-50 text-rose-600 border-rose-100' },
              { icon: 'rocket_launch', title: 'أولمبيات البرمجة', desc: 'التأهيل لأولمبيات البرمجة الدولية', cls: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
            ].map((item, i) => (
              <div key={i} className="public-card p-3 md:p-4 border border-[var(--color-border-subtle)]">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 shrink-0 ${item.cls.split(' ')[0]} rounded-lg flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-lg ${item.cls.split(' ')[1]}`}>{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--color-text-primary)] mb-0.5">{item.title}</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* المسارات التعليمية */}
      <section className="section-padding bg-[var(--color-surface-dim)]" id="tracks">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-2 rounded-full mb-4">المسارات التعليمية</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">اختار المسار اللي يناسب ابنك</h2>
            <p className="text-[var(--color-text-secondary)] text-base md:text-lg">كل عمر ليه الطريقة المناسبة — مش هنخلط بينهم</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {[
              { track: 'Track A', title: 'استكشاف التكنولوجيا', en: 'Junior Tech Explorers', age: 'من 8 إلى 11 سنة', icon: 'rocket_launch', iconChild: 'child_care', items: [{ icon: 'visibility', text: 'تعلم مرئي تفاعلي' }, { icon: 'sports_esports', text: 'ألعاب تعليمية ذكية' }, { icon: 'palette', text: 'مشاريع إبداعية ممتعة' }], gradient: 'from-emerald-400 via-teal-400 to-cyan-400', btn: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-200', text: 'text-emerald', bg: 'bg-emerald', border: 'border-emerald', link: '/tracks?track=a' },
              { track: 'Track B', title: 'مهندس الذكاء الاصطناعي', en: 'Future AI Engineers', age: 'من 12 إلى 15 سنة', icon: 'smart_toy', iconChild: 'psychology', items: [{ icon: 'code', text: 'برمجة حقيقية ومواقع' }, { icon: 'smart_toy', text: 'مسارات عمل الذكاء الاصطناعي' }, { icon: 'psychology', text: 'تفكير تقني متقدم' }], gradient: 'from-blue-500 via-indigo-500 to-violet-500', btn: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-200', text: 'text-blue', bg: 'bg-blue', border: 'border-blue', link: '/tracks?track=b' },
              { track: 'Track C', title: 'مهندس التكنولوجيا', en: 'Future Tech Engineers', age: 'من 16 إلى 20 سنة', icon: 'bolt', iconChild: 'engineering', items: [{ icon: 'rocket_launch', text: 'تطوير ويب شامل' }, { icon: 'smart_toy', text: 'هندسة الذكاء الاصطناعي' }, { icon: 'phone_iphone', text: 'تطوير تطبيقات الموبايل' }, { icon: 'analytics', text: 'تحليل البيانات المتقدم' }], gradient: 'from-purple-500 via-fuchsia-500 to-pink-500', btn: 'from-purple-500 to-fuchsia-500', shadow: 'shadow-purple-200', text: 'text-purple', bg: 'bg-purple', border: 'border-purple', link: '/tracks?track=c' },
            ].map((t, i) => (
              <div key={i} className="public-card overflow-hidden group">
                <div className={`h-1.5 bg-gradient-to-r ${t.gradient}`}></div>
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`${t.bg}-50 ${t.border}-200 border px-2.5 py-1 rounded-lg`}>
                      <span className={`${t.text}-700 font-bold text-xs`}>{t.track}</span>
                    </div>
                    <span className={`material-symbols-outlined text-3xl ${t.text}-400 group-hover:scale-125 transition-transform duration-500`}>{t.icon}</span>
                  </div>
                  <h3 className={`text-base font-bold ${t.text}-700 mb-1`}>{t.title}</h3>
                  <p className={`${t.text}-600 text-xs font-semibold mb-1.5`}>{t.en}</p>
                  <p className="text-[var(--color-text-secondary)] text-xs mb-3 flex items-center gap-1.5">
                    <span className={`material-symbols-outlined ${t.text}-500 text-sm`}>{t.iconChild}</span>
                    {t.age}
                  </p>
                  <div className="space-y-1.5 mb-4">
                    {t.items.map((item, j) => (
                      <div key={j} className={`flex items-center gap-2 ${t.bg}-50 p-2 rounded-lg ${t.border}-50 border`}>
                        <span className={`material-symbols-outlined ${t.text}-500 text-sm`}>{item.icon}</span>
                        <span className="text-xs text-[var(--color-text-primary)]">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={t.link} className={`w-full block text-center py-2 bg-gradient-to-r ${t.btn} text-white rounded-lg font-bold text-sm ${t.shadow} shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all`}>
                    ابدأ الرحلة
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* البرامج المميزة */}
      <section className="section-padding" id="programs">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#f59e0b]/10 text-[#b45309] text-sm font-bold px-4 py-2 rounded-full mb-4">برامج مميزة</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">برامج إضافية متخصصة</h2>
            <p className="text-[var(--color-text-secondary)] text-base md:text-lg">برامج مكملة لتقوية المهارات الأكاديمية والتقنية</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* الثانوية العامة */}
            <Link href="/secondary" className="public-card overflow-hidden group">
              <div className="relative h-36 overflow-hidden">
                <Image src="/secondary-banner.jpg" alt="برنامج الثانوية العامة" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute top-3 right-3">
                  <span className="inline-block bg-[#f59e0b] text-[#1a3fa0] text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">برنامج خاص</span>
                </div>
                <div className="absolute bottom-3 right-3 left-3">
                  <h3 className="text-white text-base font-bold mb-0.5">برمجة + ذكاء اصطناعي</h3>
                  <p className="text-white/70 text-xs">الثانوية العامة — الصف الثالث الثانوي</p>
                </div>
              </div>
              <div className="p-3.5">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {['اعتماد رسمي', 'شهادة دولية', 'منصة QUREO'].map((tag, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[var(--color-primary)] font-bold text-xs">
                  <span>اكتشف البرنامج</span>
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                </div>
              </div>
            </Link>

            {/* Techno Math */}
            <Link href="/technomath" className="public-card overflow-hidden group">
              <div className="relative h-36 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-amber-200">
                    <span className="material-symbols-outlined text-white text-3xl">calculate</span>
                  </div>
                  <span className="inline-block bg-[#f59e0b]/20 text-[#b45309] text-xs font-bold px-2.5 py-0.5 rounded-full">جديد</span>
                </div>
              </div>
              <div className="p-3.5">
                <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-1">Techno Math</h3>
                <p className="text-[var(--color-text-secondary)] text-xs mb-3">حساب ذهني من العداد للسرعة الاحترافية — 12 شهر، من 8 لـ 15 سنة</p>
                <div className="flex items-center gap-1.5 text-[#b45309] font-bold text-xs">
                  <span>اكتشف البرنامج</span>
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                </div>
              </div>
            </Link>

            {/* Tech English */}
            <Link href="/techenglish" className="public-card overflow-hidden group">
              <div className="relative h-36 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-200">
                    <span className="material-symbols-outlined text-white text-3xl">translate</span>
                  </div>
                  <span className="inline-block bg-blue-100 text-blue-600 text-xs font-bold px-2.5 py-0.5 rounded-full">جديد</span>
                </div>
              </div>
              <div className="p-3.5">
                <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-1">Tech English</h3>
                <p className="text-[var(--color-text-secondary)] text-xs mb-3">إنجليزية التكنولوجيا — مش للمدرسة بس، لعالم البرمجة. 12 شهر من A1 لـ B2</p>
                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
                  <span>اكتشف البرنامج</span>
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* مش بس برمجة */}
      <section className="section-padding" id="extras">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">مش بس برمجة — بنهتم بكل جوانب طفلك</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Techno Math */}
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

            {/* Tech English */}
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

            {/* إخصائي سلوكي */}
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

            {/* TKA-Egypt */}
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

      {/* طلابنا المتميزين */}
      <section className="section-padding" id="students">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-4 py-2 rounded-full mb-4">طلاب متميزين</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">نماذج نجاح حقيقية</h2>
            <p className="text-[var(--color-text-secondary)] text-base md:text-lg">طلاب بشهادات معتمدة — ابنك ممكن يكون الجاي</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { name: 'Mohamed Hossam Ali', cert: '400176BT', img: '1.png' },
              { name: 'Habiba Amgad Mahmoud', cert: '400172AU', img: '2.png' },
              { name: 'Hala Amgad Mahmoud', cert: '400173AU', img: '3.png' },
              { name: 'Habiba Hussain Alsayed', cert: '400138AU', img: '4.png' },
              { name: 'Aysen Hossam Ali', cert: '400177BT', img: '5.png' },
              { name: 'Sila Ahmed Mahmoud', cert: '400125AU', img: '6.png' },
              { name: 'Seif Hesham Mohamed', cert: '400126AU', img: '7.png' },
              { name: 'Ziad Ahmed Alsayigh', cert: '400114AU', img: '8.png' },
              { name: 'Hamza Hussain Alsayed', cert: '400137AU', img: '9.png' },
              { name: 'Ahmed Mohamed Fouad', cert: '400122AU', img: '10.png' },
              { name: 'Tala Naser Abdelfatah', cert: '400179AU', img: '11.png' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="relative mb-3">
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#f59e0b] via-[#fbbf24] to-[#f59e0b] rounded-full opacity-70 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
                  <div className="student-avatar relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-[3px] border-[#f59e0b] shadow-lg shadow-[#f59e0b]/30">
                    <Image src={`/student/${s.img}`} alt={s.name} width={200} height={200} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-[var(--color-text-primary)] text-xs mb-0.5">{s.name}</h4>
                  <div className="flex items-center justify-center gap-1 text-[var(--color-accent-text)]">
                    <span className="material-symbols-outlined text-xs">badge</span>
                    <span className="text-xs font-semibold">{s.cert}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* آراء الأهالي */}
      <section className="section-padding bg-[var(--color-surface-dim)]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">أهالي قالوا</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { text: 'ابني عمل أول مشروع ويب في 3 شهور. فريق محترم ومتابعة ممتازة.', name: 'أم محمد', location: '🇸🇦 الرياض، السعودية', stars: 5 },
              { text: 'بنتي بقت بتصمم تطبيقات بنفسها. أفضل قرار خذيته.', name: 'أبو عبدالله', location: '🇰🇼 الكويت', stars: 5 },
              { text: 'محتوى عملي حقيقي — بنتي عملت مشاريع روبوتيكس وعرضت في المدرسة.', name: 'م. سارة أحمد', location: '🇪🇬 القاهرة، مصر', stars: 5 },
            ].map((t, i) => (
              <div key={i} className="public-card p-4">
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <span key={j} className="material-symbols-outlined text-[#f59e0b] text-sm">star</span>
                  ))}
                </div>
                <p className="text-[var(--color-text-primary)] text-xs leading-relaxed mb-3">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">person</span>
                  </div>
                  <div>
                    <p className="font-bold text-[var(--color-text-primary)] text-xs">{t.name}</p>
                    <p className="text-[var(--color-text-secondary)] text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* أسعار وخطط الاشتراك */}
      <section className="section-padding bg-[var(--color-surface-dim)]" id="plans">
        <div className="max-w-4xl mx-auto px-4">
          {/* جزء من القيمة الفعلية */}
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

      {/* CTA Final */}
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
