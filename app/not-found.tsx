import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{
        fontSize: '4rem',
        fontWeight: 800,
        color: '#ff3b3b',
        marginBottom: '0.5rem',
        fontFamily: 'Space Grotesk, sans-serif',
      }}>404</h1>
      <h2 style={{
        fontSize: '1.5rem',
        color: '#f1f5f9',
        marginBottom: '0.75rem',
        fontFamily: 'Space Grotesk, sans-serif',
      }}>Page Not Found</h2>
      <p style={{
        color: '#94a3b8',
        marginBottom: '2rem',
        maxWidth: '400px',
        lineHeight: 1.5,
      }}>
        This page doesn&apos;t exist. But your CELPIP score can still exist at CLB 9+.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #cc0000, #ff3b3b)',
          color: 'white',
          fontWeight: 700,
          textDecoration: 'none',
        }}>Go Home</Link>
        <Link href="/blog" style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#cbd5e1',
          fontWeight: 600,
          textDecoration: 'none',
        }}>Read Blog</Link>
      </div>
    </div>
  );
}
