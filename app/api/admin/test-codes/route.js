import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

function getTokenFromCookie(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/sb-access-token=([^;]+)/);
  return match ? match[1] : null;
}

async function verifyAuth(request) {
  const token = getTokenFromCookie(request);
  if (!token) return { error: 'غير مصرح', status: 401 };

  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) return { error: 'جلسة منتهية', status: 401 };

  const userData = await userRes.json();

  const profileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userData.id}&select=*`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  if (!profileRes.ok) return { error: 'الملف الشخصي غير موجود', status: 404 };

  const profiles = await profileRes.json();
  if (!profiles || profiles.length === 0) return { error: 'الملف الشخصي غير موجود', status: 404 };

  return { user: profiles[0], token };
}

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/test_codes?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('Supabase error:', res.status, errText);
      return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    }

    const codes = await res.json();
    return NextResponse.json({ codes });
  } catch (err) {
    console.error('List test codes error:', err);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح — للإدارة فقط' }, { status: 403 });
  }

  try {
    const { count = 1, track, expires_days } = await request.json();

    const codes = [];
    for (let i = 0; i < Math.min(count || 1, 50); i++) {
      let code;
      let attempts = 0;
      do {
        code = generateCode();
        attempts++;
      } while (attempts < 10);

      const insertData = {
        code,
        track: track || null,
        created_by: auth.user.id,
        created_at: new Date().toISOString(),
      };

      if (expires_days) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + Number(expires_days));
        insertData.expires_at = expiresAt.toISOString();
      }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/test_codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(insertData),
      });

      if (res.ok) {
        const created = await res.json();
        codes.push(created[0]);
      } else {
        const errText = await res.text();
        console.error('Insert code error:', res.status, errText);
      }
    }

    return NextResponse.json({ success: true, codes });
  } catch (err) {
    console.error('Create test codes error:', err);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
