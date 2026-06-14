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

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const formType = searchParams.get('form_type') || '';
    const status = searchParams.get('status') || '';

    let query = `${SUPABASE_URL}/rest/v1/team_applications?select=*&order=created_at.desc`;

    if (search) {
      query += `&or=(name.ilike.*${encodeURIComponent(search)}*,email.ilike.*${encodeURIComponent(search)}*)`;
    }
    if (formType) {
      query += `&form_type=eq.${formType}`;
    }
    if (status) {
      query += `&status=eq.${status}`;
    }

    const res = await fetch(query, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Supabase error:', res.status, errText);
      return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    }

    const applications = await res.json();
    return NextResponse.json({ applications });
  } catch (err) {
    console.error('List team applications error:', err);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
