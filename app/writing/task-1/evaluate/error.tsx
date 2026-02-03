'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Common';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Task1EvaluateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the console for debugging
    console.error('Task 1 Evaluation Error:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <AlertTriangle size={48} color="#dc2626" style={{ marginBottom: '1rem' }} />
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1e293b' }}>
        Evaluation Error
      </h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '400px' }}>
        An error occurred during evaluation. Please try again.
      </p>
      <Button onClick={reset}>
        <RefreshCw size={16} />
        Try again
      </Button>
    </div>
  );
}
