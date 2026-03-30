'use client';

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useState } from 'react';
import dynamic from 'next/dynamic';
const RiveConfetti = dynamic(() => import('@/components/RiveConfetti'), { ssr: false });

function RiveAnim({ src, label, height = 300 }: { src: string; label: string; height?: number }) {
  const { RiveComponent } = useRive({
    src,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  return (
    <div style={{
      background: '#1e1e2e',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.08)',
      padding: 16,
      marginBottom: 16,
    }}>
      <div style={{ width: '100%', height, borderRadius: 12, overflow: 'hidden', background: '#0f0f1a' }}>
        <RiveComponent />
      </div>
      <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginTop: 12 }}>{label}</div>
    </div>
  );
}

export default function RiveTestPage() {
  const [showConfetti, setShowConfetti] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f1a',
      padding: '20px 16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      maxWidth: 480,
      margin: '0 auto',
    }}>
      <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
        🎬 Rive Test
      </h1>

      <RiveConfetti trigger={showConfetti} />

      <button
        onClick={() => { setShowConfetti(false); setTimeout(() => setShowConfetti(true), 50); }}
        style={{
          width: '100%', padding: '16px', fontSize: 18, fontWeight: 700,
          background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff',
          border: 'none', borderRadius: 12, cursor: 'pointer', marginBottom: 24,
        }}
      >
        🎊 Test Confetti
      </button>

      <RiveAnim src="/rive/confetti.riv" label="🎊 Confetti (inline preview)" height={300} />
      <RiveAnim src="/rive/avatars.riv" label="👤 Avatar Pack" height={300} />
      <RiveAnim src="/rive/success-workout.riv" label="✅ Success Workout" height={350} />
      <RiveAnim src="/rive/gamification.riv" label="🗺️ Gamification" height={350} />
      <RiveAnim src="/rive/level-up.riv" label="⬆️ Level Up" height={350} />
      <RiveAnim src="/rive/3d-game-icons.riv" label="🎮 3D Game Icons" height={300} />
      <RiveAnim src="/rive/button1.riv" label="🔘 Animated Button" height={200} />
    </div>
  );
}
