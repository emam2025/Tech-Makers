'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/* ──────────────────────── TRACK DATA ──────────────────────── */

const trackData = {
  a: {
    id: 'a',
    title: 'Junior Tech Explorers',
    subtitle: 'مسار مستكشفو التقنية الصغار',
    age: '8–11 سنة',
    icon: 'child_care',
    color: 'secondary',
    description:
      'في هذه المرحلة لا نركز فقط على تعليم الطفل البرمجة، بل على بناء علاقة إيجابية مع التكنولوجيا. هدمنا تحويل الطفل من مستخدم للألعاب والمحتوى الرقمي إلى طفل قادر على التفكير، الإبداع، وصناعة أفكاره باستخدام التكنولوجيا.',
    objectives: [
      { icon: '🎨', text: 'التعلم البصري' },
      { icon: '🎮', text: 'الأنشطة التفاعلية' },
      { icon: '🧩', text: 'حل المشكلات' },
      { icon: '🚀', text: 'التعلم بالمشاريع' },
    ],
    years: [
      {
        title: 'السنة الأولى',
        subtitle: 'رحلة الاكتشاف',
        description: 'مرحلة بناء علاقة الطفل الإيجابية مع التكنولوجيا — من مستخدم إلى صانع.',
        levels: [
          {
            id: 1,
            title: 'Creative Coding Foundations',
            titleAr: 'أساسيات البرمجة الإبداعية',
            description: 'بناء أساس التفكير البرمجي وإزالة الخوف من البرمجة.',
            topics: ['ما هي البرمجة؟', 'كيف تفكر الأجهزة؟', 'مفهوم الأوامر Instructions', 'ترتيب الخطوات', 'حل المشكلات بطريقة منظمة'],
            content: ['الحركة والتحكم', 'الأحداث Events', 'التكرار Loops', 'الشروط Conditions', 'المتغيرات Variables', 'التفاعل بين العناصر'],
            tools: ['Scratch Programming'],
            projects: ['لعبة متاهة', 'لعبة سباق', 'قصة تفاعلية', 'لعبة أسئلة'],
            outcomes: ['فهم أساسيات البرمجة', 'بناء ألعاب بسيطة', 'التفكير بطريقة منظمة', 'تحويل الأفكار لمشاريع رقمية'],
          },
          {
            id: 2,
            title: 'App Creation & Digital Creativity',
            titleAr: 'صناعة التطبيقات والإبداع الرقمي',
            description: 'نقل الطفل من اللعب بالتكنولوجيا إلى صناعة التطبيقات والمحتوى الرقمي.',
            topics: ['كيف تعمل التطبيقات؟', 'أساسيات تصميم الواجهات', 'تجربة المستخدم', 'التفكير الإبداعي'],
            content: ['تصميم الشاشات', 'الأزرار والأحداث', 'الصور والأصوات', 'منطق التطبيق', 'أساسيات التصميم', 'الألوان والخطوط', 'إنشاء محتوى رقمي', 'استخدام أدوات AI للإبداع'],
            tools: ['MIT App Inventor', 'Digital Design Tools'],
            projects: ['تطبيق آلة حاسبة', 'تطبيق قصص', 'تطبيق مهام يومية', 'تصميم مشروع رقمي'],
            outcomes: ['تصميم تطبيقات بسيطة', 'فكرة المنتج الرقمي', 'التعبير عن أفكاره بالتكنولوجيا'],
          },
          {
            id: 3,
            title: 'Python Basics & Web Discovery',
            titleAr: 'أساسيات Python واكتشاف الويب',
            description: 'الانتقال للبرمجة الحقيقية وبناء أساس قوي للمراحل القادمة.',
            topics: ['Python Fundamentals', 'Web Basics', 'AI Learning Skills'],
            content: ['Variables', 'Conditions', 'Loops', 'Functions', 'Lists', 'HTML', 'بناء صفحة بسيطة', 'استخدام AI للتعلم'],
            tools: ['VS Code', 'Python', 'Web Browser'],
            projects: ['ألعاب Python بسيطة', 'آلة حاسبة', 'صفحة شخصية', 'Quiz System'],
            outcomes: ['كتابة برامج بسيطة', 'فهم أساسيات المواقع', 'التعامل مع الأكواد بثقة'],
          },
          {
            id: 4,
            title: 'Smart Projects & AI Foundations',
            titleAr: 'المشاريع الذكية وأساسيات الذكاء الاصطناعي',
            description: 'ربط كل المهارات السابقة وبناء مشاريع ذكية.',
            topics: ['تطوير المشاريع', 'تنظيم الأفكار', 'أساسيات الذكاء الاصطناعي', 'العمل الجماعي'],
            content: ['ما هو AI؟', 'كيف يعمل؟', 'الاستخدام المسؤول', 'AI Story Generator', 'Smart Assistant Prototype', 'Mini Automation Tool'],
            tools: ['Scratch', 'Python', 'AI Tools'],
            projects: ['AI Story Generator', 'Smart Assistant Prototype', 'Mini Automation Tool', 'Graduation Project'],
            outcomes: ['التفكير كمبدع تقني', 'بناء مشاريع رقمية', 'فهم أساسيات البرمجة والذكاء الاصطناعي', 'امتلاك أساس قوي للتخصص مستقبلاً'],
          },
        ],
      },
    ],
    softSkills: [
      { icon: '🧠', text: 'الثقة بالنفس' },
      { icon: '🌱', text: 'تقبل الخطأ والتعلم منه' },
      { icon: '🎯', text: 'التركيز والانضباط' },
      { icon: '🤝', text: 'التعاون' },
      { icon: '💡', text: 'عقلية أنا أستطيع أن أصنع' },
    ],
    finalOutcomes: [
      '⭐ التفكير كمبدع تقني',
      '⭐ بناء مشاريع رقمية',
      '⭐ فهم أساسيات البرمجة والـ AI',
      '⭐ أساس قوي للتخصص مستقبلاً',
    ],
  },

  b: {
    id: 'b',
    title: 'Future AI Developers',
    subtitle: 'مسار مطوري المستقبل',
    age: '12–15 سنة',
    icon: 'code',
    color: 'primary',
    description:
      'في عمر 12–15 سنة يبدأ الطالب مرحلة الانتقال من التعرف على التكنولوجيا إلى بناء مهارات تقنية حقيقية. لذلك يركز هذا المسار على تطوير عقلية المطور من خلال كتابة أكواد حقيقية، التفكير التحليلي، واستخدام الذكاء الاصطناعي بشكل عملي.',
    objectives: [
      { icon: '💻', text: 'كتابة أكواد حقيقية' },
      { icon: '🧠', text: 'التفكير التحليلي وحل المشكلات' },
      { icon: '🤖', text: 'استخدام الذكاء الاصطناعي عملياً' },
      { icon: '🚀', text: 'بناء مشاريع رقمية حقيقية' },
    ],
    years: [
      {
        title: 'السنة الأولى',
        subtitle: 'رحلة المطور',
        description: 'مرحلة بناء أساسيات البرمجة وتطوير عقلية المطور.',
        levels: [
          {
            id: 1,
            title: 'Computational Thinking & Python Entry',
            titleAr: 'التفكير الحسابي ودخول Python',
            description: 'بناء أساس قوي في البرمجة وطريقة تفكير المبرمج.',
            topics: ['Algorithms', 'Flowcharts', 'Logic Systems', 'Problem Decomposition', 'Python Fundamentals'],
            content: ['Variables', 'Conditions', 'Loops', 'Functions', 'Lists', 'Dictionaries', 'تنظيم الملفات', 'VS Code', 'Terminal', 'GitHub Introduction'],
            tools: ['VS Code', 'Terminal', 'GitHub'],
            projects: ['Calculator', 'Logic Games', 'Quiz System', 'Task Automation Basics'],
            outcomes: ['كتابة برامج Python أساسية', 'التفكير بطريقة مبرمج', 'فهم أدوات التطوير الأساسية', 'التعامل مع الأخطاء البرمجية'],
          },
          {
            id: 2,
            title: 'Web Development & Product Thinking',
            titleAr: 'تطوير الويب والتفكير كصانع منتجات',
            description: 'تعليم الطالب بناء منتجات رقمية وليس مجرد صفحات.',
            topics: ['كيف يعمل الويب؟', 'كيف يفكر المستخدم؟', 'كيف تتحول الفكرة إلى منتج؟'],
            content: ['HTML', 'CSS', 'JavaScript Basics', 'User Experience', 'Wireframes', 'Design Thinking', 'عرض الأفكار', 'بناء هوية رقمية'],
            tools: ['VS Code', 'Figma', 'Browser DevTools'],
            projects: ['Personal Portfolio', 'Landing Page', 'Interactive Website', 'Product Prototype'],
            outcomes: ['بناء مواقع حقيقية', 'فهم تجربة المستخدم', 'تقديم مشروع بشكل احترافي'],
          },
          {
            id: 3,
            title: 'Python Projects & AI Tools',
            titleAr: 'مشاريع Python وأدوات الذكاء الاصطناعي',
            description: 'الانتقال من تعلم البرمجة إلى استخدامها لحل مشاكل حقيقية.',
            topics: ['Intermediate Python', 'APIs & JSON', 'File Handling & Automation', 'Prompt Engineering', 'AI Workflows', 'Database Basics'],
            content: ['APIs', 'JSON', 'File Handling', 'Automation', 'Prompt Engineering', 'AI Productivity', 'تنظيم البيانات', 'الجداول', 'تخزين المعلومات'],
            tools: ['VS Code', 'Postman', 'Python Libraries'],
            projects: ['AI Assistant', 'Smart Automation Tool', 'Student Database System', 'AI Productivity Project'],
            outcomes: ['بناء أدوات عملية', 'استخدام AI بفعالية', 'فهم أساسيات البيانات', 'تطوير مهارة البحث والتعلم'],
          },
          {
            id: 4,
            title: 'AI Engineering Foundations',
            titleAr: 'أساسيات هندسة الذكاء الاصطناعي',
            description: 'تجهيز الطالب لاختيار تخصصه وبناء مشاريع أقوى.',
            topics: ['مفهوم الذكاء الاصطناعي', 'كيف تعمل النماذج الذكية', 'الاستخدام المسؤول للـ AI', 'تنظيم المشاريع', 'APIs Integration', 'Project Structure', 'Deployment Basics'],
            content: ['GitHub Portfolio', 'Presentation Skills', 'Tech Career Paths', 'Freelancing Awareness'],
            tools: ['GitHub', 'VS Code', 'Cloud Services'],
            projects: ['AI Web App Prototype', 'Automation Project', 'Smart Productivity Tool', 'Graduation Project'],
            outcomes: ['بناء مشاريع تقنية متوسطة', 'استخدام أدوات المطورين', 'فهم أساسيات الذكاء الاصطناعي', 'اختيار تخصصه المناسب'],
          },
        ],
      },
    ],
    softSkills: [
      { icon: '🧠', text: 'التفكير النقدي' },
      { icon: '🎯', text: 'الالتزام والمسؤولية' },
      { icon: '👥', text: 'العمل الجماعي' },
      { icon: '🗣', text: 'مهارات التواصل' },
      { icon: '🚀', text: 'الثقة بالنفس' },
    ],
    finalOutcomes: [
      '⭐ بناء مشاريع تقنية متوسطة',
      '⭐ استخدام أدوات المطورين',
      '⭐ فهم أساسيات الـ AI',
      '⭐ اختيار التخصص المناسب',
    ],
    nextSteps: ['AI Engineering', 'Full Stack Development', 'Mobile Development', 'Data Analysis', 'Smart Systems'],
  },

  c: {
    id: 'c',
    title: 'Future Tech Engineers',
    subtitle: 'المسار الهندسي للمستقبل',
    age: '16–20 سنة',
    icon: 'engineering',
    color: 'tertiary',
    description:
      'في عمر 16–20 سنة يبدأ الطالب مرحلة مختلفة؛ لم يعد الهدف فقط تعلم أداة أو لغة برمجة، بل بناء عقلية تقنية تؤهله للدراسة الجامعية وسوق العمل. لذلك صممنا مسار Future Tech Engineers ليحول الطالب من مستخدم للتكنولوجيا إلى مطور قادر على بناء حلول رقمية حقيقية.',
    objectives: [
      { icon: '💻', text: 'البرمجة' },
      { icon: '🤖', text: 'الذكاء الاصطناعي' },
      { icon: '🌐', text: 'تطوير التطبيقات والمواقع' },
      { icon: '🧠', text: 'التفكير الهندسي وحل المشكلات' },
      { icon: '🚀', text: 'بناء المشاريع التقنية' },
    ],
    years: [
      {
        title: 'السنة الأولى',
        subtitle: 'Foundation Year',
        description: 'مرحلة بناء الأساس التقني — الهدف: تأسيس الطالب بطريقة صحيحة قبل الدخول في التخصص.',
        levels: [
          {
            id: 1,
            title: 'Programming & Computer Science Foundations',
            titleAr: 'أساسيات البرمجة وعلوم الكمبيوتر',
            description: 'بناء عقلية المبرمج وفهم طريقة عمل البرمجيات.',
            topics: ['Computational Thinking', 'Algorithms', 'Flowcharts', 'Problem Solving', 'Python Fundamentals'],
            content: ['Variables', 'Conditions', 'Loops', 'Functions', 'Lists', 'Dictionaries', 'Debugging'],
            tools: ['VS Code', 'Terminal', 'Git Basics'],
            projects: ['نظام اختبارات', 'ألعاب منطقية', 'أدوات أتمتة بسيطة'],
            outcomes: ['كتابة برامج حقيقية', 'تحليل المشاكل بطريقة منظمة', 'فهم أساسيات البرمجة'],
          },
          {
            id: 2,
            title: 'Web Development & Digital Products',
            titleAr: 'تطوير الويب والمنتجات الرقمية',
            description: 'تعليم الطالب كيف تتحول الفكرة إلى منتج رقمي.',
            topics: ['أساسيات المواقع الإلكترونية', 'تصميم واجهات المستخدم', 'تجربة المستخدم UI/UX'],
            content: ['HTML', 'CSS', 'JavaScript Basics', 'التفكير كصانع منتجات', 'بناء تجربة مستخدم جيدة'],
            tools: ['VS Code', 'Browser DevTools', 'Figma'],
            projects: ['موقع شخصي', 'صفحة منتج', 'مشروع ويب تفاعلي'],
            outcomes: ['بناء صفحات ويب حقيقية', 'فهم طريقة تصميم المنتجات الرقمية', 'إنشاء أول Portfolio'],
          },
          {
            id: 3,
            title: 'Python Development & AI Tools',
            titleAr: 'تطوير Python وأدوات الذكاء الاصطناعي',
            description: 'الانتقال من كتابة الأكواد إلى بناء أدوات ذكية.',
            topics: ['Python Intermediate', 'APIs & JSON', 'Automation & File Handling', 'Prompt Engineering', 'AI Workflows', 'قواعد البيانات'],
            content: ['APIs', 'JSON', 'Automation', 'File Handling', 'Prompt Engineering', 'AI Productivity', 'تنظيم البيانات', 'تخزين المعلومات'],
            tools: ['VS Code', 'Postman', 'Python Libraries'],
            projects: ['AI Assistant', 'Smart Automation Tool', 'Student Management System'],
            outcomes: ['بناء أدوات عملية', 'استخدام الذكاء الاصطناعي بذكاء', 'ربط البرمجة بحلول واقعية'],
          },
          {
            id: 4,
            title: 'AI Engineering Foundations',
            titleAr: 'أساسيات هندسة الذكاء الاصطناعي',
            description: 'تجهيز الطالب لاختيار تخصصه وبناء مشاريع أقوى.',
            topics: ['أساسيات الذكاء الاصطناعي', 'طريقة عمل الأنظمة الذكية', 'تكامل الأدوات والـ APIs', 'بناء المشاريع الحديثة'],
            content: ['GitHub Portfolio', 'Presentation Skills', 'Career Awareness', 'المشروع النهائي: Graduation Project'],
            tools: ['GitHub', 'VS Code', 'Cloud Services'],
            projects: ['Graduation Project — مشروع تخرج متكامل'],
            outcomes: ['امتلاك مشروع متكامل', 'معرفة كيف يعمل مهندس التكنولوجيا', 'جاهزية للانتقال للتخصص'],
          },
        ],
      },
      {
        title: 'السنة الثانية',
        subtitle: 'Specialization Year',
        description: 'بعد بناء الأساس يختار الطالب مسار التخصص.',
        specializations: [
          { id: 'ai', title: 'AI Engineering', titleAr: 'هندسة الذكاء الاصطناعي', icon: 'smart_toy', color: 'primary', description: 'بناء تطبيقات وحلول تعتمد على الذكاء الاصطناعي.', topics: ['AI Applications', 'AI Agents', 'Automation Systems', 'AI Products'], outcomes: ['بناء مشاريع AI عملية'] },
          { id: 'fullstack', title: 'Full Stack Development', titleAr: 'تطوير تطبيقات الويب الكاملة', icon: 'language', color: 'secondary', description: 'تأهيل الطالب لبناء تطبيقات ويب كاملة.', topics: ['Frontend', 'Backend', 'Databases', 'APIs'], outcomes: ['بناء تطبيقات ويب متكاملة'] },
          { id: 'mobile', title: 'Mobile App Development', titleAr: 'تطوير تطبيقات الهاتف', icon: 'phone_iphone', color: 'tertiary', description: 'تعلم صناعة تطبيقات الهاتف.', topics: ['تصميم التطبيقات', 'منطق التطبيقات', 'ربط الخدمات'], outcomes: ['إنشاء تطبيقات عملية'] },
          { id: 'data', title: 'Data & Analytics', titleAr: 'البيانات والتحليلات', icon: 'monitoring', color: 'primary', description: 'فهم البيانات وتحويلها لقرارات.', topics: ['Data Processing', 'Analysis', 'Visualization', 'AI Data Tools'], outcomes: ['مشاريع تحليل بيانات'] },
        ],
      },
    ],
    softSkills: [
      { icon: '🧠', text: 'التفكير النقدي' },
      { icon: '🎯', text: 'الالتزام والمسؤولية' },
      { icon: '👥', text: 'العمل الجماعي' },
      { icon: '🗣', text: 'مهارات العرض' },
      { icon: '🚀', text: 'الثقة بالنفس' },
    ],
    finalOutcomes: [
      '⭐ مشاريع حقيقية',
      '⭐ Portfolio',
      '⭐ خبرة عملية',
      '⭐ عقلية مطور',
      '⭐ رؤية واضحة لمستقبله التقني',
    ],
  },
};

