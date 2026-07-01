import { NextResponse } from 'next/server';
import { rateLimit, checkOrigin, sanitizePlain, getClientIp } from '../../../../lib/security';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;

const LEVEL_NAMES = {
  A1: 'مبتدئ (Beginner)',
  A2: 'أساسي (Elementary)',
  B1: 'متوسط (Intermediate)',
  B2: 'فوق متوسط (Upper-Intermediate)',
  C1: 'متقدم (Advanced)',
  C2: 'إتقان (Proficiency)',
};

const TRACK_NAMES = {
  a: 'Track A — Junior Tech Explorers (8–11 سنة)',
  b: 'Track B — Future AI Engineers (12–15 سنة)',
  c: 'Track C — Future Tech Engineers (16–20 سنة)',
};

async function sendResultEmail(email, name, result) {
  if (!BREVO_API_KEY) return;

  const strengthsList = result.strengths.length > 0
    ? result.strengths.map(s => `<li style="color:#16a34a;font-weight:600;">${s}</li>`).join('')
    : '<li style="color:#6b7280;">لا توجد نقاط قوة محددة</li>';

  const weaknessesList = result.weaknesses.length > 0
    ? result.weaknesses.map(w => `<li style="color:#dc2626;font-weight:600;">${w}</li>`).join('')
    : '<li style="color:#6b7280;">أداء ممتاز!</li>';

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="font-family:'IBM Plex Sans Arabic','Be Vietnam Pro',sans-serif;background:#f8fafc;margin:0;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <div style="background:linear-gradient(135deg,#4169e1,#1a3fa0);padding:32px;text-align:center;">
    <h1 style="color:#fff;font-size:24px;margin:0;">نتائج اختبار تحديد المستوى الإنجليزي</h1>
    <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Tech Makers Egypt</p>
  </div>
  <div style="padding:32px;">
    <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">مرحباً <strong>${sanitizePlain(name)}</strong>,</p>
    <p style="font-size:14px;color:#64748b;margin:0 0 24px;">إليك نتيجة اختبار تحديد المستوى الإنجليزي:</p>
    
    <div style="text-align:center;margin:24px 0;">
      <div style="display:inline-block;background:linear-gradient(135deg,#4169e1,#1a3fa0);border-radius:16px;padding:24px 48px;">
        <div style="color:#f7be1d;font-size:48px;font-weight:900;">${result.level}</div>
        <div style="color:#fff;font-size:16px;margin-top:4px;">${LEVEL_NAMES[result.level]}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0;">
      <div style="background:#f0fdf4;border-radius:12px;padding:16px;text-align:center;">
        <div style="color:#16a34a;font-size:32px;font-weight:900;">${result.percentage}%</div>
        <div style="color:#64748b;font-size:12px;">النسبة المئوية</div>
      </div>
      <div style="background:#eff6ff;border-radius:12px;padding:16px;text-align:center;">
        <div style="color:#4169e1;font-size:32px;font-weight:900;">${result.correct}/${result.total}</div>
        <div style="color:#64748b;font-size:12px;">الإجابات الصحيحة</div>
      </div>
    </div>

    <div style="margin:24px 0;">
      <h3 style="color:#1e293b;font-size:16px;margin:0 0 12px;">نقاط القوة</h3>
      <ul style="margin:0;padding-right:20px;">${strengthsList}</ul>
    </div>

    <div style="margin:24px 0;">
      <h3 style="color:#1e293b;font-size:16px;margin:0 0 12px;">مجالات التحسين</h3>
      <ul style="margin:0;padding-right:20px;">${weaknessesList}</ul>
    </div>

    <div style="background:#fef3c7;border-radius:12px;padding:16px;margin:24px 0;text-align:center;">
      <p style="color:#92400e;font-size:14px;margin:0;">
        المسار المقترح: <strong>${TRACK_NAMES[result.track] || result.track}</strong>
      </p>
    </div>

    <div style="text-align:center;margin:32px 0;">
      <a href="https://tka-egypt.com/register" style="display:inline-block;background:#f7be1d;color:#1a3fa0;padding:14px 48px;border-radius:9999px;font-weight:800;font-size:16px;text-decoration:none;">سجّل الآن في المسار المناسب</a>
    </div>
  </div>
  <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="color:#94a3b8;font-size:12px;margin:0;">© 2026 Tech Makers Egypt — جميع الحقوق محفوظة</p>
  </div>
</div>
</body>
</html>`;

  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'Tech Makers Egypt', email: 'info@tka-egypt.com' },
        to: [{ email }],
        subject: `نتائج اختبار المستوى الإنجليزي - المستوى ${result.level}`,
        htmlContent,
      }),
    });
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

export async function POST(request) {
  const ip = getClientIp(request);

  if (!await rateLimit(ip, 5, 60000)) {
    return NextResponse.json(
      { error: 'تم تجاوز الحد المسموح من الطلبات' },
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
    const { name, email, result } = body;

    if (!name || !email || !result) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صالح' },
        { status: 400 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json(
        { error: 'خطأ في إعدادات الخادم' },
        { status: 500 }
      );
    }

    const insertRes = await fetch(
      `${SUPABASE_URL}/rest/v1/english_test_results`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          name: sanitizePlain(name),
          email: sanitizePlain(email),
          level: result.level,
          percentage: result.percentage,
          correct: result.correct,
          total: result.total,
          track: result.track,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          breakdown: result.breakdown,
        }),
      }
    );

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      console.error('Supabase insert error:', errText);
      return NextResponse.json(
        { error: 'فشل حفظ البيانات' },
        { status: 500 }
      );
    }

    await sendResultEmail(email, name, result);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
