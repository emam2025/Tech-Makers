import { NextResponse } from 'next/server';
import { sanitizePlain, validateEmail, validatePhone, validateInputLength } from '../../../../lib/security';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

function getTokenFromCookie(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/sb-access-token=([^;]+)/);
  return match ? match[1] : null;
}

async function verifyAuth(request) {
  const token = getTokenFromCookie(request);
  if (!token) return { error: 'غير مصرح', status: 401 };

  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  });
  if (!userRes.ok) return { error: 'جلسة منتهية', status: 401 };

  const userData = await userRes.json();

  const profileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userData.id}&select=*`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  if (!profileRes.ok) return { error: 'الملف الشخصي غير موجود', status: 404 };

  const profiles = await profileRes.json();
  if (!profiles || profiles.length === 0) return { error: 'الملف الشخصي غير موجود', status: 404 };

  return { user: profiles[0], token };
}

export async function GET(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    }

    const profiles = await res.json();
    return NextResponse.json({ users: profiles });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح — للإدارة فقط' }, { status: 403 });
  }

  try {
    const { email, password, full_name, role, branch, phone, supervised_groups } = await request.json();

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور والاسم مطلوبان' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صالح' }, { status: 400 });
    }
    if (password.length < 6 || password.length > 128) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون بين 6 و 128 حرف' }, { status: 400 });
    }
    if (typeof full_name !== 'string' || full_name.length < 2 || full_name.length > 100) {
      return NextResponse.json({ error: 'الاسم غير صالح' }, { status: 400 });
    }
    if (phone && !validatePhone(phone)) {
      return NextResponse.json({ error: 'رقم الهاتف غير صالح' }, { status: 400 });
    }

    if (!['admin', 'supervisor'].includes(role || 'supervisor')) {
      return NextResponse.json({ error: 'الدور غير صحيح' }, { status: 400 });
    }

    const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        email: sanitizePlain(email),
        password,
        email_confirm: true,
        user_metadata: { full_name: sanitizePlain(full_name), role: role || 'supervisor' },
      }),
    });

    if (!createRes.ok) {
      return NextResponse.json({ error: 'فشل إنشاء المستخدم — تأكد من البريد الإلكتروني' }, { status: 400 });
    }

    const createData = await createRes.json();

    const updateProfileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${createData.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          full_name: sanitizePlain(full_name),
          role: role || 'supervisor',
        }),
      }
    );

    let profile = null;
    if (updateProfileRes.ok) {
      const profiles = await updateProfileRes.json();
      profile = profiles[0] || null;
    }

    if (profile && role === 'supervisor') {
      const extraFields = {};
      if (branch) extraFields.branch = sanitizePlain(branch);
      if (phone) extraFields.phone = sanitizePlain(phone);
      if (supervised_groups) extraFields.supervised_groups = supervised_groups;

      if (Object.keys(extraFields).length > 0) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/profiles?id=eq.${createData.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
            body: JSON.stringify(extraFields),
          }
        );
      }
    }

    return NextResponse.json({ success: true, user: profile || { id: createData.id, email: sanitizePlain(email), full_name: sanitizePlain(full_name), role: role || 'supervisor' } });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { id, role, full_name, phone, branch, supervised_groups, profile_photo, bio } = body;

    if (auth.user.role !== 'admin' && auth.user.id !== id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    if (role && auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح — للإدارة فقط' }, { status: 403 });
    }

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    }

    const updateData = {};
    if (role && auth.user.role === 'admin') {
      if (!['admin', 'supervisor'].includes(role)) {
        return NextResponse.json({ error: 'الدور غير صحيح' }, { status: 400 });
      }
      updateData.role = role;
    }
    if (full_name !== undefined) {
      if (typeof full_name !== 'string' || full_name.length < 2 || full_name.length > 100) {
        return NextResponse.json({ error: 'الاسم غير صالح' }, { status: 400 });
      }
      updateData.full_name = sanitizePlain(full_name);
    }
    if (phone !== undefined) {
      if (phone && !validatePhone(phone)) {
        return NextResponse.json({ error: 'رقم الهاتف غير صالح' }, { status: 400 });
      }
      updateData.phone = phone ? sanitizePlain(phone) : null;
    }
    if (branch !== undefined) updateData.branch = branch ? sanitizePlain(branch) : null;
    if (supervised_groups !== undefined) updateData.supervised_groups = supervised_groups;
    if (profile_photo !== undefined) updateData.profile_photo = profile_photo;
    if (bio !== undefined) {
      if (typeof bio === 'string' && bio.length > 2000) {
        return NextResponse.json({ error: 'السيرة الذاتية طويلة جداً' }, { status: 400 });
      }
      updateData.bio = bio ? sanitizePlain(bio) : null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
    }

    const profiles = await res.json();
    return NextResponse.json({ success: true, user: profiles[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح — للإدارة فقط' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    }

    if (id === auth.user.id) {
      return NextResponse.json({ error: 'لا يمكنك حذف حسابك الخاص' }, { status: 400 });
    }

    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${id}&select=id`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );

    if (!profileRes.ok) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const profiles = await profileRes.json();
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
