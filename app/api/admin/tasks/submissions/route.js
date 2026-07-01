import { NextResponse } from 'next/server';
import { checkOrigin } from '../../../../../lib/security';
import { verifyCsrfToken } from '../../../../../lib/csrf';
import { verifyAuth, getTokenFromCookie } from '../../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const task_id = searchParams.get('task_id');
    const student_id = searchParams.get('student_id');
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    if (task_id) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/task_submissions?select=*,student:students_enhanced(full_name,national_id),task:tasks(title,max_score)&task_id=eq.${task_id}&order=submitted_at.desc&limit=${pageSize}&offset=${from}`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' } }
      );
      if (!res.ok) return NextResponse.json({ error: 'فشل جلب التسليمات' }, { status: 500 });
      const submissions = await res.json();
      const total = parseInt(res.headers.get('content-range')?.split('/')[1] || submissions.length);
      return NextResponse.json({ data: submissions, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
    }

    if (student_id) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/task_submissions?select=*,task:tasks(title,max_score,type,due_date)&student_id=eq.${student_id}&order=submitted_at.desc&limit=${pageSize}&offset=${from}`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' } }
      );
      if (!res.ok) return NextResponse.json({ error: 'فشل جلب التسليمات' }, { status: 500 });
      const submissions = await res.json();
      const total = parseInt(res.headers.get('content-range')?.split('/')[1] || submissions.length);
      return NextResponse.json({ data: submissions, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
    }

    return NextResponse.json({ error: 'task_id or student_id required' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!checkOrigin(request) || !verifyCsrfToken(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, score, feedback } = body;

    if (!id) return NextResponse.json({ error: 'ID مطلوب' }, { status: 400 });

    if (score !== undefined) {
      if (!['admin', 'supervisor', 'trainer'].includes(auth.user.role)) {
        return NextResponse.json({ error: 'غير مصرح بالتصحيح' }, { status: 403 });
      }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/task_submissions?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          score,
          feedback,
          graded_by: auth.user.id,
          graded_at: new Date().toISOString(),
          status: 'graded',
        }),
      });
      if (!res.ok) return NextResponse.json({ error: 'فشل التصحيح' }, { status: 500 });
      const submission = await res.json();
      return NextResponse.json({ success: true, submission: submission[0] });
    }

    if (!['admin', 'supervisor', 'trainer', 'student'].includes(auth.user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const { task_id, student_id, submission_text, submission_url } = body;
    if (!task_id || !student_id) return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });

    const res = await fetch(`${SUPABASE_URL}/rest/v1/task_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ task_id, student_id, submission_text, submission_url, status: 'submitted' }),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل التسليم' }, { status: 500 });
    const submission = await res.json();
    return NextResponse.json({ success: true, submission: submission[0] });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
