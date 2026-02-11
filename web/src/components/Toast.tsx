import React from 'react';

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div
      id="toast"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: '14px',
        transform: 'translateX(-50%)',
        padding: '8px 10px',
        borderRadius: '12px',
        border: '1px solid rgba(28,28,44,.12)',
        background: 'rgba(255,255,255,.92)',
        color: 'rgba(28,28,44,.92)',
        fontSize: '12px',
        zIndex: 9999,
        boxShadow: '0 12px 30px rgba(22,18,40,.14)',
      }}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
