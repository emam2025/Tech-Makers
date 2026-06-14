'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const GRADES = [
  { v: 2, l: 'الصف الثاني الابتدائي' }, { v: 3, l: 'الصف الثالث الابتدائي' },
  { v: 4, l: 'الصف الرابع الابتدائي' }, { v: 5, l: 'الصف الخامس الابتدائي' },
  { v: 6, l: 'الصف السادس الابتدائي' }, { v: 7, l: 'الصف الأول الإعدادي' },
  { v: 8, l: 'الصف الثاني الإعدادي' }, { v: 9, l: 'الصف الثالث الإعدادي' },
  { v: 10, l: 'الصف الأول الثانوي' }, { v: 11, l: 'الصف الثاني الثانوي' },
  { v: 12, l: 'الصف الثالث الثانوي' },
];

const COUNTRIES = ['مصر','الأردن','السعودية','الكويت','الإمارات','قطر','البحرين','عمان','فلسطين','لبنان','العراق','سوريا','اليمن','ليبيا','تونس','الجزائر','المغرب','السودان','موريتانيا','أخرى'];

const EGYPT_GOVS = ['القاهرة','الجيزة','الإسكندرية','الدقهلية','الشرقية','الغربية','القليوبية','المنوفية','البحيرة','كفر الشيخ','دمياط','بورسعيد','الإسماعيلية','السويس','شمال سيناء','جنوب سيناء','الفيوم','بني سويف','المنيا','أسيوط','سوهاج','قنا','الأقصر','أسوان','الوادي الجديد','مطروح','البحر الأحمر','حلوان','6 أكتوبر'];

const STEPS = [
  { label: 'المسار والخطة', icon: 'route' },
  { label: 'بيانات الطالب', icon: 'person' },
  { label: 'المعلومات الدراسية', icon: 'school' },
  { label: 'بيانات التواصل', icon: 'contact_mail' },
];

