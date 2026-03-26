'use client';

import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Dumbbell, User, LogOut, ChevronDown, Crown,
  CreditCard, BookOpen, HelpCircle, GraduationCap, Trophy,
  Gem, MessageCircle, Zap,
} from 'lucide-react';
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
  { to: '/blog', icon: BookOpen, label: 'Blog' },
  { to: '/pricing', icon: CreditCard, label: 'Pricing' },
  { to: '/rankings', icon: Trophy, label: 'Rankings' },
  { to: '/support', icon: HelpCircle, label: 'Support' },
  { to: 'https://t.me/+YcO9MfUHIjQyYjAx', icon: MessageCircle, label: 'Community', external: true },
];

/* Icon map for mobile nav strip — replaces emojis with Lucide icons */
const mobileNavIconMap: Record<string, React.ElementType> = {
  '/': Home,
  '/dashboard': Dumbbell,
  '/pricing': Gem,
  '/rankings': Trophy,
};

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

  if (pathname.startsWith('/try') || pathname.startsWith('/start')) return null;

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
      {/* Mobile minimal header */}
      {pathname !== '/dashboard' && !pathname?.startsWith('/ai-coach') && (
        <header className={`${styles.header} ${styles.mobileMinimalHeader} ${headerHidden ? styles.headerHidden : ''}`}>
          <div className={styles.headerContent}>
            <Link href="/" className={styles.logoLink}>
              <Logo size={32} />
              <span className={styles.logoText}>
                CELPIP <span className={styles.logoAI}>AI</span> Coach
              </span>
            </Link>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <NotificationBell />
                <Link href="/profile" aria-label="Profile" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={styles.userInitials} style={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                    {user.user_metadata?.avatar_url ? (
                      <Image src={user.user_metadata.avatar_url} alt="" width={36} height={36} className={styles.userAvatar} />
                    ) : (
                      getUserName().charAt(0).toUpperCase()
                    )}
                  </div>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link href="/auth/login" className={styles.loginBtnGhost}>
                  Sign In
                </Link>
                <Link href="/auth/register" className={styles.startFreeBtn}>
                  <Zap size={14} />
                  Start Free
                </Link>
              </div>
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
                    aria-label="User menu"
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link href="/auth/login" className={styles.loginBtnGhost}>
                  Sign In
                </Link>
                <Link href="/auth/register" className={styles.startFreeBtn}>
                  <Zap size={14} />
                  Start Free
                </Link>
              </div>
            ) : null}
          </nav>
        </div>

        {/* Mobile horizontal nav strip — uses Lucide icons instead of emojis */}
        <div className={styles.mobileNavStrip}>
          {navItems
            .filter((item) => Object.keys(mobileNavIconMap).includes(item.to))
            .map((item) => {
              const active = isActive(item.to);
              const NavIcon = mobileNavIconMap[item.to];
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`${styles.mobileNavItem} ${active ? styles.mobileNavItemActive : ''}`}
                >
                  <NavIcon size={14} className={styles.mobileNavIcon} />
                  {item.label}
                </Link>
              );
            })}
        </div>
      </header>
    </>
  );
};
