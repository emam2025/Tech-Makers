'use client';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`card-admin ${hover ? 'hover:shadow-[var(--shadow-medium)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 border-b border-[var(--color-border-subtle)] ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-5 py-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-dim)] rounded-b-[var(--radius-lg)] ${className}`}>
      {children}
    </div>
  );
}

export function KPICard({ icon, iconColor, iconBg, value, label, trend, trendDir }) {
  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="kpi-value">{value}</div>
          <div className="kpi-label">{label}</div>
          {trend && (
            <div className={`kpi-trend ${trendDir === 'up' ? 'up' : 'down'}`}>
              <span className="material-symbols-outlined text-[12px]">
                {trendDir === 'up' ? 'trending_up' : 'trending_down'}
              </span>
              {trend}
            </div>
          )}
        </div>
        <div className="kpi-icon" style={{ background: iconBg || 'var(--color-primary-light)' }}>
          <span className="material-symbols-outlined text-[20px]" style={{ color: iconColor || 'var(--color-primary)' }}>
            {icon}
          </span>
        </div>
      </div>
    </div>
  );
}
