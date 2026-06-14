'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="bg-surface/95 border-b border-outline-variant/30 shadow-sm sticky top-0 z-40 w-full">
        <div className="flex items-center justify-between px-margin-mobile md:px-margin-desktop py-4 w-full max-w-container-max mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="تك ميكرز" className="h-10 w-auto" loading="lazy" />
          </Link>
          <button className="md:hidden text-primary p-3 hover:bg-primary/10 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center" onClick={() => setOpen(true)} aria-label="القائمة">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-primary font-bold border-b-2 border-primary py-1">الرئيسية</Link>
            <Link href="/about" className="text-on-surface-variant font-medium hover:text-primary-light transition-all duration-300">من نحن</Link>
            <Link href="/secondary" className="text-on-surface-variant font-medium hover:text-primary-light transition-all duration-300">الثانوية العامة</Link>
            <Link href="/certificate" className="text-on-surface-variant font-medium hover:text-primary-light transition-all duration-300">الشهادات</Link>
            <Link href="/join" className="text-on-surface-variant font-medium hover:text-primary-light transition-all duration-300">انضم إلينا</Link>
          </nav>
        </div>
      </header>

      {/* Overlay - outside header so fixed positioning works */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className={`absolute top-0 right-0 h-full w-[280px] bg-surface shadow-2xl transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
            <div className="font-headline-xl text-headline-xl text-primary">تك ميكرز</div>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-surface-container-high rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul className="flex flex-col gap-2 p-6">
            <li>
              <Link href="/" className="bg-primary-container text-on-primary-container rounded-full flex items-center gap-3 px-4 py-3" onClick={() => setOpen(false)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/about" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-high transition-colors" onClick={() => setOpen(false)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                من نحن
              </Link>
            </li>
            <li>
              <Link href="/secondary" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-high transition-colors" onClick={() => setOpen(false)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                الثانوية العامة
              </Link>
            </li>
            <li>
              <Link href="/certificate" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-high transition-colors" onClick={() => setOpen(false)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                الشهادات
              </Link>
            </li>
            <li>
              <Link href="/join" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-high transition-colors" onClick={() => setOpen(false)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>
                انضم إلينا
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
