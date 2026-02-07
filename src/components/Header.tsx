'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, PenTool, BookOpen, Home, Headphones, Mic, User, LogOut, ChevronDown } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';
import styles from '@/styles/Layout.module.scss';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/writing', icon: PenTool, label: 'Writing' },
  { to: '/listening', icon: Headphones, label: 'Listening' },
  { to: '/reading', icon: BookOpen, label: 'Reading' },
  { to: '/speaking', icon: Mic, label: 'Speaking' },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLogo}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>✍️</div>
            <div className={styles.logoTextWrapper}>
              <span className={styles.logoText}>CELPIP Coach</span>
              <span className={styles.logoSubtext}>Writing Mastery MVP</span>
            </div>
          </Link>
        </div>
        <nav className={styles.headerNav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
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
            <div className={styles.userMenu} ref={dropdownRef}>
              <button 
                className={styles.userMenuBtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={getUserName()}
                    className={styles.userAvatar}
                  />
                ) : (
                  <div className={styles.userInitials}>{getUserInitials()}</div>
                )}
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
          ) : !loading ? (
            <Link href="/auth/login" className={styles.loginBtn}>
              Sign In
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
};
