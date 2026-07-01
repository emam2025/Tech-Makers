import { NextResponse } from 'next/server';
import { sanitizePlain, validateEmail, validatePhone, checkOrigin } from '../../../../../lib/security';
import { verifyCsrfToken } from '../../../../../lib/csrf';
import { verifyAuth, getTokenFromCookie } from '../../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id } = await params;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/students_enhanced?id=eq.${id}&select=*`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    const students = await res.json();
    if (!students?.length) return NextResponse.json({ error: 'الطالب غير موجود' }, { status: 404 });
    return NextResponse.json({ student: students[0] });
  } catch (err) {
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

    const allowedFields = ['full_name', 'email', 'phone', 'track', 'status', 'age', 'group_id', 'notes'];
    const allowed = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        if (typeof body[key] === 'string') {
          allowed[key] = sanitizePlain(body[key]);
        } else {
          allowed[key] = body[key];
        }
      }
    }

    if (allowed.email && !validateEmail(allowed.email)) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صالح' }, { status: 400 });
    }
    if (allowed.phone && !validatePhone(allowed.phone)) {
      return NextResponse.json({ error: 'رقم الهاتف غير صالح' }, { status: 400 });
    }
    if (allowed.full_name && (allowed.full_name.length < 2 || allowed.full_name.length > 100)) {
      return NextResponse.json({ error: 'الاسم غير صالح' }, { status: 400 });
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/students_enhanced?id=eq.${id}`, {
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
    const student = await res.json();
    return NextResponse.json({ success: true, student: student[0] });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!checkOrigin(request) || !verifyCsrfToken(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }
  if (auth.user.role !== 'admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  const { id } = await params;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/students_enhanced?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
