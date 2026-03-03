'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Volume2, ChevronDown, CheckCircle2 } from 'lucide-react';
import styles from '@/styles/PracticeTimer.module.scss';

interface Preset {
  label: string;
  section: string;
  seconds: number;
  description: string;
}

const presets: Preset[] = [
  { label: 'Writing Task 1', section: 'writing', seconds: 27 * 60, description: 'Email — 27 minutes' },
  { label: 'Writing Task 2', section: 'writing', seconds: 26 * 60, description: 'Survey Response — 26 minutes' },
  { label: 'Speaking Task 1', section: 'speaking', seconds: 90, description: 'Giving Advice — 90 seconds' },
  { label: 'Speaking Task 2', section: 'speaking', seconds: 60, description: 'Personal Experience — 60 seconds' },
  { label: 'Speaking Task 3', section: 'speaking', seconds: 60, description: 'Describing a Scene — 60 seconds' },
  { label: 'Speaking Task 4', section: 'speaking', seconds: 60, description: 'Making Predictions — 60 seconds' },
  { label: 'Speaking Task 5', section: 'speaking', seconds: 90, description: 'Comparing & Persuading — 90 seconds' },
  { label: 'Speaking Task 6', section: 'speaking', seconds: 60, description: 'Difficult Situation — 60 seconds' },
  { label: 'Speaking Task 7', section: 'speaking', seconds: 90, description: 'Expressing Opinions — 90 seconds' },
  { label: 'Speaking Task 8', section: 'speaking', seconds: 60, description: 'Unusual Situation — 60 seconds' },
  { label: 'Reading Part', section: 'reading', seconds: 13 * 60, description: 'Per passage — ~13 minutes' },
  { label: 'Full Reading', section: 'reading', seconds: 55 * 60, description: 'All parts — 55 minutes' },
  { label: 'Full Listening', section: 'listening', seconds: 50 * 60, description: 'All parts — 50 minutes' },
  { label: 'Custom 5 min', section: 'custom', seconds: 5 * 60, description: 'Quick practice' },
  { label: 'Custom 10 min', section: 'custom', seconds: 10 * 60, description: 'Short session' },
  { label: 'Custom 30 min', section: 'custom', seconds: 30 * 60, description: 'Study block' },
];

const sectionColors: Record<string, string> = {
  writing: '#a78bfa',
  speaking: '#38bdf8',
  reading: '#2dd4bf',
  listening: '#fb923c',
  custom: '#94a3b8',
};

export default function PracticeTimerPage() {
  const [selected, setSelected] = useState<Preset>(presets[0]);
  const [timeLeft, setTimeLeft] = useState(presets[0].seconds);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalSeconds = selected.seconds;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    if (!running || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setRunning(false);
          setFinished(true);
          // Play alarm sound
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800;
            gain.gain.value = 0.3;
            osc.start();
            setTimeout(() => { osc.frequency.value = 1000; }, 200);
            setTimeout(() => { osc.frequency.value = 800; }, 400);
            setTimeout(() => { osc.stop(); ctx.close(); }, 600);
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, timeLeft]);

  const selectPreset = (preset: Preset) => {
    setSelected(preset);
    setTimeLeft(preset.seconds);
    setRunning(false);
    setFinished(false);
    setShowPresets(false);
  };

  const toggleTimer = () => {
    if (finished) {
      setTimeLeft(selected.seconds);
      setFinished(false);
    }
    setRunning(!running);
  };

  const reset = () => {
    setRunning(false);
    setFinished(false);
    setTimeLeft(selected.seconds);
  };

  const isWarning = timeLeft <= 60 && timeLeft > 0 && running;
  const isCritical = timeLeft <= 10 && timeLeft > 0 && running;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge}>
          <Timer size={14} />
          <span>Practice Timer</span>
        </div>
        <h1>CELPIP Practice Timer</h1>
        <p>Simulate real exam timing for every section and task</p>
      </div>

      {/* Preset Selector */}
      <div className={styles.selectorWrap}>
        <button className={styles.selector} onClick={() => setShowPresets(!showPresets)}>
          <div>
            <span className={styles.selectorLabel} style={{ color: sectionColors[selected.section] }}>
              {selected.label}
            </span>
            <span className={styles.selectorDesc}>{selected.description}</span>
          </div>
          <ChevronDown size={20} className={showPresets ? styles.chevronOpen : ''} />
        </button>

        {showPresets && (
          <div className={styles.presetList}>
            {presets.map((p, i) => (
              <button
                key={i}
                className={`${styles.presetItem} ${p === selected ? styles.presetActive : ''}`}
                onClick={() => selectPreset(p)}
              >
                <span style={{ color: sectionColors[p.section] }}>{p.label}</span>
                <span className={styles.presetDesc}>{p.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Timer Display */}
      <div className={`${styles.timerDisplay} ${isWarning ? styles.warning : ''} ${isCritical ? styles.critical : ''} ${finished ? styles.finished : ''}`}>
        <svg className={styles.progressRing} viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" className={styles.ringBg} />
          <circle
            cx="100" cy="100" r="90"
            className={styles.ringFill}
            style={{
              strokeDasharray: `${2 * Math.PI * 90}`,
              strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress / 100)}`,
              stroke: finished ? '#22c55e' : (isCritical ? '#ef4444' : (isWarning ? '#f59e0b' : sectionColors[selected.section])),
            }}
          />
        </svg>
        <div className={styles.timerText}>
          {finished ? (
            <div className={styles.finishedText}>
              <CheckCircle2 size={32} />
              <span>Time&apos;s Up!</span>
            </div>
          ) : (
            <>
              <span className={styles.time}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className={styles.timeLabel}>remaining</span>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.resetBtn} onClick={reset} disabled={timeLeft === totalSeconds && !finished}>
          <RotateCcw size={20} />
        </button>
        <button
          className={`${styles.playBtn} ${running ? styles.pauseBtn : ''}`}
          onClick={toggleTimer}
        >
          {running ? <Pause size={28} /> : <Play size={28} />}
          <span>{running ? 'Pause' : (finished ? 'Restart' : 'Start')}</span>
        </button>
        <div className={styles.placeholder} />
      </div>

      {/* Tips */}
      <div className={styles.tips}>
        <h3>💡 Timing Tips</h3>
        <ul>
          <li><strong>Writing:</strong> Spend 2-3 minutes planning before you write</li>
          <li><strong>Speaking:</strong> Fill the entire time — silence hurts your score</li>
          <li><strong>Reading:</strong> Don&apos;t spend more than 2 minutes on one question</li>
          <li><strong>Listening:</strong> Audio plays once — take notes while listening</li>
        </ul>
      </div>
    </div>
  );
}
