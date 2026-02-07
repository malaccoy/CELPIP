'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PenTool, BookOpen, Menu, X, Headphones, Mic, Home, User } from 'lucide-react';
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

const SidebarItem = ({ to, icon: Icon, label, isActive }: { to: string; icon: React.ElementType; label: string; isActive: boolean }) => {
  return (
    <Link
      href={to}
      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

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
    return pathname === to;
  };

  return (
    <>
      {/* Mobile Menu Toggle (shown in header area on mobile) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={styles.mobileMenuToggle}
        aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Optional on desktop, toggle on mobile */}
      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Menu</h2>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={isActive(item.to)}
            />
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};
