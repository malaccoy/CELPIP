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
          {/* Background gradient */}
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0f0f1a" />
          </linearGradient>
          
          {/* Book gradient */}
          <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="40%" stopColor="#a855f7" />
            <stop offset="70%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          
          {/* Page gradient */}
          <linearGradient id="pageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.05" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#bookGrad)" strokeWidth="1" opacity="0.5" />
        
        {/* Open Book */}
        <g filter="url(#glow)" className={styles.book}>
          {/* Left page */}
          <path
            d="M50 30 
               C45 32, 28 34, 22 36
               L22 72
               C28 70, 45 68, 50 66
               Z"
            fill="url(#pageGrad)"
            stroke="url(#bookGrad)"
            strokeWidth="2"
            strokeLinejoin="round"
            className={styles.leftPage}
          />
          
          {/* Right page */}
          <path
            d="M50 30 
               C55 32, 72 34, 78 36
               L78 72
               C72 70, 55 68, 50 66
               Z"
            fill="url(#pageGrad)"
            stroke="url(#bookGrad)"
            strokeWidth="2"
            strokeLinejoin="round"
            className={styles.rightPage}
          />
          
          {/* Spine */}
          <line 
            x1="50" y1="30" 
            x2="50" y2="66" 
            stroke="url(#bookGrad)" 
            strokeWidth="2"
            className={styles.spine}
          />
          
          {/* Text lines - left page */}
          <line x1="28" y1="44" x2="44" y2="42" stroke="url(#bookGrad)" strokeWidth="1.5" opacity="0.5" className={styles.line1} />
          <line x1="28" y1="50" x2="44" y2="48" stroke="url(#bookGrad)" strokeWidth="1.5" opacity="0.4" className={styles.line2} />
          <line x1="28" y1="56" x2="44" y2="54" stroke="url(#bookGrad)" strokeWidth="1.5" opacity="0.3" className={styles.line3} />
          
          {/* Text lines - right page */}
          <line x1="56" y1="42" x2="72" y2="44" stroke="url(#bookGrad)" strokeWidth="1.5" opacity="0.5" className={styles.line1} />
          <line x1="56" y1="48" x2="72" y2="50" stroke="url(#bookGrad)" strokeWidth="1.5" opacity="0.4" className={styles.line2} />
          <line x1="56" y1="54" x2="72" y2="56" stroke="url(#bookGrad)" strokeWidth="1.5" opacity="0.3" className={styles.line3} />
        </g>
        
        {/* AI Sparkles */}
        <path 
          d="M82 22 L84 28 L90 30 L84 32 L82 38 L80 32 L74 30 L80 28 Z" 
          fill="white"
          className={styles.spark1}
        />
        <path 
          d="M18 25 L19 29 L23 30 L19 31 L18 35 L17 31 L13 30 L17 29 Z" 
          fill="white"
          opacity="0.8"
          className={styles.spark2}
        />
        <path 
          d="M85 65 L86 68 L89 69 L86 70 L85 73 L84 70 L81 69 L84 68 Z" 
          fill="white"
          opacity="0.7"
          className={styles.spark3}
        />
        
        {/* Floating particles */}
        <circle cx="15" cy="55" r="1.5" fill="#f472b6" className={styles.particle1} />
        <circle cx="88" cy="50" r="1.2" fill="#06b6d4" className={styles.particle2} />
        <circle cx="50" cy="82" r="1" fill="#a855f7" className={styles.particle3} />
      </svg>
    </div>
  );
};
