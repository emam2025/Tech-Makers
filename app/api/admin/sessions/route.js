import { NextResponse } from 'next/server';
import { verifyAuth, getTrainerGroupIds } from '../../../../lib/adminAuth.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const group_id = searchParams.get('group_id') || '';
    const date = searchParams.get('date') || '';

    let query = `${SUPABASE_URL}/rest/v1/sessions?select=*,group:groups(name),trainer:trainers(full_name)&order=scheduled_date.desc`;
    if (group_id) query += `&group_id=eq.${group_id}`;
    if (date) query += `&scheduled_date=eq.${date}`;

    if (auth.user.role === 'trainer') {
      const groupIds = await getTrainerGroupIds(auth.user.id);
      if (groupIds.length === 0) return NextResponse.json({ sessions: [] });
      query += `&group_id=in.(${groupIds.join(',')})`;
    }

    query += '&limit=500';

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    const sessions = await res.json();
    return NextResponse.json({ sessions });
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
    const res = await fetch(`${SUPABASE_URL}/rest/v1/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: 'فشل الإضافة', details: errText }, { status: 500 });
    }
    const session = await res.json();
    return NextResponse.json({ success: true, session: session[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
