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
      <section className="relative py-10 md:py-14 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a3fa0 0%, #4169e1 50%, #6b8aff 100%)' }}>
        <div className="absolute inset-0">
          <Image src="/secondary-banner.jpg" alt="" fill sizes="100vw" priority className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#1a3fa0]/60 via-[#4169e1]/50 to-[#6b8aff]/40" />
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </Link>
            <span className="text-white/60 text-sm">العودة للصفحة الرئيسية</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shrink-0">
              <span className="material-symbols-outlined text-white text-3xl">code</span>
            </div>
            <div className="min-w-0">
              <span className="text-sm text-[#f7be1d] bg-[#f7be1d]/20 px-3 py-1 rounded-full inline-block mb-1 border border-[#f7be1d]/30 font-bold max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                مسار البرمجة والذكاء الاصطناعي — الصفوف الثلاثة
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
                اتقن لغة المستقبل
              </h1>
              <p className="text-white/80 text-lg mt-1" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                مسار سنوي متدرج من تأسيس علوم الحاسب إلى البرمجة المتقدمة والمشروعات
              </p>
            </div>
          </div>
          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-3xl" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
            يبدأ من فهم المعلومات وأمنها والاتصالات والأنظمة الرقمية في الصف الأول الثانوي، ثم ينتقل إلى البرمجة العملية والذكاء الاصطناعي في الصف الثاني، وينتهي في الثالث بمراجعة متقدمة ومشروعات تطبيقية تؤهل الطالب للفهم العملي الحقيقي.
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              ليه تختار كورسنا؟
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
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
                <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* EDUCATIONAL OBJECTIVES */}
          <div className="text-center mb-12">
            <span className="inline-block bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-secondary/20">
              الأهداف التعليمية
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              ماذا سيتعلم الطالب؟
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg mb-8" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>{step.description}</p>
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
                مستويات الذكاء المعرفي في امتحان الفصل الدراسي الثاني
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
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
                  <div className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>{item.label}</div>
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
                <div className="text-sm text-gray-600" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GRADE PATHS */}
      <section className="py-16 md:py-20 px-margin-mobile md:px-margin-desktop bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-primary/20">
              المنهج الدراسي
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              اختر الصف الدراسي
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
              مسار متكامل لكل صف يشمل المنهج الرسمي، الأنشطة العملية، ومعايير التقييم
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* First Grade */}
            <Link href="/secondary/first" className="group bg-gradient-to-br from-[#4169e1]/5 to-white rounded-3xl p-8 border-2 border-[#4169e1]/20 hover:border-[#4169e1] hover:shadow-xl hover:shadow-[#4169e1]/10 transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#4169e1] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-2xl">looks_one</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#4169e1]" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>الصف الأول الثانوي</h3>
                  <p className="text-sm text-gray-500">تأسيس علوم الحاسب والتفكير البرمجي</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                فهم المعلومات وأمنها والاتصالات والأنظمة الرقمية — 8 وحدات
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-[#4169e1]/10 text-[#4169e1] px-2 py-1 rounded-full font-bold">8 وحدات</span>
                <span className="text-xs bg-[#4169e1]/10 text-[#4169e1] px-2 py-1 rounded-full font-bold">فصلان دراسيان</span>
              </div>
              <div className="space-y-2">
                {['المعلومات والبيانات', 'أمن المعلومات', 'أساسيات الحاسب', 'الشبكات والمنطق الرقمي', 'مدخل البرمجة'].map((topic, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="material-symbols-outlined text-[#4169e1] text-sm">check_circle</span>
                    {topic}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-[#4169e1] font-bold text-sm group-hover:gap-3 transition-all">
                <span>عرض المنهج التفصيلي</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </Link>

            {/* Second Grade */}
            <Link href="/secondary/second" className="group bg-gradient-to-br from-[#fd761a]/5 to-white rounded-3xl p-8 border-2 border-[#fd761a]/20 hover:border-[#fd761a] hover:shadow-xl hover:shadow-[#fd761a]/10 transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#fd761a] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-2xl">looks_two</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#fd761a]" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>الصف الثاني الثانوي</h3>
                  <p className="text-sm text-gray-500">البرمجة والتطبيقات المتقدمة</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                البرمجة العملية بالـ Python والذكاء الاصطناعي — 8 وحدات
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-[#fd761a]/10 text-[#fd761a] px-2 py-1 rounded-full font-bold">8 وحدات</span>
                <span className="text-xs bg-[#fd761a]/10 text-[#fd761a] px-2 py-1 rounded-full font-bold">فصلان دراسيان</span>
              </div>
              <div className="space-y-2">
                {['أساسيات Python', 'التحكم والتكرار', 'هياكل البيانات', 'البرمجة الكائنية OOP', 'مدخل الذكاء الاصطناعي'].map((topic, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="material-symbols-outlined text-[#fd761a] text-sm">check_circle</span>
                    {topic}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-[#fd761a] font-bold text-sm group-hover:gap-3 transition-all">
                <span>عرض المنهج التفصيلي</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </Link>

            {/* Third Grade */}
            <Link href="/secondary/third" className="group bg-gradient-to-br from-[#2ecc71]/5 to-white rounded-3xl p-8 border-2 border-[#2ecc71]/20 hover:border-[#2ecc71] hover:shadow-xl hover:shadow-[#2ecc71]/10 transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#2ecc71] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-2xl">looks_3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2ecc71]" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>الصف الثالث الثانوي</h3>
                  <p className="text-sm text-gray-500">الاحتراف والمشروعات والاستعداد الجامعي</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                مراجعة متقدمة وبناء تطبيقات ومشروعات تطبيقية — 7 وحدات
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-[#2ecc71]/10 text-[#2ecc71] px-2 py-1 rounded-full font-bold">7 وحدات</span>
                <span className="text-xs bg-[#2ecc71]/10 text-[#2ecc71] px-2 py-1 rounded-full font-bold">فصلان دراسيان</span>
              </div>
              <div className="space-y-2">
                {['مراجعة البرمجة المتقدمة', 'بناء التطبيقات', 'قواعد البيانات', 'مشروعات عملية', 'المشروع النهائي'].map((topic, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="material-symbols-outlined text-[#2ecc71] text-sm">check_circle</span>
                    {topic}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-[#2ecc71] font-bold text-sm group-hover:gap-3 transition-all">
                <span>عرض المنهج التفصيلي</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section id="register" className="py-16 md:py-20 px-margin-mobile md:px-margin-desktop" style={{ background: 'linear-gradient(135deg, #1a3fa0 0%, #4169e1 50%, #6b8aff 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-[#f7be1d] text-[#1a3fa0] px-5 py-1.5 rounded-full text-sm font-bold mb-4 shadow-lg">
              سجّل الآن — مقاعد محدودة
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              تسجيل بيانات الطالب
            </h2>
            <p className="text-white/75 text-lg" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
              املأ البيانات التالية وسنتواصل معك فوراً لتأكيد التسجيل
            </p>
          </div>

          {done ? (
            <div className="bg-white rounded-3xl p-10 text-center shadow-2xl">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>تم التسجيل بنجاح!</h3>
              <p className="text-gray-600 mb-8 text-lg" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                شكراً لك! سنتواصل معك خلال 24 ساعة لتأكيد التسجيل وتفاصيل الدورة.
              </p>
              <button onClick={resetForm} className="bg-[#1a3fa0] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a3fa0]/90 transition-colors cursor-pointer">
                تسجيل طالب آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f7be1d] via-[#fd761a] to-[#f7be1d]" />

              {errors._form && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm font-medium mb-4">
                  {errors._form}
                </div>
              )}

              {/* Name */}
              <div className="mb-5">
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
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">المدرسة *</label>
                <input type="text" placeholder="اسم المدرسة" value={form.school} onChange={e => setForm({...form, school: e.target.value})} className={inputClass('school')} />
                {errors.school && <span className="text-red-500 text-xs mt-1 block">{errors.school}</span>}
              </div>

              {/* Grade */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">الصف الدراسي *</label>
                <select value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} className={inputClass('grade')}>
                  <option value="">اختر الصف</option>
                  {GRADES.map(g => <option key={g.v} value={g.v}>{g.l}</option>)}
                </select>
                {errors.grade && <span className="text-red-500 text-xs mt-1 block">{errors.grade}</span>}
              </div>

              {/* Governorate */}
              <div className="grid grid-cols-2 gap-3 mb-5">
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
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2">طريقة الدراسة *</label>
                <div className="flex gap-3">
                  {[
                    { v: 'online', label: 'أونلاين', icon: 'computer', desc: 'عبر الإنترنت' },
                    { v: 'offline', label: 'أوفلاين', icon: 'meeting_room', desc: 'في الفصل' },
                  ].map(mode => (
                    <button
                      key={mode.v}
                      type="button"
                      onClick={() => setForm({...form, studyMode: mode.v})}
                      className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        form.studyMode === mode.v
                          ? 'border-[#1a3fa0] bg-[#1a3fa0]/5 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-2xl ${form.studyMode === mode.v ? 'text-[#1a3fa0]' : 'text-gray-400'}`}>{mode.icon}</span>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${form.studyMode === mode.v ? 'text-[#1a3fa0]' : 'text-gray-700'}`}>{mode.label}</div>
                        <div className="text-xs text-gray-500">{mode.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.studyMode && <span className="text-red-500 text-xs mt-1 block">{errors.studyMode}</span>}
              </div>

              {/* Phone */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">رقم التليفون *</label>
                  <input type="tel" placeholder="01012345678" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputClass('phone')} dir="ltr" />
                  {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone}</span>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">رقم الواتساب</label>
                  <input type="tel" placeholder="01012345678" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className={inputClass('whatsapp')} dir="ltr" />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#f7be1d] to-[#e6a80e] text-[#1a3fa0] py-4 rounded-xl font-bold text-lg hover:from-[#e6a80e] hover:to-[#d49b0c] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xl shadow-[#f7be1d]/30"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    جاري التسجيل...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">how_to_reg</span>
                    تسجيل الآن
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
