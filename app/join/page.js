'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function JoinPage() {
  const [activeTab, setActiveTab] = useState('trainer');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.target);
    const data = {
      formType,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      country: formData.get('country'),
      specialty: formData.get('specialty'),
      experience: formData.get('experience'),
      portfolio: formData.get('portfolio'),
      bio: formData.get('bio'),
      onlineWork: formData.get('onlineWork'),
      studentInteraction: formData.get('studentInteraction'),
      gulfExperience: formData.get('gulfExperience'),
      certificate: formData.get('certificate'),
      department: formData.get('department'),
    };

    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        e.target.reset();
      } else {
        setError(json.error || 'حدث خطأ');
      }
    } catch {
      setError('فشل الاتصال بالخادم');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <section className="relative bg-gradient-to-br from-primary-deep to-primary text-on-primary overflow-hidden py-24 md:py-32">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-6">شكراً لتواصلك معنا</h1>
            <p className="font-body-lg text-body-lg max-w-2xl mx-auto opacity-90">تم استلام طلبك بنجاح! سيتواصل معك فريق التوظيف قريباً.</p>
            <div className="mt-10">
              <Link href="/" className="bg-secondary-container text-on-secondary-container px-10 py-4 rounded-full font-headline-lg shadow-xl hover:scale-105 active:scale-95 transition-all inline-block">العودة للرئيسية</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="relative bg-gradient-to-br from-primary-deep to-primary text-on-primary overflow-hidden py-24 md:py-32">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-6">كن جزءاً من فريق Tech Makers</h1>
          <p className="font-body-lg text-body-lg max-w-2xl mx-auto opacity-90">انضم إلى مجتمع يسعى لتشكيل مستقبل التكنولوجيا في مصر وتطوير جيل المبتكرين القادم.</p>
          <div className="mt-10">
            <Link href="#apply-forms" className="bg-secondary-container text-on-secondary-container px-10 py-4 rounded-full font-headline-lg shadow-xl hover:scale-105 active:scale-95 transition-all inline-block">ابدأ رحلتك معنا</Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-bg-off-white">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-headline-xl text-headline-xl text-primary mb-4">لماذا تنضم إلينا؟</h2>
            <div className="h-1.5 w-24 bg-secondary-container mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-gutter">
            <div className="bg-white p-8 rounded-xl shadow-card border border-primary-light/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
              </div>
              <h4 className="font-headline-lg text-headline-lg mb-3">بيئة عمل مرنة</h4>
              <p className="text-on-surface-variant font-body-md">نقدر التوازن بين العمل والحياة ونوفر مرونة كاملة في المواعيد والمهام.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-card border border-primary-light/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">model_training</span>
              </div>
              <h4 className="font-headline-lg text-headline-lg mb-3">تدريب مستمر</h4>
              <p className="text-on-surface-variant font-body-md">فرص لا تنتهي لتطوير مهاراتك التقنية والشخصية من خلال ورش عمل مكثفة.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-card border border-primary-light/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">groups</span>
              </div>
              <h4 className="font-headline-lg text-headline-lg mb-3">فريق شغوف</h4>
              <p className="text-on-surface-variant font-body-md">ستعمل جنباً إلى جنب مع أفضل العقول في مجال التكنولوجيا والابتكار.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-card border border-primary-light/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
              </div>
              <h4 className="font-headline-lg text-headline-lg mb-3">نمو مهني</h4>
              <p className="text-on-surface-variant font-body-md">مسار وظيفي واضح وفرص حقيقية للترقي وتولي مسؤوليات قيادية.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-container-lowest" id="apply-forms">
        <div className="max-w-4xl mx-auto px-margin-mobile">
          <div className="text-center mb-12">
            <h2 className="font-headline-xl text-headline-xl text-primary mb-4">طلبات الانضمام</h2>
            <p className="text-on-surface-variant">اختر الفئة التي تناسب خبراتك واملأ النموذج</p>
          </div>

          <div className="flex justify-center gap-4 mb-12">
            <button
              className={`px-8 py-3 rounded-full font-label-md transition-all duration-300 ${activeTab === 'trainer' ? 'bg-primary text-on-primary shadow-lg scale-105' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
              onClick={() => setActiveTab('trainer')}
            >
              مدرب (Trainer)
            </button>
            <button
              className={`px-8 py-3 rounded-full font-label-md transition-all duration-300 ${activeTab === 'specialist' ? 'bg-primary text-on-primary shadow-lg scale-105' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
              onClick={() => setActiveTab('specialist')}
            >
              متخصص (Specialist)
            </button>
            <button
              className={`px-8 py-3 rounded-full font-label-md transition-all duration-300 ${activeTab === 'admin' ? 'bg-primary text-on-primary shadow-lg scale-105' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
              onClick={() => setActiveTab('admin')}
            >
              إداري (Admin)
            </button>
          </div>

          {activeTab === 'trainer' && (
            <div className="golden-glow-border p-1">
              <div className="bg-white p-8 md:p-12 rounded-3xl">
                <div className="text-center mb-8">
                  <h3 className="font-headline-lg text-headline-lg text-primary mb-2">تسجيل المدربين</h3>
                  <p className="text-on-surface-variant">أكمل البيانات التالية للتقديم على وظيفة المدرب</p>
                </div>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 rounded-xl text-red-700 font-body-md text-body-md flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-500">error</span>
                    {error}
                  </div>
                )}
              <form className="space-y-6" onSubmit={(e) => handleSubmit(e, 'trainer')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="trainer-name">الاسم الكامل *</label>
                    <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="text" name="name" id="trainer-name" placeholder="أدخل اسمك الثلاثي" minLength="5" maxLength="100" required />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="trainer-email">البريد الإلكتروني *</label>
                    <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="email" name="email" id="trainer-email" placeholder="example@techmakers.com" required />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="trainer-phone">رقم الهاتف *</label>
                    <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="tel" name="phone" id="trainer-phone" placeholder="+20 123 456 7890" pattern="[\+0][0-9\s\-]{7,15}" required />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="trainer-country">الدولة *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="country" id="trainer-country" required>
                      <option value="">اختر الدولة</option>
                      <option value="egypt">مصر</option>
                      <option value="jordan">الأردن</option>
                      <option value="saudi">السعودية</option>
                      <option value="kuwait">الكويت</option>
                      <option value="uae">الإمارات</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="trainer-specialty">التخصص *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="specialty" id="trainer-specialty" required>
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
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="trainer-experience">سنوات الخبرة *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="experience" id="trainer-experience" required>
                      <option value="">اختر مستوى الخبرة</option>
                      <option value="0-1">أقل من سنة</option>
                      <option value="1-3">1-3 سنوات</option>
                      <option value="3-5">3-5 سنوات</option>
                      <option value="5+">أكثر من 5 سنوات</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="trainer-portfolio">رابط ملف الأعمال (Portfolio) / LinkedIn</label>
                  <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="url" name="portfolio" id="trainer-portfolio" placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="trainer-bio">نبذة عنك *</label>
                  <textarea className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="bio" id="trainer-bio" rows="4" placeholder="تحدث بإيجاز عن خبراتك وأبرز إنجازاتك..." required></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="trainer-online">هل تجيد العمل أونلاين؟ *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="onlineWork" id="trainer-online" required>
                      <option value="">اختر الإجابة</option>
                      <option value="yes">نعم، أجيد العمل أونلاين</option>
                      <option value="no">لا، أفضل العمل أوفلاين</option>
                      <option value="both">أعمل بالطريقتين</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="trainer-students">هل لديك القدرة للتعامل مع الطلاب؟ *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="studentInteraction" id="trainer-students" required>
                      <option value="">اختر الإجابة</option>
                      <option value="yes">نعم، لدي خبرة في التعامل مع الطلاب</option>
                      <option value="no">لا، لكنني متحمس للتعلم</option>
                      <option value="some">لدي بعض الخبرة</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="trainer-gulf">هل لديك خبرات سابقة مع التعامل مع طلاب وأطفال بالخليج العربي؟ *</label>
                  <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="gulfExperience" id="trainer-gulf" required>
                    <option value="">اختر الإجابة</option>
                    <option value="yes">نعم، لدي خبرة سابقة</option>
                    <option value="no">لا، لكنني مستعد للعمل معهم</option>
                    <option value="some">لدي بعض الخبرة في التعامل مع أطفال الخليج</option>
                  </select>
                </div>
                <div className="pt-6">
                  <button type="submit" disabled={submitting} className="w-full bg-primary text-on-primary py-4 rounded-full font-headline-lg hover:shadow-lg active:scale-95 transition-all disabled:opacity-50">
                    {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </button>
                </div>
              </form>
              </div>
            </div>
          )}

          {activeTab === 'specialist' && (
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-outline-variant/20">
              <div className="text-center mb-8">
                <h3 className="font-headline-lg text-headline-lg text-primary mb-2">تسجيل المتخصصين</h3>
                <p className="text-on-surface-variant">أكمل البيانات التالية للتقديم على وظيفة المتخصص</p>
              </div>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 rounded-xl text-red-700 font-body-md text-body-md flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-500">error</span>
                  {error}
                </div>
              )}
              <form className="space-y-6" onSubmit={(e) => handleSubmit(e, 'specialist')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="spec-name">الاسم الكامل *</label>
                    <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="text" name="name" id="spec-name" placeholder="أدخل اسمك الثلاثي" minLength="5" maxLength="100" required />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="spec-email">البريد الإلكتروني *</label>
                    <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="email" name="email" id="spec-email" placeholder="example@techmakers.com" required />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="spec-phone">رقم الهاتف *</label>
                    <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="tel" name="phone" id="spec-phone" placeholder="+20 123 456 7890" pattern="[\+0][0-9\s\-]{7,15}" required />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="spec-country">الدولة *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="country" id="spec-country" required>
                      <option value="">اختر الدولة</option>
                      <option value="egypt">مصر</option>
                      <option value="jordan">الأردن</option>
                      <option value="saudi">السعودية</option>
                      <option value="kuwait">الكويت</option>
                      <option value="uae">الإمارات</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="spec-type">نوع التخصص *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="specialty" id="spec-type" required>
                      <option value="">اختر نوع التخصص</option>
                      <option value="behavioral">إخصائي سلوكي</option>
                      <option value="educational">إخصائي إرشادي</option>
                      <option value="counselor">مرشد نفسي</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="spec-experience">سنوات الخبرة *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="experience" id="spec-experience" required>
                      <option value="">اختر مستوى الخبرة</option>
                      <option value="0-1">أقل من سنة</option>
                      <option value="1-3">1-3 سنوات</option>
                      <option value="3-5">3-5 سنوات</option>
                      <option value="5+">أكثر من 5 سنوات</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="spec-certificate">الشهادات المهنية</label>
                  <textarea className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="certificate" id="spec-certificate" rows="3" placeholder="اذكر الشهادات المهنية التي تمتلكها"></textarea>
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="spec-bio">نبذة عنك *</label>
                  <textarea className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="bio" id="spec-bio" rows="4" placeholder="تحدث بإيجاز عن خبراتك وأبرز إنجازاتك..." required></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="spec-online">هل تجيد العمل أونلاين؟ *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="onlineWork" id="spec-online" required>
                      <option value="">اختر الإجابة</option>
                      <option value="yes">نعم، أجيد العمل أونلاين</option>
                      <option value="no">لا، أفضل العمل أوفلاين</option>
                      <option value="both">أعمل بالطريقتين</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="spec-students">هل لديك القدرة للتعامل مع الطلاب؟ *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="studentInteraction" id="spec-students" required>
                      <option value="">اختر الإجابة</option>
                      <option value="yes">نعم، لدي خبرة في التعامل مع الطلاب</option>
                      <option value="no">لا، لكنني متحمس للتعلم</option>
                      <option value="some">لدي بعض الخبرة</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="spec-gulf">هل لديك خبرات سابقة مع التعامل مع طلاب وأطفال بالخليج العربي؟ *</label>
                  <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="gulfExperience" id="spec-gulf" required>
                    <option value="">اختر الإجابة</option>
                    <option value="yes">نعم، لدي خبرة سابقة</option>
                    <option value="no">لا، لكنني مستعد للعمل معهم</option>
                    <option value="some">لدي بعض الخبرة في التعامل مع أطفال الخليج</option>
                  </select>
                </div>
                <div className="pt-6">
                  <button type="submit" disabled={submitting} className="w-full bg-primary text-on-primary py-4 rounded-full font-headline-lg hover:shadow-lg active:scale-95 transition-all disabled:opacity-50">
                    {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-outline-variant/20">
              <div className="text-center mb-8">
                <h3 className="font-headline-lg text-headline-lg text-primary mb-2">تسجيل الإداريين</h3>
                <p className="text-on-surface-variant">أكمل البيانات التالية للتقديم على وظائف الإدارة</p>
              </div>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 rounded-xl text-red-700 font-body-md text-body-md flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-500">error</span>
                  {error}
                </div>
              )}
              <form className="space-y-6" onSubmit={(e) => handleSubmit(e, 'admin')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="admin-name">الاسم الكامل *</label>
                    <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="text" name="name" id="admin-name" placeholder="أدخل اسمك الثلاثي" minLength="5" maxLength="100" required />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="admin-email">البريد الإلكتروني *</label>
                    <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="email" name="email" id="admin-email" placeholder="example@techmakers.com" required />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="admin-phone">رقم الهاتف *</label>
                    <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="tel" name="phone" id="admin-phone" placeholder="+20 123 456 7890" pattern="[\+0][0-9\s\-]{7,15}" required />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="admin-country">الدولة *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="country" id="admin-country" required>
                      <option value="">اختر الدولة</option>
                      <option value="egypt">مصر</option>
                      <option value="jordan">الأردن</option>
                      <option value="saudi">السعودية</option>
                      <option value="kuwait">الكويت</option>
                      <option value="uae">الإمارات</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="admin-dept">القسم *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="department" id="admin-dept" required>
                      <option value="">اختر القسم</option>
                      <option value="hr">الموارد البشرية</option>
                      <option value="marketing">التسويق والمبيعات</option>
                      <option value="support">خدمة العملاء</option>
                      <option value="finance">المالية</option>
                      <option value="tech">الدعم الفني</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="admin-experience">سنوات الخبرة *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="experience" id="admin-experience" required>
                      <option value="">اختر مستوى الخبرة</option>
                      <option value="0-1">أقل من سنة</option>
                      <option value="1-3">1-3 سنوات</option>
                      <option value="3-5">3-5 سنوات</option>
                      <option value="5+">أكثر من 5 سنوات</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="admin-portfolio">LinkedIn</label>
                  <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="url" name="portfolio" id="admin-portfolio" placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="admin-bio">نبذة عنك *</label>
                  <textarea className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="bio" id="admin-bio" rows="4" placeholder="تحدث بإيجاز عن خبراتك وأبرز إنجازاتك..." required></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="admin-online">هل تجيد العمل أونلاين؟ *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="onlineWork" id="admin-online" required>
                      <option value="">اختر الإجابة</option>
                      <option value="yes">نعم، أجيد العمل أونلاين</option>
                      <option value="no">لا، أفضل العمل أوفلاين</option>
                      <option value="both">أعمل بالطريقتين</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="admin-students">هل لديك القدرة للتعامل مع الطلاب؟ *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="studentInteraction" id="admin-students" required>
                      <option value="">اختر الإجابة</option>
                      <option value="yes">نعم، لدي خبرة في التعامل مع الطلاب</option>
                      <option value="no">لا، لكنني متحمس للتعلم</option>
                      <option value="some">لدي بعض الخبرة</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="admin-gulf">هل لديك خبرات سابقة مع التعامل مع طلاب وأطفال بالخليج العربي؟ *</label>
                  <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="gulfExperience" id="admin-gulf" required>
                    <option value="">اختر الإجابة</option>
                    <option value="yes">نعم، لدي خبرة سابقة</option>
                    <option value="no">لا، لكنني مستعد للعمل معهم</option>
                    <option value="some">لدي بعض الخبرة في التعامل مع أطفال الخليج</option>
                  </select>
                </div>
                <div className="pt-6">
                  <button type="submit" disabled={submitting} className="w-full bg-primary text-on-primary py-4 rounded-full font-headline-lg hover:shadow-lg active:scale-95 transition-all disabled:opacity-50">
                    {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-bg-off-white">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-headline-xl text-headline-xl text-primary">تواصل مباشر</h2>
            <p className="text-on-surface-variant mt-2">نحن هنا للإجابة على استفساراتك حول الانضمام</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            <a className="flex flex-col items-center text-center p-10 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow group" href="mailto:info@tka-egypt.com">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-primary text-4xl">mail</span>
              </div>
              <h4 className="font-headline-lg text-headline-lg mb-2">البريد الإلكتروني</h4>
              <p className="text-on-surface-variant font-label-md">info@tka-egypt.com</p>
            </a>
            <a className="flex flex-col items-center text-center p-10 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow group" href="https://wa.me/201062540164" target="_blank" rel="noopener noreferrer">
              <div className="w-20 h-20 bg-whatsapp/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-whatsapp/10 transition-colors">
                <span className="material-symbols-outlined text-whatsapp text-4xl">chat</span>
              </div>
              <h4 className="font-headline-lg text-headline-lg mb-2">واتساب</h4>
              <p className="text-on-surface-variant font-label-md">0106 254 0164</p>
            </a>
            <div className="flex flex-col items-center text-center p-10 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-20 h-20 bg-secondary-container/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary text-4xl">share</span>
              </div>
              <h4 className="font-headline-lg text-headline-lg mb-4">وسائل التواصل</h4>
              <div className="flex gap-4">
                <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary-light hover:text-white transition-all" href="https://www.facebook.com/TKA.Egypt/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
