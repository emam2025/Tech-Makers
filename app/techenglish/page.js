import Link from 'next/link';

export default function TechEnglishPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative py-16 md:py-24 px-margin-mobile md:px-margin-desktop bg-gradient-to-br from-primary-deep via-primary to-primary-light overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-tertiary rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-container-max mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/#why" className="text-white/70 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </Link>
            <span className="text-white/60 text-sm">العودة للمميزات الإضافية</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <span className="material-symbols-outlined text-white text-3xl">translate</span>
            </div>
            <div>
              <span className="font-label-sm text-sm text-tertiary bg-tertiary/20 px-3 py-1 rounded-full inline-block mb-1 border border-tertiary/30">برنامج متكامل</span>
              <h1 className="font-headline-xl text-headline-lg md:text-headline-xl text-white">Tech English — اللغة الإنجليزية التكنولوجية</h1>
            </div>
          </div>

          <p className="text-white/80 font-body-lg text-body-lg leading-relaxed mb-8 max-w-3xl">
            Tech English — لغة المستقبل لأطفال المستقبل. لا تتعلم الإنجليزية لكي تنجح في اختبار...
            بل لكي تدخل عالم التكنولوجيا بثقة.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/20">
              <span className="material-symbols-outlined text-lg">schedule</span>
              12 شهر
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/20">
              <span className="material-symbols-outlined text-lg">school</span>
              4 مستويات
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/20">
              <span className="material-symbols-outlined text-lg">trending_up</span>
              A1 → B2
            </div>
            <div className="flex items-center gap-2 bg-tertiary/30 backdrop-blur-sm text-tertiary px-4 py-2 rounded-xl text-sm font-bold border border-tertiary/40">
              <span className="material-symbols-outlined text-lg">star</span>
              برنامج حصري
            </div>
          </div>

          <Link href="/register?track=techenglish" className="inline-flex items-center gap-3 bg-tertiary text-on-tertiary px-10 py-4 rounded-full font-headline-lg shadow-xl hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined">app_registration</span>
            سجّل الآن
          </Link>
        </div>
      </section>

      {/* QUICK CARD */}
      <section className="py-12 px-margin-mobile md:px-margin-desktop bg-white">
        <div className="max-w-container-max mx-auto">
          <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-32 p-8 md:p-12 border border-primary/10 shadow-[0_8px_32px_rgba(65,105,225,0.08)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-primary rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">auto_stories</span>
              </div>
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary">Tech English — اللغة الإنجليزية التكنولوجية</h2>
                <p className="text-on-surface-variant text-sm">English for Future Technology</p>
              </div>
            </div>
            <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
              برنامج متكامل لمدة 12 شهر يُجهّز الطالب لاستخدام الإنجليزية في عالم التكنولوجيا. 4 مستويات متدرجة من A1 إلى B2، مع تركيز على المحادثة، المفردات التقنية، والمهارات المهنية.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 text-center border border-primary/10">
                <span className="material-symbols-outlined text-primary text-2xl mb-2 block">schedule</span>
                <span className="text-on-surface font-bold text-sm block">12 شهر</span>
                <span className="text-on-surface-variant text-xs">المدة الإجمالية</span>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-blue-200">
                <span className="material-symbols-outlined text-blue-500 text-2xl mb-2 block">group</span>
                <span className="text-on-surface font-bold text-sm block">جميع الأعمار</span>
                <span className="text-on-surface-variant text-xs">من 8 سنوات فما فوق</span>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-tertiary/10">
                <span className="material-symbols-outlined text-tertiary text-2xl mb-2 block">trending_up</span>
                <span className="text-on-surface font-bold text-sm block">4 مستويات</span>
                <span className="text-on-surface-variant text-xs">A1 → B2</span>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-secondary/10">
                <span className="material-symbols-outlined text-secondary text-2xl mb-2 block">translate</span>
                <span className="text-on-surface font-bold text-sm block">شامل</span>
                <span className="text-on-surface-variant text-xs">محادثة + قراءة + كتابة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop bg-bg-off-white">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary px-5 py-2 rounded-full font-label-md mb-4 border border-primary/20">
              <span className="material-symbols-outlined text-sm align-middle">route</span> رحلة التعلم
            </span>
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-primary mb-3">Tech English Journey</h2>
            <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">4 مستويات متدرجة من A1 إلى B2، كل مستوى 3 أشهر، تصميم مخصص لجعل الطالب يتحدث الإنجليزية بثقة في عالم التكنولوجيا</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-primary to-primary-deep -translate-x-1/2 rounded-full"></div>

            {/* Level 1 */}
            <div className="relative flex flex-col md:flex-row gap-8 mb-16 items-center">
              <div className="md:w-1/2 md:text-right">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(59,130,246,0.1)] border border-blue-100 hover:shadow-[0_12px_40px_rgba(59,130,246,0.2)] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">L1</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">3 أشهر</span>
                    </div>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-primary-deep mb-2">Tech English Starter</h3>
                  <span className="text-blue-500 font-bold text-sm">A1 Foundation</span>
                  <p className="text-on-surface-variant text-sm mt-3 mb-4">بناء أساس لغوي بسيط يجعل الطالب قادرًا على فهم والتحدث في مواقف يومية وتقنية بسيطة.</p>

                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-blue-500 text-lg">record_voice_over</span>
                        <span className="font-bold text-sm text-primary-deep">Speaking Confidence</span>
                      </div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        <li>• تقديم النفس والحديث عن الهوايات</li>
                        <li>• وصف الأشياء وطرح الأسئلة</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-blue-500 text-lg">hearing</span>
                        <span className="font-bold text-sm text-primary-deep">Listening Skills</span>
                      </div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        <li>• فهم المحادثات البسيطة</li>
                        <li>• التقاط الكلمات الأساسية</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-blue-500 text-lg">devices</span>
                        <span className="font-bold text-sm text-primary-deep">Vocabulary: Technology Basics</span>
                      </div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        <li>• Computer Parts, Internet, Apps, Devices</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <p className="text-xs font-bold text-blue-600 mb-2">المهارات المكتسبة:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">تقديم النفس بثقة</span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">فهم محادثات قصيرة</span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">كلمات تقنية أساسية</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Timeline dot */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-500 rounded-full items-center justify-center shadow-lg shadow-blue-500/30 z-10">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="md:w-1/2"></div>
            </div>

            {/* Level 2 */}
            <div className="relative flex flex-col md:flex-row gap-8 mb-16 items-center">
              <div className="md:w-1/2"></div>
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/30 z-10">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(65,105,225,0.1)] border border-primary/10 hover:shadow-[0_12px_40px_rgba(65,130,225,0.2)] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-deep rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">L2</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">3 أشهر</span>
                    </div>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-primary-deep mb-2">Tech Explorer</h3>
                  <span className="text-primary font-bold text-sm">A2 Communication</span>
                  <p className="text-on-surface-variant text-sm mt-3 mb-4">نقل الطالب من فهم الكلمات إلى التواصل الحقيقي. التعبير عن الرأي وشرح الأفكار التقنية.</p>

                  <div className="space-y-3">
                    <div className="bg-primary/5 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-lg">chat</span>
                        <span className="font-bold text-sm text-primary-deep">Conversation</span>
                      </div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        <li>• التعبير عن الرأي وشرح فكرة</li>
                        <li>• وصف مشكلة وطلب المساعدة</li>
                      </ul>
                    </div>
                    <div className="bg-primary/5 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-lg">play_circle</span>
                        <span className="font-bold text-sm text-primary-deep">Listening</span>
                      </div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        <li>• فيديوهات قصيرة ومقاطع تقنية مبسطة</li>
                        <li>• محادثات واقعية</li>
                      </ul>
                    </div>
                    <div className="bg-primary/5 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-lg">code</span>
                        <span className="font-bold text-sm text-primary-deep">Vocabulary: Technology</span>
                      </div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        <li>• Coding, Programming, AI, Robots, Digital World</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-primary/10">
                    <p className="text-xs font-bold text-primary mb-2">المهارات المكتسبة:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">يتحدث في مواقف يومية</span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">يشرح فكرة تقنية</span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">يزيد الثقة</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Level 3 */}
            <div className="relative flex flex-col md:flex-row gap-8 mb-16 items-center">
              <div className="md:w-1/2 md:text-right">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(139,92,246,0.1)] border border-violet-100 hover:shadow-[0_12px_40px_rgba(139,92,246,0.2)] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">L3</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-violet-600 bg-violet-100 px-3 py-1 rounded-full">3 أشهر</span>
                    </div>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-primary-deep mb-2">Future Tech Communicator</h3>
                  <span className="text-violet-500 font-bold text-sm">B1 Intermediate</span>
                  <p className="text-on-surface-variant text-sm mt-3 mb-4">استخدام الإنجليزية للتعلم والتعاون في المجال التقني. العروض النقاشات والكتابة.</p>

                  <div className="space-y-3">
                    <div className="bg-violet-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-violet-500 text-lg">mic</span>
                        <span className="font-bold text-sm text-primary-deep">Speaking</span>
                      </div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        <li>• Presentations & Discussions</li>
                        <li>• Team Communication</li>
                      </ul>
                    </div>
                    <div className="bg-violet-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-violet-500 text-lg">edit_note</span>
                        <span className="font-bold text-sm text-primary-deep">Writing</span>
                      </div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        <li>• كتابة وصف مشروع وأفكار ورسائل</li>
                      </ul>
                    </div>
                    <div className="bg-violet-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-violet-500 text-lg">smart_toy</span>
                        <span className="font-bold text-sm text-primary-deep">Technology Topics</span>
                      </div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        <li>• AI, Cybersecurity, Web Dev, Future Jobs</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-violet-100">
                    <p className="text-xs font-bold text-violet-600 mb-2">المهارات المكتسبة:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">يتحدث بطلاقة أفضل</span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">يشرح مشاريع تقنية</span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">يشارك في نقاشات</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-violet-500 rounded-full items-center justify-center shadow-lg shadow-violet-500/30 z-10">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="md:w-1/2"></div>
            </div>

            {/* Level 4 */}
            <div className="relative flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2"></div>
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full items-center justify-center shadow-lg shadow-amber-500/30 z-10">
                <span className="text-white font-bold">4</span>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(245,158,11,0.1)] border border-amber-100 hover:shadow-[0_12px_40px_rgba(245,158,11,0.2)] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">L4</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">3 أشهر</span>
                      <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mr-2">+ مشروع نهائي</span>
                    </div>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-primary-deep mb-2">Tech Professional</h3>
                  <span className="text-amber-600 font-bold text-sm">B2 Advanced Communication</span>
                  <p className="text-on-surface-variant text-sm mt-3 mb-4">تجهيز الطالب لاستخدام الإنجليزية في الدراسة والمستقبل التقني. المهارات المهنية والمشاريع.</p>

                  <div className="space-y-3">
                    <div className="bg-amber-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-amber-600 text-lg">record_voice_over</span>
                        <span className="font-bold text-sm text-primary-deep">Advanced Speaking</span>
                      </div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        <li>• Presentations, Problem Solving, Debates</li>
                      </ul>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-amber-600 text-lg">work</span>
                        <span className="font-bold text-sm text-primary-deep">Professional English</span>
                      </div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        <li>• كتابة CV، Interview Skills، Email Communication</li>
                      </ul>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-amber-600 text-lg">precision_manufacturing</span>
                        <span className="font-bold text-sm text-primary-deep">AI & Technology English</span>
                      </div>
                      <ul className="text-xs text-on-surface-variant space-y-1">
                        <li>• قراءة مقالات تقنية وفهم أدوات الذكاء الاصطناعي</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-amber-100">
                    <p className="text-xs font-bold text-amber-600 mb-2">المخرجات النهائية:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">يتحدث بثقة</span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">يتعلم من مصادر أجنبية</span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">مشروع نهائي</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop bg-gradient-to-br from-primary-deep to-primary">
        <div className="max-w-container-max mx-auto text-center">
          <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-white mb-4">ابدأ رحلتك في Tech English</h2>
          <p className="text-white/80 font-body-lg max-w-2xl mx-auto mb-8">
            سجّل الآن واحصل على مستوى مجاني تقييمي لتحديد مستواك الحالي
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register?track=techenglish" className="bg-tertiary text-on-tertiary px-10 py-4 rounded-full font-headline-lg shadow-xl hover:scale-105 active:scale-95 transition-all">
              سجّل في Tech English
            </Link>
            <Link href="/english-test" className="bg-white/15 backdrop-blur-sm text-white border border-white/30 px-10 py-4 rounded-full font-headline-lg hover:bg-white/25 transition-all">
              اختبر مستواك مجاناً
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
