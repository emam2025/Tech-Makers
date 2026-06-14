'use client';

import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
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
    xl: 'max-w-xl',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${sizes[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)]">
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-surface-dim)] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[var(--color-text-secondary)]">close</span>
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-dim)] rounded-b-[var(--radius-xl)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'تأكيد', confirmVariant = 'danger', loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">{message}</p>
      <div className="flex items-center justify-end gap-3">
        <button onClick={onClose} className="admin-btn admin-btn-secondary" disabled={loading}>
          إلغاء
        </button>
        <button
          onClick={onConfirm}
          className={`admin-btn ${confirmVariant === 'danger' ? 'admin-btn-danger' : 'admin-btn-primary'}`}
          disabled={loading}
        >
          {loading ? 'جاري...' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
