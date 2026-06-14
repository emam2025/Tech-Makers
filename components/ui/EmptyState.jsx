'use client';

export default function EmptyState({ icon = 'inbox', title, description, action }) {
  return (
    <div className="empty-state">
      <span className="material-symbols-outlined">{icon}</span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
