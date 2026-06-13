'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const trackData = {
  a: {
    totalSteps: 4,
    yearLabels: ['السنة الأولى — رحلة الاكتشاف'],
    steps: [
      {
        title: 'الطالب هيلعب... ويلعب... ويلعب!',
        desc: 'بس المرة دي، هو اللي بيصمم اللعبة. في المستوى ده بنخلي طفلك يحب التكنولوجيا من غير أي خوف أو ملل.',
        gains: [
          '🕹️ يصمم ألعابه الخاصة على الكمبيوتر',
          '🧩 يحل المشكلات بذكاء بدل الحفظ',
          '📝 يحول أفكاره لمشاريع يشوفها بعينه',
          '💪 يكتسب ثقة كبيرة في نفسه',
        ],
        achievement: "بنهاية المستوى: طفلك هيقولك 'أنا اللي عملت اللعبة دي!' بفخر 🏅",
      },
      {
        title: 'ابنك هيبقى مصمم تطبيقات صغير!',
        desc: 'بنقله من "بيستخدم التطبيقات" لـ"بيصممها". دلوقتي طفلك يقدر يبني تطبيق موبايل خاص بيه ويفهم واجهة المستخدم.',
        gains: [
          '📱 يصمم تطبيق موبايل كامل من الصفر',
          '🎨 يحترف أسس التصميم والألوان والخطوط',
          '🤖 يستخدم أدوات الذكاء الاصطناعي بشكل إبداعي',
          '🎤 يقدّم مشروعه قدام الناس بثقة',
        ],
        achievement: 'بنهاية المستوى: ممكن يعرض تطبيقه على الموبايل بتاعه! 🏅',
      },
      {
        title: 'بيبدأ يكتب أكواد زي المبرمجين الكبار',
        desc: 'هنا اللحظة المهمة — طفلك هيتعلم لغة Python الحقيقية ويفهم إزاي المواقع شغالة. بأساليب مبسطة ومناسبة لسنه.',
        gains: [
          '💻 يكتب برامج بنفسه بلغة حقيقية',
          '🌐 يبني أول موقع شخصي ليه على الإنترنت',
          '🔍 يتعلم يستخدم AI كأداة ذكية للتعلم',
          '🧠 يصبر على حل المشاكل ولا يستسلم',
        ],
        achievement: "بنهاية المستوى: طفلك يقدر يقول 'أنا مبرمج!' بجدية 🏅",
      },
      {
        title: 'التخرج! أول مشروع كامل لطفلك',
        desc: 'المستوى الأخير — طفلك بيجمع كل اللي اتعلمه في مشروع تخرج حقيقي يستخدم فيه الذكاء الاصطناعي.',
        gains: [
          '🤖 يبني أداة ذكاء اصطناعي بنفسه',
          '📋 يخطط لمشروع كامل من الصفر للنهاية',
          '👥 يشتغل ضمن فريق مع زملاءه',
          '🎯 يقدّم مشروعه قدام لجنة تقييم',
        ],
        achievement: 'بعد السنة: طفلك جاهز يدخل التخصص اللي يحبه بثقة 🎓',
      },
    ],
  },
  b: {
    totalSteps: 4,
    yearLabels: ['السنة الأولى — رحلة الاحتراف'],
    steps: [
      {
        title: 'ابنك هيبدأ يفكر زي المبرمجين',
        desc: 'بيبدأ يتعلم يفكر بطريقة منظمة، يكتب كود حقيقي بلغة Python، ويتعامل مع الأدوات اللي بيستخدمها المحترفين.',
        gains: [
          '💻 يكتب برامج حقيقية بلغة Python',
          '🧠 يفكر بطريقة المبرمج المحترف',
          '🛠️ يستخدم أدوات المطورين المحترفين',
          '📁 يدير ملفاته ومشاريعه باحتراف',
        ],
        achievement: 'بنهاية المستوى: ابنك هيبدأ يبني أدوات عملية تفيده في حياته 🏅',
      },
      {
        title: 'بيصمم موقعه على الإنترنت!',
        desc: 'ابنك هيبني أول موقع شخصي ليه ويبدأ يفهم تجربة المستخدم والتصميم، كأنه مالك منتج تقني حقيقي.',
        gains: [
          '🌐 يبني موقع ويب كامل يستعرض أعماله',
          '🎨 يفهم أساسيات التصميم وتجربة المستخدم',
          '📱 يصمم صفحات تعمل على الموبايل والكمبيوتر',
          '🏷️ يبني هويته البصرية الشخصية',
        ],
        achievement: 'بنهاية المستوى: ابنك يقدر يشارك أعماله مع العالم أونلاين 🏅',
      },
      {
        title: 'بيستخدم الذكاء الاصطناعي زي المحترفين',
        desc: 'ابنك هيبدأ يستخدم أدوات الـ AI بشكل احترافي ويبني أدوات ذكية تحل مشاكل حقيقية، ويفهم قواعد البيانات.',
        gains: [
          '🤖 يبني مساعد ذكاء اصطناعي خاص بيه',
          '⚙️ يصمم أدوات تنفذ مهام بشكل أوتوماتيك',
          '📊 يفهم تنظيم البيانات وقواعد البيانات',
          '🔬 يبحث ويحل المشكلات بشكل مستقل',
        ],
        achievement: 'بنهاية المستوى: ابنك بيستخدم التكنولوجيا عشان يبتكر مش بس يستخدم 🏅',
      },
      {
        title: 'هوية تقنية حقيقية قبل التخرج',
        desc: 'ابنك بيبني ملف أعماله الاحترافي على GitHub، وبيفهم سوق العمل التقني، وبيبدأ يفكر في مساراته المهنية المستقبلية.',
        gains: [
          '💼 يبني Portfolio احترافي على GitHub',
          '🚀 ينشر مشاريعه على الإنترنت',
          '🧭 يفهم المسارات المهنية في التكنولوجيا',
          '🤝 يطور مهارات التواصل والعرض المهني',
        ],
        achievement: 'بنهاية السنة: ابنك جاهز للسنة التخصصية وهوية تقنية قوية تميزه 🎓',
      },
    ],
  },
  c: {
    totalSteps: 5,
    yearLabels: ['السنة الأولى — Foundation Year', 'السنة الثانية — Specialization Year'],
    yearBreak: 4,
    steps: [
      {
        title: 'Level 1: Programming & Computer Science Foundations',
        desc: 'بناء عقلية المبرمج وفهم طريقة عمل البرمجيات. يتعلم الطالب Computational Thinking, Algorithms, Flowcharts, Problem Solving, و Python Fundamentals.',
        gains: [
          '✅ Variables, Conditions, Loops, Functions',
          '✅ Lists, Dictionaries, Debugging',
          '🛠️ أدوات المطور: VS Code, Terminal, Git Basics',
          '🎮 المشاريع: نظام اختبارات، ألعاب منطقية، أدوات أتمتة بسيطة',
        ],
        achievement: 'بنهاية المستوى: كتابة برامج حقيقية + تحليل المشاكل بطريقة منظمة + فهم أساسيات البرمجة 🏅',
      },
      {
        title: 'Level 2: Web Development & Digital Products',
        desc: 'تعليم الطالب كيف تتحول الفكرة إلى منتج رقمي. أساسيات المواقع والتصميم وتجربة المستخدم UI/UX.',
        gains: [
          '🌐 HTML, CSS, JavaScript Basics',
          '🎨 التفكير كصانع منتجات رقمية',
          '📱 بناء تجربة مستخدم جيدة',
          '🌐 المشاريع: موقع شخصي، صفحة منتج، مشروع ويب تفاعلي',
        ],
        achievement: 'بنهاية المستوى: بناء صفحات ويب حقيقية + فهم طريقة تصميم المنتجات الرقمية + إنشاء أول Portfolio 🏅',
      },
      {
        title: 'Level 3: Python Development & AI Tools',
        desc: 'الانتقال من كتابة الأكواد إلى بناء أدوات ذكية. Python Intermediate, APIs, JSON, Automation, File Handling, Prompt Engineering, AI Workflows.',
        gains: [
          '🤖 Prompt Engineering, AI Productivity',
          '⚙️ APIs, JSON, Automation, File Handling',
          '📊 تنظيم البيانات وقواعد البيانات',
          '🤖 المشاريع: AI Assistant, Smart Automation Tool, Student Management System',
        ],
        achievement: 'بنهاية المستوى: بناء أدوات عملية + استخدام الذكاء الاصطناعي بذكاء + ربط البرمجة بحلول واقعية 🏅',
      },
      {
        title: 'Level 4: AI Engineering Foundations',
        desc: 'تجهيز الطالب لاختيار تخصصه وبناء مشاريع أقوى. أساسيات الذكاء الاصطناعي + طريقة عمل الأنظمة الذكية + تكامل الأدوات والـ APIs.',
        gains: [
          '🧠 أساسيات الذكاء الاصطناعي وطريقة عمل الأنظمة الذكية',
          '🔗 تكامل الأدوات والـ APIs',
          '💼 GitHub Portfolio + Presentation Skills + Career Awareness',
          '🚀 المشروع النهائي: Graduation Project',
        ],
        achievement: 'بنهاية السنة الأولى: امتلاك مشروع متكامل + معرفة كيف يعمل مهندس التكنولوجيا + جاهزية للانتقال للتخصص 🎓',
      },
      {
        title: 'السنة التخصصية: اختر مسارك',
        desc: 'اختر التخصص اللي يناسبك وابدأ بناء مهاراتك المتقدمة. 4 مسارات متاحة: AI Engineering, Full Stack Development, Mobile App Development, Data & Analytics.',
        gains: [
          '🚀 AI Engineering: بناء تطبيقات وحلول تعتمد على الذكاء الاصطناعي',
          '🌐 Full Stack Development: تطبيقات ويب كاملة (Frontend + Backend + Databases)',
          '📱 Mobile App Development: صناعة تطبيقات الهاتف',
          '📊 Data & Analytics: تحويل البيانات لقرارات',
        ],
        achievement: 'بنهاية الرحلة: مشاريع حقيقية + Portfolio + خبرة عملية + عقلية مطور + رؤية واضحة لمستقبله التقني 🏆',
      },
    ],
  },
};

