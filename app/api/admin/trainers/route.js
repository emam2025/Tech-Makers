import { NextResponse } from 'next/server';
import { checkOrigin } from '../../../../lib/security';
import { verifyCsrfToken } from '../../../../lib/csrf';
import { verifyAuth, getTokenFromCookie } from '../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const source = searchParams.get('source') || '';
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    if (source === 'students') {
      let query = `${SUPABASE_URL}/rest/v1/students?select=id,name,email,phone,track,grade,status&order=created_at.desc&limit=${pageSize}&offset=${from}`;
      if (search) query += `&or=(name.ilike.*${search}*,email.ilike.*${search}*,phone.ilike.*${search}*)`;
      const res = await fetch(query, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
      });
      if (!res.ok) return NextResponse.json({ error: 'فشل جلب الطلاب' }, { status: 500 });
      const students = await res.json();
      const total = parseInt(res.headers.get('content-range')?.split('/')[1] || students.length);
      return NextResponse.json({ data: students, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
    }

    if (source === 'team') {
      let query = `${SUPABASE_URL}/rest/v1/team_applications?select=id,name,email,phone,form_type,qualification,university,college,major,status&order=created_at.desc&limit=${pageSize}&offset=${from}`;
      if (search) query += `&or=(name.ilike.*${search}*,email.ilike.*${search}*,phone.ilike.*${search}*)`;
      const res = await fetch(query, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
      });
      if (!res.ok) return NextResponse.json({ error: 'فشل جلب المتقدمين' }, { status: 500 });
      const team = await res.json();
      const total = parseInt(res.headers.get('content-range')?.split('/')[1] || team.length);
      return NextResponse.json({ data: team, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
    }

    let query = `${SUPABASE_URL}/rest/v1/trainers?select=*&order=created_at.desc`;
    if (search) query += `&or=(full_name.ilike.*${search}*,email.ilike.*${search}*)`;
    query += `&limit=${pageSize}&offset=${from}`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    const trainers = await res.json();
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || trainers.length);
    return NextResponse.json({ data: trainers, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!checkOrigin(request) || !verifyCsrfToken(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }
  if (!['admin', 'supervisor'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const res = await fetch(`${SUPABASE_URL}/rest/v1/trainers`, {
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
    const trainer = await res.json();
    return NextResponse.json({ success: true, trainer: trainer[0] });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
