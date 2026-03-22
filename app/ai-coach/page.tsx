'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles, BookOpen, PenTool, Headphones, Mic,
  Loader2, RefreshCw, ArrowRight, Clock, FileText,
  Volume2, ChevronRight, Zap, TrendingUp, TrendingDown, Minus, Play, Pause, Target
} from 'lucide-react';
import { usePlan } from '@/hooks/usePlan';
import { useAdaptiveDifficulty } from '@/hooks/useAdaptiveDifficulty';
import { ProGate } from '@/components/ProGate';
import styles from '@/styles/AIPractice.module.scss';
import { analytics } from '@/lib/analytics';
import dynamic from 'next/dynamic';

const MobileTopBar = dynamic(() => import('@/components/MobileTopBar'), { ssr: false });

// ─── Config ──────────────────────────────────────
type Section = 'reading' | 'writing' | 'listening' | 'speaking';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

const SECTIONS: { id: Section; label: string; icon: React.ElementType; }[] = [
  { id: 'reading', label: 'Reading', icon: BookOpen },
  { id: 'writing', label: 'Writing', icon: PenTool },
  { id: 'listening', label: 'Listening', icon: Headphones },
  { id: 'speaking', label: 'Speaking', icon: Mic },
];

const PARTS: Record<Section, { id: string; label: string }[]> = {
  reading: [
    { id: 'Part 1 (Reading Correspondence)', label: 'Part 1 — Correspondence' },
    { id: 'Part 2 (Reading to Apply a Diagram)', label: 'Part 2 — Diagram' },
    { id: 'Part 3 (Reading for Information)', label: 'Part 3 — Information' },
    { id: 'Part 4 (Reading for Viewpoints)', label: 'Part 4 — Viewpoints' },
  ],
  writing: [
    { id: 'Task 1 (Email/Letter)', label: 'Task 1 — Email' },
    { id: 'Task 2 (Opinion Survey)', label: 'Task 2 — Opinion' },
  ],
  listening: [
    { id: 'Part 1 (Problem Solving)', label: 'Part 1 — Problem Solving' },
    { id: 'Part 2 (Daily Life Conversation)', label: 'Part 2 — Daily Life' },
    { id: 'Part 3 (Information)', label: 'Part 3 — Information' },
    { id: 'Part 4 (News Item)', label: 'Part 4 — News' },
    { id: 'Part 5 (Discussion)', label: 'Part 5 — Discussion' },
    { id: 'Part 6 (Viewpoints)', label: 'Part 6 — Viewpoints' },
  ],
  speaking: [
    { id: 'Task 1 (Giving Advice)', label: 'Task 1 — Advice' },
    { id: 'Task 2 (Personal Experience)', label: 'Task 2 — Experience' },
    { id: 'Task 3 (Describing a Scene)', label: 'Task 3 — Scene' },
    { id: 'Task 4 (Making Predictions)', label: 'Task 4 — Predictions' },
    { id: 'Task 5 (Comparing and Persuading)', label: 'Task 5 — Compare' },
    { id: 'Task 6 (Difficult Situation)', label: 'Task 6 — Difficult Situation' },
    { id: 'Task 7 (Expressing Opinions)', label: 'Task 7 — Opinions' },
    { id: 'Task 8 (Unusual Situation)', label: 'Task 8 — Unusual' },
  ],
};

const SPEAKING_TASK_SLUGS: Record<string, string> = {
  '1': 'giving-advice',
  '2': 'personal-experience',
  '3': 'describing-scene',
  '4': 'making-predictions',
  '5': 'comparing-persuading',
  '6': 'difficult-situation',
  '7': 'expressing-opinions',
  '8': 'unusual-situation',
};

const DIFFICULTIES: { id: Difficulty; emoji: string; label: string; desc: string }[] = [
  { id: 'beginner', emoji: '🌱', label: 'Beginner', desc: 'CLB 5-6' },
  { id: 'intermediate', emoji: '🔥', label: 'Intermediate', desc: 'CLB 7-8' },
  { id: 'advanced', emoji: '🏆', label: 'Advanced', desc: 'CLB 9+' },
];

