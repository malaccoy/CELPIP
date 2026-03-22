'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Zap, Clock, Gift, ArrowRight } from 'lucide-react';

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function ExerciseOfferPopup({ show, onClose }: Props) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 min countdown
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!show) return;
    setTimeLeft(300);
    setExpired(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [show]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleClaim = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'monthly' }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // fallback
      window.location.href = '/pricing';
    }
    setLoading(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, animation: 'offerFadeIn 0.3s ease',
    }}>
      <style>{`
        @keyframes offerFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes offerPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes offerShine { 0% { left: -100%; } 100% { left: 100%; } }
      `}</style>
      <div style={{
        background: 'linear-gradient(145deg, #1a1f2e, #0f1420)',
        border: '2px solid #f59e0b',
        borderRadius: 20,
        padding: '28px 24px',
        maxWidth: 380, width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(255,255,255,0.1)', border: 'none',
          borderRadius: 20, width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#888',
        }}>
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 4 }}>🎉</div>
          <h3 style={{ color: '#fff', fontSize: 20, margin: '0 0 4px', fontWeight: 700 }}>
            Great job practicing!
          </h3>
          <p style={{ color: '#f59e0b', fontSize: 14, margin: 0, fontWeight: 600 }}>
            Here&apos;s an exclusive reward for you
          </p>
        </div>

        {/* Offer card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e2a40, #152030)',
          border: '1px solid #f59e0b44',
          borderRadius: 14,
          padding: '16px',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Shine effect */}
          <div style={{
            position: 'absolute', top: 0, width: '50%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.1), transparent)',
            animation: 'offerShine 3s ease-in-out infinite',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              background: '#f59e0b22', borderRadius: 10, padding: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Gift size={24} color="#f59e0b" />
            </div>
            <div>
              <div style={{ color: '#f59e0b', fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>
                UPGRADE TO PRO
              </div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>
                Unlimited Access
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <span style={{ color: '#34d399', fontSize: 28, fontWeight: 800 }}>CA$24.99</span>
            <span style={{ color: '#888', fontSize: 13 }}>/month</span>
          </div>

          <p style={{ color: '#aaa', fontSize: 12, margin: '4px 0 0' }}>
            Unlimited exercises • Advanced level • AI feedback
          </p>
        </div>

        {/* Timer */}
        {!expired ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, marginBottom: 16, color: timeLeft < 60 ? '#f87171' : '#f59e0b',
          }}>
            <Clock size={14} />
            <span style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              Offer expires in {formatTime(timeLeft)}
            </span>
          </div>
        ) : (
          <div style={{
            textAlign: 'center', marginBottom: 16, color: '#f87171', fontSize: 14, fontWeight: 600,
          }}>
            ⏰ Offer expired!
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleClaim}
          disabled={loading || expired}
          style={{
            width: '100%', padding: '14px 0',
            background: expired ? '#333' : 'linear-gradient(135deg, #f59e0b, #f97316)',
            border: 'none', borderRadius: 12,
            color: expired ? '#666' : '#000',
            fontWeight: 700, fontSize: 16,
            cursor: expired ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            animation: expired ? 'none' : 'offerPulse 2s ease-in-out infinite',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <Zap size={18} />
          {loading ? 'Loading...' : expired ? 'Offer Expired' : 'Claim 50% OFF Now'}
          {!expired && <ArrowRight size={16} />}
        </button>

        {/* Skip */}
        <button onClick={onClose} style={{
          width: '100%', marginTop: 10, padding: '8px 0',
          background: 'none', border: 'none',
          color: '#555', fontSize: 12, cursor: 'pointer',
        }}>
          No thanks, I&apos;ll keep the free plan
        </button>
      </div>
    </div>
  );
}
