'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Dumbbell, User, LogOut, ChevronDown, Crown, CreditCard, BookOpen, HelpCircle, GraduationCap, Trophy } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useContentAccess } from '@/hooks/useContentAccess';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/Logo';
import NotificationBell from '@/components/NotificationBell';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import styles from '@/styles/Layout.module.scss';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  external?: boolean;
}

const navItems: NavItem[] = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/dashboard', icon: Dumbbell, label: 'Practice' },
  // { to: '/guides', icon: GraduationCap, label: 'Study Guides' },
  // { to: '/english', icon: (() => null) as any, label: '🍁 Citizenship' },
  { to: '/blog', icon: BookOpen, label: 'Blog' },
  { to: '/pricing', icon: CreditCard, label: 'Pricing' },
  // { to: '/tools/score-calculator', icon: (() => null) as any, label: '🧮 CRS Calculator' },
  { to: '/rankings', icon: Trophy, label: 'Rankings' },
  // Profile removed from nav — accessible via avatar
  { to: '/support', icon: HelpCircle, label: 'Support' },
  { to: 'https://t.me/+YcO9MfUHIjQyYjAx', icon: (() => null) as any, label: '💬 Community', external: true },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const { isPro } = useContentAccess();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerHidden = useScrollDirection();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (to: string) => {
    if (to === '/writing') return pathname.startsWith('/writing');
    if (to === '/listening') return pathname.startsWith('/listening');
    if (to === '/reading') return pathname.startsWith('/reading');
    if (to === '/speaking') return pathname.startsWith('/speaking');
    if (to === '/profile') return pathname.startsWith('/profile');
    return pathname === to;
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  const getUserInitials = () => {
    if (!user) return '?';
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return '?';
  };

  const getUserName = () => {
    if (!user) return 'User';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  };

  return (
    <>
      {/* Mobile minimal header — hidden on pages with own top bar */}
      {pathname !== '/dashboard' && !pathname?.startsWith('/ai-coach') && (
      <header className={`${styles.header} ${styles.mobileMinimalHeader} ${headerHidden ? styles.headerHidden : ''}`}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '8px 16px', height: '48px',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <Logo size={32} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
              CELPIP <span style={{ color: '#ff3b3b' }}>AI</span> Coach
            </span>
          </Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <NotificationBell />
              <Link href="/profile" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
                background: '#232733', border: '2px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '0.9rem', fontWeight: 700,
              }}>
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  getUserName().charAt(0).toUpperCase()
                )}
              </div>
            </Link>
            </div>
          ) : (
            <Link href="/auth/login" style={{
              background: '#ff3b3b', color: '#fff', borderRadius: 20,
              padding: '6px 16px', fontWeight: 700, fontSize: '0.8rem',
              textDecoration: 'none',
            }}>
              Sign In
            </Link>
          )}
        </div>
      </header>
      )}

      {/* Desktop header */}
    <header className={`${styles.header} ${styles.desktopHeader} ${headerHidden ? styles.headerHidden : ''}`}>
      <div className={styles.headerContent}>
        <div className={styles.headerLogo}>
          <Link href="/" className={styles.logoLink}>
            <Logo size={42} />
            <div className={styles.logoTextWrapper}>
              <span className={styles.logoText}>CELPIP <span className={styles.logoAI}>AI</span> Coach</span>
            </div>
          </Link>
        </div>
        <nav className={styles.headerNav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            if (item.external) {
              return (
                <a
                  key={item.to}
                  href={item.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.headerNavLink}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </a>
              );
            }
            return (
              <Link
                key={item.to}
                href={item.to}
                className={`${styles.headerNavLink} ${active ? styles.headerNavLinkActive : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          {/* User Menu */}
          {!loading && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <NotificationBell />
              <div className={styles.userMenu} ref={dropdownRef}>
              <button 
                className={styles.userMenuBtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className={styles.avatarWrapper}>
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt={getUserName()}
                      className={styles.userAvatar}
                    />
                  ) : (
                    <div className={styles.userInitials}>{getUserInitials()}</div>
                  )}
                  {isPro && (
                    <div className={styles.avatarProBadge}>
                      <Crown size={8} />
                    </div>
                  )}
                </div>
                <ChevronDown size={14} className={dropdownOpen ? styles.rotated : ''} />
              </button>
              
              {dropdownOpen && (
                <div className={styles.userDropdown}>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{getUserName()}</span>
                    <span className={styles.userEmail}>{user.email}</span>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link 
                    href="/profile" 
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} />
                    Profile
                  </Link>
                  <button 
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            </div>
          ) : !loading ? (
            <Link href="/auth/login" className={styles.loginBtn}>
              Sign In
            </Link>
          ) : null}
        </nav>
      </div>
      {/* Mobile horizontal nav strip */}
      <div className={styles.mobileNavStrip}>
        {navItems.filter(item => !['/support', '/blog'].includes(item.to)).map((item) => {
          const active = isActive(item.to);
          const emojiMap: Record<string, string> = {
            '/': '🏠',
            '/dashboard': '🎯',
            '/guides': '📚',
            // '/english': '🍁',
            '/pricing': '💎',
            '/rankings': '🏆',
            '/profile': '👤',
          };
          const emoji = emojiMap[item.to] || '';
          return (
            <Link
              key={item.to}
              href={item.to}
              className={`${styles.mobileNavItem} ${active ? styles.mobileNavItemActive : ''}`}
            >
              <span className={styles.mobileNavEmoji}>{emoji}</span>
              {item.label.replace('🍁 ', '')}
            </Link>
          );
        })}
      </div>
    </header>
    </>
  );
};
