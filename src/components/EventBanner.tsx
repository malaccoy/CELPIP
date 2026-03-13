'use client';

import React, { useState, useEffect } from 'react';
import { X, Zap, Clock, Copy, Check } from 'lucide-react';
import { getActiveEvent, getTimeRemaining, type SiteEvent } from '@/lib/events';
import { useContentAccess } from '@/hooks/useContentAccess';
import styles from '@/styles/EventBanner.module.scss';

export function EventBanner() {
  const [event, setEvent] = useState<SiteEvent | null>(null);
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isPro } = useContentAccess();

  useEffect(() => {
    const active = getActiveEvent();
    if (!active) return;

    setEvent(active);
    setTime(getTimeRemaining(active.endDate));

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(active.endDate);
      setTime(remaining);
      if (remaining.expired) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    if (event) localStorage.setItem('event-dismissed', event.id);
    setDismissed(true);
  };

  const handleCopyCode = () => {
    if (!event) return;
    navigator.clipboard.writeText(event.promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!event || time.expired || isPro) return null;
  if (dismissed) return null;

  return (
    <div
      className={styles.banner}
      style={{
        background: `linear-gradient(135deg, ${event.bannerColor} 0%, ${event.bannerColorEnd} 100%)`,
      }}
    >
      <div className={styles.content}>
        <div className={styles.left}>
          <span className={styles.emoji}>{event.bannerEmoji}</span>
          <div className={styles.text}>
            <span className={styles.eventName}>{event.name}</span>
            <span className={styles.discount}>{event.discount}</span>
            <span className={styles.description}>{event.description}</span>
          </div>
        </div>

        <div className={styles.center}>
          <Clock size={14} className={styles.clockIcon} />
          <div className={styles.countdown}>
            <div className={styles.timeUnit}>
              <span className={styles.timeValue}>{String(time.days).padStart(2, '0')}</span>
              <span className={styles.timeLabel}>days</span>
            </div>
            <span className={styles.timeSep}>:</span>
            <div className={styles.timeUnit}>
              <span className={styles.timeValue}>{String(time.hours).padStart(2, '0')}</span>
              <span className={styles.timeLabel}>hrs</span>
            </div>
            <span className={styles.timeSep}>:</span>
            <div className={styles.timeUnit}>
              <span className={styles.timeValue}>{String(time.minutes).padStart(2, '0')}</span>
              <span className={styles.timeLabel}>min</span>
            </div>
            <span className={styles.timeSep}>:</span>
            <div className={styles.timeUnit}>
              <span className={styles.timeValue}>{String(time.seconds).padStart(2, '0')}</span>
              <span className={styles.timeLabel}>sec</span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <button className={styles.codeBtn} onClick={handleCopyCode}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span className={styles.code}>{event.promoCode}</span>
          </button>
          <button className={styles.ctaBtn} onClick={async () => {
            try {
              const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: 'monthly', promoCode: event.promoCode }),
              });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
              else window.location.href = '/pricing';
            } catch { window.location.href = '/pricing'; }
          }}>
            <Zap size={14} />
            {event.ctaText}
          </button>
        </div>
      </div>

      <button className={styles.closeBtn} onClick={handleDismiss}>
        <X size={14} />
      </button>
    </div>
  );
}
