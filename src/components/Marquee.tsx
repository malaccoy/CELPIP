'use client';

import React, { CSSProperties } from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  style?: CSSProperties;
  className?: string;
}

export default function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  style,
  className,
}: MarqueeProps) {
  const animDir = direction === 'left' ? 'normal' : 'reverse';

  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track:hover {
          animation-play-state: ${pauseOnHover ? 'paused' : 'running'} !important;
        }
      `}</style>
      <div
        style={{
          overflow: 'hidden',
          width: '100%',
          maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
          ...style,
        }}
        className={className}
      >
        <div
          className="marquee-track"
          style={{
            display: 'flex',
            gap: 24,
            width: 'max-content',
            animation: `marquee-scroll ${speed}s linear infinite`,
            animationDirection: animDir,
          }}
        >
          {children}
          {children}
        </div>
      </div>
    </>
  );
}
