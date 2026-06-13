import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      {/* ABOUT INTRO */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50/80 to-yellow-50/60 rounded-32 p-8 md:p-12 border-2 border-amber-400/40">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
              </div>
              <h2 className="font-headline-xl text-amber-900">من نحن</h2>
            </div>
            <p className="text-amber-950 font-body-lg leading-relaxed text-center mb-6">
              نتبنى مناهج <strong className="text-amber-800 font-bold">CS50 العالمية</strong> والمعتمدة من <strong className="text-amber-800 font-bold">جامعة هارفارد</strong> ونطوّعها لتناسب العقول الشابة <strong className="text-amber-800 font-bold">(من 8 إلى 20 سنة)</strong>، لننتقل بهم من مجرد &quot;مستهلكين&quot; إلى &quot;مبتكرين&quot; و&quot;صنّاع&quot; لها، عبر التأسيس القوي في علوم الحاسب والذكاء الاصطناعي. <strong className="text-amber-800 font-bold">ودعم الرؤية الاستراتيجية المصرية للتنمية المستدامة 2030.</strong>
            </p>
            <div className="bg-amber-100/50 rounded-2xl p-5 md:p-6 border border-amber-300/30 mb-6">
              <p className="text-amber-900 font-body-md leading-relaxed text-center">
                <strong className="text-amber-800">TKA-Egypt</strong> آكاديمية المعرفة التكنولوجية - مصر، <strong className="text-amber-800">المرخصة عام ٢٠١٦</strong> ومعتمدة ضمن مراكز التدريب الرائدة بمجال تدريب علوم الحاسب ونظم المعلومات التكنولوجية، وتعمل أيضاً على تطوير طلابها بتكنولوجيا <strong className="text-amber-800">الذكاء الاصطناعي المتطور</strong>.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/egypt-2030.png"
                alt="الرؤية المصرية 2030"
                width={160}
                height={90}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-bg-off-white">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="bg-white p-5 md:p-10 rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 border-r-4 border-r-primary hover-lift">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-container/20 rounded-xl flex items-center justify-center mb-4 md:mb-6 text-primary">
              <span className="material-symbols-outlined" style={{fontSize: 28}}>visibility</span>
            </div>
            <h3 className="font-headline-lg text-primary-deep mb-4">رؤيتنا</h3>
            <p className="text-on-surface-variant font-body-md leading-relaxed">أن نكون الوجهة الأولى والأكثر ثقة في مصر والوطن العربي لبناء العقول التقنية الشابة، والمحرك الأساسي لتمكين جيل يقود التحول الرقمي وصناعة التكنولوجيا تماشياً مع رؤية مصر 2030.</p>
          </div>
          <div className="bg-white p-5 md:p-10 rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 border-r-4 border-r-secondary-container hover-lift">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary-container/20 rounded-xl flex items-center justify-center mb-4 md:mb-6 text-secondary-container">
              <span className="material-symbols-outlined" style={{fontSize: 28}}>rocket_launch</span>
            </div>
            <h3 className="font-headline-lg text-primary-deep mb-4">رسالتنا</h3>
            <p className="text-on-surface-variant font-body-md leading-relaxed">توفير بيئة تعليمية تفاعلية ومبتكرة تعتمد على فلسفة الاستنتاج وحل المشكلات بدلاً من التلقين، وتطوير مهارات التفكير المنطقي وتزويد الطلاب بأدوات العصر الرقمي على أيدي نخبة من الخبراء والمهندسين.</p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-container-max mx-auto text-center">
          <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-primary-deep mb-8">قيمنا</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['الشغف', 'الابتكار', 'الجودة', 'التأثير المجتمعي'].map((v, i) => (
              <span key={i} className="bg-primary/5 text-primary px-8 py-4 rounded-2xl font-headline-md border border-primary/10">{v}</span>
            ))}
          </div>
        </div>
      </section>

      {/* GOALS */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-bg-off-white">
        <div className="text-center mb-16">
          <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-primary-deep mb-4">أهدافنا الاستراتيجية</h2>
          <div className="h-1.5 w-24 bg-secondary-container mx-auto rounded-full"></div>
        </div>
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group bg-white p-5 md:p-8 rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 hover-lift">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <span className="material-symbols-outlined text-2xl md:text-3xl text-primary">psychology</span>
              <h4 className="font-headline-lg text-primary">بناء العقلية الهندسية</h4>
            </div>
            <p className="text-on-surface-variant font-body-md">تدريب الأطفال على تفكيك المشكلات المعقدة وحلها بخطوات منطقية متسلسلة (التفكير الحسابي).</p>
          </div>
          <div className="group bg-white p-5 md:p-8 rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 hover-lift">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <span className="material-symbols-outlined text-2xl md:text-3xl text-secondary">code</span>
              <h4 className="font-headline-lg text-primary">التمكين التقني المبكر</h4>
            </div>
            <p className="text-on-surface-variant font-body-md">التأسيس السليم في لغات البرمجة المتقدمة وعلوم البيانات والذكاء الاصطناعي لتهيئة الطلاب لسوق العمل المستقبلي.</p>
          </div>
          <div className="group bg-white p-5 md:p-8 rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 hover-lift">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <span className="material-symbols-outlined text-2xl md:text-3xl text-tertiary">star</span>
              <h4 className="font-headline-lg text-primary">الجودة والاعتمادية</h4>
            </div>
            <p className="text-on-surface-variant font-body-md">تقديم محتوى تعليمي يضاهي المناهج الجامعية العالمية (مثل فلسفة CS50)، مع تبسيطها لتناسب استيعاب الناشئين.</p>
          </div>
          <div className="group bg-white p-5 md:p-8 rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 hover-lift">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <span className="material-symbols-outlined text-2xl md:text-3xl text-primary-light">emoji_events</span>
              <h4 className="font-headline-lg text-primary">اكتشاف المواهب ورعايتها</h4>
            </div>
            <p className="text-on-surface-variant font-body-md">توفير مسارات متخصصة للطلاب المتميزين ودعمهم لبناء سابقة أعمال حقيقية والمشاركة في المسابقات الدولية.</p>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface overflow-hidden" id="founder">
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
              <p>هدفنا ليس مجرد تخريج مبرمجين، بل سد الفجوة الكبيرة بين المناهج التعليمية الكلاسيكية ومتطلبات الواقع العملي المتسارع. نحن هنا لنأخذ بيد أبنائنا، ونحول شغفهم بالتكنولوجيا من مجرد &quot;استهلاك&quot; إلى &quot;ابتكار وصناعة&quot;، مزودين إياهم بالأدوات التقنية التي <span className="text-royal font-bold">تجعلهم قادة التحول الرقمي القادم</span>.</p>
              <p>أدرك تماماً أن الاستثمار الحقيقي ليس في ما نتركه لأبنائنا، بل في الأفكار والأدوات التي نزرعها في عقولهم. التكنولوجيا اليوم لم تعد مقتصرة على الشاشات أو الألعاب؛ بل أصبحت لغة العالم، والذكاء الاصطناعي هو أبجديتها الجديدة. نحن نرى في كل طفل مبرمجاً مبدعاً، ومهندساً قادراً على ابتكار حلول لأعقد المشكلات متى توفرت له البيئة الصحيحة والموجه المحترف.</p>
              <p>في TKA-Egypt، نحن ملتزمون بتوفير بيئة تعليمية بمعايير عالمية على أرض مصرية، محولين كل سطر برمجي يتعلمونه إلى خطوة نحو مسار مهني واعد في عالم رقمي لا ينتظر المتأخرين.</p>
              <p className="text-royal font-bold">دعونا نصنع المستقبل معاً.. خطوة بخطوة، وكوداً بكود.</p>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto bg-primary-container rounded-40 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="font-headline-xl text-headline-lg md:text-display-lg text-white mb-8">جاهز لتكون صانع التكنولوجيا القادم؟</h2>
            <p className="text-primary-fixed font-body-lg mb-12 max-w-2xl mx-auto">انضم إلى مئات الطلاب الذين بدأوا رحلتهم معنا وحولوا شغفهم إلى واقع ملموس.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/tracks" className="bg-secondary-container text-on-secondary-container font-bold px-12 py-5 rounded-full font-headline-lg hover:shadow-highlight transition-all scale-100 hover:scale-105">استكشف المسارات</Link>
              <Link href="/register" className="border-2 border-primary-fixed text-primary-fixed px-12 py-5 rounded-full font-headline-lg hover:bg-primary-fixed hover:text-primary-container transition-all">سجل الآن</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
