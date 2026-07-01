import { NextResponse } from 'next/server';
import { rateLimit, checkOrigin, getClientIp } from '../../../lib/security';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function POST(request) {
  const ip = getClientIp(request);
  if (!await rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: 'تم تجاوز الحد المسموح، حاول بعد دقيقة' }, { status: 429 });
  }

  if (!checkOrigin(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }

  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'الكود مطلوب' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    if (cleanCode.length > 20) {
      return NextResponse.json({ error: 'الكود طويل جداً' }, { status: 400 });
    }

    if (!/^[A-Z0-9\-]+$/.test(cleanCode)) {
      return NextResponse.json({ error: 'الكود يحتوي على أحرف غير مسموحة' }, { status: 400 });
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({ error: 'خطأ في إعدادات الخادم' }, { status: 500 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/test_codes?code=eq.${cleanCode}&select=*`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'فشل التحقق من الكود' }, { status: 500 });
    }

    const records = await res.json();

    if (!records || records.length === 0) {
      return NextResponse.json({ error: 'كود غير صالح' }, { status: 404 });
    }

    const record = records[0];

    if (record.used) {
      return NextResponse.json({ error: 'تم استخدام هذا الكود مسبقاً' }, { status: 410 });
    }

    if (record.expires_at && new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ error: 'انتهت صلاحية هذا الكود' }, { status: 410 });
    }

    return NextResponse.json({
      success: true,
      student_name: record.student_name || 'طالب',
      track: record.track || null,
      code_id: record.id,
    });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const ip = getClientIp(request);
  if (!await rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: 'تم تجاوز الحد المسموح، حاول بعد دقيقة' }, { status: 429 });
  }

  try {
    const { code_id } = await request.json();

    if (!code_id || typeof code_id !== 'string') {
      return NextResponse.json({ error: 'معرف الكود مطلوب' }, { status: 400 });
    }

    if (code_id.length > 50) {
      return NextResponse.json({ error: 'معرف الكود غير صالح' }, { status: 400 });
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({ error: 'خطأ في إعدادات الخادم' }, { status: 500 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/test_codes?id=eq.${code_id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          used: true,
          used_at: new Date().toISOString(),
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'فشل تحديث الكود' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
