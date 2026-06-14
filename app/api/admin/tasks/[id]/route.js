import { NextResponse } from 'next/server';
import { sanitizePlain } from '../../../../../lib/security';

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

export async function PUT(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!['admin', 'supervisor', 'trainer'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();

    const allowed = {};
    if (body.title !== undefined) {
      if (!body.title || typeof body.title !== 'string') {
        return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 });
      }
      allowed.title = sanitizePlain(body.title);
    }
    if (body.description !== undefined) {
      allowed.description = body.description ? sanitizePlain(body.description) : null;
    }
    if (body.deadline !== undefined) allowed.deadline = body.deadline;
    if (body.group_id !== undefined) allowed.group_id = body.group_id;
    if (body.status !== undefined) {
      const validStatuses = ['active', 'completed', 'cancelled'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: 'الحالة غير صالحة' }, { status: 400 });
      }
      allowed.status = body.status;
    }
    if (body.max_score !== undefined) {
      if (typeof body.max_score !== 'number' || body.max_score <= 0) {
        return NextResponse.json({ error: 'الدرجة القصوى غير صالحة' }, { status: 400 });
      }
      allowed.max_score = body.max_score;
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${id}`, {
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
    const task = await res.json();
    return NextResponse.json({ success: true, task: task[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!['admin', 'supervisor'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
