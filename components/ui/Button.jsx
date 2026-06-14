'use client';

import { forwardRef } from 'react';

const variants = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-[var(--shadow-soft)]',
  secondary: 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-dim)]',
  ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-dim)] hover:text-[var(--color-text-primary)]',
  danger: 'bg-[var(--color-danger)] text-white hover:bg-[#B91C1C]',
  'danger-ghost': 'bg-transparent text-[var(--color-danger)] border border-[var(--color-danger-border)] hover:bg-[var(--color-danger-light)]',
  link: 'bg-transparent text-[var(--color-primary)] hover:underline p-0 h-auto',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs h-8 min-h-[32px]',
  md: 'px-5 py-2.5 text-sm h-10 min-h-[40px]',
  lg: 'px-6 py-3 text-base h-12 min-h-[48px]',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading, icon, iconRight, children, className = '', disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-md)] transition-all duration-[var(--transition-fast)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="material-symbols-outlined text-[18px]">{iconRight}</span>
      )}
    </button>
  );
});

export default Button;
