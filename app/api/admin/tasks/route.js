import { NextResponse } from 'next/server';
import { sanitizePlain } from '../../../../lib/security';
import { verifyAuth, getTrainerGroupIds } from '../../../../lib/adminAuth.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const group_id = searchParams.get('group_id') || '';
    const status = searchParams.get('status') || '';

    let query = `${SUPABASE_URL}/rest/v1/tasks?select=*,group:groups(name),submission_count:task_submissions(count)&order=created_at.desc`;
    if (group_id) query += `&group_id=eq.${group_id}`;
    if (status) query += `&status=eq.${status}`;

    if (auth.user.role === 'trainer') {
      const groupIds = await getTrainerGroupIds(auth.user.id);
      if (groupIds.length === 0) return NextResponse.json({ tasks: [] });
      query += `&group_id=in.(${groupIds.join(',')})`;
    }

    query += '&limit=500';

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    const tasks = await res.json();
    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!['admin', 'supervisor', 'trainer'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 });
    }
    const allowed = {
      title: sanitizePlain(body.title),
      description: body.description ? sanitizePlain(body.description) : null,
      group_id: body.group_id || null,
      type: body.type || 'assignment',
      due_date: body.due_date || null,
      max_score: body.max_score || 100,
      status: body.status || 'draft',
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(allowed),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الإضافة' }, { status: 500 });
    const task = await res.json();
    return NextResponse.json({ success: true, task: task[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
