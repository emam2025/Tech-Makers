'use client';

const variants = {
  active: 'status-badge active',
  pending: 'status-badge pending',
  expired: 'status-badge expired',
  suspended: 'status-badge suspended',
  trial: 'status-badge trial',
  success: 'status-badge active',
  warning: 'status-badge pending',
  danger: 'status-badge expired',
  info: 'status-badge trial',
  default: 'status-badge suspended',
};

export default function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span className={`${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
