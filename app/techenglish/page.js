'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const levels = [
  {
    num: 'L1',
    title: 'Tech English Starter',
    subtitle: 'A1 Foundation',
    duration: '3 أشهر',
    color: 'blue',
    gradient: 'from-blue-400 to-blue-600',
    border: 'border-blue-100',
    hoverShadow: 'hover:shadow-[0_12px_40px_rgba(59,130,246,0.2)]',
    bgLight: 'bg-blue-50',
    textAccent: 'text-blue-500',
    tagBg: 'bg-blue-100',
    tagText: 'text-blue-600',
    dotBg: 'bg-blue-500',
    dotShadow: 'shadow-blue-500/30',
    description: 'بناء أساس لغوي بسيط يجعل الطالب قادرًا على فهم والتحدث في مواقف يومية وتقنية بسيطة.',
    topics: [
      { icon: 'record_voice_over', name: 'Speaking Confidence', items: ['تقديم النفس والحديث عن الهوايات', 'وصف الأشياء وطرح الأسئلة'] },
      { icon: 'hearing', name: 'Listening Skills', items: ['فهم المحادثات البسيطة', 'التقاط الكلمات الأساسية'] },
      { icon: 'devices', name: 'Vocabulary: Technology Basics', items: ['Computer Parts, Internet, Apps, Devices'] },
    ],
    skills: ['تقديم النفس بثقة', 'فهم محادثات قصيرة', 'كلمات تقنية أساسية', 'التعامل مع واجهات البرامج', 'بناء جمل بسيطة'],
  },
  {
    num: 'L2',
    title: 'Tech Explorer',
    subtitle: 'A2 Communication',
    duration: '3 أشهر',
    color: 'primary',
    gradient: 'from-primary to-primary-deep',
    border: 'border-primary/10',
    hoverShadow: 'hover:shadow-[0_12px_40px_rgba(65,130,225,0.2)]',
    bgLight: 'bg-primary/5',
    textAccent: 'text-primary',
    tagBg: 'bg-primary/10',
    tagText: 'text-primary',
    dotBg: 'bg-primary',
    dotShadow: 'shadow-primary/30',
    description: 'نقل الطالب من فهم الكلمات إلى التواصل الحقيقي. التعبير عن الرأي وشرح الأفكار التقنية.',
    topics: [
      { icon: 'chat', name: 'Conversation', items: ['التعبير عن الرأي وشرح فكرة', 'وصف مشكلة وطلب المساعدة'] },
      { icon: 'play_circle', name: 'Listening', items: ['فيديوهات قصيرة ومقاطع تقنية مبسطة', 'محادثات واقعية'] },
      { icon: 'code', name: 'Vocabulary: Technology', items: ['Coding, Programming, AI, Robots, Digital World'] },
    ],
    skills: ['يتحدث في مواقف يومية', 'يشرح فكرة تقنية', 'يفهم محتوى تقني مبسط', 'يزيد الثقة أثناء الكلام'],
  },
  {
    num: 'L3',
    title: 'Future Tech Communicator',
    subtitle: 'B1 Intermediate',
    duration: '3 أشهر',
    color: 'violet',
    gradient: 'from-violet-400 to-violet-600',
    border: 'border-violet-100',
    hoverShadow: 'hover:shadow-[0_12px_40px_rgba(139,92,246,0.2)]',
    bgLight: 'bg-violet-50',
    textAccent: 'text-violet-500',
    tagBg: 'bg-violet-100',
    tagText: 'text-violet-600',
    dotBg: 'bg-violet-500',
    dotShadow: 'shadow-violet-500/30',
    description: 'استخدام الإنجليزية للتعلم والتعاون في المجال التقني. العروض النقاشات والكتابة.',
    topics: [
      { icon: 'mic', name: 'Speaking', items: ['Presentations & Discussions', 'Team Communication'] },
      { icon: 'edit_note', name: 'Writing', items: ['كتابة وصف مشروع وأفكار ورسائل'] },
      { icon: 'smart_toy', name: 'Technology Topics', items: ['AI, Cybersecurity, Web Dev, Future Jobs'] },
    ],
    skills: ['يتحدث بطلاقة أفضل', 'يشرح مشاريع تقنية', 'يفهم المحتوى التعليمي الإنجليزي', 'يشارك في نقاشات بسيطة'],
  },
  {
    num: 'L4',
    title: 'Tech Professional',
    subtitle: 'B2 Advanced Communication',
    duration: '3 أشهر + مشروع نهائي',
    color: 'amber',
    gradient: 'from-amber-400 to-orange-500',
    border: 'border-amber-100',
    hoverShadow: 'hover:shadow-[0_12px_40px_rgba(245,158,11,0.2)]',
    bgLight: 'bg-amber-50',
    textAccent: 'text-amber-600',
    tagBg: 'bg-amber-100',
    tagText: 'text-amber-600',
    dotBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    dotShadow: 'shadow-amber-500/30',
    description: 'تجهيز الطالب لاستخدام الإنجليزية في الدراسة والمستقبل التقني. المهارات المهنية والمشاريع.',
    topics: [
      { icon: 'record_voice_over', name: 'Advanced Speaking', items: ['Presentations, Problem Solving, Debates'] },
      { icon: 'work', name: 'Professional English', items: ['كتابة CV، Interview Skills، Email Communication'] },
      { icon: 'precision_manufacturing', name: 'AI & Technology English', items: ['قراءة مقالات تقنية وفهم أدوات الذكاء الاصطناعي'] },
    ],
    skills: ['يتحدث بثقة', 'يتعلم من مصادر أجنبية', 'يفهم مصطلحات البرمجة والـ AI', 'يقدم أفكاره ومشاريعه بالإنجليزية', 'مشروع نهائي'],
  },
];

