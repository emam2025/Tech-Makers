import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function POST(request) {
  try {
    const { password, access_token } = await request.json();

    if (!password || !access_token) {
      return NextResponse.json({ error: 'كلمة المرور ورمز الوصول مطلوبان' }, { status: 400 });
    }

    if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون بين 6 و 128 حرفاً' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err.msg || 'فشل تحديث كلمة المرور' }, { status: res.status });
    }

    return NextResponse.json({ message: 'تم تحديث كلمة المرور بنجاح' });
  } catch (e) {
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
