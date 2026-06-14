import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'الكود مطلوب' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json(
        { error: 'خطأ في إعدادات الخادم' },
        { status: 500 }
      );
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
      return NextResponse.json(
        { error: 'فشل التحقق من الكود' },
        { status: 500 }
      );
    }

    const records = await res.json();

    if (!records || records.length === 0) {
      return NextResponse.json(
        { error: 'كود غير صالح' },
        { status: 404 }
      );
    }

    const record = records[0];

    if (record.used) {
      return NextResponse.json(
        { error: 'تم استخدام هذا الكود مسبقاً' },
        { status: 410 }
      );
    }

    if (record.expires_at && new Date(record.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'انتهت صلاحية هذا الكود' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      student_name: record.student_name || 'طالب',
      track: record.track || null,
      code_id: record.id,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { code_id } = await request.json();

    if (!code_id) {
      return NextResponse.json(
        { error: 'معرف الكود مطلوب' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: 'فشل تحديث الكود' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}
