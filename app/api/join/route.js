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
    const {
      formType, firstName, middleName, lastName, email, phone, address, country,
      qualification, graduationYear, university, major,
      langArabic, langEnglish, langFrench, skills, photo,
      specialty, experience, department, portfolio, bio,
      onlineWork, studentInteraction, gulfExperience, certificate
    } = body;

    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

    if (!formType || !firstName || !lastName || !email || !phone || !address || !country || !qualification || !graduationYear || !university || !major || !skills) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب أن تكون مكتملة' },
        { status: 400 }
      );
    }

    if (!ALLOWED_FORM_TYPES.includes(formType)) {
      return NextResponse.json({ error: 'نوع النموذج غير صحيح' }, { status: 400 });
    }

    if (fullName.length < 5 || fullName.length > 150) {
      return NextResponse.json({ error: 'الاسم غير صحيح' }, { status: 400 });
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صحيح' }, { status: 400 });
    }
    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'رقم الهاتف غير صحيح' }, { status: 400 });
    }
    if (address.length < 5 || address.length > 200) {
      return NextResponse.json({ error: 'العنوان غير صحيح' }, { status: 400 });
    }
    if (university.length < 3 || university.length > 150) {
      return NextResponse.json({ error: 'اسم الجامعة غير صحيح' }, { status: 400 });
    }
    if (major.length < 3 || major.length > 150) {
      return NextResponse.json({ error: 'التخصص غير صحيح' }, { status: 400 });
    }
    if (skills.length < 5 || skills.length > 1000) {
      return NextResponse.json({ error: 'المهارات غير صحيحة' }, { status: 400 });
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
        name: sanitizePlain(fullName),
        first_name: sanitizePlain(firstName),
        middle_name: middleName ? sanitizePlain(middleName) : null,
        last_name: sanitizePlain(lastName),
        email: sanitizePlain(email),
        phone: sanitizePlain(phone),
        address: sanitizePlain(address),
        country: sanitizePlain(country),
        qualification: sanitizePlain(qualification),
        graduation_year: graduationYear,
        university: sanitizePlain(university),
        major: sanitizePlain(major),
        lang_arabic: langArabic || null,
        lang_english: langEnglish || null,
        lang_french: langFrench || null,
        skills: sanitizePlain(skills),
        photo_url: photo || null,
        specialty: specialty ? sanitizePlain(specialty) : null,
        experience: experience ? sanitizePlain(experience) : null,
        department: department ? sanitizePlain(department) : null,
        portfolio: portfolio ? sanitizePlain(portfolio) : null,
        bio: bio ? sanitizePlain(bio) : null,
        online_work: onlineWork || null,
        student_interaction: studentInteraction || null,
        gulf_experience: gulfExperience || null,
        certificate: certificate ? sanitizePlain(certificate) : null,
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
