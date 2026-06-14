import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function generateUsername() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'TKA-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'خطأ في إعدادات الخادم' },
        { status: 500 }
      );
    }

    const username = generateUsername();
    const password = generatePassword();
    const email = `${username.toLowerCase()}@tka-guest.com`;

    // Create user in Supabase Auth
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: username,
          role: 'student',
          status: 'trial',
        },
      }),
    });

    if (!authRes.ok) {
      const errData = await authRes.json();
      return NextResponse.json(
        { error: 'فشل إنشاء الحساب المؤقت' },
        { status: 500 }
      );
    }

    const userData = await authRes.json();

    // Sign in to get tokens
    const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!loginRes.ok) {
      return NextResponse.json(
        { error: 'فشل تسجيل الدخول' },
        { status: 500 }
      );
    }

    const authData = await loginRes.json();

    // Get profile
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userData.id}&select=*`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );

    const profiles = await profileRes.json();
    const profile = profiles?.[0] || { id: userData.id, full_name: username, role: 'student', status: 'trial' };

    const response = NextResponse.json({
      success: true,
      username,
      password,
      user: profile,
    });

    response.cookies.set('sb-access-token', authData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: authData.expires_in || 3600,
    });

    response.cookies.set('sb-refresh-token', authData.refresh_token || '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}
