import { NextResponse } from 'next/server';
import { checkOrigin } from '../../../../../lib/security';
import { verifyCsrfToken } from '../../../../../lib/csrf';
import { verifyAuth, getTokenFromCookie } from '../../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Convert attendance status to score (1-10)
function attendanceToScore(status) {
  switch (status) {
    case 'present': return 10;
    case 'late': return 7;
    case 'excused': return 5;
    case 'absent': return 1;
    default: return 5;
  }
}

// Calculate behavioral score based on attendance pattern
function calculateBehaviorScore(attendanceRecords) {
  if (!attendanceRecords.length) return 5;
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const total = attendanceRecords.length;
  
  const attendanceRate = presentCount / total;
  const punctualityRate = (presentCount + lateCount) / total;
  
  // Behavioral score based on commitment
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
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json({ error: 'معرف الجلسة مطلوب' }, { status: 400 });
    }

    // Get session details
    const sessionRes = await fetch(
      `${SUPABASE_URL}/rest/v1/sessions?id=eq.${session_id}&select=*,group:groups(id,name)`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!sessionRes.ok) return NextResponse.json({ error: 'فشل جلب الجلسة' }, { status: 500 });
    const sessions = await sessionRes.json();
    if (!sessions.length) return NextResponse.json({ error: 'الجلسة غير موجودة' }, { status: 404 });
    const session = sessions[0];

    if (!session.group_id) {
      return NextResponse.json({ error: 'الجلسة غير مرتبطة بمجموعة' }, { status: 400 });
    }

    // Get attendance records for this session
    const attRes = await fetch(
      `${SUPABASE_URL}/rest/v1/attendance?session_id=eq.${session_id}&select=*,student:students_enhanced(full_name)`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    if (!attRes.ok) return NextResponse.json({ error: 'فشل جلب سجل الحضور' }, { status: 500 });
    const attendance = await attRes.json();

    if (!attendance.length) {
      return NextResponse.json({ error: 'لا توجد سجلات حضور لهذه الجلسة' }, { status: 400 });
    }

    // Get previous attendance for behavioral calculation
    const prevAttRes = await fetch(
      `${SUPABASE_URL}/rest/v1/attendance?select=*&student_id=in.(${attendance.map(a => a.student_id).join(',')})`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const prevAttendance = prevAttRes.ok ? await prevAttRes.json() : [];

    const evaluations = [];
    const errors = [];

    for (const record of attendance) {
      try {
        // Get student's attendance history
        const studentHistory = prevAttendance.filter(a => a.student_id === record.student_id);

        // Calculate scores
        const attendanceScore = attendanceToScore(record.status);
        const behaviorScore = calculateBehaviorScore(studentHistory);
        
        // Overall score: 60% attendance + 40% behavior
        const overallScore = Math.round(((attendanceScore * 0.6) + (behaviorScore * 0.4)) * 100) / 100;

        // Check if evaluation already exists for this session
        const existingRes = await fetch(
          `${SUPABASE_URL}/rest/v1/evaluations?student_id=eq.${record.student_id}&session_id=eq.${session_id}&select=id`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        const existing = existingRes.ok ? await existingRes.json() : [];
        if (existing.length > 0) continue; // Skip if already evaluated

        const evalData = {
          student_id: record.student_id,
          evaluator_id: auth.user.id,
          group_id: session.group_id,
          session_id: session_id,
          technical_score: null,
          attendance_score: attendanceScore,
          participation_score: null,
          behavior_score: behaviorScore,
          effort_score: null,
          overall_score: overallScore,
          strengths: record.status === 'present' ? 'الالتزام بالحضور' : record.status === 'late' ? 'الحضور مع تأخر بسيط' : null,
          weaknesses: record.status === 'absent' ? 'الغياب عن الجلسة' : record.status === 'late' ? 'التأخر عن موعد الجلسة' : null,
          recommendations: record.status === 'absent' ? 'يجب مراجعة سبب الغياب والالتزام بالحضور' : null,
          general_notes: `تقييم تلقائي — جلسة "${session.title || ''}" — ${record.status === 'present' ? 'حاضر' : record.status === 'late' ? 'متأخر' : record.status === 'excused' ? 'معذور' : 'غائب'}`,
          evaluation_date: session.scheduled_date || new Date().toISOString().split('T')[0],
          evaluation_type: 'session',
        };

        const res = await fetch(`${SUPABASE_URL}/rest/v1/evaluations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: 'return=representation',
          },
          body: JSON.stringify(evalData),
        });

        if (res.ok) {
          const ev = await res.json();
          evaluations.push(ev[0]);
        } else {
          errors.push(record.student_id);
        }
      } catch {
        errors.push(record.student_id);
      }
    }

    return NextResponse.json({
      success: true,
      evaluations_created: evaluations.length,
      errors: errors.length,
      session: session.title,
    });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