const allTracks = [
  { id: 'a', title: 'Track A: The Explorer', age: '8–11 سنة', icon: 'child_care', color: 'secondary', points: ['البرمجة الرسومية (Scratch)', 'صناعة التطبيقات والإبداع الرقمي', 'أساسيات Python واكتشاف الويب', 'المشاريع الذكية وأساسيات AI'] },
  { id: 'b', title: 'Track B: The Builder', age: '12–15 سنة', icon: 'code', color: 'primary', points: ['التفكير الحسابي وPython', 'تطوير الويب والمنتجات الرقمية', 'مشاريع Python وأدوات AI', 'أساسيات هندسة الذكاء الاصطناعي'] },
  { id: 'c', title: 'Track C: The Professional', age: '16–20 سنة', icon: 'engineering', color: 'tertiary', points: ['علوم الكمبيوتر وهندسة البرمجيات', 'المنتجات الرقمية وتجربة المستخدم', 'هندسة الذكاء الاصطناعي', '4 مسارات تخصصية'] },
];

const plans = [
  { id: 'monthly', name: 'اشتراك شهري', price: '1200', unit: 'جنيه / شهر', badge: null, highlight: false, note: 'مناسب للتجربة — البرايفت سيشن' },
  { id: 'quarterly', name: 'اشتراك ربع سنوي', price: '890', unit: 'جنيه / شهريًا', badge: '⭐ الأكثر اختيارًا', highlight: true, note: 'إجمالي 2,670 جنيه لكل 3 شهور — توفر 930 جنيه' },
  { id: 'yearly', name: 'اشتراك سنوي', price: '690', unit: 'جنيه / شهريًا', badge: '🏆 الأوفر', highlight: false, note: 'إجمالي 8,280 جنيه سنويًا — توفر 6,120 جنيه' },
];

