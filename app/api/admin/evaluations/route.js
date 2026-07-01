import { NextResponse } from 'next/server';
import { sanitizePlain, checkOrigin } from '../../../../lib/security';
import { verifyCsrfToken } from '../../../../lib/csrf';
import { verifyAuth, getTrainerGroupIds } from '../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id') || '';
    const group_id = searchParams.get('group_id') || '';
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = `${SUPABASE_URL}/rest/v1/evaluations?select=*,student:students_enhanced(full_name),evaluator:profiles(full_name),group:groups(name)&order=evaluation_date.desc`;
    if (student_id) query += `&student_id=eq.${student_id}`;
    if (group_id) query += `&group_id=eq.${group_id}`;

    if (auth.user.role === 'trainer') {
      const groupIds = await getTrainerGroupIds(auth.user.id);
      if (groupIds.length === 0) return NextResponse.json({ data: [], total: 0, page, pageSize, totalPages: 0 });
      query += `&group_id=in.(${groupIds.join(',')})`;
    }

    query += `&limit=${pageSize}&offset=${from}`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب التقييمات' }, { status: 500 });
    const evaluations = await res.json();
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || evaluations.length);
    return NextResponse.json({ data: evaluations, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
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
  if (!['admin', 'supervisor', 'trainer'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.student_id || typeof body.student_id !== 'string') {
      return NextResponse.json({ error: 'معرف الطالب مطلوب' }, { status: 400 });
    }

    if (auth.user.role === 'trainer' && body.group_id) {
      const groupIds = await getTrainerGroupIds(auth.user.id);
      if (!groupIds.includes(body.group_id)) {
        return NextResponse.json({ error: 'غير مصرح لهذه المجموعة' }, { status: 403 });
      }
    }

    const scores = ['technical_score', 'attendance_score', 'participation_score', 'behavior_score', 'effort_score'];
    let totalScore = 0;
    let scoreCount = 0;
    for (const key of scores) {
      if (body[key] !== undefined && body[key] !== null) {
        if (typeof body[key] !== 'number' || body[key] < 1 || body[key] > 10) {
          return NextResponse.json({ error: `${key} يجب أن يكون بين 1 و 10` }, { status: 400 });
        }
        totalScore += body[key];
        scoreCount++;
      }
    }

    const overall_score = scoreCount > 0 ? Math.round((totalScore / scoreCount) * 100) / 100 : null;

    const allowed = {
      student_id: sanitizePlain(body.student_id),
      evaluator_id: auth.user.id,
      group_id: body.group_id || null,
      session_id: body.session_id || null,
      technical_score: body.technical_score || null,
      attendance_score: body.attendance_score || null,
      participation_score: body.participation_score || null,
      behavior_score: body.behavior_score || null,
      effort_score: body.effort_score || null,
      overall_score,
      strengths: body.strengths ? sanitizePlain(body.strengths) : null,
      weaknesses: body.weaknesses ? sanitizePlain(body.weaknesses) : null,
      recommendations: body.recommendations ? sanitizePlain(body.recommendations) : null,
      general_notes: body.general_notes ? sanitizePlain(body.general_notes) : null,
      evaluation_date: body.evaluation_date || new Date().toISOString().split('T')[0],
      evaluation_type: body.evaluation_type || 'periodic',
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/evaluations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(allowed),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل إضافة التقييم' }, { status: 500 });
    const evaluation = await res.json();
    return NextResponse.json({ success: true, evaluation: evaluation[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
