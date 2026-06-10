import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      {/* ABOUT HERO */}
      <section className="about-hero">
        <div className="tech-bg">
          <div className="stars-anim"></div>
          <div className="tech-lines">
            <div className="line line1"></div>
            <div className="line line2"></div>
            <div className="line line3"></div>
            <div className="line line4"></div>
            <div className="line line5"></div>
          </div>
          <div className="tech-circles">
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>
          </div>
          <div className="binary-code">
            <span>01001</span>
            <span>10110</span>
            <span>01101</span>
            <span>11010</span>
            <span>00101</span>
          </div>
        </div>
        <div className="container">
          <span className="section-eyebrow">عن TKA-Egypt</span>
          <h1 className="about-hero-title">نبني جيل عربي قادر على صناعة التكنولوجيا</h1>
          <p className="about-hero-sub">نطمح لأن نكون المنصة التعليمية الرائدة في المنطقة العربية لتأهيل الطلاب في مجالات التكنولوجيا والبرمجة والذكاء الاصطناعي</p>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="vm-section">
        <div className="container">
          <div className="vm-grid">
            <div className="vm-card vm-vision">
              <div className="vm-icon">🔭</div>
              <h3>رؤيتنا</h3>
              <p>بناء جيل عربي قادر على صناعة التكنولوجيا وليس فقط استخدامها، من خلال بيئة تعليمية متكاملة تجمع بين العلوم التقنية ومهارات التفكير النقدي والإبداع.</p>
            </div>
            <div className="vm-card vm-mission">
              <div className="vm-icon">🎯</div>
              <h3>رسالتنا</h3>
              <p>إتاحة فرصة تعليمية عالية الجودة للطلاب المتميزين والمهتمين بمجالات التكنولوجيا المستقبلية، عبر منهج تعليمي متكامل يبدأ من أساسيات البرمجة وصولاً إلى الذكاء الاصطناعي وبناء المشاريع الحقيقية.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GOALS */}
      <section className="goals-section">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">أهدافنا</span>
            <h2 className="section-title">ما نسعي لتحقيقه</h2>
            <p className="section-sub">نعمل بشغف لبناء مستقبل تقني مشرق للجيل العربي</p>
          </div>

          <div className="goals-grid">
            <div className="goal-card">
              <div className="goal-num">01</div>
              <div className="goal-icon">🧠</div>
              <h4>بناء عقلية تحليلية</h4>
              <p>تأهيل الطلاب للتفكير العلمي والمنهجي وحل المشكلات بطريقة هندسية</p>
            </div>
            <div className="goal-card">
              <div className="goal-num">02</div>
              <div className="goal-icon">💻</div>
              <h4>تطوير مهارات تقنية</h4>
              <p>تعليم البرمجة والذكاء الاصطناعي وتقنيات المستقبل بطريقة عملية وتفاعلية</p>
            </div>
            <div className="goal-card">
              <div className="goal-num">03</div>
              <div className="goal-icon">🚀</div>
              <h4>تحفيز الإبداع</h4>
              <p>تحويل الطلاب من مستهلكين للتكنولوجيا إلى مبدعين وصانعين لها</p>
            </div>
            <div className="goal-card">
              <div className="goal-num">04</div>
              <div className="goal-icon">🤝</div>
              <h4>تعزيز العمل الجماعي</h4>
              <p>تنمية مهارات التواصل والتعاون والعمل ضمن فرق عمل</p>
            </div>
            <div className="goal-card">
              <div className="goal-num">05</div>
              <div className="goal-icon">🌍</div>
              <h4>بناء جيل عربي متمرس</h4>
              <p>إعداد الطلاب لسوق العمل التقني والمسارات المهنية الحديثة</p>
            </div>
            <div className="goal-card">
              <div className="goal-num">06</div>
              <div className="goal-icon">📈</div>
              <h4>قياس الأثر</h4>
              <p>متابعة تطور الطلاب وقياس أثر البرنامج على مسيرتهم التعليمية والمهنية</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="founder-section">
        <div className="container">
          <div className="founder-grid">
            <div className="founder-image-wrap">
              <div className="founder-blob"></div>
              <img src="founder.png" alt="مؤسس TKA-Egypt" className="founder-image" />
            </div>
            <div className="founder-content">
              <span className="section-eyebrow">كلمة المؤسس</span>
              <h2 className="founder-title">نبني ما نتمناه لمستقبل أبنائنا</h2>
              <div className="founder-text">
                <p>في عالم تتغير فيه التكنولوجيا بسرعة غير مسبوقة، أصبح من الضروري أن نُعِدّ أبناءنا لمواجهة تحديات الغد. لم يعد كافياً أن يعرف الطفل كيف يستخدم الأجهزة الذكية، بل يجب أن يفهم كيف يعمل وكيف يصنع أدواته الخاصة.</p>
                <p>program Tech Makers انطلق من رؤية واضحة: نحن لا نقدم مادة علمية فقط… بل نبني بيئة تعليمية متكاملة تساعد الطالب على النمو فكريًا، تقنيًا، وشخصيًا.</p>
                <p>نؤمن بأن كل طفل عربي يحمل بداخله قدرات هائلة إذا أُتيحت له الفرصة المناسبة والدعم اللازم. نحن هنا لنكون الجسر الذي ينقل أبناءنا من مجرد مستهلكين للتكنولوجيا إلى صانعين لها.</p>
                <p>دعونا معاً نبني جيلًا عربياً قادرًا على صناعة المستقبل.</p>
              </div>
              <div className="founder-signature">
                <span className="founder-name">مؤسس TKA-Egypt</span>
                <span className="founder-role">Tech Makers Egypt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container cta-inner">
          <span className="cta-eyebrow">انضم إلينا</span>
          <h2>🚀 كن جزءاً من رحلة Tech Makers</h2>
          <p> سواء كنت طالباً أو أباً أو مدرباً، نحن نرحب بك في مجتمع Tech Makers</p>
          <div className="cta-actions">
            <Link href="/register" className="btn btn-primary btn-lg">سجّل الآن</Link>
            <Link href="/tracks" className="btn btn-ghost btn-lg">استكشف المسارات</Link>
          </div>
        </div>
      </section>
    </>
  );
}
