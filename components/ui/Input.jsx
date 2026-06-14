'use client';

import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, helperText, icon, prefix, suffix, className = '', ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-[var(--color-text-primary)]">
          {label}
          {props.required && <span className="text-[var(--color-danger)] mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] text-[20px] pointer-events-none">
            {icon}
          </span>
        )}
        {prefix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={`admin-input ${icon || prefix ? 'pr-10' : ''} ${suffix ? 'pl-10' : ''} ${error ? 'error' : ''} ${className}`}
          {...props}
        />
        {suffix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] text-sm">
            {suffix}
          </span>
        )}
      </div>
      {(error || helperText) && (
        <p className={`text-xs ${error ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-tertiary)]'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
