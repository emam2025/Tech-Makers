'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function PerformanceReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or fetch actual data from Supabase here
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen pb-32" dir="rtl">
      {/* Top App Bar */}
      <header className="flex items-center px-4 h-16 w-full z-50 bg-surface border-b border-surface-variant sticky top-0 shadow-sm">
        <button 
          onClick={() => router.back()}
          className="material-symbols-outlined text-primary p-2 active:scale-95 transition-transform"
        >
          arrow_back
        </button>
        <h1 className="font-headline-md text-headline-md text-primary mr-2 font-bold text-lg">تقرير الأداء</h1>
        <div className="mr-auto">
          <button className="material-symbols-outlined text-primary p-2">share</button>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Student Identity Summary */}
        <section className="flex items-center gap-4 bg-surface-container-lowest p-md border border-outline-variant rounded-xl shadow-sm">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-fixed p-0.5 relative">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkr7tobgHnFvBLa48MqeJMprcyfPafkdplM_EoiAimLi00nvOOJGvvsdZrhGzl_I0iLjOMsuXcFfo-7zSulrDAveMiPS_ir_XCHj5GOHZUs85Tbm0yCen2cp86EbftR7vez3h2eHIEjqX9-RMR07So9EYddAE4AJLajP68BDzq8B0jVYTsX1X6nbeZ6pBFHEzz5L3qARKp70DjW-qeXKP0l1_Ak8cfjOHSid0liXbo6-0b0szlPrcI4ZK3_nhyEURp1WwvTzVve0M"
                alt="Student"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-surface-container-lowest rounded-full"></div>
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-primary font-bold">أحمد محمود علي</h2>
            <p className="text-sm text-on-surface-variant">الصف الثالث الثانوي - شعبة علمي رياضة</p>
          </div>
        </section>

        {/* KPI Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Radial Attendance */}
          <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
            <span className="text-xs text-on-surface-variant mb-3 uppercase tracking-wider font-bold">نسبة الحضور</span>
            <div className="w-24 h-24 rounded-full flex items-center justify-center relative shadow-inner" style={{
              background: 'radial-gradient(closest-side, white 82%, transparent 83% 100%), conic-gradient(#002045 88%, #ebeef0 0)'
            }}>
              <span className="text-xl font-bold text-primary">88%</span>
            </div>
            <div className="mt-3 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">ممتاز</div>
          </div>

          {/* Grade Average */}
          <div className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
            <span className="text-xs text-on-surface-variant mb-3 uppercase tracking-wider font-bold">متوسط الدرجات</span>
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-primary text-white shadow-lg">
              <span className="text-3xl font-bold">A-</span>
            </div>
            <span className="mt-3 text-sm text-primary font-bold">92.4 / 100</span>
          </div>
        </div>

        {/* Performance Graph */}
        <section className="bg-surface-container-lowest p-md border border-outline-variant rounded-xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <h3 className="text-sm font-bold text-primary">تطور المستوى الأكاديمي</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-surface-container text-on-surface-variant rounded-md">آخر 6 أشهر</span>
          </div>
          <div className="relative h-56 w-full mt-6">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="chartFill" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#002045" stopOpacity="0.15"></stop>
                  <stop offset="100%" stopColor="#002045" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <line stroke="#ebeef0" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="20" y2="20"></line>
              <line stroke="#ebeef0" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="40" y2="40"></line>
              <line stroke="#ebeef0" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="60" y2="60"></line>
              <line stroke="#ebeef0" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="100" y1="80" y2="80"></line>
              <path d="M 0 80 Q 20 75, 30 65 T 50 60 T 75 35 T 100 25" fill="none" stroke="#002045" strokeLinecap="round" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>
              <path d="M 0 80 Q 20 75, 30 65 T 50 60 T 75 35 T 100 25 L 100 100 L 0 100 Z" fill="url(#chartFill)"></path>
              <circle cx="100" cy="25" fill="#002045" r="4" stroke="white" strokeWidth="2"></circle>
            </svg>
            <div className="absolute bottom-[-32px] inset-x-0 flex justify-between px-1">
              {['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'].map((m, i) => (
                <span key={m} className={`text-[10px] font-bold ${i === 5 ? 'text-primary' : 'text-on-surface-variant/60'}`}>{m}</span>
              ))}
            </div>
          </div>
          <div className="pt-8"></div>
        </section>

        {/* Performance Analysis */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-primary">تحليل الأداء</h3>
          <div className="bg-surface-container-low p-4 border-r-4 border-primary rounded-l-xl rounded-r-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <h4 className="text-sm font-bold text-primary">نقاط القوة الرئيسية</h4>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-primary text-[14px]">check</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed">قدرة تحليلية عالية في حل المسائل الرياضية المعقدة.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-primary text-[14px]">check</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed">التزام تام بمواعيد تسليم المشاريع الأسبوعية.</p>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 p-4 border-r-4 border-amber-500 rounded-l-xl rounded-r-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-amber-700" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
              <h4 className="text-sm font-bold text-amber-800">فرص التحسين</h4>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-amber-800 text-[14px]">trending_up</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">تحسين مهارات المحادثة باللغة الإنجليزية في القسم الشفوي.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-amber-800 text-[14px]">group</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">زيادة المشاركة في النقاشات الجماعية داخل الفصل.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Export Options */}
        <section className="bg-primary text-white p-md rounded-xl space-y-4 shadow-lg overflow-hidden relative">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="flex flex-col gap-1 relative z-10">
            <h3 className="text-sm font-bold text-white">تحميل التقرير الرسمي</h3>
            <p className="text-[10px] text-white/70">متوفر بصيغ متعددة للأرشفة أو الطباعة</p>
          </div>
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <button className="flex items-center justify-center gap-2 bg-white dark:bg-surface text-primary px-4 py-3 rounded-lg text-sm font-bold hover:bg-surface-container-low transition-colors active:scale-95 duration-200 shadow-sm">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
              <span>نسخة PDF</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white dark:bg-surface text-primary px-4 py-3 rounded-lg text-sm font-bold hover:bg-surface-container-low transition-colors active:scale-95 duration-200 shadow-sm">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
              <span>نسخة Excel</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
