'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, ExternalLink, Users } from 'lucide-react';
import { analytics } from '@/lib/analytics';

const TELEGRAM_GROUP = 'https://t.me/+YcO9MfUHIjQyYjAx';
const STORAGE_KEY = 'community-popup-dismissed';

export function CommunityPopup() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Hide on /try pages
    if (pathname.startsWith('/try') || pathname.startsWith('/start')) return;

    // Only show once — check localStorage
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) return;

    // Small delay so it doesn't flash immediately
    const timer = setTimeout(() => { setShow(true); analytics.communityPopupShown(); }, 2000);
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

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', animation: 'fadeIn 0.3s ease',
    }} onClick={dismiss}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #1b1f2a 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px', maxWidth: '400px', width: '100%',
        padding: '2rem', position: 'relative',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Close button */}
        <button onClick={dismiss} style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
          cursor: 'pointer', padding: '4px',
        }}>
          <X size={20} />
        </button>

        {/* Content */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🍁💬</div>
          
          <h2 style={{
            fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9',
            margin: '0 0 0.5rem',
          }}>
            Join Our Community!
          </h2>
          
          <p style={{
            fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.5, margin: '0 0 1.5rem',
          }}>
            Get daily Canadian immigration news, citizenship test tips, and connect with other learners on Telegram.
          </p>

          {/* Features */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
            marginBottom: '1.5rem', textAlign: 'left',
          }}>
            {[
              '📰 Daily immigration news & IRCC updates',
              '📝 Citizenship test tips & facts',
              '🎯 CELPIP study strategies',
              '👥 Connect with other test-takers',
            ].map((item, i) => (
              <div key={i} style={{
                fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)',
                paddingLeft: '0.25rem',
              }}>
                {item}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button onClick={join} style={{
            width: '100%', padding: '0.9rem',
            background: 'linear-gradient(135deg, #0088cc 0%, #0066aa 100%)',
            border: 'none', borderRadius: '12px',
            color: 'white', fontSize: '1rem', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseOver={e => { (e.target as any).style.transform = 'scale(1.02)'; }}
          onMouseOut={e => { (e.target as any).style.transform = 'scale(1)'; }}
          >
            <Users size={18} />
            Join Telegram Group
            <ExternalLink size={14} />
          </button>

          {/* Skip */}
          <button onClick={dismiss} style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem',
            cursor: 'pointer', marginTop: '0.75rem',
            padding: '0.5rem',
          }}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
