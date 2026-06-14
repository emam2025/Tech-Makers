import { NextResponse } from 'next/server';
import { rateLimit, checkOrigin, sanitize, sanitizePlain, validateEmail, validatePhone, validateName, validateInputLength, getClientIp } from '../../../lib/security';

const TRACK_NAMES = {
  a: 'Track A — Junior Tech Explorers (8–11 سنة)',
  b: 'Track B — Future AI Engineers (12–15 سنة)',
  c: 'Track C — Future Tech Engineers (16–20 سنة)',
  technomath: 'Techno Math — الحساب الذهني (8–15 سنة)',
};

const PLAN_NAMES = {
  monthly: 'اشتراك شهري — 1200 جنيه/شهر',
  quarterly: 'اشتراك ربع سنوي — 890 جنيه/شهرياً (إجمالي 2670)',
  yearly: 'اشتراك سنوي — 690 جنيه/شهرياً (إجمالي 8280)',
};

const PLAN_NAMES_TECHNOMATH = {
  monthly: 'اشتراك شهري — 800 جنيه/شهر',
  quarterly: 'اشتراك ربع سنوي — 650 جنيه/شهرياً (إجمالي 1950)',
  yearly: 'اشتراك سنوي — 500 جنيه/شهرياً (إجمالي 6000)',
};

const ALLOWED_TRACKS = ['a', 'b', 'c', 'technomath'];
const ALLOWED_PLANS = ['monthly', 'quarterly', 'yearly'];

export async function POST(request) {
  const ip = getClientIp(request);

  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json(
      { error: 'تم تجاوز الحد المسموح من الطلبات، حاول بعد دقيقة' },
      { status: 429 }
    );
  }

  if (!checkOrigin(request)) {
    return NextResponse.json(
      { error: 'طلب غير مصرح به' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name, birth_date, email, phone, whatsapp, grade, country, governorate, city, track, plan } = body;

    if (!name || !birth_date || !email || !phone || !whatsapp || !grade || !track || !plan) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب أن تكون مكتملة' },
        { status: 400 }
      );
    }

    const lengthError = validateInputLength(body);
    if (lengthError) {
      return NextResponse.json({ error: lengthError }, { status: 400 });
    }

    if (!validateName(name)) {
      return NextResponse.json({ error: 'الاسم غير صحيح' }, { status: 400 });
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صحيح' }, { status: 400 });
    }
    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'رقم الهاتف غير صحيح' }, { status: 400 });
    }
    if (!validatePhone(whatsapp)) {
      return NextResponse.json({ error: 'رقم الواتساب غير صحيح' }, { status: 400 });
    }
    if (!ALLOWED_TRACKS.includes(track)) {
      return NextResponse.json({ error: 'المسار غير صحيح' }, { status: 400 });
    }
    if (!ALLOWED_PLANS.includes(plan)) {
      return NextResponse.json({ error: 'الاشتراك غير صحيح' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    const brevoKey = process.env.BREVO_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const checkRes = await fetch(
      `${supabaseUrl}/rest/v1/students?name=eq.${encodeURIComponent(name)}&email=eq.${encodeURIComponent(email)}&select=id`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: 'هذا الطالب مسجل مسبقاً بهذا البريد الإلكتروني', field: '_form' },
          { status: 409 }
        );
      }
    }

    const dbResponse = await fetch(`${supabaseUrl}/rest/v1/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: sanitizePlain(name),
        birth_date,
        email: sanitizePlain(email),
        phone: sanitizePlain(phone),
        whatsapp: sanitizePlain(whatsapp),
        grade: Number(grade),
        country: country ? sanitizePlain(country) : null,
        governorate: governorate ? sanitizePlain(governorate) : null,
        city: city ? sanitizePlain(city) : null,
        track,
        plan,
        status: 'pending',
        created_at: new Date().toISOString(),
      }),
    });

    if (!dbResponse.ok) {
      const errorText = await dbResponse.text();
      console.error('Supabase error:', dbResponse.status, errorText);
      return NextResponse.json(
        { error: 'فشل حفظ البيانات' },
        { status: 500 }
      );
    }

    const trackName = TRACK_NAMES[track] || track;
    const planName = (track === 'technomath' ? PLAN_NAMES_TECHNOMATH : PLAN_NAMES)[plan] || plan;

    const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><title>تأكيد التسجيل</title></head>
<body style="font-family: 'Cairo', Arial, sans-serif; background: #f4f7fc; margin: 0; padding: 32px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
    <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 32px; text-align: center;">
      <h1 style="color: #fff; font-size: 24px; margin: 0;">Tech Makers Egypt</h1>
      <p style="color: #bfdbfe; font-size: 14px; margin: 8px 0 0;">Building Future Tech Leaders</p>
    </div>
    <div style="padding: 32px;">
      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <span style="font-size: 20px;">&#9989;</span>
        <p style="color: #065f46; font-weight: 800; font-size: 18px; margin: 8px 0 0;">تم استلام طلب التسجيل بنجاح!</p>
      </div>

      <p style="color: #374151; font-size: 15px; line-height: 1.8;">مرحباً <strong>ولي أمر الطالب</strong>،</p>
      <p style="color: #374151; font-size: 15px; line-height: 1.8;">نشكر لك اهتمامك بتسجيل ابنك في برنامج <strong>Tech Makers Egypt</strong>. تم استلام طلب التسجيل والبيانات التالية:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 700; color: #1e3a8a; width: 40%;">اسم الطالب</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #374151;">${sanitize(name)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 700; color: #1e3a8a;">المسار</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #374151;">${trackName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 700; color: #1e3a8a;">خطة الاشتراك</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #374151;">${planName}</td>
        </tr>
      </table>

      <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 20px 0;">
        <p style="color: #92400e; font-size: 14px; font-weight: 700; margin: 0 0 8px;">&#x1F4CC; الخطوات القادمة:</p>
        <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.8;">سيقوم فريق الإدارة بالتواصل معكم خلال أقرب وقت لتحديد موعد <strong>المقابلة الشخصية للطالب واختبار القبول</strong>، بالإضافة إلى حجز موعد <strong>المحاضرة المجانية</strong> لتقييم المستوى والتأكد من ملاءمة المسار.</p>
      </div>

      <p style="color: #6b7280; font-size: 13px; line-height: 1.8; text-align: center; margin-top: 24px;">نحن في Tech Makers Egypt نؤمن أن كل طفل يستحق فرصة لبناء مستقبله التكنولوجي.<br>نتشرف بانضمامكم إلينا &#x1F499;</p>
    </div>
    <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; 2026 Tech Makers Egypt — بالشراكة مع TKA-Egypt</p>
    </div>
  </div>
</body>
</html>`;

    if (brevoKey) {
      try {
        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': brevoKey,
          },
          body: JSON.stringify({
            sender: { name: 'Tech Makers Egypt', email: 'info@tka-egypt.com' },
            to: [{ email: sanitizePlain(email) }],
            subject: `تم تسجيل ${sanitizePlain(name)} في Tech Makers Egypt`,
            htmlContent: emailHtml,
          }),
        });

        if (!brevoRes.ok) {
          const errBody = await brevoRes.text();
          console.error('Brevo send error:', brevoRes.status, errBody);
        }
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الطالب بنجاح! سيتم التواصل معك لتحديد موعد المقابلة.',
    });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'خطأ داخلي في الخادم' },
      { status: 500 }
    );
  }
}
