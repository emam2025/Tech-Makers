export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, birth_date, phone, whatsapp, grade, country, governorate, city, track, plan } = req.body;

    if (!name || !birth_date || !phone || !whatsapp || !grade || !track || !plan) {
      return res.status(400).json({ error: 'جميع الحقول المطلوبة يجب أن تكون مكتملة' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
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
      return res.status(500).json({ error: 'فشل حفظ البيانات' });
    }

    return res.status(200).json({
      success: true,
      message: '✅ تم تسجيل الطالب بنجاح! سيتم التواصل معك لتحديد موعد المقابلة.',
    });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'خطأ داخلي في الخادم' });
  }
}
