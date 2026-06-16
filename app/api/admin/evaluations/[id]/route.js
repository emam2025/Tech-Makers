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
    const scoreFields = ['technical_score', 'attendance_score', 'participation_score', 'behavior_score', 'effort_score'];
    let totalScore = 0;
    let scoreCount = 0;

    for (const key of scoreFields) {
      if (body[key] !== undefined) {
        if (body[key] !== null && (typeof body[key] !== 'number' || body[key] < 1 || body[key] > 10)) {
          return NextResponse.json({ error: `${key} يجب أن يكون بين 1 و 10` }, { status: 400 });
        }
        allowed[key] = body[key];
        if (body[key] !== null) { totalScore += body[key]; scoreCount++; }
      }
    }

    if (scoreCount > 0) {
      allowed.overall_score = Math.round((totalScore / scoreCount) * 100) / 100;
    }

    if (body.strengths !== undefined) allowed.strengths = body.strengths ? sanitizePlain(body.strengths) : null;
    if (body.weaknesses !== undefined) allowed.weaknesses = body.weaknesses ? sanitizePlain(body.weaknesses) : null;
    if (body.recommendations !== undefined) allowed.recommendations = body.recommendations ? sanitizePlain(body.recommendations) : null;
    if (body.general_notes !== undefined) allowed.general_notes = body.general_notes ? sanitizePlain(body.general_notes) : null;
    if (body.evaluation_type !== undefined) allowed.evaluation_type = body.evaluation_type;
    if (body.evaluation_date !== undefined) allowed.evaluation_date = body.evaluation_date;

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/evaluations?id=eq.${id}`, {
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
    const evaluation = await res.json();
    return NextResponse.json({ success: true, evaluation: evaluation[0] });
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
    const res = await fetch(`${SUPABASE_URL}/rest/v1/evaluations?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
