import { NextResponse } from 'next/server';
import { rateLimit, checkOrigin, getClientIp } from '../../../lib/security';
import { generateQuestions, analyzeResults } from '../../../lib/gemini';

export async function POST(request) {
  const ip = getClientIp(request);

  if (!rateLimit(ip, 3, 60000)) {
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
    const { action } = body;

    console.log('English test action:', action);
    console.log('GEMINI_API_KEY set:', !!process.env.GEMINI_API_KEY);
    console.log('GEMINI_API_KEY_BACKUP set:', !!process.env.GEMINI_API_KEY_BACKUP);

    if (action === 'generate') {
      const data = await generateQuestions();
      return NextResponse.json({ success: true, questions: data.questions });
    }

    if (action === 'analyze') {
      const { questions, answers } = body;
      if (!questions || !answers) {
        return NextResponse.json(
          { error: 'بيانات غير مكتملة' },
          { status: 400 }
        );
      }
      const result = await analyzeResults(questions, answers);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json(
      { error: 'إجراء غير صالح' },
      { status: 400 }
    );
  } catch (err) {
    console.error('English test API error:', err.message, err.stack);
    return NextResponse.json(
      { error: err.message || 'حدث خطأ في الخادم، حاول مرة أخرى' },
      { status: 500 }
    );
  }
}
