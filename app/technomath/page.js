import Link from 'next/link';

export default function TechnoMathPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative py-16 md:py-24 px-margin-mobile md:px-margin-desktop bg-surface overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-tertiary rounded-full blur-3xl" />
        </div>
        <div className="max-w-container-max mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/#why" className="text-primary hover:text-primary-deep transition-colors">
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </Link>
            <span className="text-on-surface-variant text-sm">العودة للمميزات الإضافية</span>
          </div>
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-primary rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-3xl">calculate</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-primary-light bg-primary-light/10 px-3 py-1 rounded-full inline-block mb-1">إضافة مستقلة</span>
                <h1 className="font-headline-xl text-headline-lg md:text-headline-xl text-primary">برنامج الحساب الذهني — تكنو ماس</h1>
              </div>
            </div>
            <p className="text-on-surface-variant font-body-lg text-body-lg leading-relaxed mb-8">
              برنامج تدريبي ممتد لمدة عام كامل يهدف إلى تطوير مهارات الحساب الذهني لدى الأطفال باستخدام أساليب علمية متدرجة تبدأ من استخدام العداد (Abacus) وصولًا إلى التخيل الذهني والحساب السريع المتقدم، مما يعزز التركيز، سرعة البديهة، والقدرات العقلية.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-xl text-sm font-bold">
                <span className="material-symbols-outlined text-lg">schedule</span>
                12 شهر
              </div>
              <div className="flex items-center gap-2 bg-tertiary/10 text-tertiary px-4 py-2 rounded-xl text-sm font-bold">
                <span className="material-symbols-outlined text-lg">group</span>
                8 — 15 سنة
              </div>
              <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-xl text-sm font-bold">
                <span className="material-symbols-outlined text-lg">trending_up</span>
                4 مستويات
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CARD */}
      <section className="py-12 px-margin-mobile md:px-margin-desktop bg-white">
        <div className="max-w-container-max mx-auto">
          <div className="bg-gradient-to-br from-primary/5 to-tertiary/5 rounded-32 p-8 md:p-12 border border-primary/10 card-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-light to-primary rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">psychology</span>
              </div>
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary">برنامج الحساب الذهني "تكنو ماس"</h2>
                <p className="text-on-surface-variant text-sm">Smart Kids Brain Training Program</p>
              </div>
            </div>
            <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
              برنامج تدريبي للأطفال من 8 إلى 15 سنة لتطوير مهارات الحساب الذهني من العداد إلى التخيل والسرعة الذهنية الاحترافية خلال عام كامل.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 text-center border border-primary/10">
                <span className="material-symbols-outlined text-primary text-2xl mb-2 block">schedule</span>
                <span className="text-on-surface font-bold text-sm block">12 شهر</span>
                <span className="text-on-surface-variant text-xs">المدة الإجمالية</span>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-tertiary/10">
                <span className="material-symbols-outlined text-tertiary text-2xl mb-2 block">group</span>
                <span className="text-on-surface font-bold text-sm block">8 — 15 سنة</span>
                <span className="text-on-surface-variant text-xs">الفئة العمرية</span>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-secondary/10">
                <span className="material-symbols-outlined text-secondary text-2xl mb-2 block">layers</span>
                <span className="text-on-surface font-bold text-sm block">4 مستويات</span>
                <span className="text-on-surface-variant text-xs">تدرج علمي</span>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-emerald-200">
                <span className="material-symbols-outlined text-emerald-600 text-2xl mb-2 block">emoji_events</span>
                <span className="text-on-surface font-bold text-sm block">احترافي</span>
                <span className="text-on-surface-variant text-xs">الهدف النهائي</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GOALS */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-primary mb-4">أهداف البرنامج</h2>
            <div className="h-1.5 w-24 bg-secondary-container mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              { icon: 'speed', text: 'تنمية مهارات الحساب الذهني السريع', color: 'primary' },
              { icon: 'center_focus_strong', text: 'تعزيز التركيز والانتباه العقلي', color: 'secondary' },
              { icon: 'bolt', text: 'تطوير سرعة معالجة المعلومات', color: 'tertiary' },
              { icon: 'architecture', text: 'بناء أساس رياضي قوي للأطفال', color: 'primary' },
              { icon: 'visibility', text: 'تدريب الدماغ على التخيل الحسابي', color: 'secondary' },
              { icon: 'trending_up', text: 'رفع مستوى الثقة في حل المسائل', color: 'tertiary' },
            ].map((item, i) => (
              <div key={i} className="group bg-white p-5 md:p-6 rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 flex items-start gap-4">
                <div className={`w-10 h-10 bg-${item.color}/10 rounded-xl flex items-center justify-center shrink-0`}>
                  <span className={`material-symbols-outlined text-${item.color}`}>{item.icon}</span>
                </div>
                <p className="text-on-surface font-body-md text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINEE PATH - 4 LEVELS */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop bg-white">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-primary mb-4">المسار التدريبي</h2>
            <p className="text-on-surface-variant font-body-lg text-body-lg">4 مستويات خلال عام كامل — من الأساسيات إلى الاحتراف</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* Level 1 */}
            <div className="bg-white rounded-32 border-2 border-emerald-400/40 shadow-[0_4px_24px_rgba(16,185,129,0.1)] overflow-hidden">
              <div className="bg-gradient-to-l from-emerald-50 to-emerald-100/50 p-6 md:p-8 border-b border-emerald-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">3 شهور</span>
                  </div>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-emerald-700 mb-2">🟢 المستوى الأول: أساسيات العداد (Abacus Foundation)</h3>
                <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">تعليم الطفل أساسيات استخدام العداد كأداة بصرية لفهم الأرقام والعمليات الحسابية.</p>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-headline-md text-headline-md text-emerald-700 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">track_targets</span>
                      الأهداف
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span> التعرف على الأرقام</li>
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span> استخدام العداد</li>
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span> الجمع والطرح البسيط</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-emerald-700 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">school</span>
                      المخرجات
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-emerald-500 text-base">arrow_left</span> فهم بصري للأرقام</li>
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-emerald-500 text-base">arrow_left</span> إجراء عمليات حسابية بسيطة</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Level 2 */}
            <div className="bg-white rounded-32 border-2 border-yellow-400/40 shadow-[0_4px_24px_rgba(234,179,8,0.1)] overflow-hidden">
              <div className="bg-gradient-to-l from-yellow-50 to-amber-100/50 p-6 md:p-8 border-b border-yellow-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">3 شهور</span>
                  </div>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-yellow-700 mb-2">🟡 المستوى الثاني: الانتقال إلى التخيل</h3>
                <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">تحويل استخدام العداد إلى صورة ذهنية داخل عقل الطفل بدون أدوات فعلية.</p>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-headline-md text-headline-md text-yellow-700 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">track_targets</span>
                      الأهداف
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-yellow-500 text-base">check_circle</span> تدريب الذاكرة البصرية</li>
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-yellow-500 text-base">check_circle</span> تصور العداد ذهنياً</li>
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-yellow-500 text-base">check_circle</span> تنفيذ عمليات أسرع</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-yellow-700 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">school</span>
                      المخرجات
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-yellow-500 text-base">arrow_left</span> حساب ذهني بسيط بدون أدوات</li>
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-yellow-500 text-base">arrow_left</span> تحسين التركيز العقلي</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Level 3 */}
            <div className="bg-white rounded-32 border-2 border-orange-400/40 shadow-[0_4px_24px_rgba(249,115,22,0.1)] overflow-hidden">
              <div className="bg-gradient-to-l from-orange-50 to-orange-100/50 p-6 md:p-8 border-b border-orange-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">3 شهور</span>
                  </div>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-orange-700 mb-2">🟠 المستوى الثالث: السرعة الذهنية</h3>
                <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">تطوير سرعة الأداء في العمليات الحسابية باستخدام العقل فقط.</p>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-headline-md text-headline-md text-orange-700 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">track_targets</span>
                      الأهداف
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-orange-500 text-base">check_circle</span> تسريع العمليات الحسابية</li>
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-orange-500 text-base">check_circle</span> الجمع والطرح والضرب السريع</li>
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-orange-500 text-base">check_circle</span> تقليل الاعتماد على الورق</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-orange-700 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">school</span>
                      المخرجات
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-orange-500 text-base">arrow_left</span> سرعة عالية في الحساب</li>
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-orange-500 text-base">arrow_left</span> دقة في النتائج</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Level 4 */}
            <div className="bg-white rounded-32 border-2 border-red-400/40 shadow-[0_4px_24px_rgba(239,68,68,0.1)] overflow-hidden">
              <div className="bg-gradient-to-l from-red-50 to-red-100/50 p-6 md:p-8 border-b border-red-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">3 شهور</span>
                  </div>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-red-700 mb-2">🔴 المستوى الرابع: الاحتراف الذهني</h3>
                <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">مرحلة متقدمة لتطوير مهارات الحساب الذهني الاحترافي وحل المسائل المعقدة بسرعة عالية جدًا.</p>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-headline-md text-headline-md text-red-700 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">track_targets</span>
                      الأهداف
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-red-500 text-base">check_circle</span> حل مسائل مركبة بسرعة</li>
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-red-500 text-base">check_circle</span> تطوير التفكير المنطقي</li>
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-red-500 text-base">check_circle</span> الوصول لسرعة ذهنية عالية جدًا</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-red-700 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">school</span>
                      المخرجات
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-red-500 text-base">arrow_left</span> مستوى احترافي في الحساب الذهني</li>
                      <li className="flex items-center gap-2 text-on-surface-variant text-sm"><span className="material-symbols-outlined text-red-500 text-base">arrow_left</span> قدرة على حل مسائل خلال ثواني</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM DURATION */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-container-max mx-auto text-center">
          <div className="max-w-2xl mx-auto bg-white rounded-32 p-8 md:p-12 border border-primary/10 card-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">timer</span>
            </div>
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-primary mb-4">إجمالي مدة البرنامج</h2>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">12 شهر</div>
            <p className="text-on-surface-variant text-sm">عام كامل — 4 مستويات × 3 شهور لكل مستوى</p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop bg-white">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-primary mb-4">مميزات البرنامج</h2>
            <div className="h-1.5 w-24 bg-secondary-container mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              { icon: 'child_care', text: 'مناسب للأطفال والناشئة', desc: 'من 8 إلى 15 سنة' },
              { icon: 'trending_up', text: 'تدريج علمي', desc: 'من السهل إلى الاحتراف' },
              { icon: 'psychology', text: 'تنمية الذكاء والتركيز', desc: 'تعزيز القدرات العقلية' },
              { icon: 'school', text: 'إعداد قوي للرياضيات', desc: ' foundation للمستقبل الأكاديمي' },
            ].map((item, i) => (
              <div key={i} className="group bg-surface rounded-24 p-6 text-center border border-outline-variant/20 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
                </div>
                <h4 className="font-headline-md text-headline-md text-primary mb-1">{item.text}</h4>
                <p className="text-on-surface-variant text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-margin-mobile md:px-margin-desktop hero-gradient text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-headline-xl text-headline-lg md:text-headline-xl mb-6">ابدأ رحلة طفلك مع الحساب الذهني</h2>
          <p className="text-white/80 font-body-lg text-body-lg mb-8">سجل الآن في برنامج تكنو ماس واعكس مهارات طفلكognitive skills</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 btn-primary"
          >
            <span className="material-symbols-outlined">how_to_reg</span>
            سجّل الآن
          </Link>
        </div>
      </section>
    </>
  );
}
