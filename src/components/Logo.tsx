'use client';

import React from 'react';
import styles from '@/styles/Logo.module.scss';

export const Logo: React.FC<{ size?: number }> = ({ size = 42 }) => {
  return (
    <div className={styles.logoContainer} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.logoSvg}
      >
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0f0f1a" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff3b3b" />
            <stop offset="100%" stopColor="#cc0000" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,59,59,0.3)" strokeWidth="1" />
        
        {/* Canadian Maple Leaf */}
        <g transform="translate(50, 52) scale(0.26)">
          <path
            d="M0,-140 L12,-80 L80,-90 L50,-40 L90,-10 L55,10 L70,70 L30,50 L0,120 L-30,50 L-70,70 L-55,10 L-90,-10 L-50,-40 L-80,-90 L-12,-80 Z"
            fill="url(#leafGrad)"
          />
        </g>
      </svg>
    </div>
  );
};
