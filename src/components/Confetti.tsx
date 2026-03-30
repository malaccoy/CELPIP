'use client';

import { useEffect, useRef } from 'react';

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
}

export default function Confetti({
  trigger,
  duration = 2500,
  particleCount = 60,
  colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!trigger || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      w: number; h: number; color: string;
      rotation: number; rotSpeed: number; gravity: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width * (0.2 + Math.random() * 0.6),
        y: canvas.height * 0.3 + Math.random() * 50,
        vx: (Math.random() - 0.5) * 12,
        vy: -(Math.random() * 10 + 5),
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        gravity: 0.15 + Math.random() * 0.1,
        opacity: 1,
      });
    }

    const start = Date.now();
    let raf: number;

    const animate = () => {
      const elapsed = Date.now() - start;
      if (elapsed > duration) {
        canvas.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const fadeStart = duration * 0.7;
      for (const p of particles) {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.opacity = elapsed > fadeStart ? 1 - (elapsed - fadeStart) / (duration - fadeStart) : 1;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [trigger, duration, particleCount, colors]);

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
        display: 'none',
      }}
    />
  );
}
