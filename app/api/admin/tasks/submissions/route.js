import { NextResponse } from 'next/server';

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

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const task_id = searchParams.get('task_id');
    const student_id = searchParams.get('student_id');

    if (task_id) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/task_submissions?select=*,student:students_enhanced(full_name,national_id),task:tasks(title,max_score)&task_id=eq.${task_id}&order=submitted_at.desc`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      if (!res.ok) return NextResponse.json({ error: 'فشل جلب التسليمات' }, { status: 500 });
      const submissions = await res.json();
      return NextResponse.json({ submissions });
    }

    if (student_id) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/task_submissions?select=*,task:tasks(title,max_score,type,due_date)&student_id=eq.${student_id}&order=submitted_at.desc`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      if (!res.ok) return NextResponse.json({ error: 'فشل جلب التسليمات' }, { status: 500 });
      const submissions = await res.json();
      return NextResponse.json({ submissions });
    }

    return NextResponse.json({ error: 'task_id or student_id required' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

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
