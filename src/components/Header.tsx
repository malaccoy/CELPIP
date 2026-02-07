'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PenTool, BookOpen, Settings, GraduationCap, Flame, Home, Headphones, Mic, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeProvider';
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
  { to: '/profile', icon: User, label: 'Profile' },
];

export const Header: React.FC = () => {
  const pathname = usePathname();

  const isActive = (to: string) => {
    if (to === '/writing') {
      return pathname.startsWith('/writing');
    }
    if (to === '/listening') {
      return pathname.startsWith('/listening');
    }
    if (to === '/reading') {
      return pathname.startsWith('/reading');
    }
    if (to === '/speaking') {
      return pathname.startsWith('/speaking');
    }
    if (to === '/profile') {
      return pathname.startsWith('/profile');
    }
    return pathname === to;
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
          <Link
            href="/profile"
            className={`${styles.profileBtn} ${isActive('/profile') ? styles.headerNavLinkActive : ''}`}
          >
            <User size={18} />
          </Link>
          <ThemeToggle className={styles.themeToggle} />
        </nav>
      </div>
    </header>
  );
};
