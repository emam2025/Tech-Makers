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

const VALID_METHODS = ['cash', 'instapay', 'vodafone_cash', 'orange_money', 'etisalat_cash', 'fawry', 'visa', 'mastercard', 'transfer', 'other'];
const VALID_STATUSES = ['pending', 'confirmed', 'rejected', 'refunded'];

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id') || '';
    const status = searchParams.get('status') || '';

    let query = `${SUPABASE_URL}/rest/v1/payments?select=*,student:students_enhanced(full_name),subscription:subscriptions(id)&order=payment_date.desc`;
    if (student_id) {
      const cleanId = sanitizePlain(student_id);
      if (cleanId.length > 50) return NextResponse.json({ error: 'معرف غير صالح' }, { status: 400 });
      query += `&student_id=eq.${cleanId}`;
    }
    if (status) query += `&status=eq.${status}`;
    query += '&limit=500';

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    const payments = await res.json();
    return NextResponse.json({ payments });
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
