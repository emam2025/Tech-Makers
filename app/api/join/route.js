import { NextResponse } from 'next/server';
import { rateLimit, checkOrigin, sanitizePlain, validateEmail, validatePhone, validateName, validateInputLength, getClientIp } from '../../../lib/security';

const ALLOWED_FORM_TYPES = ['trainer', 'specialist', 'admin'];

export async function POST(request) {
  const ip = getClientIp(request);

  if (!rateLimit(ip, 5, 60000)) {
    return NextResponse.json(
      { error: 'تم تجاوز الحد المسموح من الطلبات، حاول بعد دقيقة' },
      { status: 429 }
    );
  }

  if (!checkOrigin(request)) {
    return NextResponse.json(
      { error: 'طلب غير مصرح به' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { formType, name, email, phone, country, specialty, experience, portfolio, bio, onlineWork, studentInteraction, gulfExperience, certificate, department } = body;

    if (!formType || !name || !email || !phone || !country || !bio || !onlineWork || !studentInteraction || !gulfExperience) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب أن تكون مكتملة' },
        { status: 400 }
      );
    }

    if (!ALLOWED_FORM_TYPES.includes(formType)) {
      return NextResponse.json({ error: 'نوع النموذج غير صحيح' }, { status: 400 });
    }

    const lengthError = validateInputLength(body);
    if (lengthError) {
      return NextResponse.json({ error: lengthError }, { status: 400 });
    }

    if (!validateName(name)) {
      return NextResponse.json({ error: 'الاسم غير صحيح' }, { status: 400 });
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صحيح' }, { status: 400 });
    }
    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'رقم الهاتف غير صحيح' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const checkRes = await fetch(
      `${supabaseUrl}/rest/v1/team_applications?email=eq.${encodeURIComponent(email)}&form_type=eq.${formType}&select=id`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: 'لقد قدمت بالفعل على هذا المنصب', field: '_form' },
          { status: 409 }
        );
      }
    }

    const dbResponse = await fetch(`${supabaseUrl}/rest/v1/team_applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        form_type: formType,
        name: sanitizePlain(name),
        email: sanitizePlain(email),
        phone: sanitizePlain(phone),
        country: sanitizePlain(country),
        specialty: specialty ? sanitizePlain(specialty) : null,
        experience: experience ? sanitizePlain(experience) : null,
        portfolio: portfolio ? sanitizePlain(portfolio) : null,
        bio: sanitizePlain(bio),
        online_work: onlineWork,
        student_interaction: studentInteraction,
        gulf_experience: gulfExperience,
        certificate: certificate ? sanitizePlain(certificate) : null,
        department: department ? sanitizePlain(department) : null,
        status: 'pending',
        created_at: new Date().toISOString(),
      }),
    });

    if (!dbResponse.ok) {
      const errorText = await dbResponse.text();
      console.error('Supabase error:', dbResponse.status, errorText);
      return NextResponse.json(
        { error: 'فشل حفظ البيانات' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'تم استلام طلبك بنجاح! سيتواصل معك فريق التوظيف قريباً.',
    });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'خطأ داخلي في الخادم' },
      { status: 500 }
    );
  }
}
