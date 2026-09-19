import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="Toastify">
      <div className="Toastify__toast-container Toastify__toast-container--top-center">
        {toasts.map((toast, idx) => {
          const typeClass =
            toast.type === 'error'
              ? 'Toastify__toast--error'
              : toast.type === 'success'
              ? 'Toastify__toast--success'
              : 'Toastify__toast--info';

          const iconColorVar =
            toast.type === 'error'
              ? 'var(--toastify-icon-color-error)'
              : toast.type === 'success'
              ? 'var(--toastify-icon-color-success)'
              : 'var(--toastify-icon-color-info)';

          const progressBarTypeClass =
            toast.type === 'error'
              ? 'Toastify__progress-bar--error'
              : toast.type === 'success'
              ? 'Toastify__progress-bar--success'
              : 'Toastify__progress-bar--info';

          return (
            <div
              key={toast.id}
              id={String(toast.id)}
              className={`Toastify__toast Toastify__toast-theme--light ${typeClass} Toastify__toast--close-on-click Toastify--animate`}
              style={{ '--nth': idx + 1, '--len': toasts.length } as React.CSSProperties}
            >
              <div role="alert" className="Toastify__toast-body">
                <div className="Toastify__toast-icon Toastify--animate-icon Toastify__zoom-enter">
                  {toast.type === 'error' && (
                    <svg viewBox="0 0 24 24" width="100%" height="100%" fill={iconColorVar}>
                      <path d="M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z" />
                    </svg>
                  )}
                  {toast.type === 'success' && (
                    <svg viewBox="0 0 24 24" width="100%" height="100%" fill={iconColorVar}>
                      <path d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z" />
                    </svg>
                  )}
                  {toast.type === 'info' && (
                    <svg viewBox="0 0 24 24" width="100%" height="100%" fill={iconColorVar}>
                      <path d="M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z" />
                    </svg>
                  )}
                </div>
                <div>{toast.message}</div>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="Toastify__close-button Toastify__close-button--light"
                type="button"
                aria-label="close"
              >
                <svg aria-hidden="true" viewBox="0 0 14 16">
                  <path
                    fillRule="evenodd"
                    d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"
                  />
                </svg>
              </button>

              <div
                role="progressbar"
                aria-hidden="false"
                aria-label="notification timer"
                className={`Toastify__progress-bar Toastify__progress-bar--animated Toastify__progress-bar-theme--light ${progressBarTypeClass}`}
                style={{ animationDuration: '5000ms', animationPlayState: 'running', opacity: 1 }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
