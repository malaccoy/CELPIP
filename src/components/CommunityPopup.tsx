'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { X, ExternalLink, Users, Newspaper, FileText, Target, UserPlus, Zap, ArrowRight } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import styles from '@/styles/CommunityPopup.module.scss';

const TELEGRAM_GROUP = 'https://t.me/+YcO9MfUHIjQyYjAx';
const STORAGE_KEY = 'community-popup-dismissed';

export function CommunityPopup() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname.startsWith('/try') || pathname.startsWith('/start')) return;

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => {
      setShow(true);
      analytics.communityPopupShown();
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const join = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    analytics.communityJoined();
    window.open(TELEGRAM_GROUP, '_blank');
    setShow(false);
  };

  if (!show) return null;

  const features = [
    { icon: Newspaper, text: 'Daily immigration news & IRCC updates' },
    { icon: FileText, text: 'Citizenship test tips & facts' },
    { icon: Target, text: 'CELPIP study strategies' },
    { icon: UserPlus, text: 'Connect with other test-takers' },
  ];

  return (
    <div className={styles.overlay} onClick={dismiss}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={dismiss} aria-label="Close">
          <X size={20} />
        </button>

        <div className={styles.content}>
          <div className={styles.iconBox}>
            <Users size={28} />
          </div>

          <h2 className={styles.title}>Join Our Community!</h2>

          <p className={styles.description}>
            Get daily Canadian immigration news, citizenship test tips, and connect with other learners on Telegram.
          </p>

          <div className={styles.features}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className={styles.featureItem}>
                  <Icon size={16} />
                  {f.text}
                </div>
              );
            })}
          </div>

          <button className={styles.ctaBtn} onClick={join}>
            <Users size={18} />
            Join Telegram Group
            <ExternalLink size={14} />
          </button>

          <button className={styles.secondaryBtn} onClick={() => { dismiss(); router.push('/auth/register'); }}>
            <Zap size={14} />
            Or start free practice instead
          </button>

          <button className={styles.skipBtn} onClick={dismiss}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
