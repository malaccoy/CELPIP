'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import styles from '@/styles/FAB.module.scss';

const HIDE_ON = ['/ai-coach', '/mock-exam', '/writing/', '/auth/', '/dashboard', '/drills'];

export default function FAB() {
  const pathname = usePathname();
  
  // Hide on home page and specific pages
  if (pathname === '/' || pathname.startsWith('/try') || pathname.startsWith('/start') || HIDE_ON.some(p => pathname.startsWith(p))) return null;
  
  return (
    <Link href="/dashboard" className={styles.fab} aria-label="Practice">
      <Sparkles size={22} />
      <span className={styles.fabLabel}>Practice</span>
    </Link>
  );
}
