'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function JoinPage() {
  const [activeTab, setActiveTab] = useState('trainer');

  return (
    <>
      <section className="join-hero">
        <div className="container">
          <span className="section-eyebrow">انضم الينا</span>
          <h1 className="join-hero-title">كن جزءاً من فريق Tech Makers</h1>
          <p className="join-hero-sub">نبحث عن أشخاص شغوفين بالتعليم والتكنولوجيا للانضمام إلى فريقنا المتنامي</p>
        </div>
      </section>

      <section className="why-join">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">لماذا Tech Makers؟</span>
            <h2 className="section-title">فرص متميزة لتطوير مسيرتك المهنية</h2>
          </div>
          <div className="why-join-grid">
            <div className="why-join-card">
              <div className="why-join-icon">🌱</div>
              <h4>بيئة عمل مرنة</h4>
              <p>عمل عن بُعد بمرونة في الأوقات يناسب الطلاب والخريجين</p>
            </div>
            <div className="why-join-card">
              <div className="why-join-icon">📚</div>
              <h4>تدريب مستمر</h4>
              <p>برامج تدريبية وتطوير مهني مستمر للموظفين</p>
            </div>
            <div className="why-join-card">
              <div className="why-join-icon">🤝</div>
              <h4>فريق شغوف</h4>
              <p>العمل مع فريق متميز يؤمن بأهمية التعليم والتكنولوجيا</p>
            </div>
            <div className="why-join-card">
              <div className="why-join-icon">🚀</div>
              <h4>نمو مهني</h4>
              <p>فرص للترقي والنمو داخل المؤسسة</p>
            </div>
          </div>
        </div>
      </section>

      <section className="join-forms">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">نموذج التسجيل</span>
            <h2 className="section-title">اختر الدور المناسب لك</h2>
            <p className="section-sub">اختر التخصص الذي يناسب خبراتك ومهاراتك</p>
          </div>

          <div className="form-tabs">
            <button
              className={'form-tab' + (activeTab === 'trainer' ? ' active' : '')}
              onClick={() => setActiveTab('trainer')}
            >
              👨‍🏫 مدرب
            </button>
            <button
              className={'form-tab' + (activeTab === 'specialist' ? ' active' : '')}
              onClick={() => setActiveTab('specialist')}
            >
              🧑‍⚕️ اخصائي
            </button>
            <button
              className={'form-tab' + (activeTab === 'admin' ? ' active' : '')}
              onClick={() => setActiveTab('admin')}
            >
              📋 اداري
            </button>
          </div>

          {activeTab === 'trainer' && (
            <div className="form-panel active" id="trainer">
              <div className="form-card">
                <div className="form-header">
                  <h3>نموذج تسجيل المدربين</h3>
                  <p>أكمل البيانات التالية للتقديم على وظيفة المدرب</p>
                </div>
                <form className="registration-form" onSubmit={(e) => { e.preventDefault(); alert('شكراً لك! تم استلام طلبك وسنتواصل معك قريباً.'); e.target.reset(); }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="trainer-name">الاسم الكامل *</label>
                      <input type="text" id="trainer-name" placeholder="أدخل اسمك الكامل" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="trainer-email">البريد الإلكتروني *</label>
                      <input type="email" id="trainer-email" placeholder="example@email.com" required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="trainer-phone">رقم الهاتف *</label>
                      <input type="tel" id="trainer-phone" placeholder="+20 1XX XXX XXXX" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="trainer-country">الدولة *</label>
                      <select id="trainer-country" required>
                        <option value="">اختر الدولة</option>
                        <option value="egypt">مصر</option>
                        <option value="jordan">الأردن</option>
                        <option value="saudi">السعودية</option>
                        <option value="kuwait">الكويت</option>
                        <option value="uae">الإمارات</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="trainer-specialty">التخصص *</label>
                      <select id="trainer-specialty" required>
                        <option value="">اختر التخصص</option>
                        <option value="programming">برمجة (Python / Scratch)</option>
                        <option value="web">تطوير الويب</option>
                        <option value="ai">ذكاء اصطناعي</option>
                        <option value="mobile">تطوير تطبيقات الموبايل</option>
                        <option value="iot">إنترنت الأشياء (IoT)</option>
                        <option value="data">تحليل البيانات</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="trainer-experience">سنوات الخبرة *</label>
                      <select id="trainer-experience" required>
                        <option value="">اختر مستوى الخبرة</option>
                        <option value="0-1">أقل من سنة</option>
                        <option value="1-3">1-3 سنوات</option>
                        <option value="3-5">3-5 سنوات</option>
                        <option value="5+">أكثر من 5 سنوات</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="trainer-portfolio">رابط ملف الأعمال (Portfolio) / LinkedIn</label>
                    <input type="url" id="trainer-portfolio" placeholder="https://" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="trainer-bio">نبذة عنك *</label>
                    <textarea id="trainer-bio" rows="4" placeholder="أخبرنا عن خبراتك ومهاراتك ولماذا تريد الانضمام لفريق Tech Makers" required></textarea>
                  </div>
                  <button type="submit" className="form-submit">إرسال الطلب</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'specialist' && (
            <div className="form-panel active" id="specialist">
              <div className="form-card">
                <div className="form-header">
                  <h3>نموذج تسجيل الإخصائيين</h3>
                  <p>أكمل البيانات التالية للتقديم على وظيفة الإخصائي السلوكي</p>
                </div>
                <form className="registration-form" onSubmit={(e) => { e.preventDefault(); alert('شكراً لك! تم استلام طلبك وسنتواصل معك قريباً.'); e.target.reset(); }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="spec-name">الاسم الكامل *</label>
                      <input type="text" id="spec-name" placeholder="أدخل اسمك الكامل" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="spec-email">البريد الإلكتروني *</label>
                      <input type="email" id="spec-email" placeholder="example@email.com" required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="spec-phone">رقم الهاتف *</label>
                      <input type="tel" id="spec-phone" placeholder="+20 1XX XXX XXXX" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="spec-country">الدولة *</label>
                      <select id="spec-country" required>
                        <option value="">اختر الدولة</option>
                        <option value="egypt">مصر</option>
                        <option value="jordan">الأردن</option>
                        <option value="saudi">السعودية</option>
                        <option value="kuwait">الكويت</option>
                        <option value="uae">الإمارات</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="spec-type">نوع التخصص *</label>
                      <select id="spec-type" required>
                        <option value="">اختر نوع التخصص</option>
                        <option value="behavioral">إخصائي سلوكي</option>
                        <option value="educational">إخصائي إرشادي</option>
                        <option value="counselor">مرشد نفسي</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="spec-experience">سنوات الخبرة *</label>
                      <select id="spec-experience" required>
                        <option value="">اختر مستوى الخبرة</option>
                        <option value="0-1">أقل من سنة</option>
                        <option value="1-3">1-3 سنوات</option>
                        <option value="3-5">3-5 سنوات</option>
                        <option value="5+">أكثر من 5 سنوات</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="spec-certificate">الشهادات المهنية</label>
                    <textarea id="spec-certificate" rows="3" placeholder="اذكر الشهادات المهنية التي تمتلكها"></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="spec-bio">نبذة عنك *</label>
                    <textarea id="spec-bio" rows="4" placeholder="أخبرنا عن خبراتك ومهاراتك ولماذا تريد الانضمام لفريق Tech Makers" required></textarea>
                  </div>
                  <button type="submit" className="form-submit">إرسال الطلب</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="form-panel active" id="admin">
              <div className="form-card">
                <div className="form-header">
                  <h3>نموذج تسجيل الإداريين</h3>
                  <p>أكمل البيانات التالية للتقديم على وظائف الإدارة</p>
                </div>
                <form className="registration-form" onSubmit={(e) => { e.preventDefault(); alert('شكراً لك! تم استلام طلبك وسنتواصل معك قريباً.'); e.target.reset(); }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="admin-name">الاسم الكامل *</label>
                      <input type="text" id="admin-name" placeholder="أدخل اسمك الكامل" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="admin-email">البريد الإلكتروني *</label>
                      <input type="email" id="admin-email" placeholder="example@email.com" required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="admin-phone">رقم الهاتف *</label>
                      <input type="tel" id="admin-phone" placeholder="+20 1XX XXX XXXX" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="admin-country">الدولة *</label>
                      <select id="admin-country" required>
                        <option value="">اختر الدولة</option>
                        <option value="egypt">مصر</option>
                        <option value="jordan">الأردن</option>
                        <option value="saudi">السعودية</option>
                        <option value="kuwait">الكويت</option>
                        <option value="uae">الإمارات</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="admin-dept">القسم *</label>
                      <select id="admin-dept" required>
                        <option value="">اختر القسم</option>
                        <option value="hr">الموارد البشرية</option>
                        <option value="marketing">التسويق والمبيعات</option>
                        <option value="support">خدمة العملاء</option>
                        <option value="finance">المالية</option>
                        <option value="tech">الدعم الفني</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="admin-experience">سنوات الخبرة *</label>
                      <select id="admin-experience" required>
                        <option value="">اختر مستوى الخبرة</option>
                        <option value="0-1">أقل من سنة</option>
                        <option value="1-3">1-3 سنوات</option>
                        <option value="3-5">3-5 سنوات</option>
                        <option value="5+">أكثر من 5 سنوات</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="admin-portfolio">LinkedIn</label>
                    <input type="url" id="admin-portfolio" placeholder="https://linkedin.com/in/yourname" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="admin-bio">نبذة عنك *</label>
                    <textarea id="admin-bio" rows="4" placeholder="أخبرنا عن خبراتك ومهاراتك ولماذا تريد الانضمام لفريق Tech Makers" required></textarea>
                  </div>
                  <button type="submit" className="form-submit">إرسال الطلب</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="contact-info">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow">تواصل معنا</span>
            <h2 className="section-title">أو تواصل معنا مباشرة</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h4>البريد الإلكتروني</h4>
              <a href="mailto:info@techmakers.eg">info@techmakers.eg</a>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📱</div>
              <h4>واتساب</h4>
              <a href="https://wa.me/20XXXXXXXXXX">+20 1XX XXX XXXX</a>
            </div>
            <div className="contact-card">
              <div className="contact-icon">🌐</div>
              <h4>السوشيال ميديا</h4>
              <a href="#">@TechMakersEgypt</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
