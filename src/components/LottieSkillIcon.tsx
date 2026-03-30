'use client';

import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

interface LottieSkillIconProps {
  skill: 'reading' | 'writing' | 'listening' | 'speaking';
  size?: number;
}

const SKILL_FILES: Record<string, string> = {
  reading: '/lottie/reading.json',
  writing: '/lottie/writing-login.json',
  listening: '/lottie/listening-boy.json',
  speaking: '/lottie/speaking-man.json',
};

export default function LottieSkillIcon({ skill, size = 48 }: LottieSkillIconProps) {
  const [animData, setAnimData] = useState<any>(null);

  useEffect(() => {
    const src = SKILL_FILES[skill];
    if (src) fetch(src).then(r => r.json()).then(setAnimData).catch(() => {});
  }, [skill]);

  if (!animData) return null;

  return (
    <Lottie animationData={animData} loop style={{ width: size, height: size }} />
  );
}
