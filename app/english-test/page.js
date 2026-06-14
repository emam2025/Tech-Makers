'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const LEVEL_NAMES = {
  A1: 'مبتدئ (Beginner)',
  A2: 'أساسي (Elementary)',
  B1: 'متوسط (Intermediate)',
  B2: 'فوق متوسط (Upper-Intermediate)',
  C1: 'متقدم (Advanced)',
  C2: 'إتقان (Proficiency)',
};

const LEVEL_COLORS = {
  A1: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: '#3b82f6' },
  A2: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', accent: '#22c55e' },
  B1: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', accent: '#eab308' },
  B2: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', accent: '#f97316' },
  C1: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', accent: '#a855f7' },
  C2: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', accent: '#ef4444' },
};

const TRACK_NAMES = {
  a: 'Track A — Junior Tech Explorers (8–11 سنة)',
  b: 'Track B — Future AI Engineers (12–15 سنة)',
  c: 'Track C — Future Tech Engineers (16–20 سنة)',
};

const TYPE_LABELS = {
  grammar: 'قواعد',
  vocabulary: 'مفردات',
  reading: 'فهم مقروء',
  completion: 'ملء فراغ',
  error: 'اكتشاف خطأ',
};

export default function EnglishTestPage() {
  const [phase, setPhase] = useState('intro');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [showReview, setShowReview] = useState(false);

  const generateQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/english-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'فشل توليد الأسئلة');
      setQuestions(data.questions);
      setPhase('test');
      setTimeLeft(20 * 60);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء توليد الأسئلة');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (phase !== 'test') return;
    if (timeLeft <= 0) {
      handleSubmitTest();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitTest = async () => {
    if (phase === 'test' && Object.keys(answers).length < questions.length) {
      const unanswered = questions.length - Object.keys(answers).length;
      if (!confirm(`لديك ${unanswered} سؤال/أسئلة لم تُجب عليها. هل تريد التسجيل؟`)) return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/english-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze', questions, answers }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'فشل تحليل النتائج');
      setResult(data.result);
      setPhase('result');
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحليل النتائج');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResult = async () => {
    if (!name.trim() || !email.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/english-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), result }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'فشل الحفظ');
      setSaved(true);
    } catch {
      alert('حدث خطأ أثناء الحفظ، حاول مرة أخرى');
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  return (
    <>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-primary-deep to-primary text-on-primary overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-tertiary/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full mb-6">
            <span className="material-symbols-outlined text-sm">school</span>
            <span className="font-label-md text-sm">اختبار تحديد المستوى</span>
          </div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-4">
            اختبار تحديد المستوى <span className="text-tertiary">الإنجليزي</span>
          </h1>
          <p className="font-body-lg text-body-lg max-w-2xl mx-auto opacity-90 mb-8">
            اختبار شامل يحدد مستواك في اللغة الإنجليزية من A1 إلى C2، مع تحليل نقاط القوة والضعف وتوصية بالمسار المناسب
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => { setPhase('start'); }}
              disabled={loading}
              className="bg-tertiary text-on-tertiary px-10 py-4 rounded-full font-headline-lg shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'جاري التحميل...' : 'ابدأ الاختبار'}
            </button>
            <Link href="/register" className="bg-white/10 backdrop-blur-sm text-white border border-white/30 px-10 py-4 rounded-full font-headline-lg hover:bg-white/20 transition-all">
              سجّل في المسار
            </Link>
          </div>
        </div>
      </section>

      {/* START / INFO */}
      {phase === 'start' && (
        <section className="py-16 md:py-24 bg-bg-off-white">
          <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-8 md:p-12">
              <h2 className="font-headline-xl text-headline-xl text-primary mb-6 text-center">تفاصيل الاختبار</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-bg-off-white rounded-2xl p-5 text-center">
                  <span className="material-symbols-outlined text-primary text-3xl mb-2">help_outline</span>
                  <div className="font-headline-lg text-headline-lg text-primary">20</div>
                  <div className="text-on-surface-variant text-sm">سؤال</div>
                </div>
                <div className="bg-bg-off-white rounded-2xl p-5 text-center">
                  <span className="material-symbols-outlined text-secondary text-3xl mb-2">timer</span>
                  <div className="font-headline-lg text-headline-lg text-secondary">20</div>
                  <div className="text-on-surface-variant text-sm">دقيقة</div>
                </div>
                <div className="bg-bg-off-white rounded-2xl p-5 text-center">
                  <span className="material-symbols-outlined text-tertiary text-3xl mb-2">assessment</span>
                  <div className="font-headline-lg text-headline-lg text-tertiary">6</div>
                  <div className="text-on-surface-variant text-sm">مستويات (A1–C2)</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="font-headline-md text-headline-md text-primary">أقسام الاختبار:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(TYPE_LABELS).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-3 bg-bg-off-white rounded-xl p-4">
                      <span className="material-symbols-outlined text-primary">check_circle</span>
                      <span className="font-body-md text-on-surface">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-600 mt-0.5">info</span>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-amber-800 mb-1">ملاحظات مهمة:</h4>
                    <ul className="text-on-surface-variant text-sm space-y-1">
                      <li>• الاختبار يحتوي على 20 سؤال في 5 أقسام</li>
                      <li>• لديك 20 دقيقة لإكمال الاختبار</li>
                      <li>• النتيجة فورية بعد الانتهاء</li>
                      <li>• يمكنك حفظ النتيجة بالبريد الإلكتروني</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={generateQuestions}
                  disabled={loading}
                  className="bg-primary text-on-primary px-12 py-4 rounded-full font-headline-lg shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <span className="animate-spin material-symbols-outlined">progress_activity</span>
                      جاري توليد الأسئلة...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined">play_arrow</span>
                      ابدأ الاختبار الآن
                    </span>
                  )}
                </button>
                {error && (
                  <p className="mt-4 text-red-600 font-body-md">{error}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TEST */}
      {phase === 'test' && questions.length > 0 && (
        <section className="py-12 md:py-20 bg-bg-off-white min-h-[60vh]">
          <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
            {/* Timer + Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-2xl ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                  {timeLeft < 300 ? 'alarm' : 'timer'}
                </span>
                <span className={`font-headline-lg text-headline-lg ${timeLeft < 300 ? 'text-red-500' : 'text-primary'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant text-sm">{answeredCount}/{questions.length}</span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>

            {/* Question */}
            {(() => {
              const q = questions[currentQ];
              if (!q) return null;
              return (
                <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-6 md:p-10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full font-label-md text-sm">
                      {TYPE_LABELS[q.type] || q.type}
                    </span>
                    <span className="text-on-surface-variant text-sm font-bold">
                      {currentQ + 1} / {questions.length}
                    </span>
                  </div>

                  {q.passage && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
                      <p className="text-on-surface font-body-md leading-relaxed">{q.passage}</p>
                    </div>
                  )}

                  <h3 className="font-headline-md text-headline-md md:text-headline-lg text-on-surface mb-6 leading-relaxed">
                    {q.question}
                  </h3>

                  <div className="space-y-3">
                    {q.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(q.id, i)}
                        className={`w-full text-right p-4 rounded-2xl border-2 transition-all duration-200 font-body-md ${
                          answers[q.id] === i
                            ? 'border-primary bg-primary/5 text-primary font-bold'
                            : 'border-gray-200 hover:border-primary/40 bg-white text-on-surface hover:bg-primary/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            answers[q.id] === i
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-on-surface-variant'
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={() => setCurrentQ(c => Math.max(0, c - 1))}
                      disabled={currentQ === 0}
                      className="flex items-center gap-2 px-6 py-3 rounded-full text-on-surface-variant hover:bg-gray-100 transition-all disabled:opacity-30"
                    >
                      <span className="material-symbols-outlined">arrow_forward</span>
                      السابق
                    </button>
                    {currentQ < questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQ(c => c + 1)}
                        className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all"
                      >
                        التالي
                        <span className="material-symbols-outlined">arrow_back</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitTest}
                        disabled={loading}
                        className="flex items-center gap-2 bg-secondary text-on-secondary px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <span className="animate-spin material-symbols-outlined">progress_activity</span>
                            جاري التحليل...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined">check_circle</span>
                            تسجيل الاختبار
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Question Map */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
              <p className="text-on-surface-variant text-sm mb-3 font-bold">خريطة الأسئلة:</p>
              <div className="flex flex-wrap gap-2">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQ(i)}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                      currentQ === i
                        ? 'bg-primary text-white scale-110'
                        : answers[q.id] !== undefined
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border-r-4 border-red-500 rounded-xl text-red-700">
                {error}
              </div>
            )}
          </div>
        </section>
      )}

      {/* RESULT */}
      {phase === 'result' && result && (
        <section className="py-16 md:py-24 bg-bg-off-white">
          <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
            {/* Level Card */}
            <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden mb-8">
              <div className="bg-gradient-to-br from-primary-deep to-primary p-8 md:p-12 text-center">
                <p className="text-white/80 font-body-lg mb-2">مستواك في اللغة الإنجليزية</p>
                <div className="text-tertiary font-black text-8xl md:text-9xl mb-2">{result.level}</div>
                <p className="text-white font-headline-lg text-headline-lg">{LEVEL_NAMES[result.level]}</p>
              </div>
              <div className="p-8 md:p-12">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="bg-bg-off-white rounded-2xl p-4 text-center">
                    <div className="text-primary font-black text-3xl">{result.percentage}%</div>
                    <div className="text-on-surface-variant text-xs mt-1">النسبة</div>
                  </div>
                  <div className="bg-bg-off-white rounded-2xl p-4 text-center">
                    <div className="text-green-600 font-black text-3xl">{result.correct}</div>
                    <div className="text-on-surface-variant text-xs mt-1">صحيحة</div>
                  </div>
                  <div className="bg-bg-off-white rounded-2xl p-4 text-center">
                    <div className="text-red-500 font-black text-3xl">{result.total - result.correct}</div>
                    <div className="text-on-surface-variant text-xs mt-1">خاطئة</div>
                  </div>
                  <div className="bg-bg-off-white rounded-2xl p-4 text-center">
                    <div className="text-secondary font-black text-3xl">{result.total}</div>
                    <div className="text-on-surface-variant text-xs mt-1">إجمالي</div>
                  </div>
                </div>

                {/* Breakdown */}
                <h3 className="font-headline-md text-headline-md text-primary mb-4">تحليل الأداء</h3>
                <div className="space-y-3 mb-8">
                  {Object.entries(result.breakdown).map(([key, val]) => {
                    if (val.total === 0) return null;
                    const pct = Math.round((val.correct / val.total) * 100);
                    return (
                      <div key={key} className="flex items-center gap-4">
                        <span className="w-24 text-sm font-bold text-on-surface">{TYPE_LABELS[key]}</span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: pct >= 70 ? '#22c55e' : pct >= 40 ? '#eab308' : '#ef4444' }}
                          ></div>
                        </div>
                        <span className="w-16 text-sm font-bold text-on-surface-variant text-left">{val.correct}/{val.total}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                    <h4 className="font-headline-md text-headline-md text-green-700 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined">thumb_up</span>
                      نقاط القوة
                    </h4>
                    {result.strengths.length > 0 ? (
                      <ul className="space-y-2">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="flex items-center gap-2 text-green-700 text-sm">
                            <span className="material-symbols-outlined text-green-500 text-base">check</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-green-600 text-sm">استمر في التعلم!</p>
                    )}
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                    <h4 className="font-headline-md text-headline-md text-red-700 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined">lightbulb</span>
                      مجالات التحسين
                    </h4>
                    {result.weaknesses.length > 0 ? (
                      <ul className="space-y-2">
                        {result.weaknesses.map((w, i) => (
                          <li key={i} className="flex items-center gap-2 text-red-700 text-sm">
                            <span className="material-symbols-outlined text-red-500 text-base">arrow_forward</span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-red-600 text-sm">أداء ممتاز!</p>
                    )}
                  </div>
                </div>

                {/* Recommended Track */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 text-center mb-8">
                  <span className="material-symbols-outlined text-amber-600 text-4xl mb-2">route</span>
                  <h4 className="font-headline-md text-headline-md text-amber-800 mb-2">المسار المقترح لك</h4>
                  <p className="text-amber-700 font-bold text-lg">{TRACK_NAMES[result.track]}</p>
                </div>

                {/* Review Answers */}
                <button
                  onClick={() => setShowReview(!showReview)}
                  className="w-full flex items-center justify-center gap-2 bg-bg-off-white text-on-surface py-3 rounded-2xl font-bold hover:bg-gray-100 transition-all mb-4"
                >
                  <span className="material-symbols-outlined">{showReview ? 'visibility_off' : 'visibility'}</span>
                  {showReview ? 'إخفاء المراجعة' : 'مراجعة الإجابات'}
                </button>

                {showReview && (
                  <div className="space-y-4 mb-8">
                    {result.details.map((d, i) => (
                      <div key={i} className={`p-4 rounded-2xl border-2 ${d.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                        <div className="flex items-start gap-3">
                          <span className={`material-symbols-outlined mt-0.5 ${d.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                            {d.isCorrect ? 'check_circle' : 'cancel'}
                          </span>
                          <div className="flex-1">
                            <p className="font-body-md text-on-surface mb-2">{d.question}</p>
                            <div className="text-sm space-y-1">
                              <p className="text-on-surface-variant">إجابتك: <span className={`font-bold ${d.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{d.userAnswer}</span></p>
                              {!d.isCorrect && (
                                <p className="text-green-600 font-bold">الإجابة الصحيحة: {d.correctAnswer}</p>
                              )}
                              <p className="text-on-surface-variant text-xs mt-2 bg-white/50 p-2 rounded-lg">{d.explanation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Save Result */}
                {!saved ? (
                  <div className="bg-bg-off-white rounded-2xl p-6 mb-8">
                    <h4 className="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined">mail</span>
                      احصل على النتيجة بالبريد
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="الاسم"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <button
                      onClick={handleSaveResult}
                      disabled={saving || !name.trim() || !email.trim()}
                      className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {saving ? 'جاري الحفظ...' : 'حفظ النتيجة'}
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-center">
                    <span className="material-symbols-outlined text-green-500 text-4xl mb-2">check_circle</span>
                    <p className="text-green-700 font-bold">تم حفظ النتيجة وإرسالها بالبريد بنجاح!</p>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/register"
                    className="flex-1 bg-secondary text-on-secondary py-4 rounded-full font-headline-lg text-center hover:shadow-lg transition-all"
                  >
                    سجّل الآن في المسار المناسب
                  </Link>
                  <button
                    onClick={() => { setPhase('intro'); setQuestions([]); setAnswers({}); setResult(null); setCurrentQ(0); setSaved(false); setShowReview(false); setName(''); setEmail(''); }}
                    className="flex-1 bg-primary text-on-primary py-4 rounded-full font-headline-lg hover:shadow-lg transition-all"
                  >
                    أعد الاختبار
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LOADING */}
      {phase !== 'intro' && phase !== 'start' && phase !== 'test' && phase !== 'result' && (
        <section className="py-32 bg-bg-off-white text-center">
          <span className="animate-spin material-symbols-outlined text-primary text-6xl">progress_activity</span>
          <p className="mt-4 text-on-surface-variant font-body-lg">جاري التحميل...</p>
        </section>
      )}
    </>
  );
}
