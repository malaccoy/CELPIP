'use client';

import { useEffect, useRef, useState } from 'react';

interface RiveConfettiProps {
  trigger: boolean | number;
  duration?: number;
}

export default function RiveConfetti({ trigger, duration = 2500 }: RiveConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prev = useRef(trigger);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger && trigger !== prev.current) {
      setActive(true);
    }
    prev.current = trigger;
  }, [trigger]);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

    interface P { x: number; y: number; vx: number; vy: number; w: number; h: number; color: string; rot: number; rs: number; g: number; }

    const particles: P[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width * (0.1 + Math.random() * 0.8),
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 3 + 2,
        w: Math.random() * 10 + 4,
        h: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        rs: (Math.random() - 0.5) * 0.2,
        g: 0.08 + Math.random() * 0.05,
      });
    }

    const start = Date.now();
    let raf: number;

    const animate = () => {
      const elapsed = Date.now() - start;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setActive(false);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fade = elapsed > duration * 0.7 ? 1 - (elapsed - duration * 0.7) / (duration * 0.3) : 1;

      for (const p of particles) {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.rot += p.rs;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = fade;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [active, duration]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
