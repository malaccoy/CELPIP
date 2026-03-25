'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface GuestWallProps {
  isLoggedIn: boolean;
  onContinue?: () => void;
}

export function getGuestCount() { return 0; }
export function incrementGuestCount() { return 0; }
export function isGuestLimitReached() { return false; }
export function clearGuestCount() {}

export default function GuestWall({ isLoggedIn }: GuestWallProps) {
  const router = useRouter();
  const pathname = usePathname();

  const goRegister = () => {
    if (typeof window !== 'undefined') {
      // Save current drill path (without ?guest=1) so they come back after signup
      localStorage.setItem('redirect_after_login', pathname);
    }
    router.push('/auth/register');
  };

  const goLogin = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('redirect_after_login', pathname);
    }
    router.push('/auth/login');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, minHeight: '100dvh', overflow: 'auto',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1c2137 0%, #232840 100%)',
        borderRadius: 24, padding: '2rem 1.5rem', maxWidth: 400, width: '100%',
        textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)', margin: 'auto',
      }}>
        {/* Score teaser */}
        <div style={{ fontSize: 56, marginBottom: 12 }}>🎯</div>

        <h2 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
          Great job! Keep going?
        </h2>

        <p style={{
          margin: '0 0 24px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5,
        }}>
          Create a free account to continue practicing<br />
          and get <strong style={{ color: '#22c55e' }}>10 free exercises every day</strong>!
        </p>

        {/* Benefits */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28,
          textAlign: 'left', padding: '0 12px',
        }}>
          {[
            ['🎯', '10 free exercises daily'],
            ['🤖', 'AI-powered feedback & scoring'],
            ['📊', 'Track your progress over time'],
            ['🏆', 'Compete on the leaderboard'],
            ['⚔️', 'Battle Mode — challenge others!'],
          ].map(([emoji, text], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)' }}>
              <span style={{ fontSize: 20 }}>{emoji}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={goRegister}
          style={{
            width: '100%', padding: '16px 24px', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #ff3b3b, #ff5252)', color: '#fff',
            fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255,59,59,0.4)',
            transition: 'transform 0.15s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Create Free Account 🚀
        </button>

        {/* Login link */}
        <p style={{ margin: '16px 0 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>
          Already have an account?{' '}
          <span onClick={goLogin} style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}>
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
