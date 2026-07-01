import { NextResponse } from 'next/server';
import { checkOrigin } from '../../../../../lib/security';
import { verifyCsrfToken } from '../../../../../lib/csrf';
import { verifyAuth, getTrainerGroupIds } from '../../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

function attendanceToScore(status) {
  switch (status) {
    case 'present': return 10;
    case 'late': return 7;
    case 'excused': return 5;
    case 'absent': return 1;
    default: return 5;
  }
}

function calculateBehaviorScore(attendanceRecords) {
  if (!attendanceRecords.length) return 5;
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const total = attendanceRecords.length;
  const attendanceRate = presentCount / total;
  if (attendanceRate >= 0.9) return 10;
  if (attendanceRate >= 0.8) return 9;
  if (attendanceRate >= 0.7) return 8;
  if (attendanceRate >= 0.6) return 7;
  if (attendanceRate >= 0.5) return 6;
  if (attendanceRate >= 0.4) return 5;
  if (attendanceRate >= 0.3) return 4;
  if (attendanceRate >= 0.2) return 3;
  return 2;
}

async function autoEvaluate(sessionId, groupId, evaluatorId, sessionDate, sessionTitle) {
  try {
    const attRes = await fetch(
      `${SUPABASE_URL}/rest/v1/attendance?session_id=eq.${sessionId}&select=*`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!attRes.ok) return;
    const attendance = await attRes.json();
    if (!attendance.length) return;

    const studentIds = attendance.map(a => a.student_id);
    const prevAttRes = await fetch(
      `${SUPABASE_URL}/rest/v1/attendance?student_id=in.(${studentIds.join(',')})&select=*`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const prevAttendance = prevAttRes.ok ? await prevAttRes.json() : [];

    for (const record of attendance) {
      const existingRes = await fetch(
        `${SUPABASE_URL}/rest/v1/evaluations?student_id=eq.${record.student_id}&session_id=eq.${sessionId}&select=id`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      const existing = existingRes.ok ? await existingRes.json() : [];
      if (existing.length > 0) continue;

      const studentHistory = prevAttendance.filter(a => a.student_id === record.student_id);
      const attendanceScore = attendanceToScore(record.status);
      const behaviorScore = calculateBehaviorScore(studentHistory);
      const overallScore = Math.round(((attendanceScore * 0.6) + (behaviorScore * 0.4)) * 100) / 100;

      await fetch(`${SUPABASE_URL}/rest/v1/evaluations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        body: JSON.stringify({
          student_id: record.student_id,
          evaluator_id: evaluatorId,
          group_id: groupId,
          session_id: sessionId,
          attendance_score: attendanceScore,
          behavior_score: behaviorScore,
          overall_score: overallScore,
          strengths: record.status === 'present' ? 'الالتزام بالحضور' : null,
          weaknesses: record.status === 'absent' ? 'الغياب عن الجلسة' : record.status === 'late' ? 'التأخر' : null,
          general_notes: `تقييم تلقائي — جلسة "${sessionTitle || ''}" — ${record.status === 'present' ? 'حاضر' : record.status === 'late' ? 'متأخر' : record.status === 'excused' ? 'معذور' : 'غائب'}`,
          evaluation_date: sessionDate || new Date().toISOString().split('T')[0],
          evaluation_type: 'session',
        }),
      });
    }
  } catch {}
}

async function autoLogTrainerHours(session, trainerId) {
  try {
    if (session.trainer_hours_logged) return;

    const hours = parseFloat(session.actual_hours) || parseFloat(session.theoretical_hours) || 1;

    const existingRes = await fetch(
      `${SUPABASE_URL}/rest/v1/trainer_hours?session_id=eq.${session.id}&select=id`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const existing = existingRes.ok ? await existingRes.json() : [];
    if (existing.length > 0) return;

    await fetch(`${SUPABASE_URL}/rest/v1/trainer_hours`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      body: JSON.stringify({
        trainer_id: trainerId,
        group_id: session.group_id,
        session_id: session.id,
        hours: hours,
        hour_type: 'training',
        description: `محاضرة تلقائية: ${session.title || 'جلسة تدريبية'}`,
        date: session.scheduled_date || new Date().toISOString().split('T')[0],
        is_auto: true,
        status: 'approved',
      }),
    });

    await fetch(`${SUPABASE_URL}/rest/v1/sessions?id=eq.${session.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      body: JSON.stringify({ trainer_hours_logged: true, actual_hours: hours }),
    });
  } catch {}
}

export async function PUT(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!checkOrigin(request) || !verifyCsrfToken(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }
  if (!['admin', 'supervisor', 'trainer'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const { id } = await params;

    if (auth.user.role === 'trainer') {
      const sessionRes = await fetch(
        `${SUPABASE_URL}/rest/v1/sessions?id=eq.${id}&select=group_id`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        if (sessionData.length) {
          const groupIds = await getTrainerGroupIds(auth.user.id);
          if (!groupIds.includes(sessionData[0].group_id)) {
            return NextResponse.json({ error: 'غير مصرح لهذه الجلسة' }, { status: 403 });
          }
        }
      }
    }

    const body = await request.json();
    const { id: _, ...updateData } = body;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/sessions?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل التعديل' }, { status: 500 });
    const session = await res.json();

    if (updateData.status === 'completed' && session[0]) {
      const s = session[0];
      autoEvaluate(id, s.group_id, auth.user.id, s.scheduled_date, s.title);
      autoLogTrainerHours(s, auth.user.id);
    }

    return NextResponse.json({ success: true, session: session[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!checkOrigin(request) || !verifyCsrfToken(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }
  if (!['admin', 'supervisor'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const res = await fetch(`${SUPABASE_URL}/rest/v1/sessions?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
