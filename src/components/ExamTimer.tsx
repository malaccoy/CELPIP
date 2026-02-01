'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import styles from '@/styles/ExamTimer.module.scss';

interface ExamTimerProps {
  totalMinutes: number;
  warningMinutes?: number;
  onTimeUp?: () => void;
  onWarning?: () => void;
}

export default function ExamTimer({ 
  totalMinutes, 
  warningMinutes = 5,
  onTimeUp,
  onWarning 
}: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasWarned, setHasWarned] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Play beep sound
  const playBeep = useCallback((frequency: number = 800, duration: number = 200, count: number = 1) => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = getAudioContext();
      
      const playOneBeep = (delay: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + delay);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration / 1000);
        
        oscillator.start(audioContext.currentTime + delay);
        oscillator.stop(audioContext.currentTime + delay + duration / 1000);
      };

      for (let i = 0; i < count; i++) {
        playOneBeep(i * 0.3);
      }
    } catch (e) {
      console.log('Audio not available');
    }
  }, [soundEnabled, getAudioContext]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          
          // Warning at X minutes left
          if (newTime === warningMinutes * 60 && !hasWarned) {
            setHasWarned(true);
            playBeep(600, 300, 3);
            onWarning?.();
          }
          
          // Time's up
          if (newTime === 0 && !hasEnded) {
            setHasEnded(true);
            setIsRunning(false);
            playBeep(400, 500, 5);
            onTimeUp?.();
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, warningMinutes, hasWarned, hasEnded, playBeep, onTimeUp, onWarning]);

  const toggleTimer = () => {
    if (!isRunning && soundEnabled) {
      // Play a short beep to "unlock" audio context on user interaction
      playBeep(1000, 50, 1);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalMinutes * 60);
    setHasWarned(false);
    setHasEnded(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerStatus = () => {
    if (timeLeft === 0) return 'ended';
    if (timeLeft <= warningMinutes * 60) return 'warning';
    if (isRunning) return 'running';
    return 'paused';
  };

  const status = getTimerStatus();
  const progressPercent = (timeLeft / (totalMinutes * 60)) * 100;

  return (
    <div className={`${styles.timerContainer} ${styles[status]}`}>
      <div className={styles.timerProgress} style={{ width: `${progressPercent}%` }} />
      
      <div className={styles.timerContent}>
        {status === 'warning' && (
          <AlertTriangle size={18} className={styles.warningIcon} />
        )}
        
        <span className={styles.timerDisplay}>
          {formatTime(timeLeft)}
        </span>

        <div className={styles.timerControls}>
          <button 
            onClick={toggleTimer} 
            className={styles.timerBtn}
            title={isRunning ? 'Pausar' : 'Iniciar'}
            disabled={timeLeft === 0}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
          </button>
          
          <button 
            onClick={resetTimer} 
            className={styles.timerBtn}
            title="Reiniciar"
          >
            <RotateCcw size={16} />
          </button>
          
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className={`${styles.timerBtn} ${!soundEnabled ? styles.muted : ''}`}
            title={soundEnabled ? 'Desativar som' : 'Ativar som'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
