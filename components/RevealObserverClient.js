"use client";

import { useEffect } from 'react';

export default function RevealObserverClient() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '50px' }
    );

    els.forEach((el) => observer.observe(el));

    // Fallback: reveal all after 2s in case observer is slow
    const fallback = setTimeout(() => {
      els.forEach((el) => el.classList.add('revealed'));
    }, 2000);

    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return null;
}