// ─── Component ───────────────────────────────────
export default function AIPracticePage() {
  const { isPro, loading: planLoading } = usePlan();
  const { performances, loaded: adaptiveLoaded, getLevelForSection, recordAttempt } = useAdaptiveDifficulty();

  const router = useRouter();
  
  // Read skill from URL query param
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialSkill = searchParams?.get('skill') as Section | null;
  
  const [section, setSection] = useState<Section>(
    initialSkill && ['reading', 'writing', 'listening', 'speaking'].includes(initialSkill) ? initialSkill : 'reading'
  );
  const [partOrTask, setPartOrTask] = useState(
    PARTS[initialSkill && ['reading', 'writing', 'listening', 'speaking'].includes(initialSkill) ? initialSkill : 'reading'][0].id
  );

  // React to URL skill param on navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const skill = params.get('skill') as Section | null;
    if (skill && ['reading', 'writing', 'listening', 'speaking'].includes(skill)) {
      setSection(skill);
      setPartOrTask(PARTS[skill][0].id);
    }
  }, []);
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [autoMode, setAutoMode] = useState(true);
  const [sessionScores, setSessionScores] = useState<Record<string, { correct: number; total: number }>>({});
  const [showSessionSummary, setShowSessionSummary] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [exercise, setExercise] = useState<any>(null);
  const [listeningPhase, setListeningPhase] = useState<'listen' | 'questions' | 'results'>('listen');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [clipAudioSrcs, setClipAudioSrcs] = useState<string[]>([]);
  const [currentClipIdx, setCurrentClipIdx] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Speaking recording states
  const [speakingPhase, setSpeakingPhase] = useState<'prompt'|'prep'|'speak'|'review'>('prompt');
  const [countdown, setCountdown] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob|null>(null);
  const [audioUrl, setAudioUrl] = useState<string|null>(null);
  const [speakingFeedback, setSpeakingFeedback] = useState<any>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder|null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startRecordingRef = useRef<() => void>(() => {});
  const stopRecordingRef = useRef<() => void>(() => {});

  // Speaking countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => {
      const newVal = countdown - 1;
      setCountdown(newVal);
      // Auto-transition: prep → speak when countdown hits 0
      if (newVal === 0 && speakingPhase === 'prep') {
        startRecordingRef.current();
      }
      // Auto-stop: speak → review when countdown hits 0
      if (newVal === 0 && speakingPhase === 'speak') {
        stopRecordingRef.current();
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [countdown, speakingPhase]);

  const startPrep = () => {
    setSpeakingPhase('prep');
    setSpeakingFeedback(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setCountdown(exercise?.prepTimeSeconds || 30);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeOpts = MediaRecorder.isTypeSupported('audio/webm') ? { mimeType: 'audio/webm' }
        : MediaRecorder.isTypeSupported('audio/mp4') ? { mimeType: 'audio/mp4' }
        : {};
      const mr = new MediaRecorder(stream, mimeOpts);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
      setSpeakingPhase('speak');
      setCountdown(exercise?.speakTimeSeconds || 60);
    } catch (e) {
      console.error('Mic access denied:', e);
      alert('Please allow microphone access to record your response.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setSpeakingPhase('review');
  };

  startRecordingRef.current = startRecording;
  stopRecordingRef.current = stopRecording;

  const submitSpeakingFeedback = async () => {
    if (!audioBlob || !exercise) return;
    setFeedbackLoading(true);
    try {
      const ext = audioBlob.type.includes('mp4') || audioBlob.type.includes('m4a') ? '.m4a' : '.webm';
      const formData = new FormData();
      formData.append('audio', new File([audioBlob], `recording${ext}`, { type: audioBlob.type }));
      formData.append('task', partOrTask);
      formData.append('prompt', exercise.prompt || exercise.passage || '');
      const res = await fetch('/api/speaking-feedback', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setSpeakingFeedback(data);
        // Save speaking score to session scores for summary
        if (data.score) {
          setSessionScores(prev => ({
            ...prev,
            [partOrTask]: { correct: data.score, total: 12 }
          }));
        }
        // Track exercise count for feedback modal
        const cnt = parseInt(localStorage.getItem('exercise-count') || '0') + 1;
        localStorage.setItem('exercise-count', cnt.toString());
        // Log speaking activity for leaderboard
        fetch('/api/log-activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'speaking', count: 1 }),
        }).catch(() => {});
      } else {
        const err = await res.json().catch(() => ({}));
        console.error('Feedback error:', res.status, err);
        alert(err.error || `Failed to get feedback (${res.status})`);
      }
    } catch (e) {
      console.error('Feedback error:', e);
    }
    setFeedbackLoading(false);
  };
  const [dailyUsage, setDailyUsage] = useState<{ isPro: boolean; used: number; limit: number; remaining: number } | null>(null);

  // Quiz state (reading/listening)
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [usedTopics, setUsedTopics] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('celpip_used_topics') || '[]');
      } catch { return []; }
    }
    return [];
  });

  // Persist used topics
  useEffect(() => {
    fetch(`/api/daily-usage?_=${Date.now()}`).then(r => r.json()).then(setDailyUsage).catch(() => {});
  }, []);

  const refreshUsage = () => {
    fetch(`/api/daily-usage?_=${Date.now()}`).then(r => r.json()).then(setDailyUsage).catch(() => {});
  };

  const incrementUsage = () => {
    fetch('/api/daily-usage', { method: 'POST' }).then(r => r.json()).then(setDailyUsage).catch(() => {});
  };

  useEffect(() => {
    if (usedTopics.length > 0) {
      localStorage.setItem('celpip_used_topics', JSON.stringify(usedTopics.slice(-30)));
    }
  }, [usedTopics]);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset answers when new exercise generated
  const resetQuiz = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
  }, []);

  // Change section → reset part to first option + auto-adjust difficulty
  const handleSectionChange = (s: Section) => {
    setSection(s);
    setPartOrTask(PARTS[s][0].id);
    setExercise(null); setSpeakingPhase('prompt'); setSpeakingFeedback(null); setAudioBlob(null); setAudioUrl(null); setListeningPhase('listen'); setHasListened(false); setIsAudioPlaying(false);
    setAudioSrc(null); setClipAudioSrcs([]); setCurrentClipIdx(0); setImageSrc(null);
    resetQuiz();
    if (autoMode && adaptiveLoaded) {
      let level = getLevelForSection(s);
      if (level === 'advanced' && !isPro) level = 'intermediate';
      setDifficulty(level);
    }
  };

  // Auto-set difficulty on first load
  useEffect(() => {
    if (autoMode && adaptiveLoaded) {
      let level = getLevelForSection(section);
      if (level === 'advanced' && !isPro) level = 'intermediate';
      setDifficulty(level);
    }
  }, [adaptiveLoaded]);

  // Save skill score when session summary shows
  useEffect(() => {
    if (!showSessionSummary) return;
    const parts = PARTS[section];
    let grandCorrect = 0;
    let grandTotal = 0;
    for (const p of parts) {
      const s = sessionScores[p.id];
      if (s) { grandCorrect += s.correct; grandTotal += s.total; }
    }
    if (grandTotal === 0) return;
    const pct = grandCorrect / grandTotal;
    // Convert percentage to CELPIP scale (1-12)
    // 95%+ = 12, 90% = 11, 85% = 10, 75% = 8, 60% = 6, 40% = 4, <40% = 3
    let celpipScore: number;
    if (pct >= 0.95) celpipScore = 12;
    else if (pct >= 0.90) celpipScore = 11;
    else if (pct >= 0.85) celpipScore = 10;
    else if (pct >= 0.80) celpipScore = 9;
    else if (pct >= 0.75) celpipScore = 8;
    else if (pct >= 0.65) celpipScore = 7;
    else if (pct >= 0.55) celpipScore = 6;
    else if (pct >= 0.45) celpipScore = 5;
    else if (pct >= 0.35) celpipScore = 4;
    else celpipScore = 3;
    
    fetch('/api/skill-scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill: section, score: celpipScore, correct: grandCorrect, total: grandTotal }),
    }).catch(() => {});
  }, [showSessionSummary]);

  // ─── Go to Next Part/Task ──────────────────────
  const goToNextPart = () => {
    const parts = PARTS[section];
    const currentIdx = parts.findIndex(p => p.id === partOrTask);
    if (currentIdx < parts.length - 1) {
      const nextPart = parts[currentIdx + 1];
      setPartOrTask(nextPart.id);
      setExercise(null);
      setSpeakingPhase('prompt');
      setSpeakingFeedback(null);
      setAudioBlob(null);
      setAudioUrl(null);
      setListeningPhase('listen');
      setHasListened(false);
      setIsAudioPlaying(false);
      setAudioSrc(null);
      setClipAudioSrcs([]);
      setCurrentClipIdx(0);
      setImageSrc(null);
      resetQuiz();
      // Scroll to very top immediately
      window.scrollTo(0, 0);
      // Auto-generate after state updates
      setTimeout(() => {
        window.scrollTo(0, 0);
        const btn = document.querySelector('[data-generate-btn]') as HTMLButtonElement;
        btn?.click();
      }, 150);
    } else {
      // Last part — show session summary
      setShowSessionSummary(true);
    }
  };

  const hasNextPart = () => {
    const parts = PARTS[section];
    const currentIdx = parts.findIndex(p => p.id === partOrTask);
    return currentIdx < parts.length - 1;
  };

  const getNextPartLabel = () => {
    const parts = PARTS[section];
    const currentIdx = parts.findIndex(p => p.id === partOrTask);
    if (currentIdx < parts.length - 1) {
      return parts[currentIdx + 1].label.split(' — ')[0];
    }
    return '';
  };

