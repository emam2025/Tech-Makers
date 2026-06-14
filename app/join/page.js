'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef } from 'react';

const LANG_LEVELS = [
  { value: 'none', label: 'لا أملك' },
  { value: 'beginner', label: 'مبتدئ' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'advanced', label: 'متقدم' },
  { value: 'native', label: 'لغة أم' },
];

const QUALIFICATIONS = [
  { value: 'bachelor', label: 'بكالوريوس' },
  { value: 'license', label: 'ليسانس' },
  { value: 'high_diploma', label: 'دبلومة عليا' },
  { value: 'master', label: 'ماجستير' },
  { value: 'phd', label: 'دكتوراه' },
];

const MARITAL_STATUS = [
  { value: 'single', label: 'أعزب' },
  { value: 'married', label: 'متزوج' },
  { value: 'widowed', label: 'أرمل' },
  { value: 'divorced', label: 'مطلق' },
  { value: 'other', label: 'أخرى' },
];

const COUNTRIES = [
  { value: 'egypt', label: 'مصر' },
  { value: 'jordan', label: 'الأردن' },
  { value: 'saudi', label: 'السعودية' },
  { value: 'kuwait', label: 'الكويت' },
  { value: 'uae', label: 'الإمارات' },
  { value: 'qatar', label: 'قطر' },
  { value: 'bahrain', label: 'البحرين' },
  { value: 'oman', label: 'عمان' },
  { value: 'libya', label: 'ليبيا' },
  { value: 'sudan', label: 'السودان' },
  { value: 'palestine', label: 'فلسطين' },
  { value: 'lebanon', label: 'لبنان' },
  { value: 'iraq', label: 'العراق' },
  { value: 'tunisia', label: 'تونس' },
  { value: 'algeria', label: 'الجزائر' },
  { value: 'morocco', label: 'المغرب' },
];

const GRADUATION_YEARS = Array.from({ length: 30 }, (_, i) => {
  const year = 2026 - i;
  return { value: String(year), label: String(year) };
});

function PhotoUpload({ name, label, required, onPhotoChange }) {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('الحجم الأقصى 2 ميجا');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onPhotoChange?.(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPreview(null);
    onPhotoChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="font-label-md text-on-surface">{label} {required && '*'}</label>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative">
            <img src={preview} alt="الصورة الشخصية" className="w-24 h-24 rounded-full object-cover border-2 border-primary" />
            <button type="button" onClick={removePhoto} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">✕</button>
          </div>
        ) : (
          <div onClick={() => inputRef.current?.click()} className="w-24 h-24 rounded-full border-2 border-dashed border-outline-variant/40 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-bg-off-white">
            <span className="material-symbols-outlined text-on-surface-variant/50 text-2xl">person</span>
            <span className="text-xs text-on-surface-variant/50 mt-1">صورة</span>
          </div>
        )}
        <div className="flex-1">
          <input ref={inputRef} type="file" name={name} accept="image/*" onChange={handleFile} className="hidden" />
          <button type="button" onClick={() => inputRef.current?.click()} className="text-sm text-primary font-bold hover:underline">اختر صورة شخصية</button>
          <p className="text-xs text-on-surface-variant/60 mt-1">JPG/PNG، الحد الأقصى 2MB</p>
        </div>
      </div>
    </div>
  );
}

