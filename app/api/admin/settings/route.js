import { NextResponse } from 'next/server';
import { sanitizePlain } from '../../../../lib/security';

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
  const profiles = await profileRes.json();
  if (!profiles?.length) return { error: 'الملف الشخصي غير موجود', status: 404 };
  return { user: profiles[0], token };
}

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';

    let query = `${SUPABASE_URL}/rest/v1/system_settings?select=*&order=key.asc&limit=200`;
    if (category) query += `&category=eq.${category}`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب الإعدادات' }, { status: 500 });
    const settings = await res.json();
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });

  try {
    const body = await request.json();
    if (!body.key || body.value === undefined) {
      return NextResponse.json({ error: 'key و value مطلوبين' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/system_settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify({
        key: sanitizePlain(body.key),
        value: body.value,
        category: body.category || 'general',
        updated_by: auth.user.id,
        updated_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحفظ' }, { status: 500 });
    const setting = await res.json();
    return NextResponse.json({ success: true, setting: setting[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
