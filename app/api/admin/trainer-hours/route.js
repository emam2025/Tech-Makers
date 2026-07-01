import { NextResponse } from 'next/server';
import { sanitizePlain, rateLimit, getClientIp, checkOrigin } from '../../../../lib/security';
import { verifyCsrfToken } from '../../../../lib/csrf';
import { verifyAuth, getTrainerGroupIds } from '../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const trainer_id = searchParams.get('trainer_id') || '';
    const month = searchParams.get('month') || '';
    const year = searchParams.get('year') || '';
    const status = searchParams.get('status') || '';
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = `${SUPABASE_URL}/rest/v1/trainer_hours?select=*,trainer:profiles!trainer_hours_trainer_id_fkey(full_name),group:groups(name)&order=date.desc`;

    if (auth.user.role === 'trainer') {
      query += `&trainer_id=eq.${auth.user.id}`;
    } else if (trainer_id) {
      query += `&trainer_id=eq.${trainer_id}`;
    }

    if (status) query += `&status=eq.${status}`;
    if (month && year) {
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const endYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
      const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;
      query += `&date=gte.${startDate}&date=lt.${endDate}`;
    }
    query += `&limit=${pageSize}&offset=${from}`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب الساعات' }, { status: 500 });
    const hours = await res.json();

    const totalHours = hours.reduce((sum, h) => sum + (parseFloat(h.hours) || 0), 0);
    const approvedHours = hours.filter(h => h.status === 'approved').reduce((sum, h) => sum + (parseFloat(h.hours) || 0), 0);
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || hours.length);

    return NextResponse.json({ data: hours, totalHours, approvedHours, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
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
  if (!['admin', 'supervisor', 'trainer'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.trainer_id) {
      return NextResponse.json({ error: 'معرف المدرب مطلوب' }, { status: 400 });
    }

    if (auth.user.role === 'trainer' && body.trainer_id !== auth.user.id) {
      return NextResponse.json({ error: 'غير مصرح لإضافة ساعات مدرب آخر' }, { status: 403 });
    }

    if (auth.user.role === 'trainer' && body.group_id) {
      const groupIds = await getTrainerGroupIds(auth.user.id);
      if (!groupIds.includes(body.group_id)) {
        return NextResponse.json({ error: 'غير مصرح لهذه المجموعة' }, { status: 403 });
      }
    }

    if (!body.hours || typeof body.hours !== 'number' || body.hours <= 0 || body.hours > 24) {
      return NextResponse.json({ error: 'عدد الساعات يجب أن يكون بين 0.5 و 24' }, { status: 400 });
    }
    if (!['training', 'preparation', 'correction', 'meeting', 'other'].includes(body.hour_type)) {
      return NextResponse.json({ error: 'نوع الساعة غير صحيح' }, { status: 400 });
    }

    const allowed = {
      trainer_id: body.trainer_id,
      group_id: body.group_id || null,
      session_id: body.session_id || null,
      hours: body.hours,
      hour_type: body.hour_type,
      description: body.description ? sanitizePlain(body.description) : null,
      date: body.date || new Date().toISOString().split('T')[0],
      is_auto: body.is_auto || false,
      status: ['admin', 'supervisor'].includes(auth.user.role) ? 'approved' : 'pending',
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/trainer_hours`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(allowed),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل إضافة الساعات' }, { status: 500 });
    const hour = await res.json();
    return NextResponse.json({ success: true, hour: hour[0] });
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
    if (!body.id) return NextResponse.json({ error: 'معرف السجل مطلوب' }, { status: 400 });

    const allowed = {};
    if (body.status !== undefined) {
      if (!['pending', 'approved', 'rejected'].includes(body.status)) {
        return NextResponse.json({ error: 'الحالة غير صحيحة' }, { status: 400 });
      }
      allowed.status = body.status;
      if (body.status === 'approved') allowed.approved_by = auth.user.id;
    }
    if (body.hours !== undefined) allowed.hours = body.hours;
    if (body.description !== undefined) allowed.description = body.description ? sanitizePlain(body.description) : null;
    if (body.hour_type !== undefined) allowed.hour_type = body.hour_type;
    if (body.date !== undefined) allowed.date = body.date;

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/trainer_hours?id=eq.${body.id}`, {
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
    const hour = await res.json();
    return NextResponse.json({ success: true, hour: hour[0] });
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
  if (!['admin', 'supervisor'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف السجل مطلوب' }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/trainer_hours?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
