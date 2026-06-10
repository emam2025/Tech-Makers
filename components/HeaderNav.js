'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HeaderNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="hamburger" onClick={() => setOpen(!open)} aria-label="القائمة">
        <span className={`ham-line ${open ? 'open' : ''}`}></span>
        <span className={`ham-line ${open ? 'open' : ''}`}></span>
        <span className={`ham-line ${open ? 'open' : ''}`}></span>
      </button>
      <nav className={`header-nav ${open ? 'nav-open' : ''}`}>
        <Link href="/" onClick={() => setOpen(false)}>تك ميكرز</Link>
        <Link href="/about" onClick={() => setOpen(false)}>من نحن</Link>
        <Link href="/certificate" onClick={() => setOpen(false)}>التحقق من الشهادة</Link>
        <Link href="/join" onClick={() => setOpen(false)}>انضم الينا</Link>
        <Link href="/join" className="nav-mobile-cta" onClick={() => setOpen(false)}>انضم لفريق العمل</Link>
      </nav>
    </>
  );
}
