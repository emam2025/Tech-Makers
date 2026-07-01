import { NextResponse } from 'next/server';
import { rateLimit, checkOrigin, getClientIp } from '../../../../lib/security';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function getTokenFromCookie(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/sb-access-token=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(request) {
  const token = getTokenFromCookie(request);
  if (!token) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userRes.ok) {
      return NextResponse.json({ error: 'جلسة منتهية' }, { status: 401 });
    }

    const userData = await userRes.json();

    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userData.id}&select=*`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!profileRes.ok) {
      return NextResponse.json({ error: 'الملف الشخصي غير موجود' }, { status: 404 });
    }

    const profiles = await profileRes.json();
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ error: 'الملف الشخصي غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ user: profiles[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const ip = getClientIp(request);
  if (!await rateLimit(ip, 5, 60000)) {
    return NextResponse.json({ error: 'تم تجاوز الحد المسموح، حاول بعد دقيقة' }, { status: 429 });
  }

  if (!checkOrigin(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 });
    }

    if (email.length > 254 || password.length > 128) {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 });
    }

    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
      },
      body: JSON.stringify({ email, password }),
    });

    const authData = await authRes.json();

    if (!authRes.ok) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${authData.user.id}&select=*`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    if (!profileRes.ok) {
      return NextResponse.json(
        { error: 'الملف الشخصي غير موجود' },
        { status: 404 }
      );
    }

    const profiles = await profileRes.json();
    if (!profiles || profiles.length === 0) {
      return NextResponse.json(
        { error: 'الملف الشخصي غير موجود' },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: profiles[0],
    });

    response.cookies.set('sb-access-token', authData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: authData.expires_in || 3600,
    });

    response.cookies.set('sb-refresh-token', authData.refresh_token || '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const token = getTokenFromCookie(request);

  if (token) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // ignore
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('sb-access-token', '', { maxAge: 0, path: '/' });
  response.cookies.set('sb-refresh-token', '', { maxAge: 0, path: '/' });
  return response;
}
