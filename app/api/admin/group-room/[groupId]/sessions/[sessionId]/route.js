import { NextResponse } from 'next/server';
import { checkOrigin } from '../../../../../../../lib/security';
import { verifyCsrfToken } from '../../../../../../../lib/csrf';
import { verifyAuth, getTokenFromCookie } from '../../../../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Trainer: update lecture details, join URL, tasks, requirements, status
export async function PUT(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!checkOrigin(request) || !verifyCsrfToken(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }
  if (!['admin', 'supervisor', 'trainer'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const { groupId, sessionId } = await params;

  try {
    const body = await request.json();
    const { id: _, ...updateData } = body;

    // Validate status if provided
    if (updateData.status && !['upcoming', 'completed', 'postponed', 'cancelled'].includes(updateData.status)) {
      return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/sessions?id=eq.${sessionId}&group_id=eq.${groupId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
    const session = await res.json();
    return NextResponse.json({ success: true, session: session[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

// Admin: assign curriculum/lecture to group
export async function POST(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!['admin', 'supervisor'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const { groupId } = await params;

  try {
    const body = await request.json();

    const sessionData = {
      group_id: groupId,
      trainer_id: body.trainer_id || null,
      title: body.title || 'محاضرة جديدة',
      description: body.description || '',
      scheduled_date: body.scheduled_date || new Date().toISOString(),
      duration_minutes: body.duration_minutes || 120,
      theoretical_hours: body.theoretical_hours || 0,
      practical_hours: body.practical_hours || 0,
      requirements: body.requirements || '[]',
      tasks: body.tasks || '[]',
      projects: body.projects || '[]',
      status: 'upcoming',
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(sessionData),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الإضافة' }, { status: 500 });
    const session = await res.json();
    return NextResponse.json({ success: true, session: session[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

// Delete session
export async function DELETE(request, { params }) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!['admin', 'supervisor'].includes(auth.user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
  }

  const { sessionId } = await params;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/sessions?id=eq.${sessionId}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
