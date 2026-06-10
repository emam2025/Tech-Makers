import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <span className="hero-eyebrow">🌟 تك ميكرز</span>
            <h1 className="hero-title">
              من <span className="hl">مستهلك للتكنولوجيا</span>
              إلى <span className="hl-yellow">صانع ومطور وقائد</span>
            </h1>
            <p className="hero-tagline">
              تك ميكرز <span className="dot">•</span> Building Future Tech Leaders
            </p>
            <div className="hero-image-mobile">
              <img src="/tech-1.png" alt="طالب تك ميكرز" className="hero-image-mobile-img" />
            </div>
            <p className="hero-sub">
              في عالم تتغير فيه التكنولوجيا بسرعة، أصبح امتلاك المهارات الرقمية ليس اختيارًا… بل ضرورة لصناعة المستقبل.
              <strong className="hero-highlight">تك ميكرز</strong> هو برنامج تعليمي متكامل يهدف إلى إعداد جيل جديد من المبدعين والقادة التقنيين، من خلال رحلة عملية تبدأ من أساسيات البرمجة والتفكير المنطقي، وصولًا إلى الذكاء الاصطناعي وبناء المشاريع الرقمية الحقيقية.
            </p>
            <p className="hero-sub hero-sub-emph">
              نؤمن أن التكنولوجيا لا يجب أن تكون مجرد أداة للاستهلاك، بل وسيلة للإبداع، الابتكار، وحل المشكلات.
            </p>
            <div className="hero-focus">
              <span className="focus-label">يركز البرنامج على:</span>
              <ul className="focus-list">
                <li>✅ بناء عقلية تحليلية ومنهجية تفكير هندسية</li>
                <li>✅ تطوير مهارات البرمجة والذكاء الاصطناعي</li>
                <li>✅ التعلم بالمشاريع والتطبيق العملي</li>
                <li>✅ تعزيز الثقة بالنفس والإبداع والعمل الجماعي</li>
                <li>✅ إعداد الطلاب لمهارات المستقبل والمسارات التقنية الحديثة</li>
              </ul>
            </div>
            <div className="hero-statement">
              نحن لا نقدم مادة علمية فقط… بل نبني بيئة تعليمية متكاملة تساعد الطالب على النمو فكريًا، تقنيًا، وشخصيًا.
            </div>
            <div className="hero-countries">
              <span className="countries-label">متاح حاليًا في:</span>
              <div className="countries-list">
                <span className="country-flag">🇪🇬 مصر</span>
                <span className="country-flag">🇯🇴 الأردن</span>
                <span className="country-flag">🇸🇦 السعودية</span>
                <span className="country-flag">🇰🇼 الكويت</span>
                <span className="country-flag">🇦🇪 الإمارات</span>
              </div>
            </div>
            <div className="hero-actions">
              <a href="#tracks" className="btn btn-primary">استكشف المسارات</a>
              <Link href="/register" className="btn btn-ghost">سجّل الآن</Link>
            </div>
          </div>
          <div className="hero-image-wrap">
            <div className="hero-blob"></div>
            <img src="/tech-1.png" alt="طالب تك ميكرز" className="hero-image" />
            <div className="age-floats">
              <div className="age-float age-float-1">
                <span className="age-float-range">8–11</span>
                <span className="age-float-label">سنة</span>
              </div>
              <div className="age-float age-float-2">
                <span className="age-float-range">12–15</span>
                <span className="age-float-label">سنة</span>
              </div>
              <div className="age-float age-float-3">
                <span className="age-float-range">16–20</span>
                <span className="age-float-label">سنة</span>
              </div>
            </div>
            <div className="hero-float hero-float-1">
              <span>🎯</span> تفكير منطقي
            </div>
            <div className="hero-float hero-float-2">
              <span>🤖</span> ذكاء اصطناعي
            </div>
            <div className="hero-float hero-float-3">
              <span>💡</span> مشاريع حقيقية
            </div>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">عن تك ميكرز</span>
            <h2 className="section-title">إحنا مش بنعلّم برمجة وبس… إحنا بنبني شخصية</h2>
            <p className="section-sub">منهج متكامل مبني على 4 محاور أساسية تُعد جيل المستقبل</p>
          </div>

          <div className="pillars-grid">
            <div className="pillar">
              <div className="pillar-num">01</div>
              <div className="pillar-icon">🧠</div>
              <h3>التفكير المنطقي</h3>
              <p>بناء عقلية تحليلية تُمكّن الطالب من فهم المشكلات وتقسيمها بذكاء</p>
            </div>
            <div className="pillar">
              <div className="pillar-num">02</div>
              <div className="pillar-icon">🎨</div>
              <h3>الإبداع الرقمي</h3>
              <p>تحويل الطالب من مستهلك للتكنولوجيا إلى صانع يُنتج أدواته</p>
            </div>
            <div className="pillar">
              <div className="pillar-num">03</div>
              <div className="pillar-icon">🛠️</div>
              <h3>التعلم بالمشاريع</h3>
              <p>زيادة الثقة بالنفس من خلال تطبيقات عملية ومشاريع حقيقية</p>
            </div>
            <div className="pillar">
              <div className="pillar-num">04</div>
              <div className="pillar-icon">🤖</div>
              <h3>التعرض المبكر للـ AI</h3>
              <p>إعداد جيل المستقبل بأدوات وتقنيات الذكاء الاصطناعي</p>
            </div>
          </div>
        </div>
      </section>

      <section className="outcomes">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">النتائج المتوقعة</span>
            <h2 className="section-title">ماذا سيحقق ابنك من خلال تك ميكرز؟</h2>
            <p className="section-sub">نتائج ملموسة تؤثر بشكل إيجابي على مستقبل طفلك الأكاديمي والمهني</p>
          </div>

          <div className="outcomes-grid">
            <div className="outcome-card">
              <div className="outcome-icon-wrap"><div className="outcome-icon">💻</div></div>
              <h3>اكتساب مهارات تقنية متقدمة</h3>
              <ul className="outcome-list">
                <li>فهم أساسيات البرمجة وتطبيقاتها العملية مما يؤهلهم لمواكبة التطورات التكنولوجية</li>
                <li>القدرة على التعامل مع مفاهيم الذكاء الاصطناعي وتصميم الروبوتات البسيطة</li>
              </ul>
            </div>
            <div className="outcome-card">
              <div className="outcome-icon-wrap"><div className="outcome-icon">📚</div></div>
              <h3>تحسين الأداء الأكاديمي</h3>
              <ul className="outcome-list">
                <li>تحسين مهارات الحساب الذهني ينعكس إيجابًا على قدرتهم في الرياضيات والعلوم</li>
                <li>تقوية اللغة الإنجليزية تعزز فهمهم للمواد الدراسية خاصة في المجالات التقنية</li>
              </ul>
            </div>
            <div className="outcome-card">
              <div className="outcome-icon-wrap"><div className="outcome-icon">🧠</div></div>
              <h3>تنمية المهارات الشخصية</h3>
              <ul className="outcome-list">
                <li>تطوير مهارات التفكير النقدي وحل المشكلات من خلال المشاريع العملية</li>
                <li>تعزيز العمل الجماعي والقيادة من خلال المشاركة في أنشطة تعاونية</li>
              </ul>
            </div>
            <div className="outcome-card">
              <div className="outcome-icon-wrap"><div className="outcome-icon">💪</div></div>
              <h3>زيادة الثقة بالنفس</h3>
              <ul className="outcome-list">
                <li>إنجاز مشاريع تقنية يعزز ثقة الأطفال بأنفسهم وقدرتهم على الإبداع</li>
                <li>المشاركة في أنشطة تعليمية متقدمة تشجعهم على تحقيق أهداف أكبر</li>
              </ul>
            </div>
            <div className="outcome-card">
              <div className="outcome-icon-wrap"><div className="outcome-icon">🔭</div></div>
              <h3>فتح آفاق جديدة للتعلم</h3>
              <ul className="outcome-list">
                <li>تحفيز الأطفال على استكشاف مجالات جديدة في العلوم والتكنولوجيا</li>
                <li>استعداد أكبر لمواجهة تحديات المستقبل في سوق العمل التقني</li>
              </ul>
            </div>
            <div className="outcome-card">
              <div className="outcome-icon-wrap"><div className="outcome-icon">🚀</div></div>
              <h3>بناء جيل مبتكر</h3>
              <ul className="outcome-list">
                <li>إعداد جيل من الأطفال القادرين على الابتكار والإسهام في تطوير المجتمع</li>
                <li>أساس قوي في التكنولوجيا والذكاء الاصطناعي يؤهلهم لقيادة مشاريع تكنولوجية</li>
              </ul>
            </div>
            <div className="outcome-card outcome-card-wide">
              <div className="outcome-icon-wrap"><div className="outcome-icon">🌍</div></div>
              <h3>تأثير إيجابي على المجتمع</h3>
              <ul className="outcome-list">
                <li>زيادة عدد الأطفال الملمين بالتكنولوجيا يسهم في تطوير المجتمع وزيادة الوعي التقني</li>
                <li>سيكون لهؤلاء الأطفال دور فعال في دفع عجلة الابتكار والتنمية في الوطن العربي</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="tracks-intro" id="tracks">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">المسارات التعليمية</span>
            <h2 className="section-title">قسّمنا الطلاب حسب الفئة العمرية</h2>
            <p className="section-sub">علشان كل طالب يتعلم بالطريقة المناسبة لسنه ومستواه — فرق كبير في طريقة التفكير، سرعة التعلم، والقدرة على الاستيعاب التقني</p>
          </div>

          <div className="tracks-cards">
            <div className="track-card track-a">
              <div className="track-badge">Track A</div>
              <h3>Junior Tech Explorers</h3>
              <p className="track-age">من 8 إلى 11 سنة</p>
              <ul className="track-tags">
                <li>🎮 Visual Learning</li>
                <li>🕹️ Gamification</li>
                <li>🎨 Creative Projects</li>
              </ul>
              <Link href="/tracks?track=a" className="track-link">شاهد الرحلة ←</Link>
            </div>
            <div className="track-card track-b">
              <div className="track-badge">Track B</div>
              <h3>Future AI Engineers</h3>
              <p className="track-age">من 12 إلى 15 سنة</p>
              <ul className="track-tags">
                <li>💻 Real Coding</li>
                <li>🤖 AI Workflows</li>
                <li>🧠 Tech Thinking</li>
              </ul>
              <Link href="/tracks?track=b" className="track-link">شاهد الرحلة ←</Link>
            </div>
            <div className="track-card track-c">
              <div className="track-badge track-badge-c">Track C</div>
              <h3>Future Tech Engineers</h3>
              <p className="track-age">من 16 إلى 20 سنة</p>
              <ul className="track-tags">
                <li>🚀 Full Stack</li>
                <li>🤖 AI Engineering</li>
                <li>📱 Mobile Dev</li>
                <li>📊 Data Analytics</li>
              </ul>
              <Link href="/tracks?track=c" className="track-link track-link-c">شاهد الرحلة ←</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="students" id="students">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">طلابنا</span>
            <h2 className="section-title">بعض طلابنا المتميزين</h2>
            <p className="section-sub">نماذج حية من دفعات سابقة — بأسماء حقيقية وشهادات موثقة</p>
          </div>

          <div className="students-grid">
            {[
              { name: 'Tala Nasser Abdelfatah', cert: '400179 AU', img: '1.jpeg' },
              { name: 'Ahmed Mohamed Fouad', cert: '400122 AU', img: '2.jpeg' },
              { name: 'Seif Hesham Mohamed', cert: '400126 AU', img: '3.jpeg' },
              { name: 'Sila Ahmed Mohamed', cert: '400125 AU', img: '4.jpeg' },
              { name: 'Ziad Ahmed AlSayigh', cert: '400114 AU', img: '5.jpeg' },
              { name: 'Aysen Hossam Ali', cert: '400177 Bt', img: '6.jpeg', result: 'Passed Level Two with Distinction' },
              { name: 'Tala Nasser Abdelfatah', cert: '400179 AU', img: '7.jpeg' },
              { name: 'Ahmed Mohamed Fouad', cert: '400122 AU', img: '8.jpeg' },
              { name: 'Seif Hesham Mohamed', cert: '400126 AU', img: '9.jpeg' },
              { name: 'Sila Ahmed Mohamed', cert: '400125 AU', img: '10.jpeg' },
              { name: 'Ziad Ahmed AlSayigh', cert: '400114 AU', img: '11.jpeg' },
            ].map((s, i) => (
              <div className="student-card" key={i}>
                <div className="student-photo-wrap">
                  <img src={`/student/${s.img}`} alt={s.name} className="student-photo" />
                  <div className="student-medal">🥇</div>
                </div>
                <h4>{s.name}</h4>
                <p className="student-cert">Certificate No: {s.cert}</p>
                <p className="student-result">{s.result || 'Passed Level One with Distinction'}</p>
              </div>
            ))}
          </div>

          <div className="students-cta">
            <p>ابنك ممكن يكون التالي 🌟</p>
          </div>
        </div>
      </section>

      <section className="addons" id="why">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">المزيد من القيمة</span>
            <h2 className="section-title">مميزات إضافية وبرامج تطويرية</h2>
            <p className="section-sub">مش بس منهج تقني — بنهتم بالشخصية والمهارات الداعمة كاملة</p>
          </div>

          <div className="addons-grid">
            <div className="addon-card addon-extra">
              <div className="addon-badge">إضافة مستقلة</div>
              <div className="addon-icon">🧠</div>
              <h3>Techno Math</h3>
              <p>برنامج تطويري لتعزيز التفكير الرياضي والمنطقي بربطه بالتكنولوجيا. تفاصيل الاشتراك والرسوم عند التواصل معنا.</p>
              <a href="#plans" className="addon-link">استفسر عن البرنامج ←</a>
            </div>
            <div className="addon-card addon-extra">
              <div className="addon-badge">إضافة مستقلة</div>
              <div className="addon-icon">🗣️</div>
              <h3>Tech English</h3>
              <p>برنامج تطويري لبناء ثقة الطالب في التواصل التقني باللغة الإنجليزية. تفاصيل الاشتراك والرسوم عند التواصل معنا.</p>
              <a href="#plans" className="addon-link">استفسر عن البرنامج ←</a>
            </div>
            <div className="addon-card addon-support">
              <div className="addon-badge addon-badge-included">مضمّن</div>
              <div className="addon-icon">🛡️</div>
              <h3>إخصائي سلوكي وإرشادي</h3>
              <p>إخصائي متخصص لمتابعة الجانب النفسي للطالب، مساعدته في التخلص من الضغوط، ودعمه طوال الرحلة التعليمية بأمان.</p>
              <span className="addon-included">مشمول في الباقة الأساسية</span>
            </div>
            <div className="addon-card addon-funding">
              <div className="addon-icon">💙</div>
              <h3>مدعوم من TKA-Egypt</h3>
              <p>البرنامج مدعوم جزئياً من TKA-Egypt، مما يضمن جودة عالية مع أسعار مناسبة للأسر المصرية.</p>
              <span className="addon-included">دعم مستمر للأهالي</span>
            </div>
          </div>
        </div>
      </section>

      <section className="plans" id="plans">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">📌 خطط الاشتراك المتاحة</span>
            <p className="section-sub plans-sub">تقدر تختار نظام الاشتراك الأنسب لك من بين الخطط التالية:</p>
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
              <Link href="/register?plan=monthly" className="plan-btn">اشترك الآن</Link>
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
              <Link href="/register?plan=quarterly" className="plan-btn">اشترك دلوقتي</Link>
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
              <Link href="/register?plan=yearly" className="plan-btn plan-btn-elite">اشترك سنوي</Link>
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

      <section className="faq" id="faq">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">الأسئلة الشائعة</span>
            <h2 className="section-title">إجابات على أهم أسئلة الأهالي</h2>
          </div>

          <div className="faq-list">
            <details className="faq-item" open>
              <summary>المحاضرات أوفلاين ولا أونلاين؟</summary>
              <p>جميع المحاضرات مباشرة Live أونلاين، مع تسجيلات متاحة للمراجعة، ومشاريع عملية وتفاعل حقيقي داخل كل محاضرة.</p>
            </details>
            <details className="faq-item">
              <summary>إيه الفرق بين Track A و Track B؟</summary>
              <p>Track A (من 8 إلى 11 سنة) يركز على التعلم البصري والألعاب والمشاريع الإبداعية. Track B (من 12 إلى 15 سنة) يركز على البرمجة الحقيقية وسير عمل الـ AI والتفكير الاحترافي.</p>
            </details>
            <details className="faq-item">
              <summary>هل فيه شهادة بعد كل مستوى؟</summary>
              <p>نعم، يحصل الطالب على شهادة معتمدة بعد كل مستوى. في باقة Future Elite يحصل الطالب على شهادة معتمدة مطبوعة + Portfolio كامل.</p>
            </details>
            <details className="faq-item">
              <summary>إيه هي برامج Techno Math و Tech English؟</summary>
              <p>برامج تطويرية إضافية تُقدم بجانب المسار الأساسي. Techno Math لتعزيز التفكير الرياضي، و Tech English لبناء ثقة الطالب في التواصل التقني باللغة الإنجليزية. يتم التسجيل فيها بشكل مستقل.</p>
            </details>
            <details className="faq-item">
              <summary>هل فيه متابعة نفسية للطالب؟</summary>
              <p>بالتأكيد. كل الباقات تشمل متابعة من إخصائي سلوكي وإرشادي متخصص لمساندة الطالب نفسياً ومساعدته في التعامل مع ضغوط الرحلة التعليمية.</p>
            </details>
            <details className="faq-item">
              <summary>إيه التخصصات المتاحة بعد السنة التأسيسية؟</summary>
              <p>5 تخصصات: Web Development، Mobile App Development، AI Automations، Data Analysis، و IoT & Smart Systems. يختار الطالب التخصص اللي يناسبه للسنة الثانية.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <span className="cta-eyebrow">مستقبل ابنك يبدأ من هنا</span>
          <h2>🚀 سجّل اهتمامك في تك ميكرز</h2>
          <p>ابدأ رحلة ابنك في عالم التكنولوجيا، البرمجة، والذكاء الاصطناعي. مقاعد محدودة في كل دفعة.</p>
          <div className="cta-actions">
            <Link href="/register" className="btn btn-primary btn-lg">سجّل الآن</Link>
            <a href="#tracks" className="btn btn-ghost btn-lg">استكشف المسارات</a>
          </div>
        </div>
      </section>
    </>
  );
}
