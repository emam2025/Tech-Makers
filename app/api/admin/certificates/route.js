import { NextResponse } from 'next/server';
import { sanitizePlain, rateLimit, getClientIp, checkOrigin } from '../../../../lib/security';
import { verifyCsrfToken } from '../../../../lib/csrf';
import { verifyAuth, getTokenFromCookie } from '../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';
    const search = searchParams.get('search') || '';
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = `${SUPABASE_URL}/rest/v1/certificates?select=*,issued_by_profile:profiles!certificates_issued_by_fkey(full_name)&order=created_at.desc`;
    if (status) query += `&status=eq.${status}`;
    if (type) query += `&certificate_type=eq.${type}`;
    if (search) query += `&or=(student_name_en.ilike.*${encodeURIComponent(search)}*,national_id.ilike.*${encodeURIComponent(search)}*,serial_number.ilike.*${encodeURIComponent(search)}*)`;
    query += `&limit=${pageSize}&offset=${from}`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب الشهادات' }, { status: 500 });
    const certificates = await res.json();
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || certificates.length);

    const statsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/certificates?select=id&status=eq.issued`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const stats = await statsRes.json();

    return NextResponse.json({ data: certificates, total_issued: stats?.length || 0, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const ip = getClientIp(request);
  if (!await rateLimit(ip, 30, 60000)) {
    return NextResponse.json({ error: 'تم تجاوز الحد المسموح' }, { status: 429 });
  }

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

    if (!body.student_name_en || typeof body.student_name_en !== 'string' || body.student_name_en.trim().length < 3) {
      return NextResponse.json({ error: 'اسم الطالب بالإنجليزية مطلوب (3 أحرف على الأقل)' }, { status: 400 });
    }
    if (!body.national_id || !/^\d{14}$/.test(body.national_id)) {
      return NextResponse.json({ error: 'الرقم القومي يجب أن يكون 14 رقم' }, { status: 400 });
    }
    if (!body.program) {
      return NextResponse.json({ error: 'البرنامج مطلوب' }, { status: 400 });
    }
    if (!['first', 'second', 'third'].includes(body.level)) {
      return NextResponse.json({ error: 'المستوى غير صحيح' }, { status: 400 });
    }
    if (!['email', 'whatsapp', 'printed'].includes(body.delivery_method)) {
      return NextResponse.json({ error: 'طريقة التسليم غير صحيحة' }, { status: 400 });
    }

    const serialNumber = `TKA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;

    const allowed = {
      student_name_en: sanitizePlain(body.student_name_en.trim()),
      national_id: body.national_id.trim(),
      program: sanitizePlain(body.program),
      level: body.level,
      certificate_type: body.certificate_type || 'student',
      delivery_method: body.delivery_method,
      delivery_contact: body.delivery_contact ? sanitizePlain(body.delivery_contact) : null,
      delivery_address: body.delivery_address ? sanitizePlain(body.delivery_address) : null,
      issued_by: auth.user.id,
      serial_number: serialNumber,
      status: 'pending',
      notes: body.notes ? sanitizePlain(body.notes) : null,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/certificates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(allowed),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل إصدار الشهادة' }, { status: 500 });
    const certificate = await res.json();
    return NextResponse.json({ success: true, certificate: certificate[0] });
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
  if (!['admin', 'supervisor'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'معرف الشهادة مطلوب' }, { status: 400 });

    const allowed = {};
    if (body.status !== undefined) {
      if (!['pending', 'issued', 'delivered', 'cancelled'].includes(body.status)) {
        return NextResponse.json({ error: 'الحالة غير صحيحة' }, { status: 400 });
      }
      allowed.status = body.status;
      if (body.status === 'issued') allowed.issued_at = new Date().toISOString();
      if (body.status === 'delivered') allowed.delivered_at = new Date().toISOString();
    }
    if (body.notes !== undefined) allowed.notes = body.notes ? sanitizePlain(body.notes) : null;
    if (body.delivery_contact !== undefined) allowed.delivery_contact = body.delivery_contact ? sanitizePlain(body.delivery_contact) : null;
    if (body.delivery_address !== undefined) allowed.delivery_address = body.delivery_address ? sanitizePlain(body.delivery_address) : null;

    if (Object.keys(allowed).length <= 1 && !body.status) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }
    allowed.updated_at = new Date().toISOString();

    const res = await fetch(`${SUPABASE_URL}/rest/v1/certificates?id=eq.${body.id}`, {
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
    const certificate = await res.json();
    return NextResponse.json({ success: true, certificate: certificate[0] });
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
  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف الشهادة مطلوب' }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/certificates?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
