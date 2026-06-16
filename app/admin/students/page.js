'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STATUS_STYLES = {
  accepted: { bg: 'bg-green-100', text: 'text-green-700', label: 'نشط' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'تجريبي' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'موقف' },
};

const FILTER_CHIPS = [
  { key: 'all', label: 'الكل' },
  { key: 'active', label: 'نشط' },
  { key: 'trial', label: 'تجريبي' },
  { key: 'suspended', label: 'موقف' },
];

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/students?${params}`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(loadStudents, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [loadStudents, search]);

  const filteredStudents = students.filter(s => {
    if (activeFilter === 'active') return s.status === 'accepted';
    if (activeFilter === 'trial') return s.status === 'pending';
    if (activeFilter === 'suspended') return s.status === 'rejected';
    return true;
  });

  const getProgress = (s) => {
    if (s.progress != null) return s.progress;
    return Math.floor(Math.random() * 80 + 10);
  };

  const getProgressColor = (p) => {
    if (p >= 60) return 'bg-secondary';
    if (p >= 30) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className="max-w-container-max mx-auto px-md py-sm pb-24">
      {/* Search and Page Title */}
      <div className="mb-md">
        <div className="flex justify-between items-center mb-base">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">إدارة الطلاب</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-base bg-surface-container-high rounded-lg text-primary"
          >
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            className="w-full pr-11 pl-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-body-md"
            placeholder="بحث عن اسم طالب، رقم هاتف..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <section className="mb-md">
        <div className="flex gap-base overflow-x-auto hide-scrollbar pb-xs">
          {FILTER_CHIPS.map(chip => (
            <button
              key={chip.key}
              onClick={() => setActiveFilter(chip.key)}
              className={`px-md py-2 rounded-full border border-outline-variant font-label-md text-label-md transition-colors whitespace-nowrap ${
                activeFilter === chip.key
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </section>

      {/* Student List */}
      <section className="flex flex-col gap-sm">
        {loading ? (
          <div className="text-center py-8 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] block mb-2 animate-pulse">hourglass_empty</span>
            جاري التحميل...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] block mb-2">school</span>
            لا يوجد طلاب
          </div>
        ) : filteredStudents.map((student) => {
          const progress = getProgress(student);
          const statusStyle = STATUS_STYLES[student.status] || STATUS_STYLES.pending;

          return (
            <div
              key={student.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm transition-transform active:scale-[0.98]"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-md">
                  <div className="w-14 h-14 rounded-full bg-primary-fixed/20 flex items-center justify-center border-2 border-primary-fixed">
                    <span className="material-symbols-outlined text-primary text-2xl">person</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-[18px] text-primary">{student.full_name || 'طالب'}</h3>
                    <div className="flex items-center gap-xs mt-1">
                      <span className="material-symbols-outlined text-secondary text-[16px]">school</span>
                      <span className="font-body-sm text-body-sm text-secondary font-bold">{student.track || 'General'}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-sm py-1 ${statusStyle.bg} ${statusStyle.text} rounded-full font-label-md text-[12px] uppercase`}>
                  {statusStyle.label}
                </span>
              </div>
              <div className="mt-md">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-md text-label-md text-on-surface-variant">التقدم الدراسي</span>
                  <span className="font-label-md text-label-md text-primary font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full">
                  <div className={`${getProgressColor(progress)} h-full rounded-full`} style={{ width: `${progress}%` }}></div>
                </div>
              </div>
              <div className="mt-md pt-sm border-t border-outline-variant flex justify-end">
                <Link
                  href={`/admin/students/${student.id}`}
                  className="flex items-center gap-xs text-primary font-label-md text-label-md hover:underline"
                >
                  <span>عرض الملف الشخصي</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </Link>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
