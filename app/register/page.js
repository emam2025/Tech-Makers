'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
  const [track, setTrack] = useState('');
  const [plan, setPlan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('track');
    const p = params.get('plan');
    if (t) setTrack(t);
    if (p) setPlan(p);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const btn = e.target.querySelector('.register-submit');
    btn.textContent = '⏳ جاري التسجيل...';

    const data = {
      name: document.getElementById('studentName').value,
      birth_date: document.getElementById('birthDate').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      whatsapp: document.getElementById('whatsapp').value,
      grade: document.getElementById('grade').value,
      country: document.getElementById('country').value,
      governorate: document.getElementById('governorate').value,
      city: document.getElementById('city').value,
      track,
      plan,
    };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        document.getElementById('registerForm').reset();
      } else {
        alert('❌ ' + (json.error || 'حدث خطأ'));
      }
    } catch {
      alert('❌ فشل الاتصال بالخادم');
    } finally {
      setSubmitting(false);
      btn.textContent = '✅ تسجيل الطالب';
    }
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
          <form id="registerForm" onSubmit={handleSubmit}>
            <div className="register-selection">
              <div className="sel-group">
                <label>المسار التعليمي</label>
                <select value={track} onChange={e => setTrack(e.target.value)} required>
                  <option value="">اختر المسار</option>
                  <option value="a">Track A — Junior Tech Explorers (8–11 سنة)</option>
                  <option value="b">Track B — Future AI Engineers (12–15 سنة)</option>
                  <option value="c">Track C — Future Tech Engineers (16–20 سنة)</option>
                </select>
              </div>
              <div className="sel-group">
                <label>خطة الاشتراك</label>
                <select value={plan} onChange={e => setPlan(e.target.value)} required>
                  <option value="">اختر الخطة</option>
                  <option value="monthly">اشتراك شهري — 1200 جنيه/شهر</option>
                  <option value="quarterly">اشتراك ربع سنوي — 890 جنيه/شهرياً (إجمالي 2670)</option>
                  <option value="yearly">اشتراك سنوي — 690 جنيه/شهرياً (إجمالي 8280)</option>
                </select>
              </div>
            </div>

            <div className="register-form">
              <div className="form-row">
                <div className="form-group">
                  <label>اسم الطالب ثلاثي *</label>
                  <input type="text" id="studentName" placeholder="مثال: أحمد محمد علي" required />
                </div>
                <div className="form-group">
                  <label>تاريخ الميلاد *</label>
                  <input type="date" id="birthDate" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>البريد الإلكتروني لولي الأمر *</label>
                  <input type="email" id="email" placeholder="example@email.com" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>رقم تليفون ولي الأمر *</label>
                  <input type="tel" id="phone" placeholder="010xxxxxxxx" required />
                </div>
                <div className="form-group">
                  <label>رقم واتساب للمتابعة *</label>
                  <input type="tel" id="whatsapp" placeholder="010xxxxxxxx" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>الصف الدراسي للطالب *</label>
                  <select id="grade" required>
                    <option value="">اختر الصف</option>
                    {[2,3,4,5,6,7,8,9,10,11,12].map(g => (
                      <option key={g} value={g}>{`الصف ${g <= 6 ? ['الثاني','الثالث','الرابع','الخامس','السادس'][g-2] + ' الابتدائي' : g <= 9 ? ['الأول','الثاني','الثالث'][g-7] + ' الإعدادي' : ['الأول','الثاني','الثالث'][g-10] + ' الثانوي'}`}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>الدولة</label>
                  <input type="text" id="country" placeholder="مثال: مصر" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>المحافظة</label>
                  <input type="text" id="governorate" placeholder="مثال: القاهرة" />
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
              ✅ تسجيل الطالب
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
