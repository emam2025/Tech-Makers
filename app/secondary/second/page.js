import Link from 'next/link';

const SEMESTER1 = [
  {
    id: 1,
    title: 'أساسيات البرمجة باستخدام Python',
    icon: 'code',
    color: '#4169e1',
    topics: ['بيئة البرمجة', 'كتابة أول برنامج', 'المتغيرات', 'الإدخال والإخراج', 'العمليات'],
    activities: null,
  },
  {
    id: 2,
    title: 'التحكم في سير البرنامج',
    icon: 'alt_route',
    color: '#fd761a',
    topics: ['الشروط', 'If / Else', 'المقارنات', 'العمليات المنطقية'],
    activities: ['برامج حسابية', 'أنظمة اختيار بسيطة'],
  },
  {
    id: 3,
    title: 'التكرار والحلقات',
    icon: 'loop',
    color: '#2ecc71',
    topics: ['For Loop', 'While Loop', 'التعامل مع التكرار'],
    activities: ['آلة حاسبة', 'برامج تدريبية'],
  },
  {
    id: 4,
    title: 'هياكل البيانات',
    icon: 'data_object',
    color: '#9b59b6',
    topics: ['Lists', 'Strings', 'Tuples', 'التعامل مع البيانات'],
    activities: null,
  },
];

const SEMESTER2 = [
  {
    id: 5,
    title: 'الدوال والبرمجة المنظمة',
    icon: 'function',
    color: '#e74c3c',
    topics: ['Functions', 'Parameters', 'تنظيم الكود', 'إعادة استخدام البرمجيات'],
    activities: null,
  },
  {
    id: 6,
    title: 'البرمجة الكائنية OOP',
    icon: 'category',
    color: '#1abc9c',
    topics: ['Classes', 'Objects', 'الخصائص والوظائف', 'مبادئ البرمجة الحديثة'],
    activities: null,
  },
  {
    id: 7,
    title: 'الخوارزميات وحل المشكلات',
    icon: 'route',
    color: '#e67e22',
    topics: ['التفكير التحليلي', 'البحث', 'الترتيب', 'كفاءة الحل'],
    activities: null,
  },
  {
    id: 8,
    title: 'مدخل الذكاء الاصطناعي',
    icon: 'smart_toy',
    color: '#8e44ad',
    topics: ['مفهوم AI', 'تعلم الآلة', 'استخدامات الذكاء الاصطناعي', 'تطبيقات عملية'],
    activities: 'مشروع نهاية العام: تطبيق برمجي كامل',
  },
];

const FEATURES = [
  { icon: 'school', label: 'عام دراسي كامل' },
  { icon: 'schedule', label: 'محاضرتان أسبوعيًا' },
  { icon: 'play_circle', label: 'شرح + تطبيق عملي' },
  { icon: 'rocket_launch', label: 'مشاريع حقيقية' },
  { icon: 'quiz', label: 'تقييمات دورية' },
];

export default function SecondGradePage() {
  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero */}
      <section className="relative py-16 md:py-24 px-margin-mobile md:px-margin-desktop overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2d6e 0%, #1a3fa0 50%, #4169e1 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-[#fd761a]/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/secondary" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
            العودة لصفحة الثانوية العامة
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block bg-[#f7be1d] text-[#1a3fa0] text-xs font-bold px-3 py-1.5 rounded-full">الصف الثاني الثانوي</span>
            <span className="inline-block bg-white/15 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">مسار الهندسة وعلوم الحاسب</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
            البرمجة والتطبيقات المتقدمة
          </h1>
          <p className="text-white/75 text-lg md:text-xl max-w-3xl" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
            ينتقل إلى البرمجة العملية والذكاء الاصطناعي — 8 وحدات تشمل Python والبرمجة الكائنية والخوارزميات
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {FEATURES.map((f, i) => (
              <span key={i} className="flex items-center gap-1.5 bg-white/10 text-white px-3 py-1.5 rounded-lg text-sm border border-white/15">
                <span className="material-symbols-outlined text-sm">{f.icon}</span>
                {f.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Semester 1 */}
      <section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block bg-[#4169e1] text-white text-xs font-bold px-3 py-1.5 rounded-full">الفصل الدراسي الأول</span>
          </div>
          <div className="space-y-5">
            {SEMESTER1.map((unit) => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        </div>
      </section>

      {/* Semester 2 */}
      <section className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block bg-[#fd761a] text-white text-xs font-bold px-3 py-1.5 rounded-full">الفصل الدراسي الثاني</span>
          </div>
          <div className="space-y-5">
            {SEMESTER2.map((unit) => (
              <UnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-margin-mobile md:px-margin-desktop bg-gradient-to-br from-[#1a3fa0] to-[#4169e1]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>ابدأ مسار البرمجة والتطبيقات</h2>
          <p className="text-white/75 mb-6" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>سجّل الآن واحصل على مقعد في دورة الصف الثاني الثانوي</p>
          <Link href="/secondary#register" className="inline-flex items-center gap-2 bg-[#f7be1d] text-[#1a3fa0] px-8 py-3.5 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all">
            <span className="material-symbols-outlined">app_registration</span>
            سجّل الآن
          </Link>
        </div>
      </section>
    </main>
  );
}

function UnitCard({ unit }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4 p-5">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${unit.color}15` }}>
          <span className="material-symbols-outlined text-2xl" style={{ color: unit.color }}>{unit.icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${unit.color}15`, color: unit.color }}>
              الوحدة {unit.id}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>{unit.title}</h3>
        </div>
      </div>
      <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">topic</span>
            المحاور
          </h4>
          <ul className="space-y-1">
            {unit.topics.map((t, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: unit.color }} />
                {t}
              </li>
            ))}
          </ul>
        </div>
        {unit.activities && (
          <div>
            <h4 className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">science</span>
              المشاريع والتطبيقات
            </h4>
            {Array.isArray(unit.activities) ? (
              <ul className="space-y-1">
                {unit.activities.map((a, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-green-500 text-xs mt-0.5">check</span>
                    {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-700 flex items-start gap-1.5">
                <span className="material-symbols-outlined text-green-500 text-xs mt-0.5">check</span>
                {unit.activities}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
