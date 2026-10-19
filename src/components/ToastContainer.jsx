import React from 'react';

export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let icon = 'fa-circle-info';
        if (toast.type === 'success') icon = 'fa-circle-check';
        if (toast.type === 'warning') icon = 'fa-triangle-exclamation';
        if (toast.type === 'danger') icon = 'fa-circle-exclamation';

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <i className={`fa-solid ${icon}`}></i>
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