function calcAge(birthDate) {
  const b = new Date(birthDate);
  const t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age;
}

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [track, setTrack] = useState('');
  const [plan, setPlan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [country, setCountry] = useState('');
  const [firstName, setFirstName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [grade, setGrade] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('track');
    const p = params.get('plan');
    if (t) setTrack(t);
    if (p) setPlan(p);
  }, []);

  function validateStep(s) {
    const errs = {};
    if (s === 0) {
      if (!track) errs.track = 'اختر المسار';
      if (!plan) errs.plan = 'اختر الخطة';
    }
    if (s === 1) {
      if (!firstName || !/^[\u0600-\u06FFA-Za-z]{2,}$/.test(firstName)) errs.firstName = 'الاسم الأول مطلوب';
      if (!fatherName || !/^[\u0600-\u06FFA-Za-z]{2,}$/.test(fatherName)) errs.fatherName = 'اسم الأب مطلوب';
      if (!familyName || !/^[\u0600-\u06FFA-Za-z]{2,}$/.test(familyName)) errs.familyName = 'اسم العائلة مطلوب';
      if (!birthDate) { errs.birthDate = 'تاريخ الميلاد مطلوب'; }
      else { const age = calcAge(birthDate); if (age < 8 || age > 20) errs.birthDate = 'العمر بين 8 و 20 سنة'; }
    }
    if (s === 2) {
      if (!grade) errs.grade = 'اختر الصف الدراسي';
    }
    if (s === 3) {
      if (!/^01[0-9]{9}$/.test(phone)) errs.phone = 'رقم التليفون غير صحيح';
      if (!/^01[0-9]{9}$/.test(whatsapp)) errs.whatsapp = 'رقم الواتساب غير صحيح';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'البريد غير صحيح';
      if (country === 'مصر' && !governorate) errs.governorate = 'اختر المحافظة';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function nextStep() {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 3));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep(3)) return;
    setSubmitting(true);
    const name = `${firstName} ${fatherName} ${familyName}`;
    const data = { name, birth_date: birthDate, email, phone, whatsapp, grade, country, governorate, city, track, plan };
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (json.success) setDone(true);
      else { const errs = {}; if (json.field) errs[json.field] = json.error; else errs._form = json.error || 'حدث خطأ'; setErrors(errs); }
    } catch { setErrors({ _form: 'فشل الاتصال بالخادم' }); }
    finally { setSubmitting(false); }
  }

  function resetForm() {
    setDone(false); setStep(0); setTrack(''); setPlan(''); setCountry('');
    setFirstName(''); setFatherName(''); setFamilyName(''); setBirthDate('');
    setEmail(''); setPhone(''); setWhatsapp(''); setGrade(''); setGovernorate(''); setCity(''); setErrors({});
  }

  const inputClass = (field) =>
    `w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary rtl-input shadow-inner transition-all ${errors[field] ? 'ring-2 ring-error bg-error-container/10' : ''}`;

  if (done) {
    return (
      <section className="p-8 md:p-16 flex flex-col items-center justify-center text-center form-shadow border border-secondary-container/20 rounded-20 w-full bg-white mx-auto max-w-container-max" dir="rtl">
        <div className="w-24 h-24 bg-secondary-container/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <span className="material-symbols-outlined text-secondary-container text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
        </div>
        <h2 className="font-headline-xl text-headline-xl text-primary mb-4">تم تسجيل الطالب بنجاح!</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md mx-auto">شكراً لانضمامكم إلى "تك ميكرز". سيقوم فريق القبول بالتواصل معكم خلال 24 ساعة عمل.</p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button className="flex-1 bg-primary text-on-primary py-4 rounded-full font-label-md text-label-md hover:bg-primary-deep transition-colors cursor-pointer" onClick={resetForm}>تسجيل طالب آخر</button>
          <Link href="/" className="flex-1 border-2 border-primary text-primary py-4 rounded-full font-label-md text-label-md hover:bg-surface-container-low transition-colors text-center">العودة للرئيسية</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-8 md:py-12 px-margin-mobile md:px-margin-desktop flex flex-col items-center min-h-screen bg-bg-off-white" dir="rtl">
      <div className="w-full max-w-2xl mx-auto">
        <div className="drop-shadow-xl">
          <div className="glow-border" style={{padding:3}}>
            <section className="w-full bg-white rounded-20 p-6 md:p-12 relative transition-all duration-500">

              {/* Stepper */}
              <div className="mb-10">
                {/* Desktop: circles + connectors */}
                <div className="hidden sm:flex items-center justify-between mb-4">
                  {STEPS.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        i < step ? 'bg-primary text-white' : i === step ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {i < step ? <span className="material-symbols-outlined text-lg">check</span> : <span>{i + 1}</span>}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`w-12 h-0.5 transition-all duration-300 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
                {/* Mobile: progress bar */}
                <div className="sm:hidden mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary">خطوة {step + 1} من {STEPS.length}</span>
                    <span className="text-xs text-gray-500">{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-primary">{STEPS[step].label}</span>
                </div>
              </div>

              {errors._form && (
                <div className="mb-6 bg-error-container text-on-error-container px-6 py-4 rounded-xl font-body-md text-body-md">{errors._form}</div>
              )}

              {/* Step 0: Track & Plan */}
              {step === 0 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant">المسار التعليمي *</label>
                    <select value={track} onChange={e => setTrack(e.target.value)} className={inputClass('track')}>
                      <option value="">اختر المسار...</option>
                      <option value="a">Track A — Junior Tech Explorers (8–11 سنة)</option>
                      <option value="b">Track B — Future AI Engineers (12–15 سنة)</option>
                      <option value="c">Track C — Future Tech Engineers (16–20 سنة)</option>
                      <option value="technomath">Techno Math — الحساب الذهني (8–15 سنة)</option>
                      <option value="techenglish">Tech English — اللغة الإنجليزية التكنولوجية</option>
                    </select>
                    {errors.track && <span className="font-label-sm text-label-sm text-error">{errors.track}</span>}
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant">خطة الاشتراك *</label>
                    <select value={plan} onChange={e => setPlan(e.target.value)} className={inputClass('plan')}>
                      <option value="">اختر الخطة...</option>
                      {track === 'technomath' ? (
                        <><option value="monthly">شهري — 800 جنيه</option><option value="quarterly">ربع سنوي — 650 جنيه/شهر</option><option value="yearly">سنوي — 500 جنيه/شهر</option></>
                      ) : track === 'techenglish' ? (
                        <><option value="monthly">شهري — 1000 جنيه</option><option value="quarterly">ربع سنوي — 750 جنيه/شهر</option><option value="yearly">سنوي — 600 جنيه/شهر</option></>
                      ) : (
                        <><option value="monthly">شهري — 1200 جنيه</option><option value="quarterly">ربع سنوي — 890 جنيه/شهر</option><option value="yearly">سنوي — 690 جنيه/شهر</option></>
                      )}
                    </select>
                    {errors.plan && <span className="font-label-sm text-label-sm text-error">{errors.plan}</span>}
                  </div>
                </div>
              )}

              {/* Step 1: Student Info */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <label className="block font-label-md text-label-md text-on-surface-variant">الاسم الأول *</label>
                      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="أحمد" className={inputClass('firstName')} />
                      {errors.firstName && <span className="font-label-sm text-label-sm text-error">{errors.firstName}</span>}
                    </div>
                    <div className="space-y-2">
                      <label className="block font-label-md text-label-md text-on-surface-variant">اسم الأب *</label>
                      <input type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} placeholder="محمد" className={inputClass('fatherName')} />
                      {errors.fatherName && <span className="font-label-sm text-label-sm text-error">{errors.fatherName}</span>}
                    </div>
                    <div className="space-y-2">
                      <label className="block font-label-md text-label-md text-on-surface-variant">اسم العائلة *</label>
                      <input type="text" value={familyName} onChange={e => setFamilyName(e.target.value)} placeholder="علي" className={inputClass('familyName')} />
                      {errors.familyName && <span className="font-label-sm text-label-sm text-error">{errors.familyName}</span>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant">تاريخ الميلاد *</label>
                    <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className={inputClass('birthDate')} />
                    {errors.birthDate && <span className="font-label-sm text-label-sm text-error">{errors.birthDate}</span>}
                  </div>
                </div>
              )}

              {/* Step 2: Academic */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant">الصف الدراسي *</label>
                    <select value={grade} onChange={e => setGrade(e.target.value)} className={inputClass('grade')}>
                      <option value="">اختر الصف...</option>
                      {GRADES.map(g => <option key={g.v} value={g.v}>{g.l}</option>)}
                    </select>
                    {errors.grade && <span className="font-label-sm text-label-sm text-error">{errors.grade}</span>}
                  </div>
                </div>
              )}

              {/* Step 3: Contact */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="block font-label-md text-label-md text-on-surface-variant">تليفون ولي الأمر *</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="010xxxxxxxx" className={inputClass('phone')} dir="ltr" />
                      {errors.phone && <span className="font-label-sm text-label-sm text-error">{errors.phone}</span>}
                    </div>
                    <div className="space-y-2">
                      <label className="block font-label-md text-label-md text-on-surface-variant">واتساب *</label>
                      <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="010xxxxxxxx" className={inputClass('whatsapp')} dir="ltr" />
                      {errors.whatsapp && <span className="font-label-sm text-label-sm text-error">{errors.whatsapp}</span>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant">البريد الإلكتروني *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" className={inputClass('email')} dir="ltr" />
                    {errors.email && <span className="font-label-sm text-label-sm text-error">{errors.email}</span>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <label className="block font-label-md text-label-md text-on-surface-variant">الدولة *</label>
                      <select value={country} onChange={e => setCountry(e.target.value)} className={inputClass('country')}>
                        <option value="">اختر الدولة</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block font-label-md text-label-md text-on-surface-variant">المحافظة</label>
                      {country === 'مصر' ? (
                        <select value={governorate} onChange={e => setGovernorate(e.target.value)} className={inputClass('governorate')}>
                          <option value="">اختر المحافظة</option>
                          {EGYPT_GOVS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      ) : (
                        <input type="text" value={governorate} onChange={e => setGovernorate(e.target.value)} placeholder="المحافظة" className={inputClass('governorate')} />
                      )}
                      {errors.governorate && <span className="font-label-sm text-label-sm text-error">{errors.governorate}</span>}
                    </div>
                    <div className="space-y-2">
                      <label className="block font-label-md text-label-md text-on-surface-variant">المدينة</label>
                      <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="مدينة نصر" className={inputClass('city')} />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <button type="button" onClick={() => setStep(s => s - 1)} className="flex-1 border-2 border-primary text-primary py-4 rounded-full font-bold hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">arrow_forward</span> السابق
                  </button>
                )}
                {step < 3 ? (
                  <button type="button" onClick={nextStep} className="flex-1 bg-primary text-white py-4 rounded-full font-bold hover:bg-primary-deep transition-colors cursor-pointer flex items-center justify-center gap-2">
                    التالي <span className="material-symbols-outlined text-lg">arrow_back</span>
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit} disabled={submitting} className="flex-1 bg-gradient-to-l from-primary to-primary-light text-on-primary py-4 rounded-full font-bold hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? (
                      <><span className="material-symbols-outlined animate-spin">progress_activity</span> جاري التسجيل...</>
                    ) : (
                      <><span className="material-symbols-outlined">check_circle</span> تسجيل الطالب</>
                    )}
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
