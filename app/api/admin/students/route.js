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
    const search = searchParams.get('search') || '';
    const track = searchParams.get('track') || '';
    const status = searchParams.get('status') || '';
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = `${SUPABASE_URL}/rest/v1/students_enhanced?select=*&order=created_at.desc`;
    if (search) query += `&or=(full_name.ilike.*${search}*,email.ilike.*${search}*,national_id.ilike.*${search}*)`;
    if (track) query += `&track=eq.${track}`;
    if (status) query += `&status=eq.${status}`;

    if (auth.user.role === 'trainer') {
      const groupIds = await getTrainerGroupIds(auth.user.id);
      if (groupIds.length === 0) return NextResponse.json({ data: [], total: 0, page, pageSize, totalPages: 0 });
      const studentRes = await fetch(
        `${SUPABASE_URL}/rest/v1/group_students?group_id=in.(${groupIds.join(',')})&select=student_id`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      if (!studentRes.ok) return NextResponse.json({ data: [], total: 0, page, pageSize, totalPages: 0 });
      const groupStudents = await studentRes.json();
      const studentIds = [...new Set(groupStudents.map(gs => gs.student_id))];
      if (studentIds.length === 0) return NextResponse.json({ data: [], total: 0, page, pageSize, totalPages: 0 });
      query += `&id=in.(${studentIds.join(',')})`;
    }

    query += `&limit=${pageSize}&offset=${from}`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
    });

    if (!res.ok) return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    const students = await res.json();
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || students.length);
    return NextResponse.json({ data: students, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
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
  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح — للإدارة فقط' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { full_name, email, phone, whatsapp, national_id, birth_date, gender, track, grade, governorate } = body;

    if (!full_name || !email || !national_id) {
      return NextResponse.json({ error: 'الاسم والبريد والهوية مطلوبة' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/students_enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        full_name, email, phone, whatsapp, national_id,
        birth_date, gender, track, grade, governorate,
        status: 'pending',
      }),
    });

    if (!res.ok) return NextResponse.json({ error: 'فشل إضافة الطالب' }, { status: 500 });
    const student = await res.json();
    return NextResponse.json({ success: true, student: student[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
