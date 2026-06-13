import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex items-center justify-center overflow-hidden hero-gradient py-24 md:py-36 px-margin-mobile md:px-margin-desktop">
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <span className="inline-block bg-primary/5 text-primary font-label-md text-label-md px-5 py-2 rounded-full mb-6">من نحن</span>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary-deep mb-6 leading-snug md:leading-tight">نبني جيلًا عربيًا قادرًا على صناعة التكنولوجيا</h1>
          <p className="text-on-surface-variant font-body-lg mb-10 max-w-2xl mx-auto">نحن في تك ميكرز نؤمن بأن المستقبل يُصنع بأيدي الشباب. مهمتنا هي تحويل الشغف التقني إلى مهارات احترافية تفتح أبواب الابتكار العالمي من قلب مصر.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="bg-primary-light text-white px-8 py-4 rounded-full font-label-md hover:shadow-lg transition-all">تواصل معنا</Link>
            <Link href="/tracks" className="border-2 border-secondary text-secondary-container font-bold px-8 py-4 rounded-full font-label-md hover:bg-secondary-container hover:text-white transition-all">برامجنا التدريبية</Link>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="bg-white p-10 rounded-20 shadow-card-sm border-r-4 border-primary hover:border-primary-light transition-all hover-lift">
            <div className="w-16 h-16 bg-primary-container/20 rounded-xl flex items-center justify-center mb-6 text-primary">
              <span className="material-symbols-outlined" style={{fontSize: 32}}>visibility</span>
            </div>
            <h3 className="font-headline-lg text-primary-deep mb-4">رؤيتنا</h3>
            <p className="text-on-surface-variant font-body-md leading-relaxed">أن نكون المنارة الرائدة في الشرق الأوسط لتمكين المبتكرين الصغار والشباب، وتخريج كوادر قادرة على المنافسة في سوق التكنولوجيا العالمي والعمل في كبرى شركات البرمجيات.</p>
          </div>
          <div className="bg-white p-10 rounded-20 shadow-card-sm border-r-4 border-secondary-container hover:border-accent-deep transition-all hover-lift">
            <div className="w-16 h-16 bg-secondary-container/20 rounded-xl flex items-center justify-center mb-6 text-secondary-container">
              <span className="material-symbols-outlined" style={{fontSize: 32}}>rocket_launch</span>
            </div>
            <h3 className="font-headline-lg text-primary-deep mb-4">رسالتنا</h3>
            <p className="text-on-surface-variant font-body-md leading-relaxed">تقديم تعليم تكنولوجي تطبيقي يدمج بين أسس الهندسة البرمجية وأحدث تقنيات الذكاء الاصطناعي، في بيئة تعليمية محفزة تعتمد على المشاريع والتعلم التفاعلي.</p>
          </div>
        </div>
      </section>

      {/* GOALS */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-bg-off-white">
        <div className="text-center mb-16">
          <h2 className="font-headline-xl text-primary-deep mb-4">أهدافنا الاستراتيجية</h2>
          <div className="h-1.5 w-24 bg-secondary-container mx-auto rounded-full"></div>
        </div>
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 hover:border-secondary-container/50">
            <span className="text-secondary-container font-headline-xl opacity-20 group-hover:opacity-100 transition-opacity">01</span>
            <h4 className="font-headline-lg text-primary mt-4 mb-2">تطوير التفكير المنطقي</h4>
            <p className="text-on-surface-variant font-body-md">تعزيز قدرات حل المشكلات لدى الطلاب من خلال البرمجة والخوارزميات.</p>
          </div>
          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 hover:border-secondary-container/50">
            <span className="text-secondary-container font-headline-xl opacity-20 group-hover:opacity-100 transition-opacity">02</span>
            <h4 className="font-headline-lg text-primary mt-4 mb-2">تطوير مهارات تقنية</h4>
            <p className="text-on-surface-variant font-body-md">تعليم البرمجة والذكاء الاصطناعي وتقنيات المستقبل بطريقة عملية وتفاعلية.</p>
          </div>
          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 hover:border-secondary-container/50">
            <span className="text-secondary-container font-headline-xl opacity-20 group-hover:opacity-100 transition-opacity">03</span>
            <h4 className="font-headline-lg text-primary mt-4 mb-2">تحفيز الإبداع والابتكار</h4>
            <p className="text-on-surface-variant font-body-md">تحويل الطلاب من مستهلكين للتكنولوجيا إلى مبدعين وصناع قادرين على الابتكار.</p>
          </div>
          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 hover:border-secondary-container/50">
            <span className="text-secondary-container font-headline-xl opacity-20 group-hover:opacity-100 transition-opacity">04</span>
            <h4 className="font-headline-lg text-primary mt-4 mb-2">تعزيز العمل الجماعي</h4>
            <p className="text-on-surface-variant font-body-md">تنمية مهارات التواصل والتعاون والعمل ضمن فرق عمل متعددة التخصصات.</p>
          </div>
          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 hover:border-secondary-container/50">
            <span className="text-secondary-container font-headline-xl opacity-20 group-hover:opacity-100 transition-opacity">05</span>
            <h4 className="font-headline-lg text-primary mt-4 mb-2">بناء جيل عربي متمرس</h4>
            <p className="text-on-surface-variant font-body-md">إعداد الطلاب لسوق العمل التقني والمسارات المهنية الحديثة في عالم التكنولوجيا.</p>
          </div>
          <div className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all border border-outline-variant/10 hover:border-secondary-container/50">
            <span className="text-secondary-container font-headline-xl opacity-20 group-hover:opacity-100 transition-opacity">06</span>
            <h4 className="font-headline-lg text-primary mt-4 mb-2">قياس الأثر والتطوير</h4>
            <p className="text-on-surface-variant font-body-md">متابعة تطور الطلاب وتحسين البرامج التعليمية بناءً على النتائج والتغذية الراجعة.</p>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="glow-border" style={{padding:3}}>
            <div className="bg-white rounded-32 shadow-card p-8 md:p-16 relative text-center">
            <span className="material-symbols-outlined absolute top-4 right-4 md:top-6 md:right-6 text-secondary-container text-5xl md:text-6xl opacity-30" style={{fontVariationSettings: "'FILL' 1"}}>format_quote</span>
            {/* Avatar + Name Card */}
            <div className="flex flex-row items-center gap-4 md:gap-6 mb-8">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-xl flex-shrink-0">
                <img src="/ceo.jpg" alt="مؤسس TKA-Egypt" className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="text-right">
                <h3 className="font-headline-xl text-royal mb-1">المهندس / إمام عبد العزيز</h3>
                <p className="text-on-secondary-fixed-variant font-body-md" style={{fontSize:14}}>المدير التنفيذي والمؤسس لـ TKA-Egypt.</p>
              </div>
            </div>
            <div className="text-on-surface-variant font-body-lg leading-relaxed max-w-2xl mx-auto space-y-4 text-justify">
              <p className="text-royal font-bold">عندما أسسنا TKA-Egypt، لم يكن هدفنا إنشاء منصة تعليمية تقليدية، بل أطلقنا مشروعاً هندسياً لصناعة العقول.</p>
              <p>هدفنا ليس مجرد تخريج مبرمجين، بل سد الفجوة الكبيرة بين المناهج التعليمية الكلاسيكية ومتطلبات الواقع العملي المتسارع. نحن هنا لنأخذ بيد أبنائنا، ونحول شغفهم بالتكنولوجيا من مجرد "استهلاك" إلى "ابتكار وصناعة"، مزودين إياهم بالأدوات التقنية التي <span className="text-royal font-bold">تجعلهم قادة التحول الرقمي القادم</span>.</p>
              <p>أدرك تماماً أن الاستثمار الحقيقي ليس في ما نتركه لأبنائنا، بل في الأفكار والأدوات التي نزرعها في عقولهم. التكنولوجيا اليوم لم تعد مقتصرة على الشاشات أو الألعاب؛ بل أصبحت لغة العالم، والذكاء الاصطناعي هو أبجديتها الجديدة. نحن نرى في كل طفل مبرمجاً مبدعاً، ومهندساً قادراً على ابتكار حلول لأعقد المشكلات متى توفرت له البيئة الصحيحة والموجه المحترف.</p>
              <p>في TKA-Egypt، نحن ملتزمون بتوفير بيئة تعليمية بمعايير عالمية على أرض مصرية، محولين كل سطر برمجي يتعلمونه إلى خطوة نحو مسار مهني واعد في عالم رقمي لا ينتظر المتأخرين.</p>
              <p className="text-royal font-bold">دعونا نصنع المستقبل معاً.. خطوة بخطوة، <strong className="text-royal">وكوداً بكود</strong>.</p>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto bg-primary-container rounded-40 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="font-headline-xl md:text-display-lg text-white mb-8">جاهز لتكون صانع التكنولوجيا القادم؟</h2>
            <p className="text-primary-fixed font-body-lg mb-12 max-w-2xl mx-auto">انضم إلى مئات الطلاب الذين بدأوا رحلتهم معنا وحولوا شغفهم إلى واقع ملموس.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/register" className="bg-secondary-container text-on-secondary-container font-bold px-12 py-5 rounded-full font-headline-lg hover:shadow-highlight transition-all scale-100 hover:scale-105">سجل الآن مجاناً</Link>
              <Link href="/tracks" className="border-2 border-primary-fixed text-primary-fixed px-12 py-5 rounded-full font-headline-lg hover:bg-primary-fixed hover:text-primary-container transition-all">استكشف المسارات</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
