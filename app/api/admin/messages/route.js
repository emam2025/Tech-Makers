import { NextResponse } from 'next/server';
import { sanitizePlain, checkOrigin } from '../../../../lib/security';
import { verifyCsrfToken } from '../../../../lib/csrf';
import { verifyAuth, getTokenFromCookie } from '../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const conversation_id = searchParams.get('conversation_id') || '';
    const group_id = searchParams.get('group_id') || '';
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    if (!conversation_id) {
      let query = `${SUPABASE_URL}/rest/v1/conversations?select=*,participants:conversation_participants(*,profile:profiles(full_name,role)),group:groups(name)&order=updated_at.desc&limit=${pageSize}&offset=${from}`;
      if (group_id) query += `&group_id=eq.${group_id}`;

      const convRes = await fetch(query, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' },
      });
      const conversations = convRes.ok ? await convRes.json() : [];
      const total = parseInt(convRes.headers.get('content-range')?.split('/')[1] || conversations.length);
      return NextResponse.json({ data: conversations, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
    }

    const msgRes = await fetch(
      `${SUPABASE_URL}/rest/v1/messages?select=*,sender:profiles(full_name,role)&conversation_id=eq.${conversation_id}&order=created_at.asc&limit=${pageSize}&offset=${from}`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact' } }
    );
    const messages = msgRes.ok ? await msgRes.json() : [];
    const total = parseInt(msgRes.headers.get('content-range')?.split('/')[1] || messages.length);
    return NextResponse.json({ data: messages, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
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

  try {
    const body = await request.json();
    const { conversation_id, content, title, participant_id, group_id } = body;

    // Create new conversation
    if (conversation_id === 'new') {
      if (!title) {
        return NextResponse.json({ error: 'عنوان المحادثة مطلوب' }, { status: 400 });
      }

      const convData = {
        title: sanitizePlain(title),
        created_by: auth.user.id,
        last_message: '',
        group_id: group_id || null,
      };

      const convRes = await fetch(`${SUPABASE_URL}/rest/v1/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(convData),
      });
      if (!convRes.ok) return NextResponse.json({ error: 'فشل إنشاء المحادثة' }, { status: 500 });
      const conv = await convRes.json();
      const newConv = conv[0];

      // Add creator as participant
      await fetch(`${SUPABASE_URL}/rest/v1/conversation_participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ conversation_id: newConv.id, user_id: auth.user.id }),
      });

      // If group conversation, add all group members
      if (group_id) {
        const membersRes = await fetch(
          `${SUPABASE_URL}/rest/v1/group_students?select=student_id&group_id=eq.${group_id}`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        if (membersRes.ok) {
          const members = await membersRes.json();
          for (const m of members) {
            await fetch(`${SUPABASE_URL}/rest/v1/conversation_participants`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
              body: JSON.stringify({ conversation_id: newConv.id, user_id: m.student_id }),
            });
          }
        }

        // Also add trainer if group has one
        const groupRes = await fetch(
          `${SUPABASE_URL}/rest/v1/groups?select=trainer_id&id=eq.${group_id}`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
        );
        if (groupRes.ok) {
          const groups = await groupRes.json();
          if (groups[0]?.trainer_id) {
            await fetch(`${SUPABASE_URL}/rest/v1/conversation_participants`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
              body: JSON.stringify({ conversation_id: newConv.id, user_id: groups[0].trainer_id }),
            });
          }
        }
      } else if (participant_id) {
        await fetch(`${SUPABASE_URL}/rest/v1/conversation_participants`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify({ conversation_id: newConv.id, user_id: participant_id }),
        });
      }

      return NextResponse.json({ success: true, conversation: newConv });
    }

    // Send message to existing conversation
    if (!conversation_id || !content) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        conversation_id,
        sender_id: auth.user.id,
        content: sanitizePlain(content),
      }),
    });
    if (!res.ok) return NextResponse.json({ error: 'فشل الإرسال' }, { status: 500 });
    const message = await res.json();

    await fetch(`${SUPABASE_URL}/rest/v1/conversations?id=eq.${conversation_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      body: JSON.stringify({ last_message: sanitizePlain(content), updated_at: new Date().toISOString() }),
    });

    return NextResponse.json({ success: true, message: message[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
