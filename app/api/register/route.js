import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, birth_date, phone, whatsapp, grade, country, governorate, city, track, plan } = body;

    if (!name || !birth_date || !phone || !whatsapp || !grade || !track || !plan) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب أن تكون مكتملة' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name,
        birth_date,
        phone,
        whatsapp,
        grade,
        country: country || null,
        governorate: governorate || null,
        city: city || null,
        track,
        plan,
        status: 'pending',
        created_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase error:', response.status, errorText);
      return NextResponse.json(
        { error: 'فشل حفظ البيانات' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '✅ تم تسجيل الطالب بنجاح! سيتم التواصل معك لتحديد موعد المقابلة.',
    });
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'خطأ داخلي في الخادم' },
      { status: 500 }
    );
  }
}
