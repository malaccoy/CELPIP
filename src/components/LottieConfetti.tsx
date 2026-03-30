'use client';

import Lottie from 'lottie-react';
import { useEffect, useState, useRef } from 'react';

interface LottieConfettiProps {
  trigger: boolean | number;
  duration?: number;
}

export default function LottieConfetti({ trigger, duration = 3000 }: LottieConfettiProps) {
  const [visible, setVisible] = useState(false);
  const [animData, setAnimData] = useState<any>(null);
  const prev = useRef(trigger);

  useEffect(() => {
    fetch('/lottie/confetti.json').then(r => r.json()).then(setAnimData);
  }, []);

  useEffect(() => {
    if (trigger && trigger !== prev.current) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), duration);
      prev.current = trigger;
      return () => clearTimeout(t);
    }
    prev.current = trigger;
  }, [trigger, duration]);

  if (!visible || !animData) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 9999,
    }}>
      <Lottie animationData={animData} loop={false} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
