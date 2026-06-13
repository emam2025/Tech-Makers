const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const TRACK_NAMES = {
  a: 'Track A — Junior Tech Explorers (8–11 سنة)',
  b: 'Track B — Future AI Engineers (12–15 سنة)',
  c: 'Track C — Future Tech Engineers (16–20 سنة)',
};

const PLAN_NAMES = {
  monthly: 'اشتراك شهري — 1200 جنيه/شهر',
  quarterly: 'اشتراك ربع سنوي — 890 جنيه/شهرياً (إجمالي 2670)',
  yearly: 'اشتراك سنوي — 690 جنيه/شهرياً (إجمالي 8280)',
};

export async function checkDuplicate(name, email) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/students?name=eq.${encodeURIComponent(name)}&email=eq.${encodeURIComponent(email)}&select=id`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );

  if (res.ok) {
    const existing = await res.json();
    return existing && existing.length > 0;
  }
  return false;
}

export async function registerStudent(data) {
  const { name, birth_date, email, phone, whatsapp, grade, country, governorate, city, track, plan } = data;

  if (!name || !birth_date || !email || !phone || !whatsapp || !grade || !track || !plan) {
    return { error: 'جميع الحقول المطلوبة يجب أن تكون مكتملة' };
  }

  const isDuplicate = await checkDuplicate(name, email);
  if (isDuplicate) {
    return { error: 'هذا الطالب مسجل مسبقاً بهذا البريد الإلكتروني', field: '_form' };
  }

  const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name,
      birth_date,
      email,
      phone,
      whatsapp,
      grade: Number(grade),
      country: country || null,
      governorate: governorate || null,
      city: city || null,
      track,
      plan,
      status: 'pending',
      created_at: new Date().toISOString(),
    }),
  });

  if (!dbRes.ok) {
    const errorText = await dbRes.text();
    console.error('Supabase error:', dbRes.status, errorText);
    return { error: 'فشل حفظ البيانات' };
  }

  return {
    success: true,
    message: '✅ تم تسجيل الطالب بنجاح! سيتم التواصل معك لتحديد موعد المقابلة.',
    trackName: TRACK_NAMES[track] || track,
    planName: PLAN_NAMES[plan] || plan,
  };
}
