import Link from 'next/link';
import Image from 'next/image';
import HeroWithHalo from '../components/HeroWithHalo';

export default function HomePage() {
  return (
    <>
      <section role="banner" aria-label="Hero" className="relative py-12 md:py-24 px-margin-mobile md:px-margin-desktop hero-gradient overflow-hidden">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
          {/* Logo */}
          <div className="col-span-1 md:col-span-2 inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full w-fit">
            <span className="text-lg">🌟</span>
            <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wide">Tech Makers Egypt</span>
          </div>
          
          {/* Left Column: Content */}
          <div className="flex flex-col gap-8">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg leading-tight">من <span className="text-secondary-container">مستهلك</span> للتكنولوجيا إلى <span className="text-royal">صانع</span> <span className="text-primary-deep">ومطور</span> و<span className="text-royal">قائد</span></h1>
            
            <p className="text-primary-deep font-headline-lg text-headline-lg flex items-center gap-2">Tech Makers • <span className="font-normal opacity-80">Building Future Tech Leaders</span></p>

            {/* Student Age Cards */}
            <div className="grid grid-cols-3 gap-3 max-w-sm">
              {['8–11 سنة', '12–15 سنة', '16–20 سنة'].map((age, i) => (
                <div key={i} className="bg-white p-2.5 md:p-3 rounded-lg md:rounded-xl shadow-sm text-center font-label-md text-primary text-xs md:text-sm">{age}</div>
              ))}
            </div>

            {/* Tech Pillars */}
            <div className="flex flex-wrap gap-3 md:gap-4">
              {[
                { icon: '🎯', text: 'تفكير منطقي' },
                { icon: '🤖', text: 'ذكاء اصطناعي' },
                { icon: '💡', text: 'مشاريع حقيقية' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 md:gap-3 bg-primary/5 text-primary px-3 md:px-4 py-1.5 md:py-2 rounded-full font-label-md text-xs md:text-sm hover:opacity-95 transition-all">
                  <span className="emoji-badge text-sm md:text-base">{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Detailed Description */}
            <div className="text-on-surface-variant font-body-md md:font-body-lg text-sm md:text-body-lg leading-relaxed space-y-4">
              <p>في عالم تتغير فيه التكنولوجيا بسرعة، أصبح امتلاك المهارات الرقمية ليس اختيارًا… بل ضرورة لصناعة المستقبل. Tech Makers هو برنامج تعليمي متكامل يهدف إلى إعداد جيل جديد من المبدعين والقادة التقنيين، من خلال رحلة عملية تبدأ من أساسيات البرمجة والتفكير المنطقي، وصولًا إلى الذكاء الاصطناعي وبناء المشاريع الرقمية الحقيقية.</p>
              <p className="font-bold">نؤمن أن التكنولوجيا لا يجب أن تكون مجرد أداة للاستهلاك، بل وسيلة للإبداع، الابتكار، وحل المشكلات.</p>
              
              <div className="bg-white p-6 rounded-20 shadow-card border border-primary/5">
                <p className="font-bold mb-3">يركز البرنامج على:</p>
                <ul className="grid md:grid-cols-2 gap-2">
                  {['بناء عقلية تحليلية ومنهجية تفكير هندسية', 'تطوير مهارات البرمجة والذكاء الاصطناعي', 'التعلم بالمشاريع والتطبيق العملي', 'تعزيز الثقة بالنفس والإبداع والعمل الجماعي', 'إعداد الطلاب لمهارات المستقبل والمسارات التقنية الحديثة'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-on-surface-variant"><span className="text-secondary">✅</span> {item}</li>
                  ))}
                </ul>
              </div>

              <p>نحن لا نقدم مادة علمية فقط… بل نبني بيئة تعليمية متكاملة تساعد الطالب على النمو فكريًا، تقنيًا، وشخصيًا.</p>
            </div>
          </div>
          
          {/* Right Column: Hero Illustration */}
          <div className="flex flex-col gap-8 items-center justify-start">
            <HeroWithHalo />
            
            {/* Features Card */}
            <div className="bg-white rounded-20 md:rounded-24 shadow-card-sm p-6 md:p-8 border border-primary/5 w-full md:max-w-sm hover-lift">
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex items-start gap-3 text-on-surface font-body-md text-sm md:text-base"><span className="material-symbols-outlined text-secondary text-lg md:text-xl flex-shrink-0 mt-0.5">check_circle</span> <span>تعلم البرمجة من الصفر للاحتراف</span></div>
                <div className="flex items-start gap-3 text-on-surface font-body-md text-sm md:text-base"><span className="material-symbols-outlined text-secondary text-lg md:text-xl flex-shrink-0 mt-0.5">check_circle</span> <span>تطبيقات عملية على الذكاء الاصطناعي</span></div>
                <div className="flex items-start gap-3 text-on-surface font-body-md text-sm md:text-base"><span className="material-symbols-outlined text-secondary text-lg md:text-xl flex-shrink-0 mt-0.5">check_circle</span> <span>تطوير مهارات التفكير المنطقي والرياضي</span></div>
                <div className="flex items-start gap-3 text-on-surface font-body-md text-sm md:text-base"><span className="material-symbols-outlined text-secondary text-lg md:text-xl flex-shrink-0 mt-0.5">check_circle</span> <span>مشاريع حقيقية وشهادات معتمدة</span></div>
                <div className="flex items-start gap-3 text-on-surface font-body-md text-sm md:text-base"><span className="material-symbols-outlined text-secondary text-lg md:text-xl flex-shrink-0 mt-0.5">check_circle</span> <span>دعم نفسي وتربوي متخصص للمواهب</span></div>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons - Full Width */}
          <div className="col-span-1 md:col-span-2 flex flex-wrap gap-4 mt-4 md:mt-8">
            <Link href="/register" aria-label="سجل الآن في Tech Makers" className="btn-primary">اشترك الآن</Link>
            <Link href="#tracks" className="btn-secondary">استكشف المسارات</Link>
          </div>
        </div>
      </section>

      <section className="section-padding" id="about">
        <div className="container-inner">
          <div className="text-center mb-16 reveal">
            <h2 className="font-headline-xl text-headline-xl text-primary mb-4">إحنا مش بنعلّم برمجة وبس… إحنا بنبني شخصية</h2>
            <p className="text-on-surface-variant font-body-lg text-body-lg">منهج متكامل مبني على 4 محاور أساسية تُعد جيل المستقبل</p>
          </div>
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-20 card-shadow hover-lift border border-primary/5 flex items-start gap-6 reveal reveal-delay-1">
              <div className="w-16 h-16 shrink-0 bg-primary-container/10 flex items-center justify-center rounded-2xl text-primary font-bold text-3xl">01</div>
              <div>
                <h3 className="font-headline-lg text-headline-lg mb-2 text-primary">🧠 التفكير المنطقي</h3>
                <p className="text-on-surface-variant">بناء عقلية تحليلية تُمكّن الطالب من فهم المشكلات وتقسيمها بذكاء</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-20 card-shadow hover-lift border border-primary/5 flex items-start gap-6 reveal reveal-delay-2">
              <div className="w-16 h-16 shrink-0 bg-secondary-container/20 flex items-center justify-center rounded-2xl text-secondary font-bold text-3xl">02</div>
              <div>
                <h3 className="font-headline-lg text-headline-lg mb-2 text-primary">🎨 الإبداع الرقمي</h3>
                <p className="text-on-surface-variant">تحويل الطالب من مستهلك للتكنولوجيا إلى صانع يُنتج أدواته</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-20 card-shadow hover-lift border border-primary/5 flex items-start gap-6 reveal reveal-delay-3">
              <div className="w-16 h-16 shrink-0 bg-tertiary-container/10 flex items-center justify-center rounded-2xl text-tertiary font-bold text-3xl">03</div>
              <div>
                <h3 className="font-headline-lg text-headline-lg mb-2 text-primary">🛠️ التعلم بالمشاريع</h3>
                <p className="text-on-surface-variant">زيادة الثقة بالنفس من خلال تطبيقات عملية ومشاريع حقيقية</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-20 card-shadow hover-lift border border-primary/5 flex items-start gap-6 reveal reveal-delay-4">
              <div className="w-16 h-16 shrink-0 bg-error-container/40 flex items-center justify-center rounded-2xl text-error font-bold text-3xl">04</div>
              <div>
                <h3 className="font-headline-lg text-headline-lg mb-2 text-primary">🤖 التعرض المبكر للـ AI</h3>
                <p className="text-on-surface-variant">إعداد جيل المستقبل بأدوات وتقنيات الذكاء الاصطناعي</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-container-low">
        <div className="container-inner">
          <div className="text-center mb-16 reveal">
            <span className="font-label-md text-label-md text-primary uppercase tracking-wide mb-2 block">النتائج المتوقعة</span>
            <h2 className="font-headline-xl text-headline-xl text-primary mb-4">ماذا سيحقق ابنك من خلال Tech Makers؟</h2>
            <p className="text-on-surface-variant font-body-lg text-body-lg">نتائج ملموسة تؤثر بشكل إيجابي على مستقبل طفلك الأكاديمي والمهني</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white p-6 rounded-xl card-shadow text-center reveal reveal-delay-1">
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg mb-3 text-primary">اكتساب مهارات تقنية متقدمة</h3>
              <ul className="text-right space-y-2">
                <li className="text-on-surface-variant font-body-md text-body-md">• فهم أساسيات البرمجة وتطبيقاتها العملية مما يؤهلهم لمواكبة التطورات التكنولوجية</li>
                <li className="text-on-surface-variant font-body-md text-body-md">• القدرة على التعامل مع مفاهيم الذكاء الاصطناعي وتصميم الروبوتات البسيطة</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl card-shadow text-center reveal reveal-delay-2">
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg mb-3 text-primary">تحسين الأداء الأكاديمي</h3>
              <ul className="text-right space-y-2">
                <li className="text-on-surface-variant font-body-md text-body-md">• تحسين مهارات الحساب الذهني ينعكس إيجابًا على قدرتهم في الرياضيات والعلوم</li>
                <li className="text-on-surface-variant font-body-md text-body-md">• تقوية اللغة الإنجليزية تعزز فهمهم للمواد الدراسية خاصة في المجالات التقنية</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl card-shadow text-center reveal reveal-delay-3">
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg mb-3 text-primary">تنمية المهارات الشخصية</h3>
              <ul className="text-right space-y-2">
                <li className="text-on-surface-variant font-body-md text-body-md">• تطوير مهارات التفكير النقدي وحل المشكلات من خلال المشاريع العملية</li>
                <li className="text-on-surface-variant font-body-md text-body-md">• تعزيز العمل الجماعي والقيادة من خلال المشاركة في أنشطة تعاونية</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl card-shadow text-center reveal reveal-delay-1">
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">💪</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg mb-3 text-primary">زيادة الثقة بالنفس</h3>
              <ul className="text-right space-y-2">
                <li className="text-on-surface-variant font-body-md text-body-md">• إنجاز مشاريع تقنية يعزز ثقة الأطفال بأنفسهم وقدرتهم على الإبداع</li>
                <li className="text-on-surface-variant font-body-md text-body-md">• المشاركة في أنشطة تعليمية متقدمة تشجعهم على تحقيق أهداف أكبر</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl card-shadow text-center">
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔭</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg mb-3 text-primary">فتح آفاق جديدة للتعلم</h3>
              <ul className="text-right space-y-2">
                <li className="text-on-surface-variant font-body-md text-body-md">• تحفيز الأطفال على استكشاف مجالات جديدة في العلوم والتكنولوجيا</li>
                <li className="text-on-surface-variant font-body-md text-body-md">• استعداد أكبر لمواجهة تحديات المستقبل في سوق العمل التقني</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl card-shadow text-center">
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg mb-3 text-primary">بناء جيل مبتكر</h3>
              <ul className="text-right space-y-2">
                <li className="text-on-surface-variant font-body-md text-body-md">• إعداد جيل من الأطفال القادرين على الابتكار والإسهام في تطوير المجتمع</li>
                <li className="text-on-surface-variant font-body-md text-body-md">• أساس قوي في التكنولوجيا والذكاء الاصطناعي يؤهلهم لقيادة مشاريع تكنولوجية</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl card-shadow text-center sm:col-span-2 lg:col-span-3">
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg mb-3 text-primary">تأثير إيجابي على المجتمع</h3>
              <ul className="text-right space-y-2 max-w-2xl mx-auto">
                <li className="text-on-surface-variant font-body-md text-body-md">• زيادة عدد الأطفال الملمين بالتكنولوجيا يسهم في تطوير المجتمع وزيادة الوعي التقني</li>
                <li className="text-on-surface-variant font-body-md text-body-md">• سيكون لهؤلاء الأطفال دور فعال في دفع عجلة الابتكار والتنمية في الوطن العربي</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" id="tracks">
        <div className="container-inner">
          <div className="text-center mb-16">
            <span className="font-label-md text-label-md text-primary uppercase tracking-wide mb-2 block">المسارات التعليمية</span>
            <h2 className="font-headline-xl text-headline-xl text-primary mb-4">اختار مسار الطالب المناسب لعمره</h2>
            <p className="text-on-surface-variant font-body-lg text-body-lg">علشان كل طالب يتعلم بالطريقة المناسبة لسنه ومستواه — فرق كبير في طريقة التفكير، سرعة التعلم، والقدرة على الاستيعاب التقني</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="relative bg-white rounded-24 overflow-hidden card-shadow group">
              <div className="h-3 bg-secondary"></div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-secondary/10 p-4 rounded-2xl">
                    <span className="font-label-md text-label-md text-secondary font-bold">Track A</span>
                  </div>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Junior Tech Explorers</h3>
                <p className="text-on-surface-variant font-body-md text-body-md mb-4">من 8 إلى 11 سنة</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">🎮 Visual Learning</li>
                  <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">🕹️ Gamification</li>
                  <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">🎨 Creative Projects</li>
                </ul>
                <Link href="/tracks?track=a" className="w-full block text-center py-3 border-2 border-secondary text-secondary rounded-xl font-bold group-hover:bg-secondary group-hover:text-white transition-all">شاهد الرحلة ←</Link>
              </div>
            </div>
            <div className="relative bg-white rounded-24 overflow-hidden card-shadow group">
              <div className="h-3 bg-primary-light"></div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-primary-light/10 p-4 rounded-2xl">
                    <span className="font-label-md text-label-md text-primary-light font-bold">Track B</span>
                  </div>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Future AI Engineers</h3>
                <p className="text-on-surface-variant font-body-md text-body-md mb-4">من 12 إلى 15 سنة</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">💻 Real Coding</li>
                  <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">🤖 AI Workflows</li>
                  <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">🧠 Tech Thinking</li>
                </ul>
                <Link href="/tracks?track=b" className="w-full block text-center py-3 border-2 border-primary-light text-primary-light rounded-xl font-bold group-hover:bg-primary-light group-hover:text-white transition-all">شاهد الرحلة ←</Link>
              </div>
            </div>
            <div className="relative bg-white rounded-24 overflow-hidden card-shadow group">
              <div className="h-3 bg-tertiary"></div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-tertiary/10 p-4 rounded-2xl">
                    <span className="font-label-md text-label-md text-tertiary font-bold">Track C</span>
                  </div>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Future Tech Engineers</h3>
                <p className="text-on-surface-variant font-body-md text-body-md mb-4">من 16 إلى 20 سنة</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">🚀 Full Stack</li>
                  <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">🤖 AI Engineering</li>
                  <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">📱 Mobile Dev</li>
                  <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-body-md">📊 Data Analytics</li>
                </ul>
                <Link href="/tracks?track=c" className="w-full block text-center py-3 border-2 border-tertiary text-tertiary rounded-xl font-bold group-hover:bg-tertiary group-hover:text-white transition-all">شاهد الرحلة ←</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface" id="students">
        <div className="container-inner">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/5 text-primary font-label-md text-label-md px-5 py-2 rounded-full mb-4">قصص نجاح</span>
            <h2 className="font-headline-xl text-headline-xl text-primary mb-4">بعض طلابنا المتميزين</h2>
            <p className="text-on-surface-variant font-body-lg text-body-lg">نماذج حية من دفعات سابقة — بأسماء حقيقية وشهادات موثقة</p>
            <div className="h-1.5 w-24 bg-secondary-container mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Tala Nasser Abdelfatah', cert: '400179 AU', img: '1.jpeg' },
              { name: 'Ahmed Mohamed Fouad', cert: '400122 AU', img: '2.jpeg' },
              { name: 'Seif Hesham Mohamed', cert: '400126 AU', img: '3.jpeg' },
              { name: 'Sila Ahmed Mohamed', cert: '400125 AU', img: '4.jpeg' },
              { name: 'Ziad Ahmed AlSayigh', cert: '400114 AU', img: '5.jpeg' },
              { name: 'Aysen Hossam Ali', cert: '400177 BT', img: '6.jpeg' },
              { name: 'Mariam Saeed Ali', cert: '400180 AU', img: '7.jpeg' },
              { name: 'Omar Karim ElSheikh', cert: '400181 AU', img: '8.jpeg' },
              { name: 'Nourhan Gamal', cert: '400182 AU', img: '9.jpeg' },
              { name: 'Youssef Ali', cert: '400183 AU', img: '10.jpeg' },
              { name: 'Lina Mahmoud', cert: '400184 AU', img: '11.jpeg' },
            ].map((s, i) => (
              <div className="group bg-white rounded-2xl hover:shadow-2xl transition-all overflow-hidden border-2 border-secondary-container/40 hover:border-secondary-container" key={i}>
                <div className="relative overflow-hidden">
                  <Image src={`/student/${s.img}`} alt={s.name} width={300} height={220} loading="lazy" className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>
                <div className="p-5 text-right bg-gradient-to-b from-white to-amber-50/30">
                  <div className="flex items-center gap-2 mb-1">
                    <svg viewBox="0 0 40 40" className="w-8 h-8 flex-shrink-0 drop-shadow-md">
                      <defs>
                        <linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffd700"/>
                          <stop offset="50%" stopColor="#ffec8b"/>
                          <stop offset="100%" stopColor="#daa520"/>
                        </linearGradient>
                      </defs>
                      <circle cx="20" cy="20" r="18" fill="url(#mg)" stroke="#b8860b" strokeWidth="1.5"/>
                      <circle cx="20" cy="23" r="8" fill="none" stroke="#b8860b" strokeWidth="0.8"/>
                      <text x="20" y="20" textAnchor="middle" fill="#8b6914" fontSize="9" fontWeight="bold">★</text>
                      <text x="20" y="31" textAnchor="middle" fill="#8b6914" fontSize="5" fontWeight="bold">تميز</text>
                      <circle cx="20" cy="10" r="3.5" fill="#ffd700" stroke="#b8860b" strokeWidth="0.6"/>
                    </svg>
                    <h4 className="font-headline-lg text-headline-lg text-primary">{s.name}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-[#b8860b] mr-10">
                    <span className="material-symbols-outlined text-sm">badge</span>
                    <span className="font-label-md text-label-md">{s.cert}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="font-headline-xl text-headline-xl text-primary">ابنك ممكن يكون التالي 🌟</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-bg-off-white" id="parents">
        <div className="container-inner">
          <div className="text-center mb-16">
            <span className="inline-block bg-secondary-container/20 text-secondary px-5 py-2 rounded-full font-label-md mb-4">ماذا يقول أولياء الأمور؟</span>
            <h2 className="font-headline-xl text-headline-xl text-primary mb-4">قصص حقيقية من عائلات تثق بنا</h2>
            <p className="text-on-surface-variant font-body-lg text-body-lg">من مصر والخليج — آباء شاهدوا تطور أبنائهم بأعينهم</p>
            <div className="h-1.5 w-24 bg-secondary-container mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 p-8 hover-lift">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
                &quot;ابني اتعلم البرمجة من الصفر وعمل أول مشروع ويب في خلال 3 شهور فقط. الفريق محترم والمتابعة ممتازة.&quot;
              </p>
              <div className="flex items-center gap-3 border-t border-outline-variant/20 pt-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">أم</span>
                </div>
                <div>
                  <span className="font-label-md text-on-surface block">أم محمد</span>
                  <span className="text-on-surface-variant text-sm">🇸🇦 الرياض، السعودية</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 p-8 hover-lift">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
                &quot;أفضل قرار خذيته لبنتي. صارت تحب الذكاء الاصطناعي وتصمم تطبيقات بنفسها. الأسعار مناسبة جداً للجودة.&quot;
              </p>
              <div className="flex items-center gap-3 border-t border-outline-variant/20 pt-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="text-secondary font-bold text-sm">أب</span>
                </div>
                <div>
                  <span className="font-label-md text-on-surface block">أبو عبدالله</span>
                  <span className="text-on-surface-variant text-sm">🇰🇼 الكويت</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 p-8 hover-lift">
              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
                &quot;محتوى عملي وحقيقي، مش مجرد كلام. بنتي بقت بتعمل مشاريع روبوتيكس وعرضت في مدرستها. شكراً TKA!&quot;
              </p>
              <div className="flex items-center gap-3 border-t border-outline-variant/20 pt-4">
                <div className="w-10 h-10 bg-tertiary/10 rounded-full flex items-center justify-center">
                  <span className="text-tertiary font-bold text-sm">م</span>
                </div>
                <div>
                  <span className="font-label-md text-on-surface block">م. سارة أحمد</span>
                  <span className="text-on-surface-variant text-sm">🇪🇬 القاهرة، مصر</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/5 text-primary font-label-md text-label-md px-5 py-2 rounded-full mb-4">لماذا تثق بنا؟</span>
            <h2 className="font-headline-xl text-headline-xl text-primary mb-4">لماذا يثق بنا أولياء الأمور؟</h2>
            <p className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl mx-auto">نتعامل مع أبنائكم بمسؤولية كاملة ونلتزم بأعلى معايير الجودة والأمان التعليمي.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-primary text-3xl">school</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary-deep mb-3">مدربون معتمدون</h3>
              <p className="text-on-surface-variant font-body-md">نخبة من خبراء البرمجة والذكاء الاصطناعي بخبرة تدريسية حقيقية للأطفال والناشئين.</p>
            </div>

            <div className="bg-white rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-secondary text-3xl">workspace_premium</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary-deep mb-3">شهادة معتمدة</h3>
              <p className="text-on-surface-variant font-body-md">شهادة موثقة بعد كل برنامج تعزز السيرة الذاتية لطفلك في رحلته الأكاديمية.</p>
            </div>

            <div className="bg-white rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-tertiary text-3xl">support_agent</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary-deep mb-3">دعم عبر واتساب 7/24</h3>
              <p className="text-on-surface-variant font-body-md">فريق متابعة مخصص لأولياء الأمور للرد على كل استفسار خلال دقائق.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" id="why">
        <div className="container-inner">
          <div className="text-center mb-16">
            <span className="font-label-md text-label-md text-primary uppercase tracking-wide mb-2 block">المزيد من القيمة</span>
            <h2 className="font-headline-xl text-headline-xl text-primary mb-4">مميزات إضافية وبرامج تطويرية</h2>
            <p className="text-on-surface-variant font-body-lg text-body-lg">مش بس منهج تقني — بنهتم بالشخصية والمهارات الداعمة كاملة</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 hover:border-primary transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-2xl">🧠</span>
              </div>
              <span className="font-label-sm text-label-sm text-primary-light bg-primary-light/10 px-3 py-1 rounded-full mb-3 inline-block">إضافة مستقلة</span>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Techno Math</h3>
              <p className="text-on-surface-variant font-body-md text-body-md mb-4">برنامج تطويري لتعزيز التفكير الرياضي والمنطقي بربطه بالتكنولوجيا. تفاصيل الاشتراك والرسوم عند التواصل معنا.</p>
               <Link href="#plans" className="text-primary font-headline-lg text-headline-lg inline-flex items-center gap-1 hover:gap-2 transition-all">استفسر عن البرنامج ←</Link>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 hover:border-primary transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-2xl">🗣️</span>
              </div>
              <span className="font-label-sm text-label-sm text-primary-light bg-primary-light/10 px-3 py-1 rounded-full mb-3 inline-block">إضافة مستقلة</span>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Tech English</h3>
              <p className="text-on-surface-variant font-body-md text-body-md mb-4">برنامج تطويري لبناء ثقة الطالب في التواصل التقني باللغة الإنجليزية. تفاصيل الاشتراك والرسوم عند التواصل معنا.</p>
               <Link href="#plans" className="text-primary font-headline-lg text-headline-lg inline-flex items-center gap-1 hover:gap-2 transition-all">استفسر عن البرنامج ←</Link>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 hover:border-primary transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-2xl">🛡️</span>
              </div>
              <span className="font-label-sm text-label-sm text-green-600 bg-green-100 px-3 py-1 rounded-full mb-3 inline-block">مضمّن</span>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-2">إخصائي سلوكي وإرشادي</h3>
              <p className="text-on-surface-variant font-body-md text-body-md mb-4">إخصائي متخصص لمتابعة الجانب النفسي للطالب، مساعدته في التخلص من الضغوط، ودعمه طوال الرحلة التعليمية بأمان.</p>
              <span className="text-green-600 font-label-md text-label-md">مشمول في الباقة الأساسية</span>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20 hover:border-primary transition-colors group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-2xl">💙</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-2">مدعوم من TKA-Egypt</h3>
              <p className="text-on-surface-variant font-body-md text-body-md mb-4">البرنامج مدعوم جزئياً من TKA-Egypt، مما يضمن جودة عالية مع أسعار مناسبة للأسر المصرية.</p>
              <span className="text-primary font-label-md text-label-md">دعم مستمر للأهالي</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-container-highest/20" id="plans">
        <div className="container-inner">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-32 card-shadow p-8 md:p-12 text-center border border-outline-variant/20">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-4xl">payments</span>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-primary mb-4">خطط أسعار مرنة تناسب كل أسرة</h2>
              <p className="text-on-surface-variant font-body-lg text-body-lg mb-8 max-w-2xl mx-auto">
                نؤمن إن التعلم ملوش عوائق مالية — عشان كده عندنا خطط اشتراك مرنة تختار منها الأنسب لميزانيتك
              </p>

              <div className="bg-gradient-to-l from-primary/5 to-secondary/5 rounded-2xl p-6 md:p-8 mb-8 border border-primary/10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">volunteer_activism</span>
                  <span className="font-headline-lg text-headline-lg text-primary">جزء من القيمة الفعلية</span>
                </div>
                <p className="text-on-surface-variant font-body-md text-body-md leading-relaxed">
                  الاشتراك المدفوع هو <strong className="text-primary">جزء من القيمة الفعلية</strong> للبرنامج فقط — حيث إن برنامج Tech Makers Egypt <strong className="text-primary">ممول جزئياً من TKA-Egypt بأكثر من 40%</strong> من تكلفة البرنامج الفعلية. الحمد لله، ده بيمكننا من تقديم تعليم بجودة عالية وسعر في متناول كل أسرة مصرية.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-surface-container-low rounded-2xl p-5">
                  <span className="text-2xl mb-2 block">📅</span>
                  <span className="font-label-md text-on-surface font-bold block mb-1">اشتراك شهري</span>
                  <span className="text-on-surface-variant text-sm">مناسبة للتجربة</span>
                </div>
                <div className="bg-surface-container-low rounded-2xl p-5">
                  <span className="text-2xl mb-2 block">📊</span>
                  <span className="font-label-md text-on-surface font-bold block mb-1">اشتراك ربع سنوي</span>
                  <span className="text-on-surface-variant text-sm">الأكثر اختياراً</span>
                </div>
                <div className="bg-surface-container-low rounded-2xl p-5">
                  <span className="text-2xl mb-2 block">🏆</span>
                  <span className="font-label-md text-on-surface font-bold block mb-1">اشتراك سنوي</span>
                  <span className="text-on-surface-variant text-sm">الأوفر والأشمل</span>
                </div>
              </div>

              <p className="text-on-surface-variant font-body-md text-body-md mb-6">
                التفاصيل الدقيقة للأسعار والباقات هتظهر لك عند اختيار المسار المناسب
              </p>

              <Link
                href="/tracks"
                className="inline-flex items-center gap-2 btn-primary"
              >
                <span className="material-symbols-outlined">route</span>
                اختر مسارك الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-label-md text-label-md text-primary uppercase tracking-wide mb-2 block">الأسئلة الشائعة</span>
            <h2 className="font-headline-xl text-headline-xl text-primary mb-4">إجابات على أهم أسئلة الأهالي</h2>
          </div>

          <div className="space-y-4">
            <div className="border border-outline-variant/30 rounded-2xl overflow-hidden">
              <details className="group" open>
                <summary className="w-full flex justify-between items-center p-6 text-right bg-off-white hover:bg-surface-container-low transition-colors cursor-pointer list-none">
                  <span className="font-headline-lg text-headline-lg text-primary">المحاضرات أوفلاين ولا أونلاين؟</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-45 text-primary">add</span>
                </summary>
                <div className="p-6 bg-white border-t border-outline-variant/30 text-on-surface-variant font-body-md text-body-md">
                  جميع المحاضرات مباشرة Live أونلاين، مع تسجيلات متاحة للمراجعة، ومشاريع عملية وتفاعل حقيقي داخل كل محاضرة.
                </div>
              </details>
            </div>
            <div className="border border-outline-variant/30 rounded-2xl overflow-hidden">
              <details className="group">
                <summary className="w-full flex justify-between items-center p-6 text-right bg-off-white hover:bg-surface-container-low transition-colors cursor-pointer list-none">
                  <span className="font-headline-lg text-headline-lg text-primary">إيه الفرق بين Track A و Track B؟</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-45 text-primary">add</span>
                </summary>
                <div className="p-6 bg-white border-t border-outline-variant/30 text-on-surface-variant font-body-md text-body-md">
                  Track A (من 8 إلى 11 سنة) يركز على التعلم البصري والألعاب والمشاريع الإبداعية. Track B (من 12 إلى 15 سنة) يركز على البرمجة الحقيقية وسير عمل الـ AI والتفكير الاحترافي.
                </div>
              </details>
            </div>
            <div className="border border-outline-variant/30 rounded-2xl overflow-hidden">
              <details className="group">
                <summary className="w-full flex justify-between items-center p-6 text-right bg-off-white hover:bg-surface-container-low transition-colors cursor-pointer list-none">
                  <span className="font-headline-lg text-headline-lg text-primary">هل فيه شهادة بعد كل مستوى؟</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-45 text-primary">add</span>
                </summary>
                <div className="p-6 bg-white border-t border-outline-variant/30 text-on-surface-variant font-body-md text-body-md">
                  نعم، يحصل الطالب على شهادة معتمدة بعد كل مستوى. في باقة Future Elite يحصل الطالب على شهادة معتمدة مطبوعة + Portfolio كامل.
                </div>
              </details>
            </div>
            <div className="border border-outline-variant/30 rounded-2xl overflow-hidden">
              <details className="group">
                <summary className="w-full flex justify-between items-center p-6 text-right bg-off-white hover:bg-surface-container-low transition-colors cursor-pointer list-none">
                  <span className="font-headline-lg text-headline-lg text-primary">إيه هي برامج Techno Math و Tech English؟</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-45 text-primary">add</span>
                </summary>
                <div className="p-6 bg-white border-t border-outline-variant/30 text-on-surface-variant font-body-md text-body-md">
                  برامج تطويرية إضافية تُقدم بجانب المسار الأساسي. Techno Math لتعزيز التفكير الرياضي، و Tech English لبناء ثقة الطالب في التواصل التقني باللغة الإنجليزية. يتم التسجيل فيها بشكل مستقل.
                </div>
              </details>
            </div>
            <div className="border border-outline-variant/30 rounded-2xl overflow-hidden">
              <details className="group">
                <summary className="w-full flex justify-between items-center p-6 text-right bg-off-white hover:bg-surface-container-low transition-colors cursor-pointer list-none">
                  <span className="font-headline-lg text-headline-lg text-primary">هل فيه متابعة نفسية للطالب؟</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-45 text-primary">add</span>
                </summary>
                <div className="p-6 bg-white border-t border-outline-variant/30 text-on-surface-variant font-body-md text-body-md">
                  بالتأكيد. كل الباقات تشمل متابعة من إخصائي سلوكي وإرشادي متخصص لمساندة الطالب نفسياً ومساعدته في التعامل مع ضغوط الرحلة التعليمية.
                </div>
              </details>
            </div>
            <div className="border border-outline-variant/30 rounded-2xl overflow-hidden">
              <details className="group">
                <summary className="w-full flex justify-between items-center p-6 text-right bg-off-white hover:bg-surface-container-low transition-colors cursor-pointer list-none">
                  <span className="font-headline-lg text-headline-lg text-primary">إيه التخصصات المتاحة بعد السنة التأسيسية؟</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-45 text-primary">add</span>
                </summary>
                <div className="p-6 bg-white border-t border-outline-variant/30 text-on-surface-variant font-body-md text-body-md">
                  5 تخصصات: Web Development، Mobile App Development، AI Automations، Data Analysis، و IoT & Smart Systems. يختار الطالب التخصص اللي يناسبه للسنة الثانية.
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-inner bg-gradient-to-br from-primary-deep to-primary-container rounded-3xl md:rounded-40 p-8 md:p-12 lg:p-24 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <span className="font-label-md text-label-md text-primary-fixed-dim mb-4 block">مستقبل ابنك يبدأ من هنا</span>
            <h2 className="font-headline-xl text-headline-xl text-display-lg-mobile md:text-display-lg mb-6">🚀 سجّل اهتمامك في Tech Makers Egypt</h2>
            <p className="text-primary-fixed-dim font-body-lg text-body-lg mb-12 max-w-2xl mx-auto">ابدأ رحلة ابنك في عالم التكنولوجيا، البرمجة، والذكاء الاصطناعي. مقاعد محدودة في كل دفعة.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="bg-secondary text-on-secondary px-12 py-5 rounded-full font-headline-lg text-headline-lg shadow-xl shadow-secondary/30 hover:scale-105 transition-transform active:scale-95">سجّل الآن</Link>
               <Link href="#tracks" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-full font-headline-lg text-headline-lg hover:bg-white/20 transition-all active:scale-95">استكشف المسارات</Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-icon-hero" style={{ fontVariationSettings: "'wght' 700" }}>code</span>
          </div>
        </div>
      </section>
    </>
  );
}
