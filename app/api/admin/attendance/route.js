import { NextResponse } from 'next/server';
import { checkOrigin } from '../../../../lib/security';
import { verifyCsrfToken } from '../../../../lib/csrf';
import { verifyAuth, getTrainerGroupIds } from '../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get('session_id') || '';
    const student_id = searchParams.get('student_id') || '';
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = `${SUPABASE_URL}/rest/v1/attendance?select=*,session:sessions(title,scheduled_date,group_id),student:students_enhanced(full_name,national_id)&order=created_at.desc`;
    if (session_id) query += `&session_id=eq.${session_id}`;
    if (student_id) query += `&student_id=eq.${student_id}`;

    if (auth.user.role === 'trainer') {
      const groupIds = await getTrainerGroupIds(auth.user.id);
      if (groupIds.length === 0) return NextResponse.json({ data: [], total: 0, page, pageSize, totalPages: 0 });
      query += `&session.group_id=in.(${groupIds.join(',')})`;
    }

    query += `&limit=${pageSize}&offset=${from}`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    const attendance = await res.json();
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || attendance.length);
    return NextResponse.json({ data: attendance, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
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
  if (!['admin', 'supervisor', 'trainer'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { session_id, records } = body;

    if (!session_id || !records?.length) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(records.map(r => ({
        session_id,
        student_id: r.student_id,
        status: r.status,
        notes: r.notes || null,
      }))),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل التسجيل' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
