'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Mail, PenTool, BookOpen, Settings, Menu, X } from 'lucide-react';
import styles from '@/styles/Layout.module.scss';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/task-1', icon: Mail, label: 'Task 1 — Email' },
  { to: '/task-2', icon: PenTool, label: 'Task 2 — Survey' },
  { to: '/library', icon: BookOpen, label: 'Biblioteca' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <h1 className={styles.mobileTitle}>CELPIP Coach</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={styles.menuButton}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarTitle}>CELPIP Coach</h1>
          <p className={styles.sidebarSubtitle}>Writing Mastery MVP</p>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.to}
            />
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};
