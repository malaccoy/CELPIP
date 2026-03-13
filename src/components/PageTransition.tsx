'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from '@/styles/PageTransition.module.scss';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className={`${styles.page} ${visible ? styles.visible : styles.entering}`}>
      {children}
    </div>
  );
}
