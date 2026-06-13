'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const GRADES = [
  { v: 2, l: 'الصف الثاني الابتدائي' },
  { v: 3, l: 'الصف الثالث الابتدائي' },
  { v: 4, l: 'الصف الرابع الابتدائي' },
  { v: 5, l: 'الصف الخامس الابتدائي' },
  { v: 6, l: 'الصف السادس الابتدائي' },
  { v: 7, l: 'الصف الأول الإعدادي' },
  { v: 8, l: 'الصف الثاني الإعدادي' },
  { v: 9, l: 'الصف الثالث الإعدادي' },
  { v: 10, l: 'الصف الأول الثانوي' },
  { v: 11, l: 'الصف الثاني الثانوي' },
  { v: 12, l: 'الصف الثالث الثانوي' },
];

const COUNTRIES = [
  'مصر',
  'الأردن',
  'السعودية',
  'الكويت',
  'الإمارات',
  'قطر',
  'البحرين',
  'عمان',
  'فلسطين',
  'لبنان',
  'العراق',
  'سوريا',
  'اليمن',
  'ليبيا',
  'تونس',
  'الجزائر',
  'المغرب',
  'السودان',
  'موريتانيا',
  'أخرى',
];

const EGYPT_GOVS = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية',
  'الغربية', 'القليوبية', 'المنوفية', 'البحيرة', 'كفر الشيخ',
  'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء',
  'جنوب سيناء', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
  'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'الوادي الجديد',
  'مطروح', 'البحر الأحمر', 'حلوان', '6 أكتوبر',
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

  function validate() {
    const errs = {};

    if (!firstName || !/^[\u0600-\u06FFA-Za-z]{2,}$/.test(firstName))
      errs.firstName = 'الاسم الأول مطلوب (حروف فقط)';

    if (!fatherName || !/^[\u0600-\u06FFA-Za-z]{2,}$/.test(fatherName))
      errs.fatherName = 'اسم الأب مطلوب (حروف فقط)';

    if (!familyName || !/^[\u0600-\u06FFA-Za-z]{2,}$/.test(familyName))
      errs.familyName = 'اسم العائلة مطلوب (حروف فقط)';

    if (!birthDate) {
      errs.birthDate = 'تاريخ الميلاد مطلوب';
    } else {
      const age = calcAge(birthDate);
      if (age < 8 || age > 20) errs.birthDate = 'العمر يجب أن يكون بين 8 و 20 سنة';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'البريد الإلكتروني غير صحيح';

    if (!/^01[0-9]{9}$/.test(phone))
      errs.phone = 'رقم التليفون غير صحيح (مثال: 01012345678)';

    if (!/^01[0-9]{9}$/.test(whatsapp))
      errs.whatsapp = 'رقم الواتساب غير صحيح (مثال: 01012345678)';

    if (!grade) errs.grade = 'اختر الصف الدراسي';

    if (country === 'مصر' && !governorate)
      errs.governorate = 'اختر المحافظة';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const name = `${firstName} ${fatherName} ${familyName}`;
    const data = { name, birth_date: birthDate, email, phone, whatsapp, grade, country, governorate, city, track, plan };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setDone(true);
      } else {
        const errs = {};
        if (json.field) errs[json.field] = json.error;
        else errs._form = json.error || 'حدث خطأ';
        setErrors(errs);
      }
    } catch {
      setErrors({ _form: 'فشل الاتصال بالخادم' });
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setDone(false);
    setTrack('');
    setPlan('');
    setCountry('');
    setFirstName('');
    setFatherName('');
    setFamilyName('');
    setBirthDate('');
    setEmail('');
    setPhone('');
    setWhatsapp('');
    setGrade('');
    setGovernorate('');
    setCity('');
    setErrors({});
  }

  if (done) {
    return (
      <section className="p-8 md:p-16 flex flex-col items-center justify-center text-center form-shadow border border-secondary-container/20 rounded-20 w-full bg-white mx-auto max-w-container-max" dir="rtl">
        <div className="w-24 h-24 bg-secondary-container/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <span className="material-symbols-outlined text-secondary-container text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
        </div>
        <h2 className="font-headline-xl text-headline-xl text-primary mb-4">تم تسجيل الطالب بنجاح!</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md mx-auto">شكراً لانضمامكم إلى &ldquo;تك ميكرز&rdquo;. سيقوم فريق القبول بالتواصل معكم عبر الهاتف أو واتساب خلال 24 ساعة عمل لتأكيد الحجز وموعد الاختبار.</p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button className="flex-1 bg-primary text-on-primary py-4 rounded-full font-label-md text-label-md hover:bg-primary-deep transition-colors" onClick={resetForm}>
            تسجيل طالب آخر
          </button>
          <Link href="/" className="flex-1 border-2 border-primary text-primary py-4 rounded-full font-label-md text-label-md hover:bg-surface-container-low transition-colors text-center">
            العودة للرئيسية
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-12 px-margin-mobile md:px-margin-desktop flex flex-col items-center min-h-screen bg-bg-off-white" dir="rtl">
      <div className="w-full max-w-2xl mx-auto">

        {/* Registration Form Card */}
          <div className="drop-shadow-xl">
          <div className="glow-border" style={{padding:3}}>
            <section className="w-full bg-white rounded-20 p-8 md:p-12 relative transition-all duration-500">
              {/* Form Header */}
          <div className="mb-10 text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-high text-primary-light font-label-md text-label-sm mb-3">
              <span className="material-symbols-outlined text-sm ml-1">edit_note</span>
              خطوة نحو المستقبل
            </span>
            <h2 className="font-headline-xl text-headline-xl text-primary">نموذج تسجيل طالب</h2>
            <p className="text-text-muted font-body-md text-body-md mt-2">يرجى ملء البيانات التالية بدقة للانضمام إلى برامجنا التعليمية.</p>
          </div>

          {errors._form && (
            <div className="mb-6">
              <div className="bg-error-container text-on-error-container px-6 py-4 rounded-xl font-body-md text-body-md">{errors._form}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* Tracks & Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">المسار التعليمي *</label>
                <select value={track} onChange={e => setTrack(e.target.value)} required className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary appearance-none rtl-input shadow-inner">
                  <option value="">اختر المسار...</option>
                  <option value="a">Track A — Junior Tech Explorers (8–11 سنة)</option>
                  <option value="b">Track B — Future AI Engineers (12–15 سنة)</option>
                  <option value="c">Track C — Future Tech Engineers (16–20 سنة)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">خطة الاشتراك *</label>
                <select value={plan} onChange={e => setPlan(e.target.value)} required className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary appearance-none rtl-input shadow-inner">
                  <option value="">اختر الخطة...</option>
                  <option value="monthly">اشتراك شهري — 1200 جنيه/شهر</option>
                  <option value="quarterly">اشتراك ربع سنوي — 890 جنيه/شهرياً (إجمالي 2670)</option>
                  <option value="yearly">اشتراك سنوي — 690 جنيه/شهرياً (إجمالي 8280)</option>
                </select>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">الاسم الأول *</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="مثال: أحمد" required className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary rtl-input shadow-inner" />
                {errors.firstName && <span className="font-label-sm text-label-sm text-error">{errors.firstName}</span>}
              </div>
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">اسم الأب *</label>
                <input type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} placeholder="مثال: محمد" required className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary rtl-input shadow-inner" />
                {errors.fatherName && <span className="font-label-sm text-label-sm text-error">{errors.fatherName}</span>}
              </div>
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">اسم العائلة *</label>
                <input type="text" value={familyName} onChange={e => setFamilyName(e.target.value)} placeholder="مثال: علي" required className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary rtl-input shadow-inner" />
                {errors.familyName && <span className="font-label-sm text-label-sm text-error">{errors.familyName}</span>}
              </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">تاريخ الميلاد *</label>
                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} required className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary rtl-input shadow-inner" />
                {errors.birthDate && <span className="font-label-sm text-label-sm text-error">{errors.birthDate}</span>}
              </div>
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">الصف الدراسي للطالب *</label>
                <select value={grade} onChange={e => setGrade(e.target.value)} required className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary appearance-none rtl-input shadow-inner">
                  <option value="">اختر الصف...</option>
                  {GRADES.map(g => (
                    <option key={g.v} value={g.v}>{g.l}</option>
                  ))}
                </select>
                {errors.grade && <span className="font-label-sm text-label-sm text-error">{errors.grade}</span>}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">رقم تليفون ولي الأمر *</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="010xxxxxxxx" required className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary rtl-input shadow-inner" />
                {errors.phone && <span className="font-label-sm text-label-sm text-error">{errors.phone}</span>}
              </div>
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">رقم واتساب للمتابعة *</label>
                <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="010xxxxxxxx" required className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary rtl-input shadow-inner" />
                {errors.whatsapp && <span className="font-label-sm text-label-sm text-error">{errors.whatsapp}</span>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-label-md text-label-md text-on-surface-variant">البريد الإلكتروني لولي الأمر *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" required className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary rtl-input shadow-inner" />
              {errors.email && <span className="font-label-sm text-label-sm text-error">{errors.email}</span>}
            </div>

            {/* Location Group */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">الدولة *</label>
                <select value={country} onChange={e => setCountry(e.target.value)} required className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary appearance-none rtl-input shadow-inner">
                  <option value="">اختر الدولة</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">المحافظة</label>
                {country === 'مصر' ? (
                  <select value={governorate} onChange={e => setGovernorate(e.target.value)} className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary appearance-none rtl-input shadow-inner">
                    <option value="">اختر المحافظة</option>
                    {EGYPT_GOVS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                ) : (
                  <input type="text" value={governorate} onChange={e => setGovernorate(e.target.value)} placeholder="مثال: القاهرة" className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary rtl-input shadow-inner" />
                )}
                {errors.governorate && <span className="font-label-sm text-label-sm text-error">{errors.governorate}</span>}
              </div>
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface-variant">المدينة / الحي</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="مثال: مدينة نصر" className="w-full bg-bg-off-white border-0 rounded-lg p-4 font-body-md text-body-md focus:ring-2 focus:ring-primary rtl-input shadow-inner" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button type="submit" className="w-full bg-gradient-to-l from-primary to-primary-light text-on-primary py-5 rounded-full font-headline-lg text-headline-lg flex items-center justify-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all active:scale-95 group disabled:opacity-50" disabled={submitting}>
                <span>{submitting ? '⏳ جاري التسجيل...' : '✅ تسجيل الطالب'}</span>
                <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
              </button>
            </div>
          </form>
        </section>
        </div>
        </div>
      </div>
    </section>
  );
}