// ─── Generate ──────────────────────────────────
  const generate = async () => {
    // Check free daily limit
    if (dailyUsage && !dailyUsage.isPro && dailyUsage.remaining <= 0) {
      setShowUpgradeModal(true);
      analytics.upgradeModalShown('daily_limit');
      return;
    }
    // Writing: skip API, redirect directly to writing page with random theme
    if (section === 'writing') {
      localStorage.setItem('celpip_ai_writing_prompt', JSON.stringify({
        task: partOrTask.includes('Task 1') ? 1 : 2,
        randomTheme: true,
      }));
      incrementUsage();
      router.push(partOrTask.includes('Task 1') ? '/writing/task-1' : '/writing/task-2');
      return;
    }

    setGenerating(true);
    setError(null);
    setExercise(null); setSpeakingPhase('prompt'); setSpeakingFeedback(null); setAudioBlob(null); setAudioUrl(null); setListeningPhase('listen'); setHasListened(false); setIsAudioPlaying(false);
    setAudioSrc(null); setClipAudioSrcs([]); setCurrentClipIdx(0); setImageSrc(null);
    resetQuiz();

    try {
      // Listening: use pre-generated library (instant, no AI call)
      if (section === 'listening') {
        const res = await fetch('/api/listening-library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partOrTask, difficulty }),
        });

        if (res.ok) {
          const data = await res.json();
          setExercise(data.exercise);
          analytics.exerciseStarted(section, partOrTask?.toString(), difficulty);
          incrementUsage();
          if (data.clipAudioUrls) {
            // Part 1 clips
            setClipAudioSrcs(data.clipAudioUrls.map((u: string) => u + '?v=' + Date.now()));
            setCurrentClipIdx(0);
            setAudioSrc(null);
          } else {
            setAudioSrc(data.audioUrl + '?v=' + Date.now());
            setClipAudioSrcs([]);
          }
          setGenerating(false);
          setCooldown(3);
          return;
        }
        // Library-only mode: no AI fallback
        throw new Error('No exercises available for this part and difficulty. Try another option.');
      }

      // Speaking: use pre-generated prompt library
      if (section === 'speaking') {
        const taskNum = partOrTask.match(/Task (\d+)/)?.[1];
        
        // Task 3 & 4 need DALL-E images — use AI generation
        if (taskNum === '3' || taskNum === '4') {
          // Fall through to AI generation below
        } else {
        const taskId = taskNum ? `task${taskNum}` : partOrTask.replace(/^Task \d+[:\s]*/, '').trim().toLowerCase().replace(/[\s()]+/g, '-');
        const res = await fetch('/api/speaking-library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId, difficulty }),
        });

        if (res.ok) {
          const data = await res.json();
          const p = data.prompt;
          setExercise({
            title: p.title || p.scenario || 'Speaking Exercise',
            prompt: p.prompt,
            passage: p.prompt,
            scenario: p.scenario,
            tips: p.tips || [],
            prepTimeSeconds: p.prepTimeSeconds || 30,
            speakTimeSeconds: p.speakTimeSeconds || 60,
            questions: [],
            bulletPoints: p.bulletPoints,
            context: p.context,
            optionA: p.optionA,
            optionB: p.optionB,
            choiceA: p.choiceA,
            choiceB: p.choiceB,
            statement: p.statement,
            difficulty: p.difficulty,
          });
          incrementUsage();
          setGenerating(false);
          setCooldown(3);
          return;
        }
        // Fall through to AI generation
        }
      }

      // Reading: use pre-generated library (instant, no AI call)
      if (section === 'reading') {
        const res = await fetch('/api/reading-library', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ partOrTask, difficulty }),
        });

        if (res.ok) {
          const data = await res.json();
          setExercise(data.exercise);
          analytics.exerciseStarted(section, partOrTask?.toString(), difficulty);
          incrementUsage();
          setGenerating(false);
          setCooldown(3);
          return;
        }
        // Library-only mode: no AI fallback
        throw new Error('No exercises available for this part and difficulty. Try another option.');
      }

      const res = await fetch('/api/ai-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          partOrTask,
          difficulty,
          previousTopics: usedTopics.slice(-15),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed (${res.status})`);
      }

      const data = await res.json();
      const ex = data.exercise;
      // Normalize clip-based exercises: flatten questions for quiz rendering
      if (ex?.clips && Array.isArray(ex.clips) && !ex.questions?.length) {
        let qIdx = 0;
        // Assign unique IDs across all clips to prevent answer collision
        for (const c of ex.clips) {
          if (c.questions) {
            c.questions = c.questions.map((q: any) => ({ ...q, id: ++qIdx }));
          }
        }
        ex.questions = ex.clips.flatMap((c: any) => c.questions || []);
      }
      setExercise(ex);
      incrementUsage();

      // Auto-start prep timer for speaking exercises
      if (section === 'speaking') {
        setSpeakingPhase('prep');
        setSpeakingFeedback(null);
        setAudioBlob(null);
        setAudioUrl(null);
        setCountdown(ex?.prepTimeSeconds || 30);
      }

      // Track topic to avoid repeats (title + scenario for stronger dedup)
      if (data.exercise?.title) {
        const topicDesc = data.exercise.title + (data.exercise.scenario ? ': ' + data.exercise.scenario.substring(0, 80) : '');
        setUsedTopics(prev => [...prev, topicDesc]);
      }

      // Audio for listening
      if (data.audio) {
        const blob = new Blob(
          [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        setAudioSrc(URL.createObjectURL(blob));
      }

      // Clip audios for listening Part 1
      if (data.clipAudios && Array.isArray(data.clipAudios)) {
        const urls = data.clipAudios.map((b64: string) => {
          const blob = new Blob(
            [Uint8Array.from(atob(b64), c => c.charCodeAt(0))],
            { type: 'audio/mpeg' }
          );
          return URL.createObjectURL(blob);
        });
        setClipAudioSrcs(urls);
        setCurrentClipIdx(0);
      }

      // Image for speaking Task 3/4
      if (data.image) {
        setImageSrc(`data:image/png;base64,${data.image}`);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setGenerating(false);
      // Cooldown to prevent spam
      setCooldown(10);
      const cd = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) { clearInterval(cd); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // ─── Quiz answer ───────────────────────────────
  const selectAnswer = (qId: number, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const submitQuiz = () => {
    if (submitted) return;
    setSubmitted(true);
    // Record for adaptive difficulty
    if (exercise?.questions) {
      const total = exercise.questions.length;
      const correct = exercise.questions.filter(
        (q: any) => answers[q.id] === q.correct
      ).length;
      recordAttempt(section, partOrTask, correct, total);
      // Track session scores per part
      setSessionScores(prev => ({
        ...prev,
        [partOrTask]: { correct, total }
      }));
      analytics.exerciseCompleted(section, Math.round((correct/total)*100));
      // Track exercise count for feedback modal trigger
      const cnt = parseInt(localStorage.getItem('exercise-count') || '0') + 1;
      localStorage.setItem('exercise-count', cnt.toString());
      // Log activity for leaderboard (1 per exercise, not per question)
      // Speaking logs in the feedback handler (line ~223), skip here to avoid double-count
      if (section !== 'speaking') {
        fetch('/api/log-activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: section, count: 1 }),
        }).catch(() => {});
      }
    }
  };

  const getScore = () => {
    if (!exercise?.questions) return { correct: 0, total: 0 };
    const total = exercise.questions.length;
    const correct = exercise.questions.filter(
      (q: any) => answers[q.id] === q.correct
    ).length;
    return { correct, total };
  };

  const [isMobileView, setIsMobileView] = useState(false);
  useEffect(() => {
    const check = () => setIsMobileView(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Hide global header on mobile (same approach as MobileDashboard)
  useEffect(() => {
    if (!isMobileView) return;
    const header = document.querySelector('header') as HTMLElement;
    const sidebar = document.querySelector('aside, [class*="sidebar"]') as HTMLElement;
    const fab = document.querySelector('[class*="fab"], [class*="FAB"]') as HTMLElement;
    const mainContainer = document.querySelector('[class*="container"]') as HTMLElement;
    const mainContent = document.querySelector('main') as HTMLElement;

    const els = [header, sidebar, fab].filter(Boolean);
    els.forEach(el => { el.style.display = 'none'; });
    if (mainContainer) { mainContainer.style.paddingTop = '0'; }
    if (mainContent) { mainContent.style.padding = '0'; mainContent.style.maxWidth = '100%'; }

    return () => {
      els.forEach(el => { el.style.display = ''; });
      if (mainContainer) { mainContainer.style.paddingTop = ''; }
      if (mainContent) { mainContent.style.padding = ''; mainContent.style.maxWidth = ''; }
    };
  }, [isMobileView]);

  // ─── Render ────────────────────────────────────
  if (planLoading) return null;

  return (
    <>
    {isMobileView && (
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: '#1b1f2a' }}>
        <MobileTopBar />
      </div>
    )}
    <div className={styles.container}>
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }} onClick={() => setShowUpgradeModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #1b1f2a 100%)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 24, padding: '2rem', maxWidth: 420, width: '100%',
            textAlign: 'center', position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(139,92,246,0.15)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔒</div>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
              Daily Limit Reached
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
              You've completed your <strong style={{ color: '#a78bfa' }}>3 free exercises</strong> for today. 
              Upgrade to Pro for unlimited practice and mock exams.
            </p>
            {/* Countdown */}
            <div style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '0.6rem 1rem',
              marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}>
              <Clock size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                Next free exercises in{' '}
                <strong style={{ color: '#fbbf24' }}>
                  {(() => {
                    const now = new Date();
                    const pst = new Date(now.toLocaleString('en-US', { timeZone: 'America/Vancouver' }));
                    const midnight = new Date(pst);
                    midnight.setDate(midnight.getDate() + 1);
                    midnight.setHours(0, 0, 0, 0);
                    const diff = midnight.getTime() - pst.getTime();
                    const h = Math.floor(diff / 3600000);
                    const m = Math.floor((diff % 3600000) / 60000);
                    return `${h}h ${m}m`;
                  })()}
                </strong>
              </span>
            </div>
            {/* Plan buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.8rem' }}>
              {[
                { plan: 'weekly', label: '1 Week', price: 'CA$9.99', sub: '/week', color: '#6366f1' },
                { plan: 'monthly', label: '1 Month', price: 'CA$29.99', sub: '/month', badge: null, color: '#8b5cf6' },
                { plan: 'quarterly', label: '3 Months', price: 'CA$59.99', sub: '/3 months', badge: 'Most Popular', color: '#7c3aed' },
                { plan: 'annual', label: '1 Year', price: 'CA$149.99', sub: '/year', badge: 'Best Value', color: '#6d28d9' },
              ].map((p) => (
                <button key={p.plan} onClick={async () => {
                  try {
                    analytics.upgradeClicked(p.plan, 'upgrade_modal');
                    const res = await fetch('/api/stripe/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ plan: p.plan }),
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                    else window.location.href = '/pricing';
                  } catch { window.location.href = '/pricing'; }
                }} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.85rem 1.2rem',
                  background: p.badge ? `linear-gradient(135deg, ${p.color}, ${p.color}dd)` : 'rgba(255,255,255,0.06)',
                  border: p.badge ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14, color: '#fff', cursor: 'pointer',
                  transition: 'transform 0.15s, background 0.2s', width: '100%',
                  boxShadow: p.badge ? `0 6px 20px ${p.color}44` : 'none',
                  position: 'relative',
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.label}</div>
                    {p.badge && <div style={{
                      fontSize: '0.65rem', fontWeight: 700, color: '#fbbf24',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>{p.badge}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{p.price}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{p.sub}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowUpgradeModal(false)} style={{
              padding: '0.6rem', background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', cursor: 'pointer',
            }}>
              Maybe later
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>
          <Sparkles size={13} />
          AI Coach
        </div>
        <h1 className={styles.title}>Practice Generator</h1>
        <p className={styles.subtitle}>
          {isPro ? 'Unlimited AI-generated exercises. Pick a section, choose your level, and train.' : 'AI-generated exercises — 3 free per day. Upgrade for unlimited access.'}
        </p>
      </div>

      {/* Section selector */}
      <div className={styles.sectionGrid}>
        {SECTIONS.map(s => {
          const Icon = s.icon;
          const isActive = section === s.id;
          return (
            <div
              key={s.id}
              className={`${isActive ? styles.sectionCardActive : styles.sectionCard} ${styles[s.id]}`}
              onClick={() => handleSectionChange(s.id)}
            >
              <div className={styles.sectionIcon}>
                <Icon size={20} />
              </div>
              <span className={styles.sectionLabel}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Part/Task selector */}
      <div className={styles.partSelector}>
        <div className={styles.partSelectorLabel}>
          {section === 'writing' || section === 'speaking' ? 'Task' : 'Part'}
        </div>
        <div className={styles.partChips}>
          {PARTS[section].map(p => (
            <div
              key={p.id}
              className={partOrTask === p.id ? styles.partChipActive : styles.partChip}
              onClick={() => { setPartOrTask(p.id); setExercise(null); setSpeakingPhase('prompt'); setSpeakingFeedback(null); setAudioBlob(null); setAudioUrl(null); setListeningPhase('listen'); setHasListened(false); setIsAudioPlaying(false); setAudioSrc(null); setClipAudioSrcs([]); setCurrentClipIdx(0); setImageSrc(null); resetQuiz(); }}
            >
              {p.label}
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className={styles.difficultySelector}>
        <div className={styles.partSelectorLabel}>
          Difficulty
          <button
            className={`${styles.autoToggle} ${autoMode ? styles.autoActive : ''}`}
            onClick={() => {
              setAutoMode(!autoMode);
              if (!autoMode && adaptiveLoaded) {
                let level = getLevelForSection(section);
                if (level === 'advanced' && !isPro) level = 'intermediate';
                setDifficulty(level);
              }
            }}
          >
            <Zap size={12} /> {autoMode ? 'Auto' : 'Manual'}
          </button>
        </div>
        {autoMode && performances[section] && (
          <div className={styles.adaptiveInfo}>
            {performances[section].trend === 'improving' && <TrendingUp size={13} />}
            {performances[section].trend === 'declining' && <TrendingDown size={13} />}
            {performances[section].trend === 'stable' && <Minus size={13} />}
            <span>
              {performances[section].attempts} attempts · {Math.round(performances[section].avgScore * 100)}% avg
              {performances[section].trend !== 'stable' && ` · ${performances[section].trend}`}
            </span>
          </div>
        )}
        <div className={styles.difficultyOptions}>
          {DIFFICULTIES.map(d => {
            const locked = d.id === 'advanced' && !isPro;
            return (
              <div
                key={d.id}
                className={`${difficulty === d.id ? styles.difficultyActive : styles.difficultyOption} ${locked ? styles.difficultyLocked : ''}`}
                onClick={() => {
                  if (locked) { router.push('/pricing'); return; }
                  setAutoMode(false); setDifficulty(d.id);
                }}
              >
                <span className={styles.difficultyEmoji}>{locked ? '🔒' : d.emoji}</span>
                <span className={styles.difficultyLabel}>{d.label}</span>
                <span className={styles.difficultyDesc}>{locked ? 'Pro Only' : d.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generate card — hide during listening exercise */}
      {!(section === 'listening' && exercise && listeningPhase !== 'results') && !exercise && (
        <div className={styles.practiceCard}>
          {/* Free usage counter */}
          {dailyUsage && !dailyUsage.isPro && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.6rem 1rem', marginBottom: '1rem',
              background: dailyUsage.remaining > 0 ? 'rgba(99,102,241,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${dailyUsage.remaining > 0 ? 'rgba(99,102,241,0.2)' : 'rgba(239,68,68,0.2)'}`,
              borderRadius: 12, fontSize: '0.82rem'
            }}>
              <span style={{ color: dailyUsage.remaining > 0 ? '#a5b4fc' : '#fca5a5' }}>
                {dailyUsage.remaining > 0
                  ? `${dailyUsage.remaining} of ${dailyUsage.limit} free exercises remaining today`
                  : 'Daily free limit reached'}
              </span>
              {dailyUsage.remaining <= 0 && (
                <a href="/pricing" style={{ color: '#fbbf24', fontWeight: 600, textDecoration: 'none', fontSize: '0.8rem' }}>
                  Upgrade →
                </a>
              )}
            </div>
          )}
          <div className={styles.practiceCardHeader}>
            <div className={`${styles.practiceCardIcon} ${styles[section]}`}>
              {section === 'reading' && <BookOpen size={28} />}
              {section === 'writing' && <PenTool size={28} />}
              {section === 'listening' && <Headphones size={28} />}
              {section === 'speaking' && <Mic size={28} />}
            </div>
            <div className={styles.practiceCardTitle}>
              <span className={`${styles.practiceCardBadge} ${styles[section]}`}>
                {PARTS[section].find(p => p.id === partOrTask)?.label?.split(' — ')[0] || section}
              </span>
              <h3>{PARTS[section].find(p => p.id === partOrTask)?.label?.split(' — ')[1] || section}</h3>
            </div>
          </div>
          <p className={styles.practiceCardDesc}>
            {section === 'reading' && 'Read the passage carefully and answer the questions.'}
            {section === 'writing' && (partOrTask.includes('Task 1') ? 'Write a formal or semi-formal email based on the prompt.' : 'Respond to an opinion survey with structured argumentation.')}
            {section === 'listening' && 'Listen to the audio and answer the questions.'}
            {section === 'speaking' && 'Speak naturally about the topic within the time limit.'}
          </p>
          <div className={styles.practiceCardMeta}>
            {section === 'writing' && <div className={styles.practiceMetaChip}><Target size={14} /><span>150-200 words</span></div>}
            {section === 'writing' && <div className={styles.practiceMetaChip}><Clock size={14} /><span>{partOrTask.includes('Task 1') ? '27' : '26'} min</span></div>}
            {section === 'listening' && <div className={styles.practiceMetaChip}><Clock size={14} /><span>Audio-based</span></div>}
            {section === 'speaking' && <div className={styles.practiceMetaChip}><Clock size={14} /><span>Timed response</span></div>}
            {section === 'reading' && <div className={styles.practiceMetaChip}><Clock size={14} /><span>Multiple choice</span></div>}
            <div className={styles.practiceMetaChip}><Sparkles size={14} /><span>{difficulty}</span></div>
          </div>
          <button
            className={`${styles.practiceCardCta} ${styles[section]}`}
            onClick={generate}
            disabled={generating || cooldown > 0}
            data-generate-btn
          >
            {cooldown > 0 ? (
              <>Wait {cooldown}s</>
            ) : generating ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                Generating...
              </>
            ) : (
              <>
                <Zap size={18} />
                Start Practice
              </>
            )}
          </button>
        </div>
      )}

      {/* Generate button when exercise already showing */}
      {!(section === 'listening' && exercise && listeningPhase !== 'results') && exercise && (
      <button
        className={generating ? styles.loading : styles.generateBtn}
        onClick={generate}
        disabled={generating || cooldown > 0}
        style={{ display: 'none' }}
      >
        Generate
      </button>
      )}

      {/* Error */}
      {error && (
        <div style={{ color: '#f87171', textAlign: 'center', marginBottom: '1rem', fontSize: '0.88rem' }}>
          {error}
        </div>
      )}

      {/* ─── Exercise Display ─── */}
      {exercise && (
        <div className={styles.exerciseWrap}>
          {/* READING */}
          {(section === 'reading' || section === 'listening') && (
            <>
              <div className={styles.exerciseHeader}>
                <h2 className={styles.exerciseTitle}>{exercise.title}</h2>
                <span className={styles.exerciseMeta}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </div>

              {/* Audio (listening only) — Listen Phase: nice card */}
              {section === 'listening' && listeningPhase === 'listen' && (audioSrc || clipAudioSrcs.length > 0) && (
                <div className={styles.listenCard}>
                  <div className={styles.audioVisual}>
                    <div className={`${styles.audioWave} ${isAudioPlaying ? styles.audioWavePlaying : ''}`}>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={styles.waveBar} />
                      ))}
                    </div>
                  </div>
                  
                  <h2 className={styles.listenTitle}>{exercise.title}</h2>
                  
                  {clipAudioSrcs.length > 0 && exercise.clips && (
                    <div className={styles.clipBadge}>
                      🎧 Clip {currentClipIdx + 1} of {clipAudioSrcs.length}
                    </div>
                  )}
                  
                  <p className={styles.listenHint}>
                    {hasListened
                      ? 'Audio finished. Click below when you\'re ready to answer.'
                      : 'Listen carefully, then answer the questions.'}
                  </p>
                  
                  <audio
                    key={clipAudioSrcs.length > 0 ? currentClipIdx : 'single'}
                    ref={audioRef}
                    src={clipAudioSrcs.length > 0 ? clipAudioSrcs[currentClipIdx] : audioSrc || ''}
                    preload="auto"
                    onPlay={() => setIsAudioPlaying(true)}
                    onPause={() => setIsAudioPlaying(false)}
                    onEnded={() => { setIsAudioPlaying(false); setHasListened(true); }}
                  />
                  
                  <div>
                    <button
                      className={styles.playBtn}
                      onClick={() => audioRef.current?.play()}
                      disabled={hasListened}
                    >
                      {isAudioPlaying ? <Pause size={20} /> : <Play size={20} />}
                      <span>{isAudioPlaying ? 'Playing...' : hasListened ? 'Already Played' : 'Play Audio'}</span>
                    </button>
                  </div>
                  
                  {hasListened && (
                    <button className={styles.readyBtn} onClick={() => setListeningPhase('questions')}>
                      Answer Questions <ArrowRight size={18} />
                    </button>
                  )}
                  
                  {clipAudioSrcs.length > 0 && (
                    <div className={styles.clipTabs}>
                      {clipAudioSrcs.map((_, i) => (
                        <div key={i} className={i === currentClipIdx ? styles.clipTabActive : i < currentClipIdx ? styles.clipTabDone : styles.clipTab}>
                          {i < currentClipIdx ? '✅ ' : ''}Clip {i + 1}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Audio still visible in questions phase (for replay) */}
              {section === 'listening' && listeningPhase === 'questions' && clipAudioSrcs.length > 0 && exercise.clips && (
                <div style={{ marginBottom: '1rem' }}>
                  <div className={styles.clipBadge}>
                    🎧 Clip {currentClipIdx + 1} of {clipAudioSrcs.length}
                  </div>
                </div>
              )}

              {/* Passage: hidden for listening when audio available — shown as fallback if no audio */}
              {section === 'listening' && !audioSrc && clipAudioSrcs.length === 0 && exercise.passage && (
                <div className={styles.passageCard}>
                  <p style={{ fontSize: '0.8rem', color: '#f59e0b', marginBottom: '0.5rem' }}>⚠️ Audio generation failed — read the passage below:</p>
                  <p className={styles.passageText}>{exercise.passage}</p>
                </div>
              )}
              {section !== 'listening' && exercise.passage && (
                <div className={styles.passageCard}>
                  <p className={styles.passageText}>{exercise.passage}</p>
                </div>
              )}

              {/* Questions */}
              {exercise.questions && (section !== 'listening' || listeningPhase !== 'listen') && (() => {
                const isClipMode = !!(exercise.clips && clipAudioSrcs.length > 0);
                const currentQuestions = isClipMode && exercise.clips?.[currentClipIdx]?.questions
                  ? exercise.clips[currentClipIdx].questions
                  : exercise.questions;
                const clipAnswered = currentQuestions.every((q: any) => answers[q.id] !== undefined);
                const isLastClip = !isClipMode || currentClipIdx >= (exercise.clips?.length || 1) - 1;
                const allClipsDone = isClipMode && submitted && isLastClip;

                return (
                <div className={styles.questionsSection}>
                  <h3 className={styles.questionsSectionTitle}>
                    {isClipMode
                      ? `Clip ${currentClipIdx + 1} — Questions (${currentQuestions.length})`
                      : `Questions (${exercise.questions.length})`}
                  </h3>

                  {currentQuestions.map((q: any) => (
                    <div key={q.id} className={styles.questionCard}>
                      <p className={styles.questionText}>
                        {q.id}. {q.question}
                      </p>
                      <ul className={styles.optionsList}>
                        {q.options.map((opt: string, idx: number) => {
                          const letters = ['A', 'B', 'C', 'D'];
                          let cls = styles.optionBtn;
                          if (submitted) {
                            if (idx === q.correct) cls = `${styles.optionBtn} ${styles.correct}`;
                            else if (answers[q.id] === idx) cls = `${styles.optionBtn} ${styles.wrong}`;
                          } else if (answers[q.id] === idx) {
                            cls = `${styles.optionBtn} ${styles.selected}`;
                          }
                          return (
                            <li key={idx}>
                              <button className={cls} onClick={() => selectAnswer(q.id, idx)}>
                                <span className={styles.optionLetter}>{letters[idx]}</span>
                                {opt}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                      {submitted && q.explanation && (
                        <div className={styles.explanation}>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Clip mode: Check Answers for this clip → Next Clip */}
                  {isClipMode && !submitted && (
                    <button
                      className={styles.generateBtn}
                      onClick={() => setSubmitted(true)}
                      disabled={!clipAnswered}
                      style={{ marginTop: '0.75rem' }}
                    >
                      Check Answers
                    </button>
                  )}
                  {isClipMode && submitted && !isLastClip && (
                    <button
                      className={styles.generateBtn}
                      onClick={() => {
                        setCurrentClipIdx(prev => prev + 1);
                        setSubmitted(false);
                        // Keep answers from previous clips — don't clear
                        setListeningPhase('listen');
                        setHasListened(false);
                        setIsAudioPlaying(false);
                      }}
                      style={{ marginTop: '0.75rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                      Next Clip 🎧
                    </button>
                  )}
                  {isClipMode && submitted && isLastClip && (
                    <>
                    <div className={styles.resultsBar}>
                      <div>
                        <div className={styles.scoreDisplay}>
                          <span className={styles.scoreNum}>{getScore().correct}</span>
                          <span className={styles.scoreTotal}>/ {getScore().total}</span>
                        </div>
                        <span className={styles.scoreLabel}>
                          {getScore().correct === getScore().total
                            ? 'Perfect! 🎉'
                            : getScore().correct >= getScore().total * 0.7
                              ? 'Good job! 👍'
                              : 'Keep practicing! 💪'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.nextActions}>
                      {hasNextPart() ? (
                        <button className={styles.nextExerciseBtn} onClick={goToNextPart} disabled={generating}>
                          {getNextPartLabel()} →
                        </button>
                      ) : (
                        <button className={styles.nextExerciseBtn} onClick={goToNextPart} disabled={generating}>
                          📊 See Results
                        </button>
                      )}
                    </div>
                    </>
                  )}

                  {/* Non-clip mode: original submit/score */}
                  {!isClipMode && (
                    <button
                      className={styles.generateBtn}
                      onClick={submitQuiz}
                      disabled={submitted || Object.keys(answers).length < (exercise.questions?.length || 0)}
                      style={{ marginTop: '0.75rem', opacity: submitted ? 0.5 : 1 }}
                    >
                      {submitted ? '✓ Answers Checked' : 'Check Answers'}
                    </button>
                  )}
                  {!isClipMode && (
                    <div style={{ display: submitted ? 'block' : 'none' }}>
                    <div className={styles.resultsBar}>
                      <div>
                        <div className={styles.scoreDisplay}>
                          <span className={styles.scoreNum}>{getScore().correct}</span>
                          <span className={styles.scoreTotal}>/ {getScore().total}</span>
                        </div>
                        <span className={styles.scoreLabel}>
                          {getScore().correct === getScore().total
                            ? 'Perfect! 🎉'
                            : getScore().correct >= getScore().total * 0.7
                              ? 'Good job! 👍'
                              : 'Keep practicing! 💪'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.nextActions}>
                      {hasNextPart() ? (
                        <button className={styles.nextExerciseBtn} onClick={goToNextPart} disabled={generating}>
                          {getNextPartLabel()} →
                        </button>
                      ) : (
                        <button className={styles.nextExerciseBtn} onClick={goToNextPart} disabled={generating}>
                          📊 See Results
                        </button>
                      )}
                    </div>
                    </div>
                  )}
                </div>
                );
              })()}
            </>
          )}

          {/* WRITING */}
          {section === 'writing' && (
            <>
              <div className={styles.exerciseHeader}>
                <h2 className={styles.exerciseTitle}>{exercise.title}</h2>
                <span className={styles.exerciseMeta}>{difficulty}</span>
              </div>

              <div className={styles.writingPrompt}>
                <p className={styles.scenarioText}>{exercise.scenario}</p>
                {exercise.bullets && exercise.bullets.length > 0 && (
                  <ul className={styles.bulletList}>
                    {exercise.bullets.map((b: string, i: number) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
                <div className={styles.promptMeta}>
                  <span className={styles.metaItem}>
                    <Clock size={14} />
                    {exercise.timeMinutes || 27} min
                  </span>
                  <span className={styles.metaItem}>
                    <FileText size={14} />
                    {exercise.wordCountTarget?.min || 150}–{exercise.wordCountTarget?.max || 200} words
                  </span>
                </div>
              </div>

              <a
                href={partOrTask.includes('Task 1') ? '/writing/task-1' : '/writing/task-2'}
                className={styles.startPracticeBtn}
                onClick={() => {
                  // Signal writing page to pick a random theme from existing contexts
                  localStorage.setItem('celpip_ai_writing_prompt', JSON.stringify({
                    task: partOrTask.includes('Task 1') ? 1 : 2,
                    randomTheme: true,
                  }));
                }}
              >
                Start Writing <ArrowRight size={16} />
              </a>
            </>
          )}

          {/* SPEAKING */}
          {section === 'speaking' && (
            <>
              <div className={styles.exerciseHeader}>
                <h2 className={styles.exerciseTitle}>{exercise.title}</h2>
                <span className={styles.exerciseMeta}>{difficulty}</span>
              </div>

              {/* Scene image for Task 3/4 */}
              {imageSrc && (
                <div className={styles.sceneImage}>
                  <img src={imageSrc} alt={exercise.title || 'Scene'} />
                </div>
              )}

              <div className={styles.speakingPrompt}>
                <p className={styles.speakingText}>{exercise.prompt}</p>
              </div>

              {/* Phase: prompt — show Start button */}
              {speakingPhase === 'prompt' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                  <div className={styles.promptMeta}>
                    <span className={styles.metaItem}><Clock size={14} /> Prep: {exercise.prepTimeSeconds || 30}s</span>
                    <span className={styles.metaItem}><Mic size={14} /> Speak: {exercise.speakTimeSeconds || 60}s</span>
                  </div>
                  {exercise.tips && exercise.tips.length > 0 && (
                    <ul className={styles.tipsList}>{exercise.tips.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
                  )}
                  <button onClick={startPrep} style={{
                    padding: '1rem', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                    border: 'none', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                    <Clock size={18} /> Start Preparation
                  </button>
                </div>
              )}

              {/* Phase: prep — countdown */}
              {speakingPhase === 'prep' && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Preparation Time
                  </div>
                  <div style={{
                    fontSize: '4rem', fontWeight: 800, color: '#a78bfa',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {countdown}s
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    Think about your response... Recording starts automatically.
                  </div>
                </div>
              )}

              {/* Phase: speak — recording */}
              {speakingPhase === 'speak' && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    🔴 Recording
                  </div>
                  <div style={{
                    fontSize: '4rem', fontWeight: 800, color: countdown <= 10 ? '#f87171' : '#34d399',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {countdown}s
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    Speak now! Recording will stop automatically.
                  </div>
                  <button onClick={stopRecording} style={{
                    marginTop: '1rem', padding: '0.8rem 2rem', background: '#ef4444',
                    border: 'none', borderRadius: 12, color: '#fff', fontWeight: 600, cursor: 'pointer',
                  }}>
                    ⏹ Stop Early
                  </button>
                </div>
              )}

              {/* Phase: review — playback + feedback */}
              {speakingPhase === 'review' && (
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {audioUrl && (
                    <audio controls src={audioUrl} style={{ width: '100%', borderRadius: 8 }} />
                  )}
                  
                  {!speakingFeedback && (
                    <button onClick={submitSpeakingFeedback} disabled={feedbackLoading} style={{
                      padding: '1rem', background: feedbackLoading ? '#4b5563' : 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: '1rem',
                      cursor: feedbackLoading ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                      {feedbackLoading ? '⏳ Analyzing your response...' : '📊 Get AI Feedback'}
                    </button>
                  )}

                  {speakingFeedback && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      
                      {/* Score Card */}
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(109,40,217,0.15))',
                        border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16, padding: '1.5rem', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                          CELPIP Score
                        </div>
                        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: speakingFeedback.score >= 7 ? '#34d399' : speakingFeedback.score >= 5 ? '#fbbf24' : '#f87171' }}>
                          {speakingFeedback.score}<span style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.3)' }}>/12</span>
                        </div>
                        {speakingFeedback.overallComment && (
                          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: 8 }}>
                            {speakingFeedback.overallComment}
                          </p>
                        )}
                      </div>

                      {/* Detailed Scores */}
                      {!isPro && (
                        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                          <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none' }}>
                            <div style={{ background: 'rgba(30,30,40,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
                              <h4 style={{ color: '#a78bfa', margin: '0 0 0.8rem', fontSize: '0.95rem' }}>📊 Detailed Scores</h4>
                              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Content: 7/12 · Vocabulary: 6/12 · Fluency: 5/12 · Structure: 6/12</p>
                            </div>
                            <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 14, padding: '1.2rem', marginTop: '0.8rem' }}>
                              <h4 style={{ color: '#fbbf24', margin: 0, fontSize: '0.95rem' }}>⚠️ Grammar Corrections</h4>
                              <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>3 corrections found...</p>
                            </div>
                            <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 14, padding: '1.2rem', marginTop: '0.8rem' }}>
                              <h4 style={{ color: '#34d399', margin: 0, fontSize: '0.95rem' }}>💡 Vocabulary Upgrades</h4>
                              <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>2 suggestions available...</p>
                            </div>
                            <div style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 14, padding: '1.2rem', marginTop: '0.8rem' }}>
                              <h4 style={{ color: '#60a5fa', margin: 0, fontSize: '0.95rem' }}>🌟 Improved Version</h4>
                              <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>See how a native speaker would answer...</p>
                            </div>
                          </div>
                          <div style={{
                            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', zIndex: 10,
                            background: 'rgba(10,14,26,0.4)', borderRadius: 14,
                          }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</div>
                            <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 0.3rem', fontWeight: 700 }}>Unlock Full Feedback</h3>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 1rem', textAlign: 'center', maxWidth: 280 }}>
                              See detailed scores, grammar corrections, vocabulary upgrades & model response
                            </p>
                            <button
                              onClick={() => router.push('/pricing')}
                              style={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff',
                                padding: '0.7rem 2rem', borderRadius: 12, border: 'none',
                                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                              }}
                            >
                              Upgrade to Pro →
                            </button>
                          </div>
                        </div>
                      )}

                      {isPro && speakingFeedback.detailedFeedback && (
                        <div style={{
                          background: 'rgba(30,30,40,0.6)', border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 14, padding: '1.2rem',
                        }}>
                          <h4 style={{ color: '#a78bfa', margin: '0 0 0.8rem', fontSize: '0.95rem' }}>📊 Detailed Scores</h4>
                          {['content', 'vocabulary', 'fluency', 'structure'].map((cat) => {
                            const fb = (speakingFeedback.detailedFeedback as any)[cat];
                            if (!fb) return null;
                            const labels: any = { content: '📝 Content', vocabulary: '📚 Vocabulary', fluency: '🗣️ Fluency', structure: '🏗️ Structure' };
                            const score = fb.score || 0;
                            const pct = (score / 12) * 100;
                            return (
                              <div key={cat} style={{ marginBottom: '0.8rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>{labels[cat]}</span>
                                  <span style={{ color: score >= 7 ? '#34d399' : score >= 5 ? '#fbbf24' : '#f87171', fontWeight: 700, fontSize: '0.85rem' }}>
                                    {score}/12
                                  </span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, height: 6, overflow: 'hidden' }}>
                                  <div style={{
                                    width: `${pct}%`, height: '100%', borderRadius: 6,
                                    background: score >= 7 ? '#34d399' : score >= 5 ? '#fbbf24' : '#f87171',
                                    transition: 'width 0.5s ease',
                                  }} />
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: 4, lineHeight: 1.4 }}>
                                  {fb.comment}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Your Transcript — Pro only */}
                      {isPro && speakingFeedback.transcript && (
                        <div style={{
                          background: 'rgba(30,30,40,0.6)', border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 14, padding: '1.2rem',
                        }}>
                          <h4 style={{ color: '#60a5fa', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>🎙️ Your Transcript</h4>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                            &ldquo;{speakingFeedback.transcript}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Grammar Errors — Pro only */}
                      {isPro && speakingFeedback.grammarErrors && speakingFeedback.grammarErrors.length > 0 && (
                        <div style={{
                          background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
                          borderRadius: 14, padding: '1.2rem',
                        }}>
                          <h4 style={{ color: '#fbbf24', margin: '0 0 0.8rem', fontSize: '0.95rem' }}>⚠️ Grammar Corrections</h4>
                          {speakingFeedback.grammarErrors.map((g: any, i: number) => (
                            <div key={i} style={{ marginBottom: i < speakingFeedback.grammarErrors.length - 1 ? '0.8rem' : 0, paddingBottom: i < speakingFeedback.grammarErrors.length - 1 ? '0.8rem' : 0, borderBottom: i < speakingFeedback.grammarErrors.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                <span style={{ color: '#f87171', textDecoration: 'line-through', fontSize: '0.9rem' }}>
                                  {typeof g === 'string' ? g : g.error}
                                </span>
                                {typeof g !== 'string' && g.correction && (
                                  <>
                                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
                                    <span style={{ color: '#34d399', fontWeight: 600, fontSize: '0.9rem' }}>{g.correction}</span>
                                  </>
                                )}
                              </div>
                              {typeof g !== 'string' && g.explanation && (
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: 4 }}>{g.explanation}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Vocabulary Suggestions — Pro only */}
                      {isPro && speakingFeedback.vocabularySuggestions && speakingFeedback.vocabularySuggestions.length > 0 && (
                        <div style={{
                          background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
                          borderRadius: 14, padding: '1.2rem',
                        }}>
                          <h4 style={{ color: '#34d399', margin: '0 0 0.8rem', fontSize: '0.95rem' }}>💡 Vocabulary Upgrades</h4>
                          {speakingFeedback.vocabularySuggestions.map((v: any, i: number) => (
                            <div key={i} style={{ marginBottom: i < speakingFeedback.vocabularySuggestions.length - 1 ? '0.8rem' : 0 }}>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                                  {typeof v === 'string' ? v : `"${v.used}"`}
                                </span>
                                {typeof v !== 'string' && v.better && (
                                  <>
                                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
                                    <span style={{ color: '#34d399', fontWeight: 600, fontSize: '0.9rem' }}>&ldquo;{v.better}&rdquo;</span>
                                  </>
                                )}
                              </div>
                              {typeof v !== 'string' && v.why && (
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: 2 }}>{v.why}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Strengths & Improvements — Pro only */}
                      {isPro && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                        {speakingFeedback.strengths && speakingFeedback.strengths.length > 0 && (
                          <div style={{
                            background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)',
                            borderRadius: 14, padding: '1rem',
                          }}>
                            <h4 style={{ color: '#34d399', margin: '0 0 0.5rem', fontSize: '0.85rem' }}>✅ Strengths</h4>
                            <ul style={{ margin: 0, paddingLeft: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                              {speakingFeedback.strengths.map((s: string, i: number) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
                            </ul>
                          </div>
                        )}
                        {speakingFeedback.improvements && speakingFeedback.improvements.length > 0 && (
                          <div style={{
                            background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)',
                            borderRadius: 14, padding: '1rem',
                          }}>
                            <h4 style={{ color: '#f87171', margin: '0 0 0.5rem', fontSize: '0.85rem' }}>🎯 To Improve</h4>
                            <ul style={{ margin: 0, paddingLeft: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
                              {speakingFeedback.improvements.map((s: string, i: number) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>}

                      {/* Model Response — Pro only */}
                      {isPro && speakingFeedback.modelResponse && (
                        <div style={{
                          background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)',
                          borderRadius: 14, padding: '1.2rem',
                        }}>
                          <h4 style={{ color: '#60a5fa', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>🌟 Improved Version</h4>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                            &ldquo;{speakingFeedback.modelResponse}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {speakingFeedback && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                {hasNextPart() ? (
                  <button className={styles.nextExerciseBtn} onClick={goToNextPart} disabled={generating}>
                    {getNextPartLabel()} →
                  </button>
                ) : (
                  <button className={styles.nextExerciseBtn} onClick={goToNextPart} disabled={generating}>
                    📊 See Results
                  </button>
                )}
                <button
                  className={styles.startPracticeBtn}
                  onClick={() => { setSpeakingPhase('prompt'); setSpeakingFeedback(null); setAudioBlob(null); setAudioUrl(null); generate(); }}
                  style={{ opacity: 0.8 }}
                >
                  Try Another Exercise <ArrowRight size={16} />
                </button>
              </div>
              )}
            </>
          )}

          {/* Next exercise button (hidden for speaking and visual tasks) */}
          {section !== 'speaking' && (
            <div className={styles.actions}>
              <button className={styles.nextBtn} onClick={generate} disabled={generating || cooldown > 0}>
                <RefreshCw size={16} />
                {cooldown > 0 ? `Wait ${cooldown}s` : 'Generate Another'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Session Summary */}
      {showSessionSummary && (
        <div className={styles.sessionSummary}>
          <h2 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>📊 Session Summary</h2>
          <p style={{ color: 'rgba(248,250,252,0.5)', marginBottom: '1.5rem' }}>
            {section.charAt(0).toUpperCase() + section.slice(1)} Practice Results
          </p>
          
          {(() => {
            const parts = PARTS[section];
            let grandCorrect = 0;
            let grandTotal = 0;
            return (
              <>
                {parts.map((p) => {
                  const score = sessionScores[p.id];
                  if (score) {
                    grandCorrect += score.correct;
                    grandTotal += score.total;
                  }
                  const pct = score ? Math.round((score.correct / score.total) * 100) : 0;
                  return (
                    <div key={p.id} className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>{p.label.split(' — ')[0]}</span>
                      <div className={styles.summaryBar}>
                        <div className={styles.summaryBarFill} style={{ width: `${pct}%`, background: pct >= 70 ? 'linear-gradient(90deg, #22c55e, #4ade80)' : pct >= 40 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)' }} />
                      </div>
                      <span className={styles.summaryScore}>
                        {score ? (section === 'speaking' ? `${score.correct}/12` : `${score.correct}/${score.total}`) : '—'}
                      </span>
                    </div>
                  );
                })}
                {grandTotal > 0 && (() => {
                  const pct = grandCorrect / grandTotal;
                  const celpip = section === 'speaking'
                    ? Math.round(grandCorrect / parts.filter(p => sessionScores[p.id]).length) // Average AI score
                    : pct >= 0.95 ? 12 : pct >= 0.90 ? 11 : pct >= 0.85 ? 10 : pct >= 0.80 ? 9 : pct >= 0.75 ? 8 : pct >= 0.65 ? 7 : pct >= 0.55 ? 6 : pct >= 0.45 ? 5 : pct >= 0.35 ? 4 : 3;
                  return (
                    <div className={styles.summaryTotal}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: celpip >= 9 ? '#4ade80' : celpip >= 7 ? '#fbbf24' : '#f87171' }}>
                          {celpip}
                        </span>
                        <span style={{ fontSize: '1rem', color: 'rgba(248,250,252,0.4)' }}>/12</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a5b4fc', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
                        Estimated CELPIP Score
                      </span>
                      <span style={{ color: 'rgba(248,250,252,0.5)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                        {grandCorrect}/{grandTotal} correct ({Math.round(pct * 100)}%)
                      </span>
                      <span style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>
                        {celpip >= 10 ? '🎉 Excellent!' : celpip >= 7 ? '👍 Good job!' : '💪 Keep practicing!'}
                      </span>
                    </div>
                  );
                })()}
              </>
            );
          })()}
          
          <button
            className={styles.nextExerciseBtn}
            onClick={() => { 
              setShowSessionSummary(false); 
              setSessionScores({}); 
              setExercise(null);
              // Scroll after React re-render completes
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
            }}
            style={{ marginTop: '1.5rem', width: '100%' }}
          >
            Start New Session
          </button>
        </div>
      )}

    </div>
    </>
  );
}
