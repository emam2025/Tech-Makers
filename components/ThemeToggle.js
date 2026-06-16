'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  if (!mounted) {
    return (
      <button
        className={`w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container-high text-on-surface-variant ${className}`}
        aria-label="تبديل الوضع"
        disabled
      >
        <span className="material-symbols-outlined text-xl">brightness_medium</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
        dark
          ? 'bg-primary/20 text-primary hover:bg-primary/30'
          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
      } ${className}`}
      aria-label={dark ? 'الوضع الفاتح' : 'الوضع الداكن'}
    >
      <span className="material-symbols-outlined text-xl">
        {dark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
