import Link from 'next/link';
import Image from 'next/image';

export default function ResultsSection() {
  return (
    <>
      <section className="section-padding" id="programs">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#f59e0b]/10 text-[#b45309] text-sm font-bold px-4 py-2 rounded-full mb-4">برامج مميزة</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)] mb-4">برامج إضافية متخصصة</h2>
            <p className="text-[var(--color-text-secondary)] text-base md:text-lg">برامج مكملة لتقوية المهارات الأكاديمية والتقنية</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </>
  );
}
