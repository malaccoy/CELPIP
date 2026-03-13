'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import styles from '@/styles/FAB.module.scss';

const HIDE_ON = ['/ai-coach', '/mock-exam', '/writing/', '/auth/', '/dashboard'];

export default function FAB() {
  const pathname = usePathname();
  
  // Hide on pages where AI Coach is already active
  if (HIDE_ON.some(p => pathname.startsWith(p))) return null;
  
  return (
    <Link href="/ai-coach" className={styles.fab} aria-label="AI Practice">
      <Sparkles size={22} />
      <span className={styles.fabLabel}>Practice</span>
    </Link>
  );
}
