'use client';

import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

interface LottieOverlayProps {
  src: string;
  show: boolean;
  size?: number;
  loop?: boolean;
  duration?: number;
  onDone?: () => void;
}

export default function LottieOverlay({ src, show, size = 200, loop = false, duration = 2000, onDone }: LottieOverlayProps) {
  const [animData, setAnimData] = useState<any>(null);

  useEffect(() => {
    fetch(src).then(r => r.json()).then(setAnimData);
  }, [src]);

  useEffect(() => {
    if (show && !loop && onDone) {
      const t = setTimeout(onDone, duration);
      return () => clearTimeout(t);
    }
  }, [show, loop, duration, onDone]);

  if (!show || !animData) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 9999,
    }}>
      <Lottie animationData={animData} loop={loop} style={{ width: size, height: size }} />
    </div>
  );
}
