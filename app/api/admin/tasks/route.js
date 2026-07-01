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
    const group_id = searchParams.get('group_id') || '';
    const status = searchParams.get('status') || '';
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = `${SUPABASE_URL}/rest/v1/tasks?select=*,group:groups(name),submission_count:task_submissions(count)&order=created_at.desc`;
    if (group_id) query += `&group_id=eq.${group_id}`;
    if (status) query += `&status=eq.${status}`;

    if (auth.user.role === 'trainer') {
      const groupIds = await getTrainerGroupIds(auth.user.id);
      if (groupIds.length === 0) return NextResponse.json({ data: [], total: 0, page, pageSize, totalPages: 0 });
      query += `&group_id=in.(${groupIds.join(',')})`;
    }

    query += `&limit=${pageSize}&offset=${from}`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    const tasks = await res.json();
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || tasks.length);
    return NextResponse.json({ data: tasks, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
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
