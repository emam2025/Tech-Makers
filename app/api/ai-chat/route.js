import { NextResponse } from 'next/server';
import { verifyAuth, getTokenFromCookie } from '../../../lib/auth-middleware.js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

async function getAiSettings() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/ai_settings?select=*`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) return {};
  const rows = await res.json();
  const settings = {};
  for (const row of rows) {
    settings[row.key] = row.value?.value ?? row.value;
  }
  return settings;
}

async function getStudentContext(studentId) {
  // Get student info
  const studentRes = await fetch(
    `${SUPABASE_URL}/rest/v1/students_enhanced?id=eq.${studentId}&select=*`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  const students = studentRes.ok ? await studentRes.json() : [];
  const student = students[0] || null;

  // Get student's groups
  const groupRes = await fetch(
    `${SUPABASE_URL}/rest/v1/group_students?student_id=eq.${studentId}&select=*,group:groups(id,name,track,level,program_name,trainer_id,trainer:trainers(full_name))`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  const groupStudents = groupRes.ok ? await groupRes.json() : [];
  const groups = groupStudents.map(gs => gs.group).filter(Boolean);

  // Get completed sessions for student's groups
  let completedSessions = [];
  let upcomingSessions = [];
  if (groups.length > 0) {
    const groupIds = groups.map(g => g.id).join(',');
    const sessionRes = await fetch(
      `${SUPABASE_URL}/rest/v1/sessions?group_id=in.(${groupIds})&select=id,title,scheduled_date,status,duration_minutes&order=scheduled_date.desc&limit=50`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const sessions = sessionRes.ok ? await sessionRes.json() : [];
    completedSessions = sessions.filter(s => s.status === 'completed');
    upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  }

  // Get subscription info
  const subRes = await fetch(
    `${SUPABASE_URL}/rest/v1/subscriptions?student_id=eq.${studentId}&select=*,plan:subscription_plans(name,price,duration_days)&order=created_at.desc&limit=1`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  const subscriptions = subRes.ok ? await subRes.json() : [];
  const activeSub = subscriptions[0] || null;

  // Get recent evaluations
  const evalRes = await fetch(
    `${SUPABASE_URL}/rest/v1/evaluations?student_id=eq.${studentId}&select=overall_score,evaluation_date,evaluation_type&order=evaluation_date.desc&limit=5`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  const evaluations = evalRes.ok ? await evalRes.json() : [];

  return { student, groups, completedSessions, upcomingSessions, activeSub, evaluations };
}

function buildSystemPrompt(aiSettings, studentContext) {
  const basePrompt = aiSettings.system_prompt || 'أنت مساعد تعليمي ذكي.';
  const { student, groups, completedSessions, upcomingSessions, activeSub, evaluations } = studentContext;

  const studentName = student?.full_name || 'الطالب';
  const groupNames = groups.map(g => `${g.name} (${g.program_name || g.track || ''} — المستوى: ${g.level || 'غير محدد'})`).join(', ') || 'غير مسجل في أي مجموعة';
  const completedCount = completedSessions.length;
  const completedTitles = completedSessions.slice(0, 10).map(s => s.title).join('، ') || 'لا توجد محاضرات مكتملة';
  const upcomingTitles = upcomingSessions.slice(0, 5).map(s => `${s.title} — ${new Date(s.scheduled_date).toLocaleDateString('ar-EG')}`).join('، ') || 'لا توجد محاضرات قادمة';
  const subInfo = activeSub ? `${activeSub.plan?.name || 'اشتراك نشط'} — ينتهي: ${activeSub.end_date ? new Date(activeSub.end_date).toLocaleDateString('ar-EG') : 'غير محدد'}` : 'لا يوجد اشتراك نشط';
  const avgScore = evaluations.length ? (evaluations.reduce((s, e) => s + (parseFloat(e.overall_score) || 0), 0) / evaluations.length).toFixed(1) : 'لا توجد تقييمات';

  return `${basePrompt}

═══════════════════════════════════════
معلومات الطالب الحالي:
═══════════════════════════════════════
- الاسم: ${studentName}
- البريد: ${student?.email || 'غير محدد'}
- الهاتف: ${student?.phone || 'غير محدد'}

═══════════════════════════════════════
المجموعات والبرنامج:
═══════════════════════════════════════
${groupNames}

═══════════════════════════════════════
المحاضرات المكتملة (${completedCount} محاضرة):
═══════════════════════════════════════
${completedTitles}

═══════════════════════════════════════
المحاضرات القادمة:
═══════════════════════════════════════
${upcomingTitles}

═══════════════════════════════════════
نظام الاشتراك:
═══════════════════════════════════════
${subInfo}

═══════════════════════════════════════
متوسط التقييم: ${avgScore}/10
═══════════════════════════════════════

قواعد مهمة:
1. استخدم اسم الطالب (${studentName}) في كل رد
2. شرح المفاهيم والدروس فقط — لا تحل التاسكات أو الواجبات
3. إذا سأل الطالب عن حل تاسك، شجعه على المحاولة واعرض شرح المفاهيم المتعلقة
4. اربط الشرح بالمحاضرات التي أتمها الطالب (${completedTitles})
5. إذا كان السؤال خارج نطاق البرمجة أو التعليم، اعتذر بلطف
6. رد بالعربية دائماً
7. كن ودوداً ومشجعاً
8. إذا ذكر الطالب محاضرة قادمة، أخبره بتاريخها`;
}

async function callGemini(apiKey, model, systemPrompt, messages, temperature, topP, maxTokens) {
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const res = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        temperature: temperature || 0.7,
        topP: topP || 0.9,
        maxOutputTokens: maxTokens || 2000,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from AI');
  return text;
}

export async function POST(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message?.trim()) return NextResponse.json({ error: 'الرسالة مطلوبة' }, { status: 400 });

    // Get AI settings
    const aiSettings = await getAiSettings();

    if (aiSettings.is_active === false) {
      return NextResponse.json({ error: 'مساعد الذكاء الاصطناعي معطل حالياً' }, { status: 503 });
    }

    const apiKey = aiSettings.api_key || process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'لم يتم تكوين مفتاح API' }, { status: 503 });

    // Get student context
    const studentContext = await getStudentContext(auth.user.id);

    // Build system prompt
    const systemPrompt = buildSystemPrompt(aiSettings, studentContext);

    // Build messages (history + new message)
    const messages = [
      ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message },
    ];

    // Call AI
    const model = aiSettings.model || 'gemini-2.5-flash';
    const temperature = parseFloat(aiSettings.temperature) || 0.7;
    const topP = parseFloat(aiSettings.top_p) || 0.9;
    const maxTokens = parseInt(aiSettings.max_tokens) || 2000;

    const reply = await callGemini(apiKey, model, systemPrompt, messages, temperature, topP, maxTokens);

    return NextResponse.json({ reply, studentName: studentContext.student?.full_name });
  } catch (err) {
    console.error('AI Chat error:', err);
    return NextResponse.json({ error: 'حدث خطأ في الاتصال بالمساعد الذكي' }, { status: 500 });
  }
}
