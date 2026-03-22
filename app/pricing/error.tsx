'use client';

export default function PricingError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: 40, textAlign: 'center', color: '#fff' }}>
      <h2>Something went wrong loading pricing</h2>
      <p style={{ color: '#999', margin: '12px 0' }}>{error.message}</p>
      <button 
        onClick={reset}
        style={{ background: '#ff3b3b', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 16 }}
      >
        Try Again
      </button>
    </div>
  );
}
