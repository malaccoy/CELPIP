'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Mail, PenTool, BookOpen, Settings, GraduationCap, Flame, Home } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeProvider';
import styles from '@/styles/Layout.module.scss';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/challenge', icon: Flame, label: 'Desafio' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/guide', icon: GraduationCap, label: 'Guia' },
  { to: '/task-1', icon: Mail, label: 'Task 1' },
  { to: '/task-2', icon: PenTool, label: 'Task 2' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
];

export const Header: React.FC = () => {
  const pathname = usePathname();

  const isActive = (to: string) => {
    if (to === '/guide') {
      return pathname === '/guide' || pathname.startsWith('/guide/');
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
          <ThemeToggle className={styles.themeToggle} />
        </nav>
      </div>
    </header>
  );
};
