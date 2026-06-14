const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function generateQuestions() {
  const prompt = `Generate an English placement test with exactly 20 questions in JSON format. The test should determine CEFR level (A1, A2, B1, B2, C1, C2).

Return ONLY valid JSON with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "type": "grammar",
      "question": "Choose the correct answer: She ___ to school every day.",
      "options": ["go", "goes", "going", "gone"],
      "correct": 1,
      "explanation": "We use 'goes' with she/he/it (third person singular)"
    }
  ]
}

Question distribution:
- Grammar (5 questions): verb tenses, articles, prepositions, subject-verb agreement
- Vocabulary (5 questions): word meanings, synonyms, antonyms, collocations
- Reading Comprehension (3 questions): short passages with comprehension questions
- Sentence Completion (4 questions): fill in the blank with the best word
- Error Detection (3 questions): find the grammar error in a sentence

For reading comprehension, use this format:
{
  "id": 7,
  "type": "reading",
  "passage": "A short paragraph (2-3 sentences)...",
  "question": "What does the passage say about...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0,
  "explanation": "The passage states that..."
}

Make questions progressively harder (A1 at start, C2 at end). Use natural, everyday English. Return ONLY the JSON, no other text.`;

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 8000,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from Gemini');

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid JSON from Gemini');

  return JSON.parse(jsonMatch[0]);
}

export async function analyzeResults(questions, answers) {
  let correct = 0;
  let grammarCorrect = 0;
  let vocabCorrect = 0;
  let readingCorrect = 0;
  let completionCorrect = 0;
  let errorCorrect = 0;
  let grammarTotal = 0;
  let vocabTotal = 0;
  let readingTotal = 0;
  let completionTotal = 0;
  let errorTotal = 0;

  const details = [];

  for (const q of questions) {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correct;

    if (isCorrect) correct++;

    if (q.type === 'grammar') {
      grammarTotal++;
      if (isCorrect) grammarCorrect++;
    } else if (q.type === 'vocabulary') {
      vocabTotal++;
      if (isCorrect) vocabCorrect++;
    } else if (q.type === 'reading') {
      readingTotal++;
      if (isCorrect) readingCorrect++;
    } else if (q.type === 'completion') {
      completionTotal++;
      if (isCorrect) completionCorrect++;
    } else if (q.type === 'error') {
      errorTotal++;
      if (isCorrect) errorCorrect++;
    }

    details.push({
      questionId: q.id,
      question: q.question,
      userAnswer: userAnswer !== undefined ? q.options[userAnswer] : 'لم يُجب',
      correctAnswer: q.options[q.correct],
      isCorrect,
      explanation: q.explanation,
    });
  }

  const percentage = Math.round((correct / questions.length) * 100);

  let level;
  if (percentage >= 90) level = 'C2';
  else if (percentage >= 80) level = 'C1';
  else if (percentage >= 65) level = 'B2';
  else if (percentage >= 50) level = 'B1';
  else if (percentage >= 35) level = 'A2';
  else level = 'A1';

  const levelNames = {
    A1: 'مبتدئ (Beginner)',
    A2: 'أساسي (Elementary)',
    B1: 'متوسط (Intermediate)',
    B2: 'فوق متوسط (Upper-Intermediate)',
    C1: 'متقدم (Advanced)',
    C2: 'إتقان (Proficiency)',
  };

  const trackMapping = {
    A1: 'a',
    A2: 'a',
    B1: 'b',
    B2: 'b',
    C1: 'c',
    C2: 'c',
  };

  const strengths = [];
  const weaknesses = [];

  if (grammarTotal > 0 && grammarCorrect / grammarTotal >= 0.7) strengths.push('القواعد الإنجليزية');
  else if (grammarTotal > 0) weaknesses.push('القواعد الإنجليزية');

  if (vocabTotal > 0 && vocabCorrect / vocabTotal >= 0.7) strengths.push('المفردات الإنجليزية');
  else if (vocabTotal > 0) weaknesses.push('المفردات الإنجليزية');

  if (readingTotal > 0 && readingCorrect / readingTotal >= 0.7) strengths.push('فهم المقروء');
  else if (readingTotal > 0) weaknesses.push('فهم المقروء');

  if (completionTotal > 0 && completionCorrect / completionTotal >= 0.7) strengths.push('ملء الفراغات');
  else if (completionTotal > 0) weaknesses.push('ملء الفراغات');

  if (errorTotal > 0 && errorCorrect / errorTotal >= 0.7) strengths.push('اكتشاف الأخطاء');
  else if (errorTotal > 0) weaknesses.push('اكتشاف الأخطاء');

  return {
    level,
    levelName: levelNames[level],
    percentage,
    correct,
    total: questions.length,
    track: trackMapping[level],
    strengths,
    weaknesses,
    details,
    breakdown: {
      grammar: { correct: grammarCorrect, total: grammarTotal },
      vocabulary: { correct: vocabCorrect, total: vocabTotal },
      reading: { correct: readingCorrect, total: readingTotal },
      completion: { correct: completionCorrect, total: completionTotal },
      error: { correct: errorCorrect, total: errorTotal },
    },
  };
}
