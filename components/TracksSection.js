import Link from 'next/link';

export default function TracksSection() {
  return (
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
  );
}
