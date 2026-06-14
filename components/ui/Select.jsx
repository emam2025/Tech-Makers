'use client';

import { forwardRef } from 'react';

const Select = forwardRef(function Select(
  { label, error, helperText, options = [], placeholder, className = '', ...props },
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
      <select
        ref={ref}
        className={`admin-input admin-select ${error ? 'error' : ''} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p className={`text-xs ${error ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-tertiary)]'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Select;
