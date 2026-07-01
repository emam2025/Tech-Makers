import { NextResponse } from 'next/server';
import { checkOrigin } from '../../../../lib/security';
import { verifyCsrfToken } from '../../../../lib/csrf';
import { verifyAuth, getTokenFromCookie } from '../../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize')) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/test_codes?select=*&order=created_at.desc&limit=${pageSize}&offset=${from}`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'count=exact',
        },
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('Supabase error:', res.status, errText);
      return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    }

    const codes = await res.json();
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || codes.length);
    return NextResponse.json({ data: codes, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    console.error('List test codes error:', err);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!checkOrigin(request) || !verifyCsrfToken(request)) {
    return NextResponse.json({ error: 'طلب غير مصرح به' }, { status: 403 });
  }
  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح — للإدارة فقط' }, { status: 403 });
  }

  try {
    const { count = 1, track, expires_days } = await request.json();

    const codes = [];
    for (let i = 0; i < Math.min(count || 1, 50); i++) {
      let code;
      let attempts = 0;
      do {
        code = generateCode();
        attempts++;
      } while (attempts < 10);

      const insertData = {
        code,
        track: track || null,
        created_by: auth.user.id,
        created_at: new Date().toISOString(),
      };

      if (expires_days) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + Number(expires_days));
        insertData.expires_at = expiresAt.toISOString();
      }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/test_codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(insertData),
      });

      if (res.ok) {
        const created = await res.json();
        codes.push(created[0]);
      } else {
        const errText = await res.text();
        console.error('Insert code error:', res.status, errText);
      }
    }

    return NextResponse.json({ success: true, codes });
  } catch (err) {
    console.error('Create test codes error:', err);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
