import { NextResponse } from 'next/server';
import { sanitizePlain, checkOrigin } from '../../../../lib/security';
import { verifyCsrfToken } from '../../../../lib/csrf';
import { verifyAuth, getTokenFromCookie } from '../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || '';
    const target = searchParams.get('target') || '';
    const activeOnly = searchParams.get('active') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = `${SUPABASE_URL}/rest/v1/advertisements?select=*,group:groups(name)&order=priority.desc,created_at.desc&limit=${pageSize}&offset=${from}`;
    if (type) query += `&type=eq.${type}`;
    if (target) query += `&target=eq.${target}`;
    if (activeOnly) query += `&is_active=eq.true`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب الإعلانات' }, { status: 500 });
    const ads = await res.json();
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || ads.length);
    return NextResponse.json({ data: ads, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!checkOrigin(request) || !verifyCsrfToken(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }
  if (!['admin', 'supervisor'].includes(auth.user.role)) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });

  try {
    const body = await request.json();
    if (!body.title) return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/advertisements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        title: sanitizePlain(body.title),
        content: body.content || '',
        image_url: body.image_url || null,
        link_url: body.link_url || null,
        type: body.type || 'popup',
        target: body.target || 'all',
        target_group_id: body.target_group_id || null,
        position: body.position || 'top',
        is_active: body.is_active !== false,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        display_rules: body.display_rules || {},
        priority: body.priority || 0,
        created_by: auth.user.id,
      }),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الإضافة' }, { status: 500 });
    const ad = await res.json();
    return NextResponse.json({ success: true, ad: ad[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!checkOrigin(request) || !verifyCsrfToken(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }
  if (!['admin', 'supervisor'].includes(auth.user.role)) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const { id, ...updateData } = body;
    if (updateData.title) updateData.title = sanitizePlain(updateData.title);
    updateData.updated_at = new Date().toISOString();

    const res = await fetch(`${SUPABASE_URL}/rest/v1/advertisements?id=eq.${id}`, {
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
    const ad = await res.json();
    return NextResponse.json({ success: true, ad: ad[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!checkOrigin(request) || !verifyCsrfToken(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }
  if (auth.user.role !== 'admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/advertisements?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
