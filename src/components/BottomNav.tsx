'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, BarChart3, User } from 'lucide-react';
import styles from '@/styles/BottomNav.module.scss';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/dashboard', icon: Dumbbell, label: 'Practice' },
  { href: '/progress', icon: BarChart3, label: 'Quizzes' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
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
    </nav>
  );
}
