import { NextResponse } from 'next/server';
import { sanitizePlain, checkOrigin } from '../../../../../lib/security';
import { verifyCsrfToken } from '../../../../../lib/csrf';
import { verifyAuth, getTokenFromCookie } from '../../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/subscription_plans?select=*&order=name.asc&limit=${pageSize}&offset=${from}`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' } }
    );
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب الباقات' }, { status: 500 });
    const plans = await res.json();
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || plans.length);
    return NextResponse.json({ data: plans, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
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