function getStepLabel(trackKey, step) {
  if (trackKey === 'c') {
    const labels = ['البرمجة', 'تطوير الويب', 'Python والـ AI', 'أساسيات الـ AI', 'التخصص'];
    return labels[step - 1] || `المرحلة ${step}`;
  }
  const labels = ['الانطلاق', 'الاكتشاف', 'البناء', 'الإنجاز'];
  return labels[step - 1] || `المرحلة ${step}`;
}

const trackCardMeta = [
  {
    id: 'a',
    title: 'Track A: The Explorer',
    age: '8-11 سنة',
    icon: 'child_care',
    borderColor: 'bg-secondary',
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    badgeBg: 'bg-secondary/10',
    badgeText: 'text-secondary',
    buttonBorder: 'border-secondary',
    buttonText: 'text-secondary',
    hoverBg: 'group-hover:bg-secondary',
    points: [
      'البرمجة الرسومية (Scratch) ومتعة التكنولوجيا',
      'تصميم التطبيقات والألعاب التفاعلية',
      'أساسيات Python والمواقع',
      'مشروع تخرج باستخدام الذكاء الاصطناعي',
    ],
  },
  {
    id: 'b',
    title: 'Track B: The Builder',
    age: '12-15 سنة',
    icon: 'code',
    borderColor: 'bg-primary',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    badgeBg: 'bg-primary/10',
    badgeText: 'text-primary',
    buttonBorder: 'border-primary',
    buttonText: 'text-primary',
    hoverBg: 'group-hover:bg-primary',
    points: [
      'لغة Python ومفاهيم البرمجة المتقدمة',
      'تطوير الويب وبناء المواقع الاحترافية',
      'أدوات الذكاء الاصطناعي والأتمتة',
      'هوية تقنية وملف أعمال على GitHub',
    ],
  },
  {
    id: 'c',
    title: 'Track C: The Professional',
    age: '16-20 سنة',
    icon: 'engineering',
    borderColor: 'bg-tertiary',
    iconBg: 'bg-tertiary/10',
    iconColor: 'text-tertiary',
    badgeBg: 'bg-tertiary/10',
    badgeText: 'text-tertiary',
    buttonBorder: 'border-tertiary',
    buttonText: 'text-tertiary',
    hoverBg: 'group-hover:bg-tertiary',
    points: [
      'علوم الكمبيوتر وهندسة البرمجيات',
      'المنتجات الرقمية وتجربة المستخدم',
      'هندسة الذكاء الاصطناعي وتكامل APIs',
      '4 مسارات تخصصية: AI, Full Stack, Mobile, Data',
    ],
  },
];

