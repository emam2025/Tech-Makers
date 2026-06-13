import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '../../../lib/security';

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbwil60umtWD1EXqdw7S6MycmHKSgzBGHWwrGw-sKdVFXGF1yfqpWM5KBqnyOUp6rDk/exec';

export async function GET(request) {
  const ip = getClientIp(request);
  if (!rateLimit(ip, 20, 60000)) {
    return NextResponse.json({ error: 'تم تجاوز الحد المسموح' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const type = searchParams.get('type');

  if (!search || !type) {
    return NextResponse.json({ error: '参数不完整' }, { status: 400 });
  }

  if (search.length > 20) {
    return NextResponse.json({ error: 'البحث طويل جداً' }, { status: 400 });
  }

  if (!/^[A-Za-z0-9\s\-]+$/.test(search)) {
    return NextResponse.json({ error: 'characters غير مسموح بها في البحث' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(`${GOOGLE_SCRIPT_URL}?search=${encodeURIComponent(search)}&type=${encodeURIComponent(type)}`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('Upstream error ' + res.status);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    if (err.name === 'AbortError') {
      return NextResponse.json({ error: 'انتهت مهلة الاتصال' }, { status: 504 });
    }
    return NextResponse.json({ error: 'فشل الاتصال بالخادم' }, { status: 502 });
  }
}
