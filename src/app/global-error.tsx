'use client';

import { useEffect } from 'react';

// global-error.tsx replaces the root layout, so it cannot rely on the
// next-intl provider tree — keep copy plain and framework-agnostic.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          textAlign: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Application Error</h1>
          <p style={{ color: '#666', maxWidth: '28rem' }}>
            A critical error occurred. Please reload the page.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              backgroundColor: '#111827',
              color: '#fff',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
