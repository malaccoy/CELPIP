'use client';

import React, { useState, useEffect } from 'react';
import { X, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import styles from '@/styles/EmailCapture.module.scss';

export default function EmailCapturePopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Don't show if already dismissed or subscribed
    const dismissed = localStorage.getItem('celpip-email-dismissed');
    const subscribed = localStorage.getItem('celpip-email-subscribed');
    if (dismissed || subscribed) return;

    // Show after 45 seconds on page
    const timer = setTimeout(() => setShow(true), 45000);
    
    // Also show on scroll (65% of page)
    const handleScroll = () => {
      const scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPct > 0.65) {
        setShow(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Exit intent (mouse leaves viewport top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('celpip-email-dismissed', Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'popup' }),
      });

      if (res.ok) {
        setStatus('success');
        localStorage.setItem('celpip-email-subscribed', 'true');
        setTimeout(() => setShow(false), 3000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (!show) return null;

  return (
    <div className={styles.overlay} onClick={handleDismiss}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={handleDismiss}>
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className={styles.success}>
            <CheckCircle2 size={48} />
            <h3>You&apos;re in! 🎉</h3>
            <p>Check your inbox for your free CELPIP study plan.</p>
          </div>
        ) : (
          <>
            <div className={styles.iconWrap}>
              <BookOpen size={32} />
            </div>

            <h3>Get Your Free CELPIP Study Plan</h3>
            <p>
              A 14-day study plan tailored to your target CLB score. 
              Plus weekly tips from our AI coach.
            </p>

            <ul className={styles.benefits}>
              <li><CheckCircle2 size={14} /> 14-day structured study schedule</li>
              <li><CheckCircle2 size={14} /> Section-by-section strategy breakdown</li>
              <li><CheckCircle2 size={14} /> Weekly CELPIP tips & practice prompts</li>
            </ul>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
              <button 
                type="submit" 
                className={styles.submit}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : (
                  <>
                    <span>Get Free Plan</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {status === 'error' && (
              <p className={styles.errorMsg}>Something went wrong. Please try again.</p>
            )}

            <p className={styles.privacy}>No spam, ever. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  );
}
