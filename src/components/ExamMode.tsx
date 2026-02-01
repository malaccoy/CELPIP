'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, Pause, AlertTriangle, Clock, Eye, EyeOff, 
  Lock, Unlock, CheckCircle, XCircle, Trophy, RotateCcw
} from 'lucide-react';
import styles from '@/styles/ExamMode.module.scss';

interface ExamModeProps {
  taskType: 'task1' | 'task2';
  totalMinutes: number;
  isActive: boolean;
  onStart: () => void;
  onEnd: (completed: boolean, timeUsed: number) => void;
  onToggle: (active: boolean) => void;
  children?: React.ReactNode;
}

interface ExamStats {
  timeUsed: number;
  completed: boolean;
  wordsWritten: number;
}

export default function ExamMode({ 
  taskType, 
  totalMinutes, 
  isActive,
  onStart,
  onEnd,
  onToggle,
  children 
}: ExamModeProps) {
  const [examState, setExamState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60);
  const [showWarning, setShowWarning] = useState(false);
  const [examStats, setExamStats] = useState<ExamStats | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number>(0);

  // Reset when toggling off
  useEffect(() => {
    if (!isActive) {
      setExamState('idle');
      setTimeLeft(totalMinutes * 60);
      setShowWarning(false);
      setExamStats(null);
    }
  }, [isActive, totalMinutes]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (examState === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          
          // Warning at 5 minutes
          if (newTime === 300 && !showWarning) {
            setShowWarning(true);
            playSound('warning');
          }
          
          // Time's up
          if (newTime === 0) {
            handleExamEnd(false);
            playSound('end');
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [examState, timeLeft, showWarning]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: 'start' | 'warning' | 'end') => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      const frequencies = { start: 880, warning: 440, end: 330 };
      const durations = { start: 0.2, warning: 0.5, end: 0.8 };
      
      oscillator.frequency.value = frequencies[type];
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durations[type]);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + durations[type]);
    } catch (e) {
      console.log('Audio not available');
    }
  }, [getAudioContext]);

  const handleStartExam = () => {
    setExamState('running');
    setTimeLeft(totalMinutes * 60);
    setShowWarning(false);
    startTimeRef.current = Date.now();
    playSound('start');
    onStart();
  };

  const handleExamEnd = (completed: boolean) => {
    const timeUsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    setExamState('finished');
    setExamStats({
      timeUsed,
      completed,
      wordsWritten: 0 // Will be set by parent
    });
    onEnd(completed, timeUsed);
  };

  const handleFinishEarly = () => {
    if (confirm('Tem certeza que deseja finalizar o exame agora?')) {
      handleExamEnd(true);
    }
  };

  const handleRestart = () => {
    setExamState('idle');
    setTimeLeft(totalMinutes * 60);
    setShowWarning(false);
    setExamStats(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeUsed = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // Pre-exam screen
  if (!isActive) {
    return (
      <div className={styles.examToggle}>
        <button 
          className={styles.examToggleBtn}
          onClick={() => onToggle(true)}
        >
          <Lock size={18} />
          <span>Ativar Modo Exame</span>
        </button>
        <p className={styles.examToggleHint}>
          Simula condições reais do CELPIP: timer travado, sem pausas.
        </p>
      </div>
    );
  }

  // Idle - ready to start
  if (examState === 'idle') {
    return (
      <div className={styles.examOverlay}>
        <div className={styles.examStartCard}>
          <div className={styles.examStartIcon}>
            <Clock size={48} />
          </div>
          <h2>Modo Exame Simulado</h2>
          <p className={styles.examStartDesc}>
            {taskType === 'task1' ? 'Task 1 — Email Writing' : 'Task 2 — Survey Response'}
          </p>
          
          <div className={styles.examRules}>
            <h3>⚠️ Regras do Modo Exame:</h3>
            <ul>
              <li><Clock size={14} /> Timer de <strong>{totalMinutes} minutos</strong> — não pode pausar</li>
              <li><Lock size={14} /> Sem voltar aos steps anteriores durante a escrita</li>
              <li><AlertTriangle size={14} /> Aviso sonoro quando faltar 5 minutos</li>
              <li><XCircle size={14} /> Se o tempo acabar, o exame termina automaticamente</li>
            </ul>
          </div>

          <div className={styles.examStartActions}>
            <button 
              className={styles.examCancelBtn}
              onClick={() => onToggle(false)}
            >
              <Unlock size={18} /> Cancelar
            </button>
            <button 
              className={styles.examStartBtn}
              onClick={handleStartExam}
            >
              <Play size={18} /> Iniciar Exame
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Running
  if (examState === 'running') {
    return (
      <div className={styles.examRunning}>
        <div className={`${styles.examTimer} ${showWarning ? styles.examTimerWarning : ''} ${timeLeft <= 60 ? styles.examTimerCritical : ''}`}>
          <div className={styles.examTimerContent}>
            <span className={styles.examTimerLabel}>
              {showWarning ? '⚠️ ATENÇÃO' : '🎯 MODO EXAME'}
            </span>
            <span className={styles.examTimerDisplay}>
              {formatTime(timeLeft)}
            </span>
            <button 
              className={styles.examFinishBtn}
              onClick={handleFinishEarly}
            >
              <CheckCircle size={16} /> Finalizar
            </button>
          </div>
          <div 
            className={styles.examTimerProgress} 
            style={{ width: `${(timeLeft / (totalMinutes * 60)) * 100}%` }}
          />
        </div>
        {children}
      </div>
    );
  }

  // Finished
  if (examState === 'finished') {
    const timeUsedPercent = examStats ? Math.round((examStats.timeUsed / (totalMinutes * 60)) * 100) : 0;
    const isGoodTime = timeUsedPercent >= 70 && timeUsedPercent <= 100;
    
    return (
      <div className={styles.examOverlay}>
        <div className={styles.examResultCard}>
          <div className={`${styles.examResultIcon} ${examStats?.completed ? styles.examResultSuccess : styles.examResultFail}`}>
            {examStats?.completed ? <Trophy size={48} /> : <XCircle size={48} />}
          </div>
          
          <h2>{examStats?.completed ? 'Exame Concluído!' : 'Tempo Esgotado!'}</h2>
          
          <div className={styles.examStats}>
            <div className={styles.examStatItem}>
              <span className={styles.examStatLabel}>Tempo usado</span>
              <span className={styles.examStatValue}>
                {examStats ? formatTimeUsed(examStats.timeUsed) : '--'}
              </span>
            </div>
            <div className={styles.examStatItem}>
              <span className={styles.examStatLabel}>Tempo disponível</span>
              <span className={styles.examStatValue}>{totalMinutes}m</span>
            </div>
            <div className={styles.examStatItem}>
              <span className={styles.examStatLabel}>Uso do tempo</span>
              <span className={`${styles.examStatValue} ${isGoodTime ? styles.examStatGood : ''}`}>
                {timeUsedPercent}%
              </span>
            </div>
          </div>

          <p className={styles.examResultTip}>
            {examStats?.completed 
              ? isGoodTime 
                ? '✅ Ótimo gerenciamento de tempo!' 
                : timeUsedPercent < 70 
                  ? '💡 Você terminou rápido demais. Revise seu texto com calma!'
                  : '⚠️ Cuidado! Você usou quase todo o tempo.'
              : '💪 Não desista! Pratique mais para melhorar sua velocidade.'}
          </p>

          <div className={styles.examResultActions}>
            <button 
              className={styles.examRestartBtn}
              onClick={handleRestart}
            >
              <RotateCcw size={18} /> Tentar Novamente
            </button>
            <button 
              className={styles.examExitBtn}
              onClick={() => onToggle(false)}
            >
              <Unlock size={18} /> Sair do Modo Exame
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
