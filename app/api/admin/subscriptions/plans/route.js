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
  return { user: await userRes.json(), token };
}

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/subscription_plans?select=*&order=name.asc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب الباقات' }, { status: 500 });
    const plans = await res.json();
    return NextResponse.json({ plans });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
