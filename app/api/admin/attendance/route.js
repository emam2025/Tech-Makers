import { NextResponse } from 'next/server';
import { verifyAuth, getTrainerGroupIds } from '../../../../lib/adminAuth.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get('session_id') || '';
    const student_id = searchParams.get('student_id') || '';

    let query = `${SUPABASE_URL}/rest/v1/attendance?select=*,session:sessions(title,scheduled_date,group_id),student:students_enhanced(full_name,national_id)&order=created_at.desc`;
    if (session_id) query += `&session_id=eq.${session_id}`;
    if (student_id) query += `&student_id=eq.${student_id}`;

    if (auth.user.role === 'trainer') {
      const groupIds = await getTrainerGroupIds(auth.user.id);
      if (groupIds.length === 0) return NextResponse.json({ attendance: [] });
      query += `&session.group_id=in.(${groupIds.join(',')})`;
    }

    query += '&limit=500';

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    const attendance = await res.json();
    return NextResponse.json({ attendance });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
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
