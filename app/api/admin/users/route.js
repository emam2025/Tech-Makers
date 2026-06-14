import { NextResponse } from 'next/server';

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
      const errText = await res.text();
      console.error('Supabase error:', res.status, errText);
      return NextResponse.json({ error: 'فشل جلب البيانات' }, { status: 500 });
    }

    const profiles = await res.json();
    return NextResponse.json({ users: profiles });
  } catch (err) {
    console.error('List users error:', err);
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

    if (!['admin', 'supervisor'].includes(role || 'supervisor')) {
      return NextResponse.json({ error: 'الدور غير صحيح' }, { status: 400 });
    }

    const adminToken = auth.token;

    const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name, role: role || 'supervisor' },
      }),
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      return NextResponse.json(
        { error: createData.msg || createData.error_description || 'فشل إنشاء المستخدم' },
        { status: 400 }
      );
    }

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
          full_name,
          role: role || 'supervisor',
        }),
      }
    );

    let profile = null;
    if (updateProfileRes.ok) {
      const profiles = await updateProfileRes.json();
      profile = profiles[0] || null;
    }

    // Update additional fields if supervisor
    if (profile && role === 'supervisor') {
      const extraFields = {};
      if (branch) extraFields.branch = branch;
      if (phone) extraFields.phone = phone;
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

    return NextResponse.json({ success: true, user: profile || { id: createData.id, email, full_name, role: role || 'supervisor' } });
  } catch (err) {
    console.error('Create user error:', err);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { id, role, full_name, phone, branch, supervised_groups, profile_photo, bio } = body;

    // Admin can update anything, supervisor can only update own profile
    if (auth.user.role !== 'admin' && auth.user.id !== id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    // Only admin can change roles
    if (role && auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح — للإدارة فقط' }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    }

    const updateData = {};
    if (role && auth.user.role === 'admin') {
      if (!['admin', 'supervisor'].includes(role)) {
        return NextResponse.json({ error: 'الدور غير صحيح' }, { status: 400 });
      }
      updateData.role = role;
    }
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone;
    if (branch !== undefined) updateData.branch = branch;
    if (supervised_groups !== undefined) updateData.supervised_groups = supervised_groups;
    if (profile_photo !== undefined) updateData.profile_photo = profile_photo;
    if (bio !== undefined) updateData.bio = bio;
    if (profile_completed !== undefined) updateData.profile_completed = profile_completed;

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
  } catch (err) {
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

    if (!id) {
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

    const deleteAuthRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!deleteAuthRes.ok) {
      const errText = await deleteAuthRes.text();
      console.error('Delete auth user error:', deleteAuthRes.status, errText);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete user error:', err);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}
