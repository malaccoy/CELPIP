'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/Logo.module.scss';

export const Logo: React.FC<{ size?: number }> = ({ size = 48 }) => {
  return (
    <div className={styles.logoContainer} style={{ width: size, height: size }}>
      <Image
        src="/logo-leaf.png"
        alt="CELPIP AI Coach"
        width={size}
        height={size}
        className={styles.logoImg}
        priority
        unoptimized
      />
    </div>
  );
};