function SharedFields({ prefix }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="font-label-md text-on-surface" htmlFor={`${prefix}-fname`}>الاسم الأول *</label>
          <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="text" name="firstName" id={`${prefix}-fname`} placeholder="الاسم الأول" minLength="2" maxLength="50" required />
        </div>
        <div className="space-y-2">
          <label className="font-label-md text-on-surface" htmlFor={`${prefix}-mname`}>الاسم الأوسط</label>
          <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="text" name="middleName" id={`${prefix}-mname`} placeholder="الاسم الأوسط (اختياري)" maxLength="50" />
        </div>
        <div className="space-y-2">
          <label className="font-label-md text-on-surface" htmlFor={`${prefix}-lname`}>الاسم الأخير *</label>
          <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="text" name="lastName" id={`${prefix}-lname`} placeholder="الاسم الأخير" minLength="2" maxLength="50" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-label-md text-on-surface" htmlFor={`${prefix}-email`}>البريد الإلكتروني *</label>
          <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="email" name="email" id={`${prefix}-email`} placeholder="example@email.com" required />
        </div>
        <div className="space-y-2">
          <label className="font-label-md text-on-surface" htmlFor={`${prefix}-phone`}>رقم الهاتف *</label>
          <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="tel" name="phone" id={`${prefix}-phone`} placeholder="+20 123 456 7890" pattern="[\+0][0-9\s\-]{7,15}" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-label-md text-on-surface" htmlFor={`${prefix}-address`}>العنوان التفصيلي *</label>
          <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="text" name="address" id={`${prefix}-address`} placeholder="الشارع، المنطقة، المدينة" minLength="5" maxLength="200" required />
        </div>
        <div className="space-y-2">
          <label className="font-label-md text-on-surface" htmlFor={`${prefix}-country`}>الدولة *</label>
          <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="country" id={`${prefix}-country`} required>
            <option value="">اختر الدولة</option>
            {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-label-md text-on-surface" htmlFor={`${prefix}-marital`}>الحالة الاجتماعية *</label>
          <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="maritalStatus" id={`${prefix}-marital`} required>
            <option value="">اختر الحالة</option>
            {MARITAL_STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <PhotoUpload name="photo" label="الصورة الشخصية" onPhotoChange={() => {}} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-label-md text-on-surface" htmlFor={`${prefix}-qualification`}>المؤهل الدراسي *</label>
          <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="qualification" id={`${prefix}-qualification`} required>
            <option value="">اختر المؤهل</option>
            {QUALIFICATIONS.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="font-label-md text-on-surface" htmlFor={`${prefix}-college`}>اسم الكليه / المعهد *</label>
          <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="text" name="college" id={`${prefix}-college`} placeholder="مثال: كلية الحاسبات والمعلومات" minLength="3" maxLength="150" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-label-md text-on-surface" htmlFor={`${prefix}-university`}>الجامعة *</label>
          <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="text" name="university" id={`${prefix}-university`} placeholder="مثال: جامعة القاهرة" minLength="3" maxLength="150" required />
        </div>
        <div className="space-y-2">
          <label className="font-label-md text-on-surface" htmlFor={`${prefix}-major`}>التخصص *</label>
          <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="text" name="major" id={`${prefix}-major`} placeholder="مثال: ذكاء اصطناعي" minLength="3" maxLength="150" required />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-label-md text-on-surface" htmlFor={`${prefix}-qualificationName`}>اسم المؤهل التفصيلي (اختياري)</label>
        <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="text" name="qualificationName" id={`${prefix}-qualificationName`} placeholder="مثال: بكالوريوس الحاسبات والمعلومات جامعة القاهرة تخصص ذكاء اصطناعي" maxLength="300" />
      </div>

      <div className="space-y-2">
        <label className="font-label-md text-on-surface" htmlFor={`${prefix}-gradYear`}>سنة التخرج *</label>
        <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="graduationYear" id={`${prefix}-gradYear`} required>
          <option value="">اختر السنة</option>
          {GRADUATION_YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        <label className="font-label-md text-on-surface">اللغات *</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg-off-white rounded-xl p-4 space-y-2">
            <span className="font-label-sm text-on-surface-variant">العربية</span>
            <select className="w-full bg-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-3 py-2 transition-all text-sm" name="lang_arabic" required>
              {LANG_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div className="bg-bg-off-white rounded-xl p-4 space-y-2">
            <span className="font-label-sm text-on-surface-variant">الإنجليزية</span>
            <select className="w-full bg-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-3 py-2 transition-all text-sm" name="lang_english" required>
              {LANG_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div className="bg-bg-off-white rounded-xl p-4 space-y-2">
            <span className="font-label-sm text-on-surface-variant">الفرنسية</span>
            <select className="w-full bg-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg px-3 py-2 transition-all text-sm" name="lang_french" required>
              {LANG_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-label-md text-on-surface" htmlFor={`${prefix}-skills`}>المهارات والهوايات *</label>
        <textarea className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="skills" id={`${prefix}-skills`} rows="3" placeholder="اذكر مهاراتك وهواياتك (مثال: البرمجة، التصميم، كرة القدم...)" minLength="5" maxLength="1000" required></textarea>
      </div>

      <div className="space-y-2">
        <label className="font-label-md text-on-surface" htmlFor={`${prefix}-experience`}>الخبرات السابقة / أماكن العمل *</label>
        <textarea className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="experienceHistory" id={`${prefix}-experience`} rows="4" placeholder="اذكر أماكن العمل السابقة والمناصب التي شغلتها (مثال: 2020-2023: مبرمج في شركة X...)" minLength="5" maxLength="2000" required></textarea>
      </div>

      <div className="space-y-2">
        <label className="font-label-md text-on-surface" htmlFor={`${prefix}-certificates`}>الشهادات التي حصلت عليها</label>
        <textarea className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="obtainedCertificates" id={`${prefix}-certificates`} rows="3" placeholder="اذكر الشهادات المهنية والدورات التي حصلت عليها (مثال: AWS Certified, Google Analytics...)" maxLength="2000"></textarea>
      </div>

      <div className="space-y-2">
        <label className="font-label-md text-on-surface">رغبة العمل *</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 bg-bg-off-white rounded-xl px-4 py-3 cursor-pointer hover:bg-surface-container-high transition-colors flex-1">
            <input type="radio" name="workPreference" value="online" className="accent-primary" required />
            <span className="font-label-md text-on-surface">أونلاين</span>
          </label>
          <label className="flex items-center gap-2 bg-bg-off-white rounded-xl px-4 py-3 cursor-pointer hover:bg-surface-container-high transition-colors flex-1">
            <input type="radio" name="workPreference" value="offline" className="accent-primary" />
            <span className="font-label-md text-on-surface">أوفلاين</span>
          </label>
          <label className="flex items-center gap-2 bg-bg-off-white rounded-xl px-4 py-3 cursor-pointer hover:bg-surface-container-high transition-colors flex-1">
            <input type="radio" name="workPreference" value="both" className="accent-primary" />
            <span className="font-label-md text-on-surface">كلاهما</span>
          </label>
        </div>
      </div>
    </>
  );
}

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
      firstName: formData.get('firstName'),
      middleName: formData.get('middleName') || '',
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      country: formData.get('country'),
      maritalStatus: formData.get('maritalStatus'),
      qualification: formData.get('qualification'),
      college: formData.get('college'),
      qualificationName: formData.get('qualificationName') || '',
      graduationYear: formData.get('graduationYear'),
      university: formData.get('university'),
      major: formData.get('major'),
      langArabic: formData.get('lang_arabic'),
      langEnglish: formData.get('lang_english'),
      langFrench: formData.get('lang_french'),
      skills: formData.get('skills'),
      experienceHistory: formData.get('experienceHistory'),
      obtainedCertificates: formData.get('obtainedCertificates') || '',
      workPreference: formData.get('workPreference'),
      photo: formData.get('photo')?.name || null,
      specialty: formData.get('specialty') || null,
      department: formData.get('department') || null,
      portfolio: formData.get('portfolio') || null,
      bio: formData.get('bio') || '',
      studentInteraction: formData.get('studentInteraction') || null,
      gulfExperience: formData.get('gulfExperience') || null,
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
      <section className="relative bg-gradient-to-br from-primary-deep to-primary text-on-primary overflow-hidden py-16 md:py-32">
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
        <div className="absolute inset-0">
          <Image
            src="/join-banner.jpg"
            alt="فريق Tech Makers"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-deep/90 to-primary/80"></div>
        </div>
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
            <div className="bg-white p-5 md:p-8 rounded-xl shadow-card border border-primary-light/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4 md:mb-6">
                <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">schedule</span>
              </div>
              <h4 className="font-headline-lg text-headline-lg mb-3">بيئة عمل مرنة</h4>
              <p className="text-on-surface-variant font-body-md">نقدر التوازن بين العمل والحياة ونوفر مرونة كاملة في المواعيد والمهام.</p>
            </div>
            <div className="bg-white p-5 md:p-8 rounded-xl shadow-card border border-primary-light/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4 md:mb-6">
                <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">model_training</span>
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

          <div className="flex justify-center gap-4 mb-12 flex-wrap">
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
                <SharedFields prefix="trainer" />

                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="trainer-specialty">التخصص المطلوب *</label>
                  <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="specialty" id="trainer-specialty" required>
                    <option value="">اختر التخصص</option>
                    <option value="programming">برمجة (Python / Scratch)</option>
                    <option value="java">Java</option>
                    <option value="c">لغة C</option>
                    <option value="cpp">لغة C++</option>
                    <option value="web">تطوير الويب</option>
                    <option value="ai">ذكاء اصطناعي</option>
                    <option value="mobile">تطوير تطبيقات الموبايل</option>
                    <option value="iot">إنترنت الأشياء (IoT)</option>
                    <option value="data">تحليل البيانات</option>
                    <option value="database">قواعد بيانات</option>
                    <option value="mental_math">مدرب حساب ذهني (Techno Math)</option>
                    <option value="english">مدرب لغة إنجليزية</option>
                    <option value="appinventor">مدرب App Inventor</option>
                    <option value="scratch">مدرب Scratch</option>
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

                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="trainer-portfolio">رابط LinkedIn / ملف الأعمال</label>
                  <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="url" name="portfolio" id="trainer-portfolio" placeholder="https://linkedin.com/in/username" />
                </div>

                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="trainer-bio">نبذة عنك *</label>
                  <textarea className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="bio" id="trainer-bio" rows="4" placeholder="تحدث بإيجاز عن خبراتك وأبرز إنجازاتك..." minLength="10" maxLength="2000" required></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="trainer-students">هل لديك القدرة للتعامل مع الطلاب؟ *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="studentInteraction" id="trainer-students" required>
                      <option value="">اختر الإجابة</option>
                      <option value="yes">نعم، لدي خبرة في التعامل مع الطلاب</option>
                      <option value="no">لا، لكنني متحمس للتعلم</option>
                      <option value="some">لدي بعض الخبرة</option>
                    </select>
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
            <div className="golden-glow-border p-1">
              <div className="bg-white p-8 md:p-12 rounded-3xl">
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
                <SharedFields prefix="spec" />

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

                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="spec-certificate">الشهادات المهنية</label>
                  <textarea className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="certificate" id="spec-certificate" rows="3" placeholder="اذكر الشهادات المهنية التي تمتلكها" maxLength="1000"></textarea>
                </div>

                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="spec-portfolio">رابط LinkedIn / ملف الأعمال</label>
                  <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="url" name="portfolio" id="spec-portfolio" placeholder="https://linkedin.com/in/username" />
                </div>

                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="spec-bio">نبذة عنك *</label>
                  <textarea className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="bio" id="spec-bio" rows="4" placeholder="تحدث بإيجاز عن خبراتك وأبرز إنجازاتك..." minLength="10" maxLength="2000" required></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="spec-students">هل لديك القدرة للتعامل مع الطلاب؟ *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="studentInteraction" id="spec-students" required>
                      <option value="">اختر الإجابة</option>
                      <option value="yes">نعم، لدي خبرة في التعامل مع الطلاب</option>
                      <option value="no">لا، لكنني متحمس للتعلم</option>
                      <option value="some">لدي بعض الخبرة</option>
                    </select>
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

          {activeTab === 'admin' && (
            <div className="golden-glow-border p-1">
              <div className="bg-white p-8 md:p-12 rounded-3xl">
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
                <SharedFields prefix="admin" />

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

                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="admin-portfolio">رابط LinkedIn / ملف الأعمال</label>
                  <input className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" type="url" name="portfolio" id="admin-portfolio" placeholder="https://linkedin.com/in/username" />
                </div>

                <div className="space-y-2">
                  <label className="font-label-md text-on-surface" htmlFor="admin-bio">نبذة عنك *</label>
                  <textarea className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="bio" id="admin-bio" rows="4" placeholder="تحدث بإيجاز عن خبراتك وأبرز إنجازاتك..." minLength="10" maxLength="2000" required></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface" htmlFor="admin-students">هل لديك القدرة للتعامل مع الطلاب؟ *</label>
                    <select className="w-full bg-bg-off-white border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 transition-all" name="studentInteraction" id="admin-students" required>
                      <option value="">اختر الإجابة</option>
                      <option value="yes">نعم، لدي خبرة في التعامل مع الطلاب</option>
                      <option value="no">لا، لكنني متحمس للتعلم</option>
                      <option value="some">لدي بعض الخبرة</option>
                    </select>
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
