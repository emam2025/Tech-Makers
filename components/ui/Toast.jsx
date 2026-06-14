'use client';

import { useState, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  const colors = {
    success: 'var(--color-success)',
    error: 'var(--color-danger)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container" dir="rtl">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className="material-symbols-outlined text-[20px]" style={{ color: colors[t.type] }}>
              {icons[t.type]}
            </span>
            <span className="flex-1 text-[var(--color-text-primary)]">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 hover:bg-[var(--color-surface-dim)] rounded cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[var(--color-text-tertiary)]">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
