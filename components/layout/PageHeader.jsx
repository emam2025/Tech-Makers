'use client';

export default function PageHeader({ title, subtitle, action, actionIcon, actionLabel, onAction, children }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {children}
        {action && (
          <button onClick={onAction} className="admin-btn admin-btn-primary">
            {actionIcon && <span className="material-symbols-outlined text-[18px]">{actionIcon}</span>}
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
