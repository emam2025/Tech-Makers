import { NextResponse } from 'next/server';
import { sanitizePlain, rateLimit, getClientIp } from '../../../../lib/security';

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
    const id = searchParams.get('id');

    if (id) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/branches?id=eq.${id}&select=*`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      if (!res.ok) return NextResponse.json({ error: 'فشل جلب الفرع' }, { status: 500 });
      const branch = await res.json();
      return NextResponse.json({ branch: branch[0] || null });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/branches?select=*,supervisor_count:supervisor_branches(count),group_count:groups(count),student_count:students_enhanced(count)&order=created_at.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب الفروع' }, { status: 500 });
    const branches = await res.json();
    return NextResponse.json({ branches });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const ip = getClientIp(request);
  if (!rateLimit(ip, 20, 60000)) {
    return NextResponse.json({ error: 'تم تجاوز الحد المسموح' }, { status: 429 });
  }

  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      return NextResponse.json({ error: 'اسم الفرع مطلوب' }, { status: 400 });
    }

    const allowed = {
      name: sanitizePlain(body.name.trim()),
      address: body.address ? sanitizePlain(body.address) : null,
      city: body.city ? sanitizePlain(body.city) : null,
      phone: body.phone ? sanitizePlain(body.phone) : null,
      is_active: body.is_active !== false,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/branches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(allowed),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل إضافة الفرع' }, { status: 500 });
    const branch = await res.json();
    return NextResponse.json({ success: true, branch: branch[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'معرف الفرع مطلوب' }, { status: 400 });

    const allowed = {};
    if (body.name !== undefined) allowed.name = sanitizePlain(body.name);
    if (body.address !== undefined) allowed.address = body.address ? sanitizePlain(body.address) : null;
    if (body.city !== undefined) allowed.city = body.city ? sanitizePlain(body.city) : null;
    if (body.phone !== undefined) allowed.phone = body.phone ? sanitizePlain(body.phone) : null;
    if (body.is_active !== undefined) allowed.is_active = body.is_active;

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/branches?id=eq.${body.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(allowed),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
    const branch = await res.json();
    return NextResponse.json({ success: true, branch: branch[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف الفرع مطلوب' }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/branches?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
