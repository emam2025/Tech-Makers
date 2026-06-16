import { NextResponse } from 'next/server';
import { verifyAuth, getTrainerGroupIds } from '../../../../lib/adminAuth.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const track = searchParams.get('track') || '';

    let query = `${SUPABASE_URL}/rest/v1/groups?select=*,trainer:trainers(full_name),student_count:group_students(count)&order=created_at.desc`;
    if (search) query += `&or=(name.ilike.*${search}*)`;
    if (track) query += `&track=eq.${track}`;

    if (auth.user.role === 'trainer') {
      const groupIds = await getTrainerGroupIds(auth.user.id);
      if (groupIds.length === 0) return NextResponse.json({ groups: [] });
      query += `&id=in.(${groupIds.join(',')})`;
    }

    query += '&limit=500';

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    const groups = await res.json();
    return NextResponse.json({ groups });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!['admin', 'supervisor'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const res = await fetch(`${SUPABASE_URL}/rest/v1/groups`, {
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
    const group = await res.json();
    return NextResponse.json({ success: true, group: group[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
