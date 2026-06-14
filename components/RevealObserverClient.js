"use client";

import { useEffect } from 'react';

export default function RevealObserverClient() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (!els.length) return;

    // Add reveal-animate class to enable animation (content starts visible, then hides for animation)
    els.forEach((el) => el.classList.add('reveal-animate'));

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

    // Small delay to ensure CSS transition is ready
    requestAnimationFrame(() => {
      els.forEach((el) => observer.observe(el));
    });

    // Fallback: reveal all after 1.5s
    const fallback = setTimeout(() => {
      els.forEach((el) => el.classList.add('revealed'));
    }, 1500);

    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return null;
}
