'use client';

import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

interface LottieResultProps {
  score: number; // 0-100 percentage
  size?: number;
}

export default function LottieResult({ score, size = 120 }: LottieResultProps) {
  const [animData, setAnimData] = useState<any>(null);
  const isGood = score >= 80;

  useEffect(() => {
    const src = isGood ? '/lottie/trophy.json' : '/lottie/sad.json';
    fetch(src).then(r => r.json()).then(setAnimData);
  }, [isGood]);

  if (!animData) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Lottie animationData={animData} loop={!isGood} style={{ width: size, height: size }} />
    </div>
  );
}
