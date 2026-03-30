'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, GraduationCap, Trophy, Crown, MoreHorizontal, Swords, Target, ClipboardList, Calculator, Users, X, HelpCircle } from 'lucide-react';
import styles from '@/styles/BottomNav.module.scss';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/map', icon: Dumbbell, label: 'Practice' },
  { href: '/guides', icon: GraduationCap, label: 'Guides' },
  { href: '/rankings', icon: Trophy, label: 'Rankings' },
  { href: '/pricing', icon: Crown, label: 'Pricing' },
];

const moreItems = [
  { href: '/battle', icon: Swords, label: 'Battle Mode', color: '#f43f5e' },
  { href: '/drills/speaking', icon: Target, label: 'Drills', color: '#f97316' },
  { href: '/mock-exam', icon: ClipboardList, label: 'Mock Exams', color: '#8b5cf6' },
  { href: '/crs-calculator', icon: Calculator, label: 'CRS Calculator', color: '#06b6d4' },
  { href: '/support', icon: HelpCircle, label: 'Support', color: '#f472b6' },
  { href: 'https://t.me/celpipcommunity', icon: Users, label: 'Community', color: '#22c55e', external: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  if (pathname.startsWith('/try') || pathname.startsWith('/start')) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const moreIsActive = moreItems.some(item => pathname.startsWith(item.href));

  return (
    <>
      {/* Overlay */}
      {showMore && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 998,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More menu popup */}
      {showMore && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
            zIndex: 999, width: 'calc(100% - 32px)', maxWidth: 360,
            background: '#1e1e2e', borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
            padding: '8px',
            animation: 'slideUp 0.2s ease-out',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px 4px' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>More</span>
            <button onClick={() => setShowMore(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={18} color="#64748b" />
            </button>
          </div>
          {moreItems.map((item) => {
            const Icon = item.icon;
            const active = !item.external && pathname.startsWith(item.href);
            const Wrapper = item.external ? 'a' : Link;
            const extraProps = item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
            return (
              <Wrapper
                key={item.href}
                href={item.href}
                {...(extraProps as any)}
                onClick={() => setShowMore(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 12px', borderRadius: 12, textDecoration: 'none',
                  background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${item.color}20`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color={item.color} />
                </div>
                <span style={{ color: active ? '#fff' : '#cbd5e1', fontWeight: 600, fontSize: '0.95rem' }}>
                  {item.label}
                </span>
                {item.external && (
                  <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: '0.7rem' }}>↗</span>
                )}
              </Wrapper>
            );
          })}
        </div>
      )}

      {/* Bottom nav */}
      <nav className={styles.bottomNav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${active ? styles.active : ''}`}
            >
              <div className={styles.iconWrapper}>
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                {active && <div className={styles.activeIndicator} />}
              </div>
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}

        {/* More button — rainbow highlight */}
        <button
          onClick={() => setShowMore(!showMore)}
          className={`${styles.navItem} ${moreIsActive || showMore ? styles.active : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative' }}
        >
          <div style={{
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #f43f5e, #f97316, #eab308, #22c55e, #06b6d4, #8b5cf6, #f43f5e)',
            backgroundSize: '300% 300%',
            animation: 'chameleon 3s ease infinite',
            padding: 2,
          }}>
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%',
              background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MoreHorizontal size={22} color="#fff" strokeWidth={2.5} />
            </div>
          </div>
          <span className={styles.label} style={{ background: 'linear-gradient(90deg, #f43f5e, #f97316, #22c55e, #06b6d4, #8b5cf6)', backgroundSize: '200% auto', animation: 'chameleonText 3s ease infinite', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>More</span>
        </button>
      </nav>

      <style jsx global>{`
        @keyframes chameleon {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes chameleonText {
          0% { background-position: 0% center; }
          50% { background-position: 200% center; }
          100% { background-position: 0% center; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}
