import { NextResponse } from 'next/server';
import { sanitizePlain, checkOrigin } from '../../../../../../lib/security';
import { verifyCsrfToken } from '../../../../../../lib/csrf';
import { verifyAuth, getTokenFromCookie } from '../../../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function PUT(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!checkOrigin(request) || !verifyCsrfToken(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }
  if (!['admin', 'supervisor'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();

    const allowed = {};
    if (body.name !== undefined) {
      if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
        return NextResponse.json({ error: 'اسم الباقة مطلوب' }, { status: 400 });
      }
      allowed.name = sanitizePlain(body.name.trim());
    }
    if (body.price !== undefined) {
      if (typeof body.price !== 'number' || body.price <= 0) {
        return NextResponse.json({ error: 'السعر غير صالح' }, { status: 400 });
      }
      allowed.price = body.price;
    }
    if (body.duration_days !== undefined) allowed.duration_days = body.duration_days;
    if (body.description !== undefined) allowed.description = body.description ? sanitizePlain(body.description) : null;
    if (body.features !== undefined) allowed.features = body.features;
    if (body.is_active !== undefined) allowed.is_active = body.is_active;

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscription_plans?id=eq.${id}`, {
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
    const plan = await res.json();
    return NextResponse.json({ success: true, plan: plan[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!checkOrigin(request) || !verifyCsrfToken(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }
  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscription_plans?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
