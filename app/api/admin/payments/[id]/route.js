import { NextResponse } from 'next/server';
import { sanitizePlain, checkOrigin } from '../../../../../lib/security';
import { verifyCsrfToken } from '../../../../../lib/csrf';
import { verifyAuth, getTokenFromCookie } from '../../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

const VALID_METHODS = ['cash', 'instapay', 'vodafone_cash', 'orange_money', 'etisalat_cash', 'fawry', 'visa', 'mastercard', 'transfer', 'other'];
const VALID_STATUSES = ['pending', 'confirmed', 'rejected', 'refunded'];

export async function GET(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/payments?id=eq.${id}&select=*,student:students_enhanced(full_name)`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    const payments = await res.json();
    if (!payments.length) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
    return NextResponse.json({ payment: payments[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

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
    if (body.amount !== undefined) {
      if (typeof body.amount !== 'number' || body.amount <= 0 || body.amount > 1000000) {
        return NextResponse.json({ error: 'المبلغ غير صالح' }, { status: 400 });
      }
      allowed.amount = body.amount;
    }
    if (body.method !== undefined) {
      if (!VALID_METHODS.includes(body.method)) {
        return NextResponse.json({ error: 'طريقة الدفع غير صالحة' }, { status: 400 });
      }
      allowed.method = body.method;
    }
    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: 'حالة الدفع غير صالحة' }, { status: 400 });
      }
      allowed.status = body.status;
    }
    if (body.notes !== undefined) {
      allowed.notes = body.notes ? sanitizePlain(body.notes) : null;
    }
    if (body.payment_date !== undefined) {
      allowed.payment_date = body.payment_date;
    }
    if (body.reference_number !== undefined) {
      allowed.reference_number = body.reference_number ? sanitizePlain(body.reference_number) : null;
    }
    if (body.paid_by_name !== undefined) {
      allowed.paid_by_name = body.paid_by_name ? sanitizePlain(body.paid_by_name) : null;
    }
    if (body.subscription_id !== undefined) {
      allowed.subscription_id = body.subscription_id;
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/payments?id=eq.${id}`, {
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
    const payment = await res.json();
    return NextResponse.json({ success: true, payment: payment[0] });
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
    const res = await fetch(`${SUPABASE_URL}/rest/v1/payments?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