const colorMap = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary', solid: 'bg-primary' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary', solid: 'bg-secondary' },
  tertiary: { bg: 'bg-tertiary/10', text: 'text-tertiary', border: 'border-tertiary', solid: 'bg-tertiary' },
};

/* ──────────────────────── COMPONENT ──────────────────────── */

export default function TracksPage() {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [view, setView] = useState('cards');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const track = params.get('track');
    if (track && trackData[track]) {
      setSelectedTrack(trackData[track]);
      setView('journey');
    }
  }, []);

  function enterTrack(id) {
    const track = trackData[id];
    if (track) {
      setSelectedTrack(track);
      setSelectedLevel(0);
      setView('journey');
      setTimeout(() => document.getElementById('journey-top')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }

  function goToPlans() {
    setView('plans');
    setTimeout(() => document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  function selectPlan(plan) {
    setSelectedPlan(plan);
    setShowConfirm(true);
  }

  function confirmRegister() {
    setShowConfirm(false);
    window.location.href = `/register?track=${selectedTrack.id}&plan=${selectedPlan.id}`;
  }

  const track = selectedTrack;

  return (
    <div dir="rtl">
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-primary-deep to-primary text-on-primary overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-4">
            {track ? track.title : 'اكتشف مسار التعلم'}
          </h1>
          <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg max-w-2xl mx-auto opacity-90">
            {track ? track.description : 'رحلات تعليمية متدرجة تناسب كل فئة عمرية — من أساسيات البرمجة إلى الاحتراف التقني'}
          </p>
          {track && (
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {track.objectives.map((obj, i) => (
                <span key={i} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-full font-label-md">
                  <span>{obj.icon}</span> {obj.text}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TRACK CARDS ── */}
      {!track && (
        <section className="py-16 md:py-24 bg-bg-off-white">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <span className="inline-block bg-secondary-container/20 text-secondary px-5 py-2 rounded-full font-label-md mb-4">📌 اختر المسار</span>
              <h2 className="font-headline-xl text-headline-xl text-primary-deep mb-4">ثلاث مسارات — ثلاث فئات عمرية</h2>
              <p className="text-on-surface-variant font-body-lg">كل مسار صمم خصيصاً ليناسب عمر طفلك ومستواه</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {allTracks.map((t) => {
                const c = colorMap[t.color];
                const trackFull = trackData[t.id];
                return (
                  <div key={t.id} className="relative bg-white rounded-24 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 group hover-lift">
                    <div className={`h-2.5 ${c.solid}`} />
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`${c.bg} p-4 rounded-2xl`}>
                          <span className={`material-symbols-outlined ${c.text} text-4xl`}>{t.icon}</span>
                        </div>
                        <span className={`${c.bg} ${c.text} px-4 py-1 rounded-full font-bold text-sm`}>{t.age}</span>
                      </div>
                      <h3 className="font-headline-lg text-headline-lg text-primary mb-2">{t.title}</h3>
                      <p className="text-on-surface-variant font-body-sm mb-4 text-sm">{trackFull?.subtitle}</p>
                      <ul className="space-y-3 mb-8">
                        {t.points.map((p, i) => (
                          <li key={i} className="flex items-center gap-2 text-on-surface-variant font-body-md">
                            <span className={`material-symbols-outlined ${c.text} text-sm`}>circle</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => enterTrack(t.id)}
                        className={`w-full py-3 border-2 ${c.border} ${c.text} rounded-xl font-bold group-hover:${c.solid} group-hover:text-white transition-all`}
                      >
                        تفاصيل المسار
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── JOURNEY VIEW ── */}
      {track && view === 'journey' && (
        <section className="py-16 md:py-24 bg-bg-off-white" id="journey-top">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">

            <button onClick={() => { setSelectedTrack(null); setView('cards'); setSelectedLevel(0); }} className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
              <span className="material-symbols-outlined">arrow_forward</span>
              العودة لاختيار المسار
            </button>

            {track.years.map((year, yi) => (
              <div key={yi} className="mb-20">
                <div className="text-center mb-12">
                  <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-label-md mb-4 ${yi === 0 ? 'bg-secondary-container/20 text-secondary' : 'bg-tertiary-container/20 text-tertiary'}`}>
                    <span className="material-symbols-outlined text-lg">{yi === 0 ? 'school' : 'rocket_launch'}</span>
                    {year.title} — {year.subtitle}
                  </div>
                  <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">{year.description}</p>
                </div>

                {/* Levels */}
                {year.levels && (
                  <div className="relative">
                    <div className="hidden md:block absolute right-1/2 top-0 bottom-0 w-0.5 bg-outline-variant/30 -translate-x-1/2" />
                    <div className="space-y-12">
                      {year.levels.map((level, li) => {
                        const isActive = selectedLevel === level.id;
                        const isLast = li === year.levels.length - 1;
                        return (
                          <div key={level.id} className="relative">
                            <div className="hidden md:flex absolute right-1/2 -translate-x-1/2 top-8 w-12 h-12 rounded-full bg-white border-2 border-primary items-center justify-center z-10 shadow-md">
                              <span className="font-bold text-primary text-sm">{level.id}</span>
                            </div>
                            <div className={`md:w-[calc(50%-2.5rem)] ${li % 2 === 0 ? 'md:mr-auto md:ml-0' : 'md:ml-auto md:mr-0'}`}>
                              <div
                                className={`bg-white rounded-24 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 transition-all duration-300 cursor-pointer ${isActive ? 'ring-2 ring-primary/30 scale-[1.01]' : 'hover:shadow-lg'}`}
                                onClick={() => setSelectedLevel(isActive ? 0 : level.id)}
                              >
                                <div className={`p-6 md:p-8 ${isActive ? 'bg-primary/5' : ''}`}>
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                                      المستوى {level.id}
                                    </span>
                                    <span className={`material-symbols-outlined transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                                      expand_more
                                    </span>
                                  </div>
                                  <h3 className="font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg text-primary-deep mb-2">{level.titleAr}</h3>
                                  <p className="text-on-surface-variant font-body-md">{level.description}</p>
                                </div>

                                <div className={`transition-all duration-500 overflow-hidden ${isActive ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                  <div className="px-6 md:px-8 pb-8">
                                    <div className="h-px bg-outline-variant/20 mb-6" />

                                    {/* Topics */}
                                    <div className="mb-6">
                                      <h4 className="font-label-md text-on-surface mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-lg">menu_book</span>
                                        ماذا يتعلم الطالب
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {level.topics.map((t, i) => (
                                          <span key={i} className="bg-primary/5 text-primary px-3 py-1.5 rounded-full text-sm font-body-md">{t}</span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Content + Tools + Projects */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                      <div className="bg-surface-container-low rounded-16 p-4">
                                        <h5 className="font-label-sm text-on-surface-variant mb-3 flex items-center gap-1.5">
                                          <span className="material-symbols-outlined text-sm">checklist</span>
                                          المحتوى
                                        </h5>
                                        <ul className="space-y-1.5">
                                          {level.content.map((c, i) => (
                                            <li key={i} className="text-sm text-on-surface-variant font-body-md flex items-start gap-1.5">
                                              <span className="text-primary mt-0.5">✓</span> {c}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div className="bg-surface-container-low rounded-16 p-4">
                                        <h5 className="font-label-sm text-on-surface-variant mb-3 flex items-center gap-1.5">
                                          <span className="material-symbols-outlined text-sm">build</span>
                                          الأدوات
                                        </h5>
                                        <ul className="space-y-1.5">
                                          {level.tools.map((t, i) => (
                                            <li key={i} className="text-sm text-on-surface-variant font-body-md flex items-start gap-1.5">
                                              <span className="text-secondary mt-0.5">▸</span> {t}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div className="bg-surface-container-low rounded-16 p-4">
                                        <h5 className="font-label-sm text-on-surface-variant mb-3 flex items-center gap-1.5">
                                          <span className="material-symbols-outlined text-sm">rocket_launch</span>
                                          المشاريع
                                        </h5>
                                        <ul className="space-y-1.5">
                                          {level.projects.map((p, i) => (
                                            <li key={i} className="text-sm text-on-surface-variant font-body-md flex items-start gap-1.5">
                                              <span className="text-tertiary mt-0.5">🚀</span> {p}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>

                                    {/* Outcomes */}
                                    <div className="bg-green-50 border border-green-200 rounded-16 p-5">
                                      <h4 className="font-label-md text-green-800 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">emoji_events</span>
                                        المخرجات المتوقعة
                                      </h4>
                                      <div className="space-y-2">
                                        {level.outcomes.map((o, i) => (
                                          <div key={i} className="flex items-center gap-2 text-green-700 font-body-md text-sm">
                                            <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
                                            {o}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {isLast && (
                                <div className="mt-8 text-center">
                                  <button
                                    onClick={goToPlans}
                                    className="inline-flex items-center gap-3 bg-gradient-to-l from-primary to-primary-deep text-white px-10 py-4 rounded-full font-label-lg hover:shadow-xl transition-all scale-100 hover:scale-105 active:scale-95"
                                  >
                                    <span className="material-symbols-outlined">shopping_cart</span>
                                    خطط الاشتراك والباقات
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Specializations */}
                {year.specializations && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {year.specializations.map((spec) => {
                      const c = colorMap[spec.color];
                      return (
                        <div key={spec.id} className={`bg-white rounded-24 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 hover-lift border-t-4 ${c.border}`}>
                          <div className="p-6">
                            <div className={`${c.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}>
                              <span className={`material-symbols-outlined ${c.text} text-3xl`}>{spec.icon}</span>
                            </div>
                            <h4 className="font-headline-md text-headline-md text-primary-deep mb-2">{spec.titleAr}</h4>
                            <p className="text-on-surface-variant font-body-sm mb-4 text-sm">{spec.description}</p>
                            <div className="space-y-2 mb-4">
                              {spec.topics.map((t, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-on-surface-variant">
                                  <span className={`w-1.5 h-1.5 rounded-full ${c.solid}`} />
                                  {t}
                                </div>
                              ))}
                            </div>
                            <div className={`${c.bg} rounded-xl p-3 text-center`}>
                              <span className={`font-label-sm ${c.text}`}>🎯 {spec.outcomes[0]}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Next Steps (Track B only) */}
            {track.nextSteps && (
              <div className="bg-white rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 p-6 md:p-12 mb-12">
                <h3 className="font-headline-lg md:font-headline-xl text-headline-lg md:text-headline-xl text-primary-deep text-center mb-4">بعد إنهاء المسار</h3>
                <p className="text-on-surface-variant font-body-md md:font-body-lg text-center mb-6 md:mb-8">يستطيع الطالب الانتقال لمسارات التخصص</p>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {track.nextSteps.map((s, i) => (
                    <span key={i} className="bg-primary/5 text-primary px-4 md:px-5 py-2 md:py-2.5 rounded-full font-label-sm md:font-label-md text-sm md:text-base">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            <div className="bg-white rounded-24 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 p-6 md:p-12 mb-12">
              <h3 className="font-headline-lg md:font-headline-xl text-headline-lg md:text-headline-xl text-primary-deep text-center mb-4 md:mb-8">
                {track.id === 'a' ? 'الجانب النفسي والسلوكي' : 'الجانب الشخصي والمهني'}
              </h3>
              <p className="text-on-surface-variant font-body-md md:font-body-lg text-center mb-6 md:mb-8">
                {track.id === 'a' ? 'نحن لا نبني مهارات تقنية فقط، بل نبني شخصية الطفل' : 'لأن النجاح التقني يحتاج أكثر من مهارة'}
              </p>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 md:gap-4">
                {track.softSkills.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 md:gap-3 bg-surface-container-low px-4 md:px-6 py-3 md:py-4 rounded-2xl">
                    <span className="text-xl md:text-2xl">{s.icon}</span>
                    <span className="font-label-sm md:font-label-md text-on-surface text-sm md:text-base">{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Outcomes */}
            <div className="bg-gradient-to-br from-primary-deep to-primary rounded-24 p-6 md:p-12 text-on-primary text-center">
              <h3 className="font-headline-lg md:font-headline-xl text-headline-lg md:text-headline-xl mb-4">{track.id === 'a' ? 'نهاية المسار' : 'نهاية الرحلة'}</h3>
              <p className="font-body-md md:font-body-lg opacity-90 mb-6 md:mb-8">
                {track.id === 'a' ? 'بنهاية المسار يصبح الطفل قادراً على:' : 'الطالب لا يخرج بشهادة فقط... بل يخرج بـ:'}
              </p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {track.finalOutcomes.map((o, i) => (
                  <span key={i} className="bg-white/15 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 rounded-full font-label-sm md:font-label-md text-sm md:text-base">{o}</span>
                ))}
              </div>
              <div className="mt-8 md:mt-10">
                <button
                  onClick={goToPlans}
                  className="inline-flex items-center gap-3 bg-white text-primary-deep px-8 md:px-10 py-3.5 md:py-4 rounded-full font-label-md hover:shadow-xl transition-all scale-100 hover:scale-105 active:scale-95"
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  اختر خطتك الآن
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PLANS VIEW ── */}
      {track && view === 'plans' && (
        <section className="py-16 md:py-24 bg-bg-off-white" id="plans-section">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">

            <button onClick={() => setView('journey')} className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:underline">
              <span className="material-symbols-outlined">arrow_forward</span>
              العودة لرحلة التعلم
            </button>

            <div className="text-center mb-10 md:mb-16">
              <span className="inline-block bg-secondary-container/20 text-secondary px-5 py-2 rounded-full font-label-md mb-4">📌 خطط الاشتراك</span>
              <h2 className="font-headline-lg md:font-headline-xl text-headline-lg md:text-headline-xl text-primary-deep mb-2">اختر الخطة المناسبة لك</h2>
              <p className="text-on-surface-variant font-body-md md:font-body-lg">مسار: <strong className="text-primary">{track.title}</strong> — الفئة العمرية: {track.age}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-24 overflow-hidden transition-all duration-300 ${
                    plan.highlight ? 'ring-2 ring-primary shadow-xl md:scale-110 z-10 border border-primary/30' : 'shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/20 hover-lift'
                  }`}
                >
                  {plan.badge && (
                    <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full font-label-md shadow-lg text-white ${plan.highlight ? 'bg-primary' : 'bg-secondary'}`}>
                      {plan.badge}
                    </div>
                  )}
                  <div className={`h-2 ${plan.highlight ? 'bg-primary' : 'bg-secondary-container'}`} />
                  <div className="p-6 md:p-8 pt-10">
                    <h3 className="font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg text-primary-deep mb-4">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="font-display-md md:font-display-lg text-display-md md:text-display-lg text-primary-deep">{plan.price}</span>
                      <span className="text-on-surface-variant font-body-sm md:font-body-md mr-2">{plan.unit}</span>
                    </div>
                    <p className="text-on-surface-variant font-body-sm mb-6 md:mb-8">{plan.note}</p>
                    <button
                      onClick={() => selectPlan(plan)}
                      className={`w-full py-3.5 rounded-full font-label-md transition-all ${
                        plan.highlight ? 'bg-primary text-white hover:shadow-lg' : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      اختر هذه الخطة
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 max-w-3xl mx-auto space-y-3">
              <div className="bg-surface-container-low p-5 rounded-16 border-r-4 border-secondary-container">
                <p className="text-on-surface-variant font-body-md text-sm">
                  🎯 <strong className="text-primary">ميزة الاشتراك السنوي:</strong> يوفر 6,120 جنيه مقارنة بالشهري، واستثمار في استمرارية تعليم أفضل.
                </p>
              </div>
              <div className="bg-surface-container-low p-5 rounded-16 border-r-4 border-primary">
                <p className="text-on-surface-variant font-body-md text-sm">
                  ✅ <strong className="text-primary">رسوم تسجيل إدارية</strong> 200 جنيه تدفع لمرة واحدة
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CONFIRM DIALOG ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-32 shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col text-center animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 md:p-8 pb-0">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="material-symbols-outlined text-primary text-3xl md:text-4xl">help</span>
              </div>
              <h3 className="font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg text-primary-deep mb-4">تأكيد التسجيل</h3>
              <p className="text-on-surface-variant font-body-sm md:font-body-md mb-2">أنت على وشك التسجيل في:</p>
              <div className="bg-surface-container-low rounded-2xl p-4 md:p-5 mb-5 md:mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-lg md:text-xl">route</span>
                  <span className="font-bold text-primary-deep text-sm md:text-base">{track?.title}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg md:text-xl">payments</span>
                  <span className="text-on-surface-variant text-sm md:text-base">{selectedPlan?.name} — {selectedPlan?.price} {selectedPlan?.unit}</span>
                </div>
              </div>
            </div>

            {/* Scrollable Policy */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 text-right">
              <div className="bg-surface-container-low rounded-2xl p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-lg">policy</span>
                  <h4 className="font-label-md text-primary font-bold">سياسة الانضمام لبرنامج Tech Makers</h4>
                </div>
                <p className="text-on-surface-variant font-body-sm mb-4 leading-relaxed">
                  تهدف Tech Makers إلى بناء بيئة تعليمية احترافية تساعد الطلاب على تطوير مهاراتهم التقنية والشخصية، لذلك نرجو الالتزام بالسياسات التالية:
                </p>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-3">
                    <h5 className="font-label-sm text-primary font-bold mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">event_available</span>
                      الالتزام بالحضور
                    </h5>
                    <p className="text-on-surface-variant text-xs leading-relaxed">البرنامج يعتمد على التفاعل والممارسة المستمرة. في حال تجاوز نسبة غياب الطالب 70% من إجمالي المحاضرات، يحق للإدارة حرمان الطالب من الشهادة المجانية، كما يؤثر الغياب المتكرر على مستوى الطالب وتقييمه.</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <h5 className="font-label-sm text-primary font-bold mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">gpp_good</span>
                      الالتزام بالسلوك والانضباط
                    </h5>
                    <p className="text-on-surface-variant text-xs leading-relaxed">نحرص على توفير بيئة آمنة ومحترمة. أي سلوك غير منضبط أو إساءة للمدربين أو الطلاب قد يعرض الطالب للتحذير أو إيقاف الحساب.</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <h5 className="font-label-sm text-primary font-bold mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      الالتزام بالمواعيد
                    </h5>
                    <p className="text-on-surface-variant text-xs leading-relaxed">يجب حضور المحاضرات في المواعيد المحددة. التأخير المستمر قد يؤثر على تقييم الطالب داخل البرنامج.</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <h5 className="font-label-sm text-primary font-bold mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">task_alt</span>
                      الالتزام بالتاسكات والمشاريع
                    </h5>
                    <p className="text-on-surface-variant text-xs leading-relaxed">يعتمد البرنامج على التطبيق العملي وليس المشاهدة فقط. يجب تنفيذ المهام والمشاريع بانتظام.</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <h5 className="font-label-sm text-primary font-bold mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">analytics</span>
                      المتابعة والتقييم
                    </h5>
                    <p className="text-on-surface-variant text-xs leading-relaxed">يتم عمل تقييمات دورية لقياس تطور الطالب، وبعض الباقات تشمل تقارير متابعة دورية لولي الأمر.</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <h5 className="font-label-sm text-primary font-bold mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">favorite</span>
                      بيئة تعليمية داعمة
                    </h5>
                    <p className="text-on-surface-variant text-xs leading-relaxed">نهتم بالجانب النفسي والسلوكي، لذلك نوفر إشراف تربوي، متابعة سلوكية، ومرشد دعم نفسي وتربوي.</p>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-3">
                    <h5 className="font-label-sm text-primary font-bold mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">flag</span>
                      هدف البرنامج
                    </h5>
                    <p className="text-on-surface-variant text-xs leading-relaxed">Tech Makers ليس مجرد كورس تقني، بل رحلة تعليمية تساعد الطلاب على التفكير المنطقي، حل المشكلات، بناء الثقة، استخدام التكنولوجيا بشكل صحيح والاستعداد لمهارات المستقبل.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 pt-4">
              <p className="text-on-surface-variant font-body-sm mb-4">هل تريد المتابعة؟</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 border-2 border-outline-variant text-on-surface-variant rounded-xl font-bold hover:bg-surface-container-low transition-all text-sm md:text-base">
                  إلغاء
                </button>
                <button onClick={confirmRegister} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm md:text-base">
                  نعم، المتابعة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      {!track && (
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary-deep to-primary text-on-primary text-center">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-4">ابدأ رحلة التعلم اليوم</h2>
            <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg max-w-2xl mx-auto opacity-90 mb-8">سجل الآن وامنح ابنك مستقبلاً تقنياً واعداً مع أحدث أساليب التعليم التفاعلي</p>
            <Link href="/register" className="inline-block bg-white text-primary-deep px-8 md:px-10 py-3.5 md:py-4 rounded-full font-label-md hover:shadow-xl transition-all scale-100 hover:scale-105 active:scale-95">
              سجل الآن
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
