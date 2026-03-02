'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/Logo.module.scss';

export const Logo: React.FC<{ size?: number }> = ({ size = 42 }) => {
  return (
    <div className={styles.logoContainer} style={{ width: size, height: size }}>
      <div className={styles.glowRing} />
      <Image
        src="/logo-transparent.png"
        alt="CELPIP AI Coach"
        width={size}
        height={size}
        className={styles.logoImg}
        priority
      />
    </div>
  );
};