export default function TracksPage() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showJourney, setShowJourney] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const track = params.get('track');
    if (track && trackData[track]) {
      setCurrentTrack(track);
    }
  }, []);

  function selectTrack(track) {
    setCurrentTrack(track);
    setCurrentStep(1);
    setShowJourney(true);
    setTimeout(() => {
      document.getElementById('space-journey')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function nextStep(step) {
    setCurrentStep(step);
  }

  function showPlans() {
    setShowJourney(false);
    setTimeout(() => {
      document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  const track = currentTrack ? trackData[currentTrack] : null;

  function getStepBadge(step) {
    if (track && track.yearBreak && step <= track.yearBreak) {
      return `السنة الأولى - المستوى ${step}`;
    }
    if (track && track.yearBreak && step > track.yearBreak) {
      return 'السنة التخصصية';
    }
    return `المرحلة ${step} من ${track ? track.totalSteps : 0}`;
  }

  function getYearLabel(step) {
    if (!track) return null;
    if (track.yearBreak && step > track.yearBreak) {
      return (
        <div className="inline-flex items-center gap-2 bg-tertiary-container/20 text-tertiary px-5 py-2 rounded-full font-label-md">
          <span className="material-symbols-outlined text-lg">school</span>
          {track.yearLabels[1]}
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-2 bg-secondary-container/20 text-secondary px-5 py-2 rounded-full font-label-md">
        <span className="material-symbols-outlined text-lg">rocket_launch</span>
        {track.yearLabels[0]}
      </div>
    );
  }

  const progressPercent = track ? (currentStep / track.totalSteps) * 100 : 0;

  function getRegisterUrl(base) {
    if (!currentTrack) return base;
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}track=${currentTrack}`;
  }

  const stepEmojis = ['🚀', '🪐', '🛰️', '🏆', '🛸'];

  return (
    <div dir="rtl">
      <section className="relative bg-gradient-to-br from-primary-deep to-primary text-on-primary overflow-hidden py-24 md:py-32">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-6">اكتشف مسار التعلم المناسب لابنك</h1>
          <p className="font-body-lg text-body-lg max-w-2xl mx-auto opacity-90">رحلات تعليمية متدرجة تناسب كل فئة عمرية — من أساسيات البرمجة إلى الاحتراف التقني</p>
        </div>
      </section>

      {!currentTrack && (
        <section className="py-16 md:py-24 bg-bg-off-white">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <span className="inline-block bg-secondary-container/20 text-secondary px-5 py-2 rounded-full font-label-md mb-4">📌 اختر المسار المناسب</span>
              <h2 className="font-headline-xl text-headline-xl text-primary-deep mb-4">ثلاث مسارات — ثلاث مراحل عمرية</h2>
              <p className="text-on-surface-variant font-body-lg">كل مسار صمم خصيصًا ليلائم عمر ابنك ومستواه</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {trackCardMeta.map((card) => (
                <div key={card.id} className="relative bg-white rounded-24 overflow-hidden card-shadow group">
                  <div className={`h-3 ${card.borderColor}`}></div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`${card.iconBg} p-4 rounded-2xl`}>
                        <span className={`material-symbols-outlined ${card.iconColor} text-4xl`}>{card.icon}</span>
                      </div>
                      <span className={`${card.badgeBg} ${card.badgeText} px-4 py-1 rounded-full font-bold`}>{card.age}</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-lg text-primary mb-4">{card.title}</h3>
                    <ul className="space-y-3 mb-8">
                      {card.points.map((point, i) => (
                        <li key={i} className="flex items-center gap-2 text-on-surface-variant font-body-md">
                          <span className="material-symbols-outlined text-secondary text-sm">circle</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => selectTrack(card.id)}
                      className={`w-full py-3 border-2 ${card.buttonBorder} ${card.buttonText} rounded-xl font-bold ${card.hoverBg} group-hover:text-white transition-all`}
                    >
                      تفاصيل المسار
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {currentTrack && showJourney && (
        <section className="py-16 md:py-24 bg-bg-off-white" id="space-journey">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <h2 className="font-headline-xl text-headline-xl text-primary-deep mb-4">رحلة التعلم</h2>
              <div className="h-1.5 w-24 bg-secondary-container mx-auto rounded-full mb-4"></div>
              <p className="text-on-surface-variant font-body-lg">اكتشف مسار التعلم خطوة بخطوة</p>
            </div>

            <div className="mb-12">
              <div className="bg-surface-container-low rounded-full h-2 mb-8 overflow-hidden">
                <div className="bg-primary h-2 rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {Array.from({ length: track.totalSteps }, (_, i) => {
                  const stepNum = i + 1;
                  let btnClasses = 'transition-all duration-300 px-5 py-2.5 rounded-full font-label-md flex items-center gap-2 hover-lift ';
                  if (stepNum === currentStep) {
                    btnClasses += 'bg-primary text-white shadow-lg scale-110';
                  } else if (stepNum < currentStep) {
                    btnClasses += 'bg-primary-container/20 text-primary';
                  } else {
                    btnClasses += 'bg-white text-on-surface-variant border border-outline-variant/30';
                  }
                  return (
                    <button key={stepNum} onClick={() => nextStep(stepNum)} className={btnClasses}>
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold bg-inherit">{stepNum}</span>
                      <span className="hidden sm:inline">{getStepLabel(currentTrack, stepNum)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-center mb-10">
              {getYearLabel(currentStep)}
            </div>

            <div className="relative">
              <div className={currentStep === 1 ? 'block' : 'hidden'}>
                <div className="bg-white p-8 md:p-12 rounded-32 card-shadow">
                  <div className="flex justify-between items-center mb-8">
                    <span className="bg-secondary-container/20 text-secondary px-4 py-1.5 rounded-full font-label-md">الخطوة 1 من {track.totalSteps}</span>
                    <span className="font-headline-lg text-headline-lg text-primary">{track.steps[0]?.title}</span>
                  </div>
                  <p className="text-on-surface-variant font-body-lg mb-8 leading-relaxed">{track.steps[0]?.desc}</p>
                  <div className="space-y-4 mb-8">
                    {track.steps[0]?.gains.map((gain, i) => (
                      <div key={i} className="flex items-start gap-3 text-on-surface-variant font-body-md">
                        <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                        {gain}
                      </div>
                    ))}
                  </div>
                  <div className="bg-secondary-container/10 p-5 rounded-16 border-r-4 border-secondary-container font-body-md text-secondary font-bold">
                    🎯 {track.steps[0]?.achievement}
                  </div>
                  {track.totalSteps > 1 && (
                    <div className="mt-8 text-left">
                      <button onClick={() => nextStep(2)} className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-label-md hover:shadow-lg transition-all">
                        التالي
                        <span className="material-symbols-outlined">arrow_back</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className={currentStep === 2 ? 'block' : 'hidden'}>
                <div className="bg-white p-8 md:p-12 rounded-32 card-shadow">
                  <div className="flex justify-between items-center mb-8">
                    <span className="bg-secondary-container/20 text-secondary px-4 py-1.5 rounded-full font-label-md">الخطوة 2 من {track.totalSteps}</span>
                    <span className="font-headline-lg text-headline-lg text-primary">{track.steps[1]?.title}</span>
                  </div>
                  <p className="text-on-surface-variant font-body-lg mb-8 leading-relaxed">{track.steps[1]?.desc}</p>
                  <div className="space-y-4 mb-8">
                    {track.steps[1]?.gains.map((gain, i) => (
                      <div key={i} className="flex items-start gap-3 text-on-surface-variant font-body-md">
                        <span className="material-symbols-outlined text-primary-light text-sm">check_circle</span>
                        {gain}
                      </div>
                    ))}
                  </div>
                  <div className="bg-primary-container/10 p-5 rounded-16 border-r-4 border-primary-light font-body-md text-primary font-bold">
                    🎯 {track.steps[1]?.achievement}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button onClick={() => nextStep(1)} className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3.5 rounded-full font-label-md hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined">arrow_forward</span>
                      السابق
                    </button>
                    {track.totalSteps > 2 && (
                      <button onClick={() => nextStep(3)} className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-label-md hover:shadow-lg transition-all">
                        التالي
                        <span className="material-symbols-outlined">arrow_back</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className={currentStep === 3 ? 'block' : 'hidden'}>
                <div className="bg-white p-8 md:p-12 rounded-32 card-shadow">
                  <div className="flex justify-between items-center mb-8">
                    <span className="bg-secondary-container/20 text-secondary px-4 py-1.5 rounded-full font-label-md">الخطوة 3 من {track.totalSteps}</span>
                    <span className="font-headline-lg text-headline-lg text-primary">{track.steps[2]?.title}</span>
                  </div>
                  <p className="text-on-surface-variant font-body-lg mb-8 leading-relaxed">{track.steps[2]?.desc}</p>
                  <div className="space-y-4 mb-8">
                    {track.steps[2]?.gains.map((gain, i) => (
                      <div key={i} className="flex items-start gap-3 text-on-surface-variant font-body-md">
                        <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                        {gain}
                      </div>
                    ))}
                  </div>
                  <div className="bg-tertiary-container/10 p-5 rounded-16 border-r-4 border-tertiary font-body-md text-tertiary font-bold">
                    🎯 {track.steps[2]?.achievement}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button onClick={() => nextStep(2)} className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3.5 rounded-full font-label-md hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined">arrow_forward</span>
                      السابق
                    </button>
                    {track.totalSteps > 3 && (
                      <button onClick={() => nextStep(4)} className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-label-md hover:shadow-lg transition-all">
                        التالي
                        <span className="material-symbols-outlined">arrow_back</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className={currentStep === 4 ? 'block' : 'hidden'}>
                <div className="bg-white p-8 md:p-12 rounded-32 card-shadow">
                  <div className="flex justify-between items-center mb-8">
                    <span className="bg-secondary-container/20 text-secondary px-4 py-1.5 rounded-full font-label-md">الخطوة 4 من {track.totalSteps}</span>
                    <span className="font-headline-lg text-headline-lg text-primary">{track.steps[3]?.title}</span>
                  </div>
                  <p className="text-on-surface-variant font-body-lg mb-8 leading-relaxed">{track.steps[3]?.desc}</p>
                  <div className="space-y-4 mb-8">
                    {track.steps[3]?.gains.map((gain, i) => (
                      <div key={i} className="flex items-start gap-3 text-on-surface-variant font-body-md">
                        <span className="material-symbols-outlined text-secondary-container text-sm">check_circle</span>
                        {gain}
                      </div>
                    ))}
                  </div>
                  <div className="bg-secondary-container/10 p-5 rounded-16 border-r-4 border-secondary-container font-body-md text-secondary font-bold">
                    🎯 {track.steps[3]?.achievement}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button onClick={() => nextStep(3)} className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3.5 rounded-full font-label-md hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined">arrow_forward</span>
                      السابق
                    </button>
                    {track.totalSteps > 4 ? (
                      <button onClick={() => nextStep(5)} className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-label-md hover:shadow-lg transition-all">
                        التالي
                        <span className="material-symbols-outlined">arrow_back</span>
                      </button>
                    ) : (
                      <button onClick={showPlans} className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-8 py-3.5 rounded-full font-label-md hover:shadow-lg transition-all">
                        عرض الباقات
                        <span className="material-symbols-outlined">arrow_back</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {track.totalSteps > 4 && (
                <div className={currentStep === 5 ? 'block' : 'hidden'}>
                  <div className="bg-white p-8 md:p-12 rounded-32 card-shadow">
                    <div className="flex justify-between items-center mb-8">
                      <span className="bg-secondary-container/20 text-secondary px-4 py-1.5 rounded-full font-label-md">الخطوة 5 من {track.totalSteps}</span>
                      <span className="font-headline-lg text-headline-lg text-primary">{track.steps[4]?.title}</span>
                    </div>
                    <p className="text-on-surface-variant font-body-lg mb-8 leading-relaxed">{track.steps[4]?.desc}</p>
                    <div className="space-y-4 mb-8">
                      {track.steps[4]?.gains.map((gain, i) => (
                        <div key={i} className="flex items-start gap-3 text-on-surface-variant font-body-md">
                          <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                          {gain}
                        </div>
                      ))}
                    </div>
                    <div className="bg-primary-container/10 p-5 rounded-16 border-r-4 border-primary font-body-md text-primary font-bold">
                      🎯 {track.steps[4]?.achievement}
                    </div>
                    <div className="mt-8 flex justify-between">
                      <button onClick={() => nextStep(4)} className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3.5 rounded-full font-label-md hover:bg-primary hover:text-white transition-all">
                        <span className="material-symbols-outlined">arrow_forward</span>
                        السابق
                      </button>
                      <button onClick={showPlans} className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-8 py-3.5 rounded-full font-label-md hover:shadow-lg transition-all">
                        عرض الباقات
                        <span className="material-symbols-outlined">arrow_back</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {currentTrack && !showJourney && (
        <section className="py-16 md:py-24 bg-surface" id="plans">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <span className="inline-block bg-secondary-container/20 text-secondary px-5 py-2 rounded-full font-label-md mb-4">📌 خطط الاشتراك المتاحة</span>
              <p className="text-on-surface-variant font-body-lg">تقدر تختار نظام الاشتراك الأنسب لك من بين الخطط التالية:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <article className="bg-white rounded-20 shadow-card-sm overflow-hidden hover-lift relative">
                <div className="h-3 bg-secondary-container"></div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">✅</span>
                    <h3 className="font-headline-lg text-headline-lg text-primary-deep">اشتراك شهري</h3>
                  </div>
                  <div className="mb-6">
                    <span className="font-display-lg text-display-lg text-primary-deep">1200</span>
                    <span className="text-on-surface-variant font-body-md mr-2">جنيه</span>
                    <span className="text-on-surface-variant font-body-md">/ شهر</span>
                  </div>
                  <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full font-label-md mb-8 inline-block">
                    مناسب للتجربة - البرايفت سيشن
                  </div>
                  <div>
                    <Link href={getRegisterUrl('/register?plan=monthly')} className="block text-center bg-primary text-white px-8 py-3.5 rounded-full font-label-md hover:shadow-lg transition-all">
                      اشترك الآن
                    </Link>
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-20 shadow-card-sm overflow-hidden hover-lift relative scale-105 md:scale-110 z-10">
                <div className="h-3 bg-primary"></div>
                <div className="absolute top-4 left-4 bg-primary text-white px-4 py-1.5 rounded-full font-label-md shadow-lg">
                  ⭐ الأكثر اختيارًا
                </div>
                <div className="p-8 pt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">✅</span>
                    <h3 className="font-headline-lg text-headline-lg text-primary-deep">اشتراك ربع سنوي</h3>
                  </div>
                  <div className="mb-2">
                    <span className="font-display-lg text-display-lg text-primary-deep">890</span>
                    <span className="text-on-surface-variant font-body-md mr-2">جنيه</span>
                    <span className="text-on-surface-variant font-body-md">/ شهريًا</span>
                  </div>
                  <div className="text-on-surface-variant font-body-md mb-6">
                    اجمالي 2670 جنيه لكل 3 شهور <span className="text-green-600 font-bold">(ستوفر 930 جنيه)</span>
                  </div>
                  <div>
                    <Link href={getRegisterUrl('/register?plan=quarterly')} className="block text-center bg-primary text-white px-8 py-3.5 rounded-full font-label-md hover:shadow-lg transition-all">
                      اشترك دلوقتي
                    </Link>
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-20 shadow-card-sm overflow-hidden hover-lift relative">
                <div className="h-3 bg-secondary-container"></div>
                <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full font-label-md shadow-lg">
                  🏆 الأوفر
                </div>
                <div className="p-8 pt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">✅</span>
                    <h3 className="font-headline-lg text-headline-lg text-primary-deep">اشتراك سنوي</h3>
                  </div>
                  <div className="mb-2">
                    <span className="font-display-lg text-display-lg text-primary-deep">690</span>
                    <span className="text-on-surface-variant font-body-md mr-2">جنيه</span>
                    <span className="text-on-surface-variant font-body-md">/ شهريًا</span>
                  </div>
                  <div className="text-on-surface-variant font-body-md mb-6">
                    اجمالي 8280 جنيه سنويًا <span className="text-green-600 font-bold">(ستوفر 6120 جنيه)</span>
                  </div>
                  <div>
                    <Link href={getRegisterUrl('/register?plan=yearly')} className="block text-center bg-primary text-white px-8 py-3.5 rounded-full font-label-md hover:shadow-lg transition-all">
                      اشترك سنوي
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-12 max-w-3xl mx-auto space-y-4">
              <div className="bg-surface-container-low p-6 rounded-16 border-r-4 border-secondary-container">
                <p className="text-on-surface-variant font-body-md">
                  🎯 <strong className="text-primary">ميزة الاشتراك السنوي:</strong> الاشتراك السنوي بيوفر لك 6120 جنيه مقارنة بالاشتراك الشهري، وده مش مجرد توفير مالي، لكنه كمان استثمار في استمرارية تعليم أفضل وخطة أوضح لابنك على مدار السنة.
                </p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-16 border-r-4 border-primary">
                <p className="text-on-surface-variant font-body-md">
                  ✅ <strong className="text-primary">رسوم تسجيل إدارية</strong> 200 جنيه تدفع لمرة واحدة
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-deep to-primary text-on-primary text-center">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-6">ابدأ رحلة التعلم اليوم</h2>
          <p className="font-body-lg text-body-lg max-w-2xl mx-auto opacity-90 mb-8">سجل الآن وامنح ابنك مستقبلًا تقنيًا واعدًا مع أحدث أساليب التعليم التفاعلي</p>
          <Link
            href={getRegisterUrl('/register')}
            className="inline-block bg-white text-primary-deep px-10 py-4 rounded-full font-label-md hover:shadow-xl transition-all scale-100 hover:scale-105 active:scale-95"
          >
            سجل الآن
          </Link>
        </div>
      </section>
    </div>
  );
}
