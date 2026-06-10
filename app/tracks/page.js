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
        achievement: 'بنهاية السنة: طفلك جاهز يدخل التخصص اللي يحبه بثقة 🎓',
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

export default function TracksPage() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showJourney, setShowJourney] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const track = params.get('track');
    if (track && trackData[track]) {
      setCurrentTrack(track);
    } else {
      setCurrentTrack('a');
    }
  }, []);

  function nextStep(step) {
    setCurrentStep(step);
  }

  function showPlans() {
    setShowJourney(false);
  }

  if (!currentTrack) return null;

  const track = trackData[currentTrack];

  function getStepBadge(step) {
    if (track.yearBreak && step <= track.yearBreak) {
      return `السنة الأولى - المستوى ${step}`;
    }
    if (track.yearBreak && step > track.yearBreak) {
      return 'السنة التخصصية';
    }
    return `المرحلة ${step} من ${track.totalSteps}`;
  }

  function getYearLabel(step) {
    if (track.yearBreak && step > track.yearBreak) {
      return <span className="year-badge year-badge-2">{track.yearLabels[1]}</span>;
    }
    return <span className="year-badge">{track.yearLabels[0]}</span>;
  }

  const progressPercent = (currentStep / track.totalSteps) * 100;

  function getRegisterUrl(base) {
    return `${base}${currentTrack ? `&track=${currentTrack}` : ''}`;
  }

  return (
    <>
      <section className="space-journey" id="space-journey" style={{ display: showJourney ? 'block' : 'none' }}>
        <div className="space-bg">
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
        </div>
        <div className="container">
          <div className="journey-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="progress-steps">
              {Array.from({ length: track.totalSteps }, (_, i) => {
                const stepNum = i + 1;
                let className = 'progress-step';
                if (stepNum === currentStep) className += ' active';
                if (stepNum < currentStep) className += ' completed';
                return (
                  <div className={className} data-step={stepNum} key={stepNum}>
                    <div className="step-dot">{stepNum}</div>
                    <span>{getStepLabel(currentTrack, stepNum)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="year-label" id="yearLabel">
            {getYearLabel(currentStep)}
          </div>

          <div className="journey-steps">
            {/* Step 1 */}
            <div className={`journey-step${currentStep === 1 ? ' active' : ''}`} id="journeyStep1">
              <div className="rocket-animation">
                <div className="rocket">🚀</div>
                <div className="rocket-trail"></div>
              </div>
              <div className="journey-content">
                <div className="step-badge" id="step1Badge">{getStepBadge(1)}</div>
                <h2 className="journey-title" id="step1Title">{track.steps[0]?.title}</h2>
                <p className="journey-desc" id="step1Desc">{track.steps[0]?.desc}</p>
                <div className="journey-gains" id="step1Gains">
                  <ul>
                    {track.steps[0]?.gains.map((gain, i) => <li key={i}>{gain}</li>)}
                  </ul>
                </div>
                <div className="journey-achievement" id="step1Achievement">{track.steps[0]?.achievement}</div>
                {track.totalSteps > 1 && (
                  <button className="journey-next-btn" onClick={() => nextStep(2)}>التالي ←</button>
                )}
              </div>
            </div>

            {/* Step 2 */}
            <div className={`journey-step${currentStep === 2 ? ' active' : ''}`} id="journeyStep2">
              <div className="planet-animation">
                <div className="planet">🪐</div>
              </div>
              <div className="journey-content">
                <div className="step-badge" id="step2Badge">{getStepBadge(2)}</div>
                <h2 className="journey-title" id="step2Title">{track.steps[1]?.title}</h2>
                <p className="journey-desc" id="step2Desc">{track.steps[1]?.desc}</p>
                <div className="journey-gains" id="step2Gains">
                  <ul>
                    {track.steps[1]?.gains.map((gain, i) => <li key={i}>{gain}</li>)}
                  </ul>
                </div>
                <div className="journey-achievement" id="step2Achievement">{track.steps[1]?.achievement}</div>
                <div className="journey-nav">
                  <button className="journey-prev-btn" onClick={() => nextStep(1)}>→ السابق</button>
                  {track.totalSteps > 2 && (
                    <button className="journey-next-btn" onClick={() => nextStep(3)}>التالي ←</button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`journey-step${currentStep === 3 ? ' active' : ''}`} id="journeyStep3">
              <div className="satellite-animation">
                <div className="satellite">🛰️</div>
              </div>
              <div className="journey-content">
                <div className="step-badge" id="step3Badge">{getStepBadge(3)}</div>
                <h2 className="journey-title" id="step3Title">{track.steps[2]?.title}</h2>
                <p className="journey-desc" id="step3Desc">{track.steps[2]?.desc}</p>
                <div className="journey-gains" id="step3Gains">
                  <ul>
                    {track.steps[2]?.gains.map((gain, i) => <li key={i}>{gain}</li>)}
                  </ul>
                </div>
                <div className="journey-achievement" id="step3Achievement">{track.steps[2]?.achievement}</div>
                <div className="journey-nav">
                  <button className="journey-prev-btn" onClick={() => nextStep(2)}>→ السابق</button>
                  {track.totalSteps > 3 && (
                    <button className="journey-next-btn" onClick={() => nextStep(4)}>التالي ←</button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`journey-step${currentStep === 4 ? ' active' : ''}`} id="journeyStep4">
              <div className="celebration-animation">
                <div className="celebration">🏆</div>
                <div className="confetti"></div>
              </div>
              <div className="journey-content">
                <div className="step-badge" id="step4Badge">{getStepBadge(4)}</div>
                <h2 className="journey-title" id="step4Title">{track.steps[3]?.title}</h2>
                <p className="journey-desc" id="step4Desc">{track.steps[3]?.desc}</p>
                <div className="journey-gains" id="step4Gains">
                  <ul>
                    {track.steps[3]?.gains.map((gain, i) => <li key={i}>{gain}</li>)}
                  </ul>
                </div>
                <div className="journey-achievement journey-achievement-final" id="step4Achievement">{track.steps[3]?.achievement}</div>
                <div className="journey-nav">
                  <button className="journey-prev-btn" onClick={() => nextStep(3)}>→ السابق</button>
                  {track.totalSteps > 4 ? (
                    <button className="journey-next-btn" onClick={() => nextStep(5)}>التالي ←</button>
                  ) : (
                    <span className="journey-next-btn" onClick={showPlans}>عرض الباقات ←</span>
                  )}
                </div>
              </div>
            </div>

            {/* Step 5 (only for track c) */}
            {track.totalSteps > 4 && (
              <div className={`journey-step${currentStep === 5 ? ' active' : ''}`} id="journeyStep5">
                <div className="rocket-animation">
                  <div className="rocket">🛸</div>
                </div>
                <div className="journey-content">
                  <div className="step-badge" id="step5Badge">{getStepBadge(5)}</div>
                  <h2 className="journey-title" id="step5Title">{track.steps[4]?.title}</h2>
                  <p className="journey-desc" id="step5Desc">{track.steps[4]?.desc}</p>
                  <div className="journey-gains" id="step5Gains">
                    <ul>
                      {track.steps[4]?.gains.map((gain, i) => <li key={i}>{gain}</li>)}
                    </ul>
                  </div>
                  <div className="journey-achievement" id="step5Achievement">{track.steps[4]?.achievement}</div>
                  <div className="journey-nav">
                    <button className="journey-prev-btn" onClick={() => nextStep(4)}>→ السابق</button>
                    <span className="journey-next-btn" onClick={showPlans}>عرض الباقات ←</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="plans" id="plans" style={{ display: showJourney ? 'none' : 'block' }}>
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">📌 خطط الاشتراك المتاحة</span>
            <p className="section-sub">تقدر تختار نظام الاشتراك الأنسب لك من بين الخطط التالية:</p>
          </div>

          <div className="plans-grid">
            <article className="plan">
              <div className="plan-head">
                <div className="plan-emoji">✅</div>
                <h3 className="plan-name">اشتراك شهري</h3>
              </div>
              <div className="plan-price">
                <span className="price-amount">1200</span>
                <span className="price-currency">جنيه</span>
                <span className="price-period">/ شهر</span>
              </div>
              <div className="plan-tag plan-tag-green">مناسب للتجربة - البرايفت سيشن</div>
              <Link href={getRegisterUrl('/register?plan=monthly')} className="plan-btn plan-register">اشترك الآن</Link>
            </article>

            <article className="plan plan-popular">
              <div className="plan-ribbon">⭐ الأكثر اختيارًا</div>
              <div className="plan-head">
                <div className="plan-emoji">✅</div>
                <h3 className="plan-name">اشتراك ربع سنوي</h3>
              </div>
              <div className="plan-price">
                <span className="price-amount">890</span>
                <span className="price-currency">جنيه</span>
                <span className="price-period">/ شهريًا</span>
              </div>
              <div className="plan-total">اجمالي 2670 جنيه لكل 3 شهور <span className="plan-save">(ستوفر 930 جنيه)</span></div>
              <Link href={getRegisterUrl('/register?plan=quarterly')} className="plan-btn plan-register">اشترك دلوقتي</Link>
            </article>

            <article className="plan plan-elite">
              <div className="plan-ribbon ribbon-elite">🏆 الأوفر</div>
              <div className="plan-head">
                <div className="plan-emoji">✅</div>
                <h3 className="plan-name">اشتراك سنوي</h3>
              </div>
              <div className="plan-price">
                <span className="price-amount">690</span>
                <span className="price-currency">جنيه</span>
                <span className="price-period">/ شهريًا</span>
              </div>
              <div className="plan-total">اجمالي 8280 جنيه سنويًا <span className="plan-save">(ستوفر 6120 جنيه)</span></div>
              <Link href={getRegisterUrl('/register?plan=yearly')} className="plan-btn plan-btn-elite plan-register">اشترك سنوي</Link>
            </article>
          </div>

          <div className="plans-footnote">
            <p>🎯 <strong>ميزة الاشتراك السنوي:</strong> الاشتراك السنوي بيوفر لك 6120 جنيه مقارنة بالاشتراك الشهري، وده مش مجرد توفير مالي، لكنه كمان استثمار في استمرارية تعليم أفضل وخطة أوضح لابنك على مدار السنة.</p>
          </div>
          <div className="plans-footnote" style={{ marginTop: 14 }}>
            <p>✅ <strong>رسوم تسجيل إدارية</strong> 200 جنيه تدفع لمرة واحدة</p>
          </div>
        </div>
      </section>
    </>
  );
}
