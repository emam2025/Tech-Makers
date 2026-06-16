'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 glass-card border-b border-primary/5 h-16 md:h-20">
        <div className="flex justify-between items-center h-full px-4 md:px-8 max-w-container-max mx-auto">
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <img src="/logo.png" alt="Tech Makers Egypt" className="h-6 md:h-7 w-auto dark:hidden" />
          <img src="/w- logo.png" alt="Tech Makers Egypt" className="h-6 md:h-7 w-auto hidden dark:block" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/" className="px-3 py-2 rounded-lg text-sm font-bold text-on-surface hover:bg-primary/5 hover:text-primary transition-colors">الرئيسية</Link>
          <Link href="/about" className="px-3 py-2 rounded-lg text-sm font-bold text-on-surface/70 hover:bg-primary/5 hover:text-primary transition-colors">من نحن</Link>
          <div className="relative group">
            <button className="px-3 py-2 rounded-lg text-sm font-bold text-on-surface/70 hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-1">
              برامجنا
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
            <div className="absolute top-full right-0 mt-1 w-56 bg-surface dark:bg-surface-container-high rounded-xl shadow-xl border border-outline-variant/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
              <Link href="/tracks?track=a" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-on-surface hover:bg-primary/5 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg text-primary">psychology</span>
                تك ميكرز
              </Link>
              <Link href="/tracks?track=technomath" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-on-surface hover:bg-primary/5 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg text-accent">calculate</span>
                تيكنو ماث
              </Link>
              <Link href="/tracks?track=techenglish" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-on-surface hover:bg-primary/5 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg text-primary">translate</span>
                لغة إنجليزية
              </Link>
              <Link href="/secondary" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-on-surface hover:bg-primary/5 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg text-accent">school</span>
                ثانوية عامة
              </Link>
            </div>
          </div>
          <Link href="/certificate" className="px-3 py-2 rounded-lg text-sm font-bold text-on-surface/70 hover:bg-primary/5 hover:text-primary transition-colors">الشهادات</Link>
          <Link href="/join" className="px-3 py-2 rounded-lg text-sm font-bold text-on-surface/70 hover:bg-primary/5 hover:text-primary transition-colors">انضم إلينا</Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden sm:flex items-center gap-2 text-on-surface/70 hover:text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined text-xl">login</span>
            <span className="text-sm font-bold hidden md:inline">دخول</span>
          </Link>
          <button className="lg:hidden text-primary p-2 hover:bg-primary/5 rounded-full transition-colors" onClick={() => setOpen(true)} aria-label="القائمة">
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className={`absolute top-0 right-0 h-full w-[280px] bg-surface dark:bg-surface-container shadow-2xl transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-outline-variant">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <img src="/logo.png" alt="Tech Makers Egypt" className="h-6 w-auto dark:hidden" />
              <img src="/w- logo.png" alt="Tech Makers Egypt" className="h-6 w-auto hidden dark:block" />
            </Link>
            <button onClick={() => setOpen(false)} aria-label="إغلاق القائمة" className="p-2 hover:bg-surface-container-high rounded-full">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <ul className="flex flex-col gap-2 p-6">
            <li>
              <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-colors font-bold text-primary" onClick={() => setOpen(false)}>
                <span className="material-symbols-outlined">home</span>
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/about" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-colors" onClick={() => setOpen(false)}>
                <span className="material-symbols-outlined">info</span>
                من نحن
              </Link>
            </li>
            <li>
              <Link href="/tracks" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-colors" onClick={() => setOpen(false)}>
                <span className="material-symbols-outlined">psychology</span>
                برامجنا
              </Link>
            </li>
            <li>
              <Link href="/certificate" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-colors" onClick={() => setOpen(false)}>
                <span className="material-symbols-outlined">verified</span>
                الشهادات
              </Link>
            </li>
            <li>
              <Link href="/join" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-colors" onClick={() => setOpen(false)}>
                <span className="material-symbols-outlined">group_add</span>
                انضم إلينا
              </Link>
            </li>
            <li className="mt-4">
              <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 text-primary font-bold transition-colors" onClick={() => setOpen(false)}>
                <span className="material-symbols-outlined">login</span>
                دخول النظام
              </Link>
            </li>
          </ul>
          <div className="px-6 pb-6">
            <ThemeToggle className="w-full" />
          </div>
        </div>
      </div>
    </>
  );
}
