'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Zap, Clock, Gift, ArrowRight, Trophy, AlertCircle } from 'lucide-react';
import styles from '@/styles/ExerciseOfferPopup.module.scss';

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function ExerciseOfferPopup({ show, onClose }: Props) {
  const [timeLeft, setTimeLeft] = useState(300);
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
      window.location.href = '/pricing';
    }
    setLoading(false);
  };

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {/* Close */}
        <button onClick={onClose} className={styles.closeBtn} aria-label="Close">
          <X size={16} />
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <Trophy size={40} />
          </div>
          <h3 className={styles.headerTitle}>Great job practicing!</h3>
          <p className={styles.headerSubtitle}>Here&apos;s an exclusive reward for you</p>
        </div>

        {/* Offer card */}
        <div className={styles.offerCard}>
          <div className={styles.shine} />
          <div className={styles.offerRow}>
            <div className={styles.offerIconBox}>
              <Gift size={24} />
            </div>
            <div>
              <div className={styles.offerLabel}>UPGRADE TO PRO</div>
              <div className={styles.offerTitle}>Unlimited Access</div>
            </div>
          </div>
          <div className={styles.priceRow}>
            <span className={styles.priceValue}>CA$24.99</span>
            <span className={styles.pricePeriod}>/month</span>
          </div>
          <p className={styles.offerFeatures}>
            Unlimited exercises &middot; Advanced level &middot; AI feedback
          </p>
        </div>

        {/* Timer */}
        {!expired ? (
          <div className={timeLeft < 60 ? styles.timerUrgent : styles.timerActive}>
            <Clock size={14} />
            <span>Offer expires in {formatTime(timeLeft)}</span>
          </div>
        ) : (
          <div className={styles.timerExpired}>
            <AlertCircle size={14} /> Offer expired!
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleClaim}
          disabled={loading || expired}
          className={expired ? styles.ctaBtnDisabled : styles.ctaBtn}
        >
          <Zap size={18} />
          {loading ? 'Loading...' : expired ? 'Offer Expired' : 'Claim 50% OFF Now'}
          {!expired && <ArrowRight size={16} />}
        </button>

        {/* Skip */}
        <button onClick={onClose} className={styles.skipBtn}>
          No thanks, I&apos;ll keep the free plan
        </button>
      </div>
    </div>
  );
}
