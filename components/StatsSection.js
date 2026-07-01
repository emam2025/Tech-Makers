export default function StatsSection() {
  return (
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
  );
}