function LevelCard({ level, isOpen, onToggle, index }) {
  return (
    <div className="relative flex gap-4 md:gap-6 items-start">
      {/* Timeline */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${level.gradient} rounded-full flex items-center justify-center shadow-lg ${level.dotShadow} z-10`}>
          <span className="text-white font-bold text-xs md:text-sm">{level.num}</span>
        </div>
        {index < 3 && <div className="w-0.5 h-full min-h-[60px] bg-gradient-to-b from-gray-200 to-gray-100" />}
      </div>

      {/* Card */}
      <div
        className={`flex-1 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border ${level.border} transition-all duration-300 cursor-pointer overflow-hidden ${isOpen ? level.hoverShadow : 'hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)]'}`}
        onClick={onToggle}
      >
        <div className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline-md md:text-headline-lg text-primary-deep">{level.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold ${level.tagText} ${level.tagBg} px-2 py-0.5 rounded-full`}>{level.subtitle}</span>
                <span className="text-xs text-on-surface-variant">{level.duration}</span>
              </div>
            </div>
            <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </div>

          {/* Expandable */}
          <div className={`transition-all duration-400 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
            <p className="text-on-surface-variant text-sm mb-3">{level.description}</p>

            <div className="space-y-2">
              {level.topics.map((topic, i) => (
                <div key={i} className={`${level.bgLight} rounded-xl p-3`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`material-symbols-outlined ${level.textAccent} text-base`}>{topic.icon}</span>
                    <span className="font-bold text-sm text-primary-deep">{topic.name}</span>
                  </div>
                  <ul className="text-xs text-on-surface-variant space-y-0.5">
                    {topic.items.map((item, j) => <li key={j}>• {item}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className={`text-xs font-bold ${level.tagText} mb-1.5`}>المهارات المكتسبة:</p>
              <div className="flex flex-wrap gap-1.5">
                {level.skills.map((skill, i) => (
                  <span key={i} className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TechEnglishPage() {
  const [openLevel, setOpenLevel] = useState(null);

  const toggleLevel = (index) => {
    setOpenLevel(openLevel === index ? null : index);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative py-16 md:py-24 px-margin-mobile md:px-margin-desktop overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/english-banner-new.jpg" 
            alt="" 
            width={500}
            height={300}
            priority
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-auto object-contain opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/90 via-primary/85 to-primary-light/80"></div>
        </div>
        <div className="max-w-container-max mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/#why" className="text-white/70 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </Link>
            <span className="text-white/60 text-sm">العودة للمميزات الإضافية</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <span className="material-symbols-outlined text-white text-3xl">translate</span>
            </div>
            <div>
              <span className="font-label-sm text-sm text-tertiary bg-tertiary/20 px-3 py-1 rounded-full inline-block mb-1 border border-tertiary/30">برنامج متكامل</span>
              <h1 className="font-headline-xl text-headline-lg md:text-headline-xl text-white">Tech English — اللغة الإنجليزية التكنولوجية</h1>
            </div>
          </div>

          <p className="text-white/80 font-body-lg text-body-lg leading-relaxed mb-8 max-w-3xl">
            Tech English — لغة المستقبل لأطفال المستقبل. لا تتعلم الإنجليزية لكي تنجح في اختبار...
            بل لكي تدخل عالم التكنولوجيا بثقة.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/20">
              <span className="material-symbols-outlined text-lg">schedule</span>
              12 شهر
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/20">
              <span className="material-symbols-outlined text-lg">school</span>
              4 مستويات
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/20">
              <span className="material-symbols-outlined text-lg">trending_up</span>
              A1 → B2
            </div>
            <div className="flex items-center gap-2 bg-tertiary/30 backdrop-blur-sm text-tertiary px-4 py-2 rounded-xl text-sm font-bold border border-tertiary/40">
              <span className="material-symbols-outlined text-lg">star</span>
              برنامج حصري
            </div>
          </div>

          <Link href="/register?track=techenglish" className="inline-flex items-center gap-3 bg-tertiary text-on-tertiary px-10 py-4 rounded-full font-headline-lg shadow-xl hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined">app_registration</span>
            سجّل الآن
          </Link>
        </div>
      </section>

      {/* QUICK CARD */}
      <section className="py-12 px-margin-mobile md:px-margin-desktop bg-white">
        <div className="max-w-container-max mx-auto">
          <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-32 p-8 md:p-12 border border-primary/10 shadow-[0_8px_32px_rgba(65,105,225,0.08)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-primary rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">auto_stories</span>
              </div>
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary">Tech English — اللغة الإنجليزية التكنولوجية</h2>
                <p className="text-on-surface-variant text-sm">English for Future Technology</p>
              </div>
            </div>
            <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
              برنامج متكامل لمدة 12 شهر يُجهّز الطالب لاستخدام الإنجليزية في عالم التكنولوجيا. 4 مستويات متدرجة من A1 إلى B2، مع تركيز على المحادثة، المفردات التقنية، والمهارات المهنية.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 text-center border border-primary/10">
                <span className="material-symbols-outlined text-primary text-2xl mb-2 block">schedule</span>
                <span className="text-on-surface font-bold text-sm block">12 شهر</span>
                <span className="text-on-surface-variant text-xs">المدة الإجمالية</span>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-blue-200">
                <span className="material-symbols-outlined text-blue-500 text-2xl mb-2 block">group</span>
                <span className="text-on-surface font-bold text-sm block">جميع الأعمار</span>
                <span className="text-on-surface-variant text-xs">من 8 سنوات فما فوق</span>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-tertiary/10">
                <span className="material-symbols-outlined text-tertiary text-2xl mb-2 block">trending_up</span>
                <span className="text-on-surface font-bold text-sm block">4 مستويات</span>
                <span className="text-on-surface-variant text-xs">A1 → B2</span>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-secondary/10">
                <span className="material-symbols-outlined text-secondary text-2xl mb-2 block">translate</span>
                <span className="text-on-surface font-bold text-sm block">شامل</span>
                <span className="text-on-surface-variant text-xs">محادثة + قراءة + كتابة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY - ACCORDION */}
      <section className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop bg-bg-off-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary px-5 py-2 rounded-full font-label-md mb-4 border border-primary/20">
              <span className="material-symbols-outlined text-sm align-middle">route</span> رحلة التعلم
            </span>
            <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-primary mb-3">Tech English Journey</h2>
            <p className="text-on-surface-variant font-body-lg">اضغط على أي مستوى لعرض التفاصيل</p>
          </div>

          <div className="space-y-6">
            {levels.map((level, index) => (
              <LevelCard
                key={index}
                level={level}
                index={index}
                isOpen={openLevel === index}
                onToggle={() => toggleLevel(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop bg-gradient-to-br from-primary-deep to-primary">
        <div className="max-w-container-max mx-auto text-center">
          <h2 className="font-headline-xl text-headline-lg md:text-headline-xl text-white mb-4">ابدأ رحلتك في Tech English</h2>
          <p className="text-white/80 font-body-lg max-w-2xl mx-auto mb-8">
            سجّل الآن واحصل على مستوى مجاني تقييمي لتحديد مستواك الحالي
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register?track=techenglish" className="bg-tertiary text-on-tertiary px-10 py-4 rounded-full font-headline-lg shadow-xl hover:scale-105 active:scale-95 transition-all">
              سجّل في Tech English
            </Link>
            <Link href="/english-test" className="bg-white/15 backdrop-blur-sm text-white border border-white/30 px-10 py-4 rounded-full font-headline-lg hover:bg-white/25 transition-all">
              اختبر مستواك مجاناً
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
