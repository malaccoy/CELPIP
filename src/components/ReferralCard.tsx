'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Users, Calendar } from 'lucide-react';

export default function ReferralCard() {
  const [data, setData] = useState<{ code: string; link: string; invited: number; paid: number; daysEarned: number } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/referral').then(r => r.ok ? r.json() : null).then(d => d && setData(d)).catch(() => {});
  }, []);

  if (!data) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = data.link;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const text = `🎓 I'm using CELPIP AI Coach to prepare for my CELPIP test! Join me and get unlimited AI practice:\n${data.link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareTelegram = () => {
    const text = `🎓 I'm using CELPIP AI Coach to prepare for my CELPIP test! Join me and get unlimited AI practice:`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(data.link)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08))',
      border: '1px solid rgba(139,92,246,0.25)',
      borderRadius: '16px',
      padding: '16px',
      margin: '0 0 16px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Gift size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>Invite Friends, Get 7 Days Free!</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>For each friend who subscribes to Pro</div>
        </div>
      </div>

      {/* Link + Copy */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '8px 12px',
        marginBottom: '10px',
      }}>
        <span style={{ flex: 1, fontSize: '12px', color: '#a78bfa', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data.link}
        </span>
        <button onClick={handleCopy} style={{
          background: copied ? 'rgba(34,197,94,0.2)' : 'rgba(139,92,246,0.2)',
          border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(139,92,246,0.4)'}`,
          borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '4px',
          color: copied ? '#4ade80' : '#c4b5fd', fontSize: '11px', fontWeight: 700,
          transition: 'all 0.2s',
        }}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Share buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={shareWhatsApp} style={{
          flex: 1, padding: '8px', borderRadius: '10px', border: 'none',
          background: 'rgba(37,211,102,0.15)', color: '#25d366',
          fontSize: '12px', fontWeight: 700, cursor: 'pointer',
        }}>
          📱 WhatsApp
        </button>
        <button onClick={shareTelegram} style={{
          flex: 1, padding: '8px', borderRadius: '10px', border: 'none',
          background: 'rgba(0,136,204,0.15)', color: '#0088cc',
          fontSize: '12px', fontWeight: 700, cursor: 'pointer',
        }}>
          ✈️ Telegram
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 0 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#c4b5fd' }}>{data.invited}</div>
          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Invited</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#4ade80' }}>{data.paid}</div>
          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Subscribed</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#fbbf24' }}>+{data.daysEarned}d</div>
          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Days Earned</div>
        </div>
      </div>
    </div>
  );
}
