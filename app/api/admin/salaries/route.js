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
    const trainer_id = searchParams.get('trainer_id') || '';
    const month = searchParams.get('month') || '';
    const year = searchParams.get('year') || '';
    const status = searchParams.get('status') || '';
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = `${SUPABASE_URL}/rest/v1/salary_reports?select=*,trainer:profiles!salary_reports_trainer_id_fkey(full_name,hourly_rate,salary_type,monthly_salary)&order=year.desc,month.desc`;
    if (trainer_id) query += `&trainer_id=eq.${trainer_id}`;
    if (month && year) query += `&month=eq.${month}&year=eq.${year}`;
    if (status) query += `&status=eq.${status}`;
    query += `&limit=${pageSize}&offset=${from}`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب تقارير الرواتب' }, { status: 500 });
    const reports = await res.json();
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || reports.length);

    return NextResponse.json({ data: reports, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const ip = getClientIp(request);
  if (!await rateLimit(ip, 20, 60000)) {
    return NextResponse.json({ error: 'تم تجاوز الحد المسموح' }, { status: 429 });
  }

  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.trainer_id) return NextResponse.json({ error: 'معرف المدرب مطلوب' }, { status: 400 });
    if (!body.month || !body.year) return NextResponse.json({ error: 'الشهر والسنة مطلوبان' }, { status: 400 });

    const existingRes = await fetch(
      `${SUPABASE_URL}/rest/v1/salary_reports?trainer_id=eq.${body.trainer_id}&month=eq.${body.month}&year=eq.${body.year}&select=id`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const existing = existingRes.ok ? await existingRes.json() : [];
    if (existing.length > 0) {
      return NextResponse.json({ error: 'تقرير هذا الشهر موجود مسبقاً' }, { status: 400 });
    }

    const trainerRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${body.trainer_id}&select=hourly_rate,salary_type,monthly_salary`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const trainers = trainerRes.ok ? await trainerRes.json() : [];
    if (!trainers.length) return NextResponse.json({ error: 'المدرب غير موجود' }, { status: 404 });
    const trainer = trainers[0];

    const startDate = `${body.year}-${String(body.month).padStart(2, '0')}-01`;
    const endMonth = parseInt(body.month) === 12 ? 1 : parseInt(body.month) + 1;
    const endYear = parseInt(body.month) === 12 ? parseInt(body.year) + 1 : parseInt(body.year);
    const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

    const hoursRes = await fetch(
      `${SUPABASE_URL}/rest/v1/trainer_hours?trainer_id=eq.${body.trainer_id}&date=gte.${startDate}&date=lt.${endDate}&status=eq.approved&select=hours`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const hoursData = hoursRes.ok ? await hoursRes.json() : [];
    const totalHours = hoursData.reduce((sum, h) => sum + (parseFloat(h.hours) || 0), 0);

    const hourlyRate = parseFloat(trainer.hourly_rate) || 0;
    const baseSalary = trainer.salary_type === 'monthly'
      ? parseFloat(trainer.monthly_salary) || 0
      : totalHours * hourlyRate;

    const allowed = {
      trainer_id: body.trainer_id,
      month: parseInt(body.month),
      year: parseInt(body.year),
      total_hours: totalHours,
      hourly_rate: hourlyRate,
      base_salary: baseSalary,
      bonus: parseFloat(body.bonus) || 0,
      deductions: parseFloat(body.deductions) || 0,
      total_salary: baseSalary + (parseFloat(body.bonus) || 0) - (parseFloat(body.deductions) || 0),
      status: 'draft',
      notes: body.notes ? sanitizePlain(body.notes) : null,
      created_by: auth.user.id,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/salary_reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(allowed),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل إنشاء التقرير' }, { status: 500 });
    const report = await res.json();
    return NextResponse.json({ success: true, report: report[0] });
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
  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'معرف التقرير مطلوب' }, { status: 400 });

    const allowed = {};
    if (body.status !== undefined) {
      if (!['draft', 'approved', 'paid'].includes(body.status)) {
        return NextResponse.json({ error: 'الحالة غير صحيحة' }, { status: 400 });
      }
      allowed.status = body.status;
      if (body.status === 'paid') allowed.paid_at = new Date().toISOString();
    }
    if (body.bonus !== undefined) allowed.bonus = parseFloat(body.bonus) || 0;
    if (body.deductions !== undefined) allowed.deductions = parseFloat(body.deductions) || 0;
    if (body.notes !== undefined) allowed.notes = body.notes ? sanitizePlain(body.notes) : null;

    if (allowed.bonus !== undefined || allowed.deductions !== undefined) {
      const reportRes = await fetch(
        `${SUPABASE_URL}/rest/v1/salary_reports?id=eq.${body.id}&select=base_salary`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      const reports = reportRes.ok ? await reportRes.json() : [];
      if (reports.length) {
        allowed.total_salary = parseFloat(reports[0].base_salary) + (allowed.bonus ?? 0) - (allowed.deductions ?? 0);
      }
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/salary_reports?id=eq.${body.id}`, {
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
    const report = await res.json();
    return NextResponse.json({ success: true, report: report[0] });
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
    if (!id) return NextResponse.json({ error: 'معرف التقرير مطلوب' }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/salary_reports?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
