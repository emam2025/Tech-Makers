import { NextResponse } from 'next/server';
import { verifyAuth, getTokenFromCookie } from '../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    if (student_id) {
      const [progressRes, eventsRes] = await Promise.all([
        fetch(
          `${SUPABASE_URL}/rest/v1/student_progress?select=*&student_id=eq.${student_id}`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        ),
        fetch(
          `${SUPABASE_URL}/rest/v1/progress_events?select=*&student_id=eq.${student_id}&order=created_at.desc&limit=${pageSize}&offset=${from}`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' } }
        ),
      ]);
      const progress = progressRes.ok ? await progressRes.json() : [];
      const events = eventsRes.ok ? await eventsRes.json() : [];
      const total = parseInt(eventsRes.headers.get('content-range')?.split('/')[1] || events.length);
      return NextResponse.json({ progress: progress[0] || null, data: events, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
    }

    const allRes = await fetch(
      `${SUPABASE_URL}/rest/v1/student_progress?select=*,student:students_enhanced(full_name,track)&order=overall_progress.desc&limit=${pageSize}&offset=${from}`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' } }
    );
    const progress = allRes.ok ? await allRes.json() : [];
    const total = parseInt(allRes.headers.get('content-range')?.split('/')[1] || progress.length);
    return NextResponse.json({ data: progress, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
