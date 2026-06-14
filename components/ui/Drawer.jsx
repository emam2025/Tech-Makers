'use client';

import { useEffect } from 'react';

export default function Drawer({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className={`drawer-content ${sizes[size]}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)]">
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-dim)] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[var(--color-text-secondary)]">close</span>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </>
  );
}
