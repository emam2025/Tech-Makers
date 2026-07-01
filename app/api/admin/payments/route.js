import { NextResponse } from 'next/server';
import { sanitizePlain, checkOrigin } from '../../../../lib/security';
import { verifyCsrfToken } from '../../../../lib/csrf';
import { verifyAuth, getTokenFromCookie } from '../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const VALID_METHODS = ['cash', 'instapay', 'vodafone_cash', 'orange_money', 'etisalat_cash', 'fawry', 'visa', 'mastercard', 'transfer', 'other'];
const VALID_STATUSES = ['pending', 'confirmed', 'rejected', 'refunded'];

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id') || '';
    const status = searchParams.get('status') || '';
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = `${SUPABASE_URL}/rest/v1/payments?select=*,student:students_enhanced(full_name),subscription:subscriptions(id)&order=payment_date.desc`;
    if (student_id) {
      const cleanId = sanitizePlain(student_id);
      if (cleanId.length > 50) return NextResponse.json({ error: 'معرف غير صالح' }, { status: 400 });
      query += `&student_id=eq.${cleanId}`;
    }
    if (status) query += `&status=eq.${status}`;
    query += `&limit=${pageSize}&offset=${from}`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    const payments = await res.json();
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || payments.length);
    return NextResponse.json({ data: payments, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
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

    if (!body.student_id || typeof body.student_id !== 'string') {
      return NextResponse.json({ error: 'معرف الطالب مطلوب' }, { status: 400 });
    }
    if (!body.amount || typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json({ error: 'المبلغ غير صالح' }, { status: 400 });
    }
    if (body.amount > 1000000) {
      return NextResponse.json({ error: 'المبلغ يتجاوز الحد الأقصى' }, { status: 400 });
    }
    if (body.method && !VALID_METHODS.includes(body.method)) {
      return NextResponse.json({ error: 'طريقة الدفع غير صالحة' }, { status: 400 });
    }
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'حالة الدفع غير صالحة' }, { status: 400 });
    }
    if (body.notes && typeof body.notes === 'string' && body.notes.length > 500) {
      return NextResponse.json({ error: 'الملاحظات طويلة جداً' }, { status: 400 });
    }
    if (body.reference_number && typeof body.reference_number === 'string' && body.reference_number.length > 100) {
      return NextResponse.json({ error: 'رقم المرجع طويل جداً' }, { status: 400 });
    }

    const allowed = {
      student_id: sanitizePlain(body.student_id),
      amount: body.amount,
      method: body.method || 'cash',
      status: body.status || 'confirmed',
      payment_date: body.payment_date || new Date().toISOString().split('T')[0],
      subscription_id: body.subscription_id || null,
      notes: body.notes ? sanitizePlain(body.notes) : null,
      reference_number: body.reference_number ? sanitizePlain(body.reference_number) : null,
      paid_by_name: body.paid_by_name ? sanitizePlain(body.paid_by_name) : null,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
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
      return NextResponse.json({ error: 'فشل الإضافة' }, { status: 500 });
    }
    const payment = await res.json();
    return NextResponse.json({ success: true, payment: payment[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
