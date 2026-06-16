'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function StudentDashboard() {
  const [currentTime, setCurrentTime] = useState('14:02');

  useEffect(() => {
    const timer = setInterval(() => {
      let [mins, secs] = currentTime.split(':').map(Number);
      if (secs > 0) {
        secs--;
      } else if (mins > 0) {
        mins--;
        secs = 59;
      }
      setCurrentTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentTime]);

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex overflow-hidden" dir="rtl">
      {/* SideNavBar */}
      <aside className="fixed right-0 top-0 h-full w-[280px] bg-primary flex flex-col py-6 border-l border-outline-variant z-50">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          </div>
          <div>
            <h1 className="font-headline-lg text-headline-lg font-semibold text-on-primary leading-tight text-xl">TKA-Egypt</h1>
            <p className="font-label-md text-label-md text-on-primary/60">إدارة الأكاديمية</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <Link href="#" className="bg-primary-container text-on-primary-container rounded-lg mx-4 px-4 py-3 flex items-center gap-3 transition-transform active:scale-95">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-md text-label-md">لوحة التحكم</span>
          </Link>
          <Link href="#" className="text-on-primary/70 hover:text-on-primary hover:bg-primary-container/10 rounded-lg mx-4 px-4 py-3 flex items-center gap-3 transition-colors duration-200">
            <span className="material-symbols-outlined">school</span>
            <span className="font-label-md text-label-md">سجل الطالب</span>
          </Link>
          <Link href="#" className="text-on-primary/70 hover:text-on-primary hover:bg-primary-container/10 rounded-lg mx-4 px-4 py-3 flex items-center gap-3 transition-colors duration-200">
            <span className="material-symbols-outlined">library_books</span>
            <span className="font-label-md text-label-md">البرامج الأكاديمية</span>
          </Link>
          <Link href="#" className="text-on-primary/70 hover:text-on-primary hover:bg-primary-container/10 rounded-lg mx-4 px-4 py-3 flex items-center gap-3 transition-colors duration-200">
            <span className="material-symbols-outlined">assessment</span>
            <span className="font-label-md text-label-md">التقارير</span>
          </Link>
        </nav>
        <div className="px-4 mt-auto space-y-1">
          <button className="w-full bg-secondary-container text-on-secondary-container rounded-lg py-3 px-4 flex items-center justify-center gap-2 font-label-md text-label-md hover:opacity-90 transition-opacity mb-4">
            <span className="material-symbols-outlined">add</span>
            تسجيل جديد
          </button>
          <Link href="#" className="text-on-primary/70 hover:text-on-primary hover:bg-primary-container/10 rounded-lg px-4 py-3 flex items-center gap-3 transition-colors duration-200">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-md text-label-md">الإعدادات</span>
          </Link>
          <Link href="#" className="text-on-primary/70 hover:text-on-primary hover:bg-primary-container/10 rounded-lg px-4 py-3 flex items-center gap-3 transition-colors duration-200">
            <span className="material-symbols-outlined">help_outline</span>
            <span className="font-label-md text-label-md">الدعم الفني</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="mr-[280px] flex-1 h-screen overflow-y-auto relative custom-scrollbar">
        {/* TopNavBar */}
        <header className="sticky top-0 left-0 w-full h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-8 z-40">
          <div className="flex items-center gap-6">
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="bg-surface-container-low border-none rounded-lg pr-10 pl-4 py-1.5 w-64 text-body-md focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all" placeholder="بحث عن موارد..." type="text"/>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-on-surface-variant font-label-md hover:text-primary transition-colors">الدليل</Link>
              <Link href="#" className="text-on-surface-variant font-label-md hover:text-primary transition-colors">المصادر</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-primary text-on-primary px-4 py-1.5 rounded-lg font-label-md text-label-md hover:opacity-90 active:opacity-70 transition-all">
              إجراء سريع
            </button>
            <div className="flex gap-2">
              <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 left-2 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
                <span className="material-symbols-outlined">apps</span>
              </button>
            </div>
            <div className="flex items-center gap-3 pr-4 border-r border-outline-variant">
              <div className="text-left">
                <p className="font-label-md text-label-md text-on-surface">أحمد منصور</p>
                <p className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider">طالب المستوى الرابع</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-xs overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkr7tobgHnFvBLa48MqeJMprcyfPafkdplM_EoiAimLi00nvOOJGvvsdZrhGzl_I0iLjOMsuXcFfo-7zSulrDAveMiPS_ir_XCHj5GOHZUs85Tbm0yCen2cp86EbftR7vez3h2eHIEjqX9-RMR07So9EYddAE4AJLajP68BDzq8B0jVYTsX1X6nbeZ6pBFHEzz5L3qARKp70DjW-qeXKP0l1_Ak8cfjOHSid0liXbo6-0b0szlPrcI4ZK3_nhyEURp1WwvTzVve0M" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="p-8 max-w-container-max mx-auto">
          {/* Hero Welcome */}
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="font-headline-xl text-headline-xl text-primary mb-2 text-3xl font-bold">مرحباً بعودتك، أحمد</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">لديك جلستان مباشرتان اليوم و4 مهام معلقة.</p>
            </div>
            <div className="bg-surface-container-highest px-4 py-2 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
              <span className="font-label-md text-label-md text-primary">24 أكتوبر 2024</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Main Column */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* Progress Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-xs">البرنامج الحالي</h3>
                    <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded font-bold uppercase">قيد التنفيذ</span>
                  </div>
                  <p className="font-headline-lg text-headline-lg text-primary mb-6 text-xl font-bold">الإدارة الاستراتيجية المتقدمة</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>تقدم البرنامج</span>
                      <span className="text-primary">68%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-xs">نسبة الحضور</h3>
                    <span className="material-symbols-outlined text-primary">verified</span>
                  </div>
                  <p className="font-headline-lg text-headline-lg text-primary mb-6 text-xl font-bold">94.2%</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-1 flex-1 bg-primary rounded-full"></div>)}
                    <div className="h-1 flex-1 bg-outline-variant rounded-full"></div>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2">وضع ممتاز في الدورة الأكاديمية 2024</p>
                </div>
              </div>

              {/* Live Sessions */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-headline-lg text-headline-lg text-primary text-xl font-bold">الجلسات المباشرة القادمة</h3>
                  <button className="text-primary font-label-md text-label-md hover:underline">عرض الجدول</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-primary-container rounded-lg flex flex-col items-center justify-center text-on-primary-container">
                        <span className="font-bold text-lg">24</span>
                        <span className="text-[10px] uppercase font-bold">أكتوبر</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">الاقتصاد العالمي وديناميكيات السوق</h4>
                        <p className="text-on-surface-variant text-sm flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-sm">person</span>
                          أ.د. سامح الغزالي • قاعة 402B
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="mb-2">
                        <span className="bg-error/10 text-error px-3 py-1 rounded-full text-[12px] font-bold animate-pulse">يبدأ خلال {currentTime}</span>
                      </div>
                      <button className="bg-primary text-on-primary px-6 py-2 rounded-lg text-sm font-bold group-hover:scale-105 transition-transform">
                        انضم للجلسة
                      </button>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest border border-outline-variant p-5 rounded-xl flex items-center justify-between group opacity-75 grayscale-[0.5] hover:grayscale-0 hover:opacity-100 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-surface-container-highest rounded-lg flex flex-col items-center justify-center text-on-surface">
                        <span className="font-bold text-lg">25</span>
                        <span className="text-[10px] uppercase font-bold">أكتوبر</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">القيادة والسلوك التنظيمي</h4>
                        <p className="text-on-surface-variant text-sm flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-sm">person</span>
                          د. نادية فؤاد • القاعة الافتراضية
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="mb-2">
                        <span className="text-on-surface-variant px-3 py-1 text-[12px] font-medium">غداً، 10:00 صباحاً</span>
                      </div>
                      <button className="bg-surface-container text-on-surface px-6 py-2 rounded-lg text-sm font-bold">
                        ضبط تذكير
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* My Journey (Timeline) */}
              <section>
                <h3 className="font-headline-lg text-headline-lg text-primary text-xl font-bold mb-6">رحلتي التعليمية</h3>
                <div className="relative bg-surface-container-low p-8 rounded-xl border border-outline-variant overflow-hidden">
                  <div className="absolute top-1/2 right-8 left-8 h-0.5 bg-outline-variant -translate-y-1/2 hidden md:block"></div>
                  <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Milestones */}
                    {[
                      { label: 'التوجيه الإرشادي', date: '15 أغسطس 2024', status: 'completed' },
                      { label: 'الوحدة 1: الأساسيات', date: '30 سبتمبر 2024', status: 'completed' },
                      { label: 'التحليلات (حالي)', date: 'ينتهي في 10 نوفمبر', status: 'active' },
                      { label: 'المشروع النهائي', date: '20 ديسمبر 2024', status: 'locked' }
                    ].map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center space-y-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg ${
                          step.status === 'completed' ? 'bg-primary text-on-primary' :
                          step.status === 'active' ? 'bg-primary ring-8 ring-primary/20 text-on-primary scale-110' :
                          'bg-white dark:bg-surface border-2 border-outline-variant text-outline-variant'
                        }`}>
                          <span className="material-symbols-outlined">
                            {step.status === 'completed' ? 'check_circle' : step.status === 'active' ? 'pending' : 'lock'}
                          </span>
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${step.status === 'active' ? 'text-primary' : 'text-on-surface'}`}>{step.label}</p>
                          <p className="text-[11px] text-on-surface-variant">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar Column */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              {/* Achievements */}
              <div className="bg-primary text-on-primary p-6 rounded-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-xs uppercase tracking-widest opacity-70 mb-4 font-bold">تقدم الإنجازات</h4>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg">محلل خبير</p>
                      <p className="text-on-primary/60 text-xs">تبقت مهمتان للحصول على الشارة</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-12 bg-white/10 rounded border border-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white/40">emoji_events</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              </div>

              {/* Notifications */}
              <div className="bg-surface-container-low rounded-xl border border-outline-variant h-fit">
                <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                  <h4 className="font-bold text-primary">تنبيهات أكاديمية</h4>
                  <span className="bg-primary text-on-primary text-[10px] px-2 py-0.5 rounded-full uppercase">3 جديد</span>
                </div>
                <div className="divide-y divide-outline-variant max-h-[400px] overflow-y-auto custom-scrollbar">
                  {[
                    { title: 'اكتمال التقييم', desc: 'تم رصد درجة بحث "دراسة السوق". النتيجة: A-', time: 'منذ ساعتين', icon: 'description', color: 'text-primary' },
                    { title: 'مصدر دراسي جديد', desc: 'تم إضافة "دليل رؤية مصر 2030" للمكتبة.', time: 'أمس', icon: 'event_available', color: 'text-secondary' },
                    { title: 'إجراء مطلوب', desc: 'توقيع وثيقة التأمين الدراسي السنوية قبل 28 أكتوبر.', time: '22 أكتوبر', icon: 'warning', color: 'text-error' }
                  ].map((notif, idx) => (
                    <div key={idx} className="p-5 hover:bg-surface transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        <div className="mt-1">
                          <span className={`material-symbols-outlined ${notif.color} text-xl`}>{notif.icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface group-hover:text-primary">{notif.title}</p>
                          <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">{notif.desc}</p>
                          <p className="text-[11px] text-outline mt-2">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-surface-container/50 text-center">
                  <button className="text-primary font-bold text-sm hover:underline">عرض جميع التنبيهات</button>
                </div>
              </div>

              {/* Support */}
              <div className="bg-surface-container-highest border border-outline-variant p-6 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-primary">المستشار الأكاديمي</p>
                  <p className="text-[12px] text-on-surface-variant">متاح للمحادثة الآن</p>
                </div>
                <button className="p-3 bg-white dark:bg-surface text-primary rounded-full shadow-sm hover:shadow-md transition-all">
                  <span className="material-symbols-outlined">forum</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 bg-surface-container border-t border-outline-variant py-12">
          <div className="max-w-container-max mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <h5 className="font-bold text-primary mb-4 text-xl">TKA-Egypt</h5>
              <p className="text-sm text-on-surface-variant">تمكين الجيل القادم من القادة المصريين من خلال التميز الإداري والأكاديمي.</p>
            </div>
            <div>
              <h6 className="text-xs text-on-surface-variant uppercase tracking-widest mb-4 font-bold">وصول الطالب</h6>
              <ul className="space-y-2">
                {['بوابة الطالب', 'دليل الكلية', 'مصادر المكتبة'].map(item => (
                  <li key={item}><Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-all inline-block">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h6 className="text-xs text-on-surface-variant uppercase tracking-widest mb-4 font-bold">القانونية</h6>
              <ul className="space-y-2">
                {['سياسة الخصوصية', 'شروط الخدمة', 'خريطة الموقع'].map(item => (
                  <li key={item}><Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-all inline-block">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h6 className="text-xs text-on-surface-variant uppercase tracking-widest mb-4 font-bold">تواصل معنا</h6>
              <div className="flex gap-4">
                <Link href="#" className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <span className="material-symbols-outlined">public</span>
                </Link>
                <Link href="#" className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                  <span className="material-symbols-outlined">mail</span>
                </Link>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-6 leading-relaxed">
                © 2024 أكاديمية TKA-Egypt للتميز. <br/>جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
