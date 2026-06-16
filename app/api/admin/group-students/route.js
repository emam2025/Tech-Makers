import { NextResponse } from 'next/server';
import { sanitizePlain } from '../../../../lib/security';

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

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!['admin', 'supervisor'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.group_id || typeof body.group_id !== 'string') {
      return NextResponse.json({ error: 'معرف المجموعة مطلوب' }, { status: 400 });
    }
    if (!body.student_id || typeof body.student_id !== 'string') {
      return NextResponse.json({ error: 'معرف الطالب مطلوب' }, { status: 400 });
    }

    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/group_students?group_id=eq.${body.group_id}&student_id=eq.${body.student_id}&select=id`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (existing.length > 0) {
        return NextResponse.json({ error: 'الطالب موجود مسبقاً في المجموعة' }, { status: 409 });
      }
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/group_students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        group_id: body.group_id,
        student_id: body.student_id,
      }),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل إضافة الطالب' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!['admin', 'supervisor'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const group_id = searchParams.get('group_id');
    const student_id = searchParams.get('student_id');

    if (!group_id || !student_id) {
      return NextResponse.json({ error: 'معرف المجموعة والطالب مطلوبان' }, { status: 400 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/group_students?group_id=eq.${group_id}&student_id=eq.${student_id}`,
      {
        method: 'DELETE',
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      }
    );
    if (!res.ok) return NextResponse.json({ error: 'فشل إزالة الطالب' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
