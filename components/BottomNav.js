'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: 'home', label: 'الرئيسية' },
  { href: '/tracks', icon: 'psychology', label: 'المسارات' },
  { href: '/register', icon: 'stars', label: 'التسجيل' },
  { href: '/join', icon: 'payments', label: 'انضم' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-white/90 dark:bg-surface-container/90 backdrop-blur-lg border-t border-primary/10 flex justify-around items-center h-20 md:hidden rounded-t-[2.5rem] shadow-[0_-10px_30px_rgba(49,130,206,0.1)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-all ${
              isActive
                ? 'text-primary font-black'
                : 'text-on-background/40 hover:text-primary'
            }`}
          >
            <span
              className={`material-symbols-outlined ${isActive ? 'text-3xl' : 'text-2xl'}`}
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[10px] mt-1 uppercase tracking-tighter">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
