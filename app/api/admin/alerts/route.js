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
    const unreadOnly = searchParams.get('unread') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = `${SUPABASE_URL}/rest/v1/alerts?select=*&order=created_at.desc&limit=${pageSize}&offset=${from}`;
    if (type) query += `&type=eq.${type}`;
    if (unreadOnly) query += `&read=eq.false`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب التنبيهات' }, { status: 500 });
    const alerts = await res.json();
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || alerts.length);
    return NextResponse.json({ data: alerts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
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

    if (!body.user_id || !body.type || !body.title || !body.message) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    const validTypes = ['payment_due', 'payment_overdue', 'absence', 'evaluation', 'general'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json({ error: 'نوع التنبيه غير صالح' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        user_id: body.user_id,
        type: body.type,
        title: sanitizePlain(body.title),
        message: sanitizePlain(body.message),
        link: body.link || null,
        metadata: body.metadata || null,
      }),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل إنشاء التنبيه' }, { status: 500 });
    const alert = await res.json();
    return NextResponse.json({ success: true, alert: alert[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!checkOrigin(request) || !verifyCsrfToken(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/alerts?id=eq.${body.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ read: true }),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
