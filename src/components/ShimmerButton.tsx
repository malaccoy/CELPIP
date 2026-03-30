'use client';

import React, { CSSProperties } from 'react';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
}

export default function ShimmerButton({
  shimmerColor = '#ffffff',
  shimmerSize = '0.1em',
  borderRadius = '12px',
  shimmerDuration = '2s',
  background = 'linear-gradient(135deg, #ef4444, #dc2626)',
  className,
  children,
  style,
  ...props
}: ShimmerButtonProps) {
  const btnStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '16px 32px',
    fontSize: 18,
    fontWeight: 700,
    color: '#fff',
    background,
    border: 'none',
    borderRadius,
    cursor: 'pointer',
    overflow: 'hidden',
    width: '100%',
    ...style,
  };

  const shimmerStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    borderRadius,
    pointerEvents: 'none',
  };

  const shimmerBeam: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '50%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${shimmerColor}33, ${shimmerColor}55, ${shimmerColor}33, transparent)`,
    animation: `shimmer-slide ${shimmerDuration} ease-in-out infinite`,
  };

  return (
    <>
      <style>{`
        @keyframes shimmer-slide {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
      <button style={btnStyle} className={className} {...props}>
        <span style={shimmerStyle}>
          <span style={shimmerBeam} />
        </span>
        <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {children}
        </span>
      </button>
    </>
  );
}
