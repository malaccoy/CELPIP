'use client';

import { useEffect, useRef, useState } from 'react';

interface NumberTickerProps {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function NumberTicker({
  value,
  duration = 2000,
  delay = 0,
  prefix = '',
  suffix = '',
  style,
  className,
}: NumberTickerProps) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const timeout = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.floor(eased * value));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [started, value, duration, delay]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums', ...style }} className={className}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}
