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
    const type = searchParams.get('type') || '';

    let query = `${SUPABASE_URL}/rest/v1/site_pages?select=*&order=sort_order asc,created_at.desc&limit=200`;
    if (type) query += `&type=eq.${type}`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب الصفحات' }, { status: 500 });
    const pages = await res.json();
    return NextResponse.json({ pages });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!['admin', 'supervisor'].includes(auth.user.role)) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });

  try {
    const body = await request.json();
    if (!body.title || !body.slug) return NextResponse.json({ error: 'العنوان والرابط مطلوبين' }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        title: sanitizePlain(body.title),
        slug: body.slug.replace(/[^a-z0-9-]/g, '-').toLowerCase(),
        content: body.content || {},
        type: body.type || 'page',
        is_active: body.is_active !== false,
        meta: body.meta || {},
        sort_order: body.sort_order || 0,
        created_by: auth.user.id,
      }),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الإضافة' }, { status: 500 });
    const page = await res.json();
    return NextResponse.json({ success: true, page: page[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!['admin', 'supervisor'].includes(auth.user.role)) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const { id, ...updateData } = body;
    if (updateData.title) updateData.title = sanitizePlain(updateData.title);
    if (updateData.slug) updateData.slug = updateData.slug.replace(/[^a-z0-9-]/g, '-').toLowerCase();
    updateData.updated_at = new Date().toISOString();

    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_pages?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
    const page = await res.json();
    return NextResponse.json({ success: true, page: page[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_pages?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
