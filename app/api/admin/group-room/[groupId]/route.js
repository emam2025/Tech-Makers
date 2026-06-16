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

export async function GET(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { groupId } = await params;

  try {
    // 1. Group info
    const groupRes = await fetch(
      `${SUPABASE_URL}/rest/v1/groups?id=eq.${groupId}&select=*,trainer:trainers(id,full_name),admin:profiles!groups_admin_id_fkey(full_name)`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!groupRes.ok) return NextResponse.json({ error: 'فشل جلب المجموعة' }, { status: 500 });
    const groups = await groupRes.json();
    if (!groups?.length) return NextResponse.json({ error: 'المجموعة غير موجودة' }, { status: 404 });
    const group = groups[0];

    // 2. Group students
    const studentsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/group_students?group_id=eq.${groupId}&select=*,student:students_enhanced(id,full_name,phone,email)`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const students = studentsRes.ok ? await studentsRes.json() : [];

    // 3. Group trainers (from group_trainers junction or single trainer_id)
    let trainers = [];
    if (group.trainer) {
      trainers = [group.trainer];
    }

    // 4. Sessions for this group
    const sessionsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/sessions?group_id=eq.${groupId}&select=*,trainer:trainers(full_name)&order=scheduled_date.asc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const sessions = sessionsRes.ok ? await sessionsRes.json() : [];

    // 5. Find next upcoming session
    const now = new Date();
    const nextSession = sessions.find(s => s.status === 'upcoming' && new Date(s.scheduled_date) > now);

    return NextResponse.json({ group, students, trainers, sessions, nextSession });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!['admin', 'supervisor'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const { groupId } = await params;

  try {
    const body = await request.json();
    const { id: _, ...updateData } = body;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/groups?id=eq.${groupId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
    const group = await res.json();
    return NextResponse.json({ success: true, group: group[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
