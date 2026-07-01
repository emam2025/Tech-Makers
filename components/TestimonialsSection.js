export default function TestimonialsSection() {
  return (
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
  );
}
