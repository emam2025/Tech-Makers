import { NextResponse } from 'next/server';
import { sanitizePlain } from '../../../../../lib/security';

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
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/subscription_plans?select=*&order=name.asc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب الباقات' }, { status: 500 });
    const plans = await res.json();
    return NextResponse.json({ plans });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!['admin', 'supervisor'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      return NextResponse.json({ error: 'اسم الباقة مطلوب' }, { status: 400 });
    }
    if (!body.price || typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json({ error: 'السعر غير صالح' }, { status: 400 });
    }
    if (body.duration_days && (typeof body.duration_days !== 'number' || body.duration_days <= 0)) {
      return NextResponse.json({ error: 'المدة غير صالحة' }, { status: 400 });
    }

    const allowed = {
      name: sanitizePlain(body.name.trim()),
      price: body.price,
      duration_days: body.duration_days || 30,
      description: body.description ? sanitizePlain(body.description) : null,
      features: body.features || null,
      is_active: body.is_active !== false,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscription_plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(allowed),
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'فشل إنشاء الباقة' }, { status: 500 });
    }
    const plan = await res.json();
    return NextResponse.json({ success: true, plan: plan[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
