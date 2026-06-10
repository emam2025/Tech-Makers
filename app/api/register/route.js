import { NextResponse } from 'next/server';

const TRACK_NAMES = {
  a: 'Track A — Junior Tech Explorers (8–11 سنة)',
  b: 'Track B — Future AI Engineers (12–15 سنة)',
  c: 'Track C — Future Tech Engineers (16–20 سنة)',
};

const PLAN_NAMES = {
  monthly: 'اشتراك شهري — 1200 جنيه/شهر',
  quarterly: 'اشتراك ربع سنوي — 890 جنيه/شهرياً (إجمالي 2670)',
  yearly: 'اشتراك سنوي — 690 جنيه/شهرياً (إجمالي 8280)',
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, birth_date, email, phone, whatsapp, grade, country, governorate, city, track, plan } = body;

    if (!name || !birth_date || !email || !phone || !whatsapp || !grade || !track || !plan) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب أن تكون مكتملة' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
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
        name,
        birth_date,
        email,
        phone,
        whatsapp,
        grade,
        country: country || null,
        governorate: governorate || null,
        city: city || null,
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
    const planName = PLAN_NAMES[plan] || plan;

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
        <span style="font-size: 20px;">✅</span>
        <p style="color: #065f46; font-weight: 800; font-size: 18px; margin: 8px 0 0;">تم استلام طلب التسجيل بنجاح!</p>
      </div>

      <p style="color: #374151; font-size: 15px; line-height: 1.8;">مرحباً <strong>ولي أمر الطالب</strong>،</p>
      <p style="color: #374151; font-size: 15px; line-height: 1.8;">نشكر لك اهتمامك بتسجيل ابنك في برنامج <strong>Tech Makers Egypt</strong>. تم استلام طلب التسجيل والبيانات التالية:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 700; color: #1e3a8a; width: 40%;">اسم الطالب</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #374151;">${name}</td>
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
        <p style="color: #92400e; font-size: 14px; font-weight: 700; margin: 0 0 8px;">📌 الخطوات القادمة:</p>
        <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.8;">سيقوم فريق الإدارة بالتواصل معكم خلال أقرب وقت لتحديد موعد <strong>المقابلة الشخصية للطالب واختبار القبول</strong>، بالإضافة إلى حجز موعد <strong>المحاضرة المجانية</strong> لتقييم المستوى والتأكد من ملاءمة المسار.</p>
      </div>

      <p style="color: #6b7280; font-size: 13px; line-height: 1.8; text-align: center; margin-top: 24px;">نحن في Tech Makers Egypt نؤمن أن كل طفل يستحق فرصة لبناء مستقبله التكنولوجي.<br>نتشرف بانضمامكم إلينا 💙</p>
    </div>
    <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2026 Tech Makers Egypt — بالشراكة مع TKA-Egypt</p>
    </div>
  </div>
</body>
</html>`;

    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'Tech Makers Egypt <noreply@tka-egypt.com>',
            to: email,
            subject: `✅ تم تسجيل ${name} في Tech Makers Egypt`,
            html: emailHtml,
          }),
        });
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: '✅ تم تسجيل الطالب بنجاح! سيتم التواصل معك لتحديد موعد المقابلة.',
    });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'خطأ داخلي في الخادم' },
      { status: 500 }
    );
  }
}
