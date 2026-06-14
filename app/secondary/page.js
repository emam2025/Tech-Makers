'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const GRADES = [
  { v: 'first_secondary', l: 'الصف الأول الثانوي' },
  { v: 'second_secondary', l: 'الصف الثاني الثانوي' },
  { v: 'third_secondary', l: 'الصف الثالث الثانوي' },
];

const GOVS = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية',
  'الغربية', 'القليوبية', 'المنوفية', 'البحيرة', 'كفر الشيخ',
  'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء',
  'جنوب سيناء', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
  'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'الوادي الجديد',
  'مطروح', 'البحر الأحمر', 'حلوان', '6 أكتوبر',
];

export default function SecondaryPage() {
  const [form, setForm] = useState({
    firstName: '', fatherName: '', familyName: '',
    school: '', grade: '', governorate: '', city: '',
    studyMode: '', phone: '', whatsapp: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function validate() {
    const errs = {};
    if (!form.firstName || form.firstName.length < 2) errs.firstName = 'الاسم الأول مطلوب';
    if (!form.fatherName || form.fatherName.length < 2) errs.fatherName = 'اسم الأب مطلوب';
    if (!form.familyName || form.familyName.length < 2) errs.familyName = 'اسم العائلة مطلوب';
    if (!form.school || form.school.length < 3) errs.school = 'اسم المدرسة مطلوب';
    if (!form.grade) errs.grade = 'اختر الصف الدراسي';
    if (!form.governorate) errs.governorate = 'اختر المحافظة';
    if (!form.studyMode) errs.studyMode = 'اختر طريقة الدراسة';
    if (!/^01[0-9]{9}$/.test(form.phone)) errs.phone = 'رقم التليفون غير صحيح';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const fullName = `${form.firstName} ${form.fatherName} ${form.familyName}`;
    const data = {
      name: fullName,
      school: form.school,
      grade: GRADES.find(g => g.v === form.grade)?.l || form.grade,
      governorate: form.governorate,
      city: form.city,
      study_mode: form.studyMode,
      phone: form.phone,
      whatsapp: form.whatsapp || form.phone,
      track: 'secondary',
    };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setDone(true);
      } else {
        setErrors({ _form: json.error || 'حدث خطأ، حاول مرة أخرى' });
      }
    } catch {
      setErrors({ _form: 'فشل الاتصال بالخادم' });
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setDone(false);
    setForm({ firstName: '', fatherName: '', familyName: '', school: '', grade: '', governorate: '', city: '', studyMode: '', phone: '', whatsapp: '' });
    setErrors({});
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'} text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors`;

  return (
    <>
      {/* HERO */}
      <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a3fa0 0%, #4169e1 50%, #6b8aff 100%)' }}>
        <div className="absolute inset-0">
          <Image src="/secondary-banner.png" alt="" fill priority className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#1a3fa0]/95 via-[#4169e1]/85 to-[#6b8aff]/80" />
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </Link>
            <span className="text-white/60 text-sm">العودة للصفحة الرئيسية</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <span className="material-symbols-outlined text-white text-3xl">code</span>
            </div>
            <div>
              <span className="text-sm text-[#f7be1d] bg-[#f7be1d]/20 px-3 py-1 rounded-full inline-block mb-1 border border-[#f7be1d]/30 font-bold">
                كورس برمجة شامل — الصف الثالث الثانوي
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                اتقن لغة المستقبل
              </h1>
              <p className="text-white/80 text-lg mt-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                كورس برمجة ثانوية عامة شامل — يتوافق مع المنهج الوطني المصري
              </p>
            </div>
          </div>
          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-3xl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            دورة برمجة متكاملة لطلاب الثانوية العامة (الصف الثالث الثانوي) تتوافق مع المنهج الوطني المصري. يحصل المتدربون الناجحون على شهادة معترف بها دوليًا تفتح أمامهم فرصًا وظيفية واسعة.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/20">
              <span className="material-symbols-outlined text-lg">verified</span>
              اعتماد رسمي من الوزارة
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/20">
              <span className="material-symbols-outlined text-lg">workspace_premium</span>
              شهادة معتمدة دوليًا
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/20">
              <span className="material-symbols-outlined text-lg">computer</span>
              منصة QUREO اليابانية
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/20">
              <span className="material-symbols-outlined text-lg">co_present</span>
              مدربون معتمدون
            </div>
          </div>
          <a href="#register" className="inline-flex items-center gap-3 bg-[#f7be1d] text-[#1a3fa0] px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined">app_registration</span>
            سجّل الآن
          </a>
        </div>
      </section>

      {/* COURSE HIGHLIGHTS */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-primary/20">
              مميزات الدورة
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              ليه تختار كورسنا؟
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
              دورة برمجة متكاملة تجمع بين المنهج الرسمي والتطبيق العملي
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              { icon: 'verified', title: 'اعتماد رسمي', desc: 'يعتمد كورسنا على منهج وزارة التربية والتعليم الجديد في البرمجة والذكاء الاصطناعي', color: '#4169e1' },
              { icon: 'devices', title: 'محتوى تفاعلي', desc: 'دروس عملية وتطبيقية عبر منصة QUREO اليابانية المتخصصة، تنمي مهارات التفكير المنطقي والإبداع', color: '#fd761a' },
              { icon: 'workspace_premium', title: 'شهادة معتمدة دوليًا', desc: 'يحصل المتدربون الناجحون على شهادة معترف بها دوليًا تفتح أمامهم فرصًا وظيفية واسعة', color: '#f7be1d' },
              { icon: 'rocket_launch', title: 'تهيئة للمستقبل', desc: 'تطوير مهارات تكنولوجية ومعرفية تتماشى مع متطلبات سوق العمل الرقمي الحديث', color: '#e74c3c' },
              { icon: 'co_present', title: 'مدربون معتمدون', desc: 'نخبة من معلمي الحاسب الآلي ذوي الخبرة والإلمام الكامل بالمنهج الرسمي', color: '#2ecc71' },
              { icon: 'psychology', title: 'تفكير نقدي', desc: 'تنمية مهارات التحليل والتفكير المنطقي وحل المشكلات المعقدة', color: '#9b59b6' },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${item.color}15` }}>
                  <span className="material-symbols-outlined text-2xl" style={{ color: item.color }}>{item.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* EDUCATIONAL OBJECTIVES */}
          <div className="text-center mb-12">
            <span className="inline-block bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-secondary/20">
              الأهداف التعليمية
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              ماذا سيتعلم الطالب؟
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg mb-8" style={{ fontFamily: 'Cairo, sans-serif' }}>
              يركز المنهج على الكفايات التقنية والرقمية الحديثة، مثل تحليل المعلومات، تصميم الحلول، واستخدام أدوات البرمجة على نحو إبداعي
            </p>
          </div>

          {/* Learning Path */}
          <div className="relative mb-16">
            <div className="absolute right-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-tertiary hidden md:block" />

            {[
              {
                level: 'البرمجة',
                title: 'كتابة الخوارزميات والبرمجة',
                icon: 'code',
                color: '#4169e1',
                description: 'عند تناول وحدة البرمجة يقوم الطالب بكتابة الخوارزميات البسيطة وتنفيذها (تنمية مهارة التفكير الخوارزمي).',
                topics: ['كتابة الخوارزميات البسيطة', 'تنفيذ الخوارزميات', 'تنمية التفكير الخوارزمي', 'تطبيق عملي على منصة QUREO'],
              },
              {
                level: 'الذكاء الاصطناعي',
                title: 'مقدمة في الذكاء الاصطناعي التوليدي',
                icon: 'smart_toy',
                color: '#fd761a',
                description: 'يكتسب الطالب فهماً أساسياً للذكاء الاصطناعي التوليدي ومدى تطبيقاته المستقبلية.',
                topics: ['مفهوم الذكاء الاصطناعي التوليدي', 'تطبيقاته المستقبلية', 'فهم آليات العمل', 'مشاريع تطبيقية'],
              },
              {
                level: 'تحليل المعلومات',
                title: 'الكفايات التقنية والرقمية الحديثة',
                icon: 'analytics',
                color: '#2ecc71',
                description: 'يركز المنهج على تحليل المعلومات، تصميم الحلول، واستخدام أدوات البرمجة على نحو إبداعي.',
                topics: ['تحليل المعلومات', 'تصميم الحلول', 'استخدام أدوات البرمجة', 'التفكير الإبداعي'],
              },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 mb-8 md:mr-16">
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 z-10" style={{ background: `${step.color}20`, border: `2px solid ${step.color}` }}>
                    <span className="material-symbols-outlined text-2xl" style={{ color: step.color }}>{step.icon}</span>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${step.color}15`, color: step.color }}>{step.level}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>{step.description}</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {step.topics.map((topic, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="material-symbols-outlined text-sm" style={{ color: step.color }}>check_circle</span>
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Exam Distribution */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 md:p-10 border border-primary/10 mb-16">
            <div className="text-center mb-8">
              <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-primary/20">
                توزيع الامتحان
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                مستويات الذكاء المعرفي في امتحان الفصل الدراسي الثاني
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
                يعكس تركيز المنهج على حل المشكلات العملية بدرجة أعلى
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'تذكر', percent: 10, color: '#4169e1', icon: 'memory' },
                { label: 'فهم', percent: 25, color: '#2ecc71', icon: 'lightbulb' },
                { label: 'تطبيق', percent: 30, color: '#fd761a', icon: 'build' },
                { label: 'حل مشكلات', percent: 35, color: '#e74c3c', icon: 'psychology' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 text-center border border-gray-100">
                  <span className="material-symbols-outlined text-3xl mb-3 block" style={{ color: item.color }}>{item.icon}</span>
                  <div className="text-3xl font-bold mb-1" style={{ color: item.color }}>{item.percent}%</div>
                  <div className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex gap-1 h-4 rounded-full overflow-hidden">
                <div style={{ width: '10%', background: '#4169e1' }} />
                <div style={{ width: '25%', background: '#2ecc71' }} />
                <div style={{ width: '30%', background: '#fd761a' }} />
                <div style={{ width: '35%', background: '#e74c3c' }} />
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: '#4169e1' }} /> تذكر 10%</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: '#2ecc71' }} /> فهم 25%</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: '#fd761a' }} /> تطبيق 30%</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: '#e74c3c' }} /> حل مشكلات 35%</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: '500+', label: 'طالب مسجل', icon: 'school' },
              { num: '95%', label: 'نسبة النجاح', icon: 'emoji_events' },
              { num: '100%', label: 'متوافق مع المنهج', icon: 'verified' },
              { num: '15+', label: 'مدرب متخصص', icon: 'co_present' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-gradient-to-br from-primary/5 to-white rounded-2xl border border-primary/10">
                <span className="material-symbols-outlined text-primary text-3xl mb-2 block">{stat.icon}</span>
                <div className="text-2xl font-bold text-primary mb-1">{stat.num}</div>
                <div className="text-sm text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section id="register" className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-primary/20">
              سجّل الآن
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              تسجيل بيانات الطالب
            </h2>
            <p className="text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
              املأ البيانات التالية وسنتواصل معك قريباً لتأكيد التسجيل وتفاصيل الدورة
            </p>
          </div>

          {done ? (
            <div className="bg-white rounded-2xl p-8 border border-green-200 text-center shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>تم التسجيل بنجاح!</h3>
              <p className="text-gray-600 mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
                شكراً لك! سنتواصل معك خلال 24 ساعة لتأكيد التسجيل وتفاصيل الدورة.
              </p>
              <button onClick={resetForm} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors cursor-pointer">
                تسجيل طالب آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
              {errors._form && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {errors._form}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الثلاثي *</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input type="text" placeholder="الاسم الأول" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className={inputClass('firstName')} />
                    {errors.firstName && <span className="text-red-500 text-xs mt-1 block">{errors.firstName}</span>}
                  </div>
                  <div>
                    <input type="text" placeholder="اسم الأب" value={form.fatherName} onChange={e => setForm({...form, fatherName: e.target.value})} className={inputClass('fatherName')} />
                    {errors.fatherName && <span className="text-red-500 text-xs mt-1 block">{errors.fatherName}</span>}
                  </div>
                  <div>
                    <input type="text" placeholder="العائلة" value={form.familyName} onChange={e => setForm({...form, familyName: e.target.value})} className={inputClass('familyName')} />
                    {errors.familyName && <span className="text-red-500 text-xs mt-1 block">{errors.familyName}</span>}
                  </div>
                </div>
              </div>

              {/* School */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">المدرسة *</label>
                <input type="text" placeholder="اسم المدرسة" value={form.school} onChange={e => setForm({...form, school: e.target.value})} className={inputClass('school')} />
                {errors.school && <span className="text-red-500 text-xs mt-1 block">{errors.school}</span>}
              </div>

              {/* Grade */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الصف الدراسي *</label>
                <select value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} className={inputClass('grade')}>
                  <option value="">اختر الصف</option>
                  {GRADES.map(g => <option key={g.v} value={g.v}>{g.l}</option>)}
                </select>
                {errors.grade && <span className="text-red-500 text-xs mt-1 block">{errors.grade}</span>}
              </div>

              {/* Governorate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">المحافظة *</label>
                  <select value={form.governorate} onChange={e => setForm({...form, governorate: e.target.value})} className={inputClass('governorate')}>
                    <option value="">اختر المحافظة</option>
                    {GOVS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.governorate && <span className="text-red-500 text-xs mt-1 block">{errors.governorate}</span>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">المنطقة / المدينة</label>
                  <input type="text" placeholder="المنطقة" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className={inputClass('city')} />
                </div>
              </div>

              {/* Study Mode */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">طريقة الدراسة *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { v: 'online', label: 'أونلاين', icon: 'computer', desc: 'عبر الإنترنت' },
                    { v: 'offline', label: 'أوفلاين', icon: 'meeting_room', desc: 'في الفصل' },
                  ].map(mode => (
                    <button
                      key={mode.v}
                      type="button"
                      onClick={() => setForm({...form, studyMode: mode.v})}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        form.studyMode === mode.v
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-2xl ${form.studyMode === mode.v ? 'text-primary' : 'text-gray-400'}`}>{mode.icon}</span>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${form.studyMode === mode.v ? 'text-primary' : 'text-gray-700'}`}>{mode.label}</div>
                        <div className="text-xs text-gray-500">{mode.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.studyMode && <span className="text-red-500 text-xs mt-1 block">{errors.studyMode}</span>}
              </div>

              {/* Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">رقم التليفون *</label>
                  <input type="tel" placeholder="01012345678" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputClass('phone')} dir="ltr" />
                  {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">رقم الواتساب</label>
                  <input type="tel" placeholder="01012345678" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className={inputClass('whatsapp')} dir="ltr" />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#f7be1d] text-[#1a3fa0] py-3.5 rounded-xl font-bold text-lg hover:bg-[#e6a80e] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#f7be1d]/20"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    جاري التسجيل...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">how_to_reg</span>
                    تسجيل
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
