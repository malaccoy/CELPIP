'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Mail, PenTool, BookOpen, Settings, Menu, X, GraduationCap } from 'lucide-react';
import styles from '@/styles/Layout.module.scss';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/guide', icon: GraduationCap, label: 'Guia' },
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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const isActive = (to: string) => {
    if (to === '/guide') {
      return pathname === '/guide' || pathname.startsWith('/guide/');
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
