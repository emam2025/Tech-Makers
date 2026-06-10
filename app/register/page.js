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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('track');
    const p = params.get('plan');
    if (t) setTrack(t);
    if (p) setPlan(p);
  }, []);

  function validate() {
    const errs = {};
    const firstName = document.getElementById('firstName').value.trim();
    const fatherName = document.getElementById('fatherName').value.trim();
    const familyName = document.getElementById('familyName').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const grade = document.getElementById('grade').value;
    const governorate = document.getElementById('governorate').value.trim();
    const city = document.getElementById('city').value.trim();

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

    const firstName = document.getElementById('firstName').value.trim();
    const fatherName = document.getElementById('fatherName').value.trim();
    const familyName = document.getElementById('familyName').value.trim();
    const name = `${firstName} ${fatherName} ${familyName}`;
    const birthDate = document.getElementById('birthDate').value;
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const grade = document.getElementById('grade').value;
    const governorate = document.getElementById('governorate').value.trim();
    const city = document.getElementById('city').value.trim();

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

  if (done) {
    return (
      <section className="register-section">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2 className="success-title">تم تسجيل الطالب بنجاح!</h2>
            <p className="success-text">
              سيتم التواصل معكم خلال أقرب وقت لتحديد موعد <strong>المقابلة الشخصية للطالب واختبار القبول</strong>،
              بالإضافة إلى حجز موعد <strong>المحاضرة المجانية</strong> لتقييم المستوى والتأكد من ملاءمة المسار.
            </p>
            <div className="success-actions">
              <Link href="/" className="btn btn-primary">العودة للصفحة الرئيسية</Link>
              <button className="btn btn-ghost" onClick={() => { setDone(false); document.getElementById('registerForm')?.reset(); setTrack(''); setPlan(''); setCountry(''); setErrors({}); }}>
                تسجيل طالب آخر
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="register-section">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow">📝 تسجيل الطالب</span>
          <h2 className="section-title">نموذج تسجيل طالب</h2>
          <p className="section-sub" style={{ fontWeight: 800, color: 'var(--royal-blue)', fontSize: 18 }}>تك ميكرز - مصر</p>
          <p className="section-sub">اختر المسار المناسب وخطة الاشتراك واستكمل بيانات ابنك</p>
        </div>

        <div className="register-box">
          {errors._form && <div className="form-error-banner">{errors._form}</div>}
          <form id="registerForm" onSubmit={handleSubmit} noValidate>
            <div className="register-selection">
              <div className="sel-group">
                <label>المسار التعليمي *</label>
                <select value={track} onChange={e => setTrack(e.target.value)} required>
                  <option value="">اختر المسار</option>
                  <option value="a">Track A — Junior Tech Explorers (8–11 سنة)</option>
                  <option value="b">Track B — Future AI Engineers (12–15 سنة)</option>
                  <option value="c">Track C — Future Tech Engineers (16–20 سنة)</option>
                </select>
              </div>
              <div className="sel-group">
                <label>خطة الاشتراك *</label>
                <select value={plan} onChange={e => setPlan(e.target.value)} required>
                  <option value="">اختر الخطة</option>
                  <option value="monthly">اشتراك شهري — 1200 جنيه/شهر</option>
                  <option value="quarterly">اشتراك ربع سنوي — 890 جنيه/شهرياً (إجمالي 2670)</option>
                  <option value="yearly">اشتراك سنوي — 690 جنيه/شهرياً (إجمالي 8280)</option>
                </select>
              </div>
            </div>

            <div className="register-form">
              <div className="form-row form-row-3">
                <div className="form-group">
                  <label>الاسم الأول *</label>
                  <input type="text" id="firstName" placeholder="مثال: أحمد" required />
                  {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label>اسم الأب *</label>
                  <input type="text" id="fatherName" placeholder="مثال: محمد" required />
                  {errors.fatherName && <span className="field-error">{errors.fatherName}</span>}
                </div>
                <div className="form-group">
                  <label>اسم العائلة *</label>
                  <input type="text" id="familyName" placeholder="مثال: علي" required />
                  {errors.familyName && <span className="field-error">{errors.familyName}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>تاريخ الميلاد *</label>
                  <input type="date" id="birthDate" required />
                  {errors.birthDate && <span className="field-error">{errors.birthDate}</span>}
                </div>
                <div className="form-group"></div>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>البريد الإلكتروني لولي الأمر *</label>
                  <input type="email" id="email" placeholder="example@email.com" required />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>رقم تليفون ولي الأمر *</label>
                  <input type="tel" id="phone" placeholder="010xxxxxxxx" required />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label>رقم واتساب للمتابعة *</label>
                  <input type="tel" id="whatsapp" placeholder="010xxxxxxxx" required />
                  {errors.whatsapp && <span className="field-error">{errors.whatsapp}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>الصف الدراسي للطالب *</label>
                  <select id="grade" required>
                    <option value="">اختر الصف</option>
                    {GRADES.map(g => (
                      <option key={g.v} value={g.v}>{g.l}</option>
                    ))}
                  </select>
                  {errors.grade && <span className="field-error">{errors.grade}</span>}
                </div>
                <div className="form-group">
                  <label>الدولة *</label>
                  <select id="country" value={country} onChange={e => setCountry(e.target.value)} required>
                    <option value="">اختر الدولة</option>
                    {COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>المحافظة</label>
                  {country === 'مصر' ? (
                    <select id="governorate">
                      <option value="">اختر المحافظة</option>
                      {EGYPT_GOVS.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  ) : (
                    <input type="text" id="governorate" placeholder="مثال: القاهرة" />
                  )}
                  {errors.governorate && <span className="field-error">{errors.governorate}</span>}
                </div>
                <div className="form-group">
                  <label>المدينة / الحي</label>
                  <input type="text" id="city" placeholder="مثال: مدينة نصر" />
                </div>
              </div>
            </div>

            <div className="register-note">
              <strong>⬅️ بعد التسجيل:</strong> سيتم عمل انترفيو للطالب واختبار قبول مع محاضرة مجانية لتحديد مستوى الطالب والتأكد من ملاءمة المسار له.
            </div>

            <button type="submit" className="register-submit" disabled={submitting}>
              {submitting ? '⏳ جاري التسجيل...' : '✅ تسجيل الطالب'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
