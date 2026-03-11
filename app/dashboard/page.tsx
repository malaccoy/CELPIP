'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PenTool, Headphones, BookOpen, Mic, 
  TrendingUp, Clock, Award, ArrowRight, 
  Sparkles, Target, Flame, BarChart3, Trophy,
  CheckCircle, Users, Clock as ClockIcon, Crown
} from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useContentAccess } from '@/hooks/useContentAccess';
import styles from '@/styles/Dashboard.module.scss';
import onboardingStyles from '@/styles/Onboarding.module.scss';

interface SkillProgress {
  sessions: number;
  lastPractice: string | null;
}

interface DashboardStats {
  writing: SkillProgress;
  listening: SkillProgress;
  reading: SkillProgress;
  speaking: SkillProgress;
  totalPractices: number;
  currentStreak: number;
}

interface OnboardingData {
  targetCLB: number | null;
  mainGoal: string;
  experience: string;
  timeline: string;
  assessmentScores: { reading: number; listening: number; writing: number; speaking: number };
  completed: boolean;
}

type AssessmentTaskType = 'listening' | 'reading' | 'writing' | 'speaking';

interface MCQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface AssessmentTask {
  section: AssessmentTaskType;
  type: 'mc' | 'write' | 'speak';
  title: string;
  instruction: string;
  context?: string;
  audioSrc?: string;
  questions?: MCQuestion[];
  writePrompt?: string;
  speakPrompt?: string;
  speakTime?: number;
}

type OnboardingStep = 'welcome' | 'target' | 'goal' | 'experience' | 'timeline' | 'assessment' | 'analyzing' | 'results';

const STORAGE_KEYS = {
  writing: 'celpip_practice_history',
  speaking: 'celpip_speaking_history',
  reading: 'celpip_reading_history',
  listening: 'celpip_listening_history',
  onboarding: 'celpip_onboarding_data'
};

export default function DashboardPage() {
  const router = useRouter();
  const { isPro } = useContentAccess();
  const [showOnboarding, setShowOnboarding] = useState(false); // Onboarding disabled
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    targetCLB: null,
    mainGoal: '',
    experience: '',
    timeline: '',
    assessmentScores: { reading: 0, listening: 0, writing: 0, speaking: 0 },
    completed: false
  });
  
  // Assessment state
  const [taskIndex, setTaskIndex] = useState(0);
  const [mcIndex, setMcIndex] = useState(0);
  const [sectionScores, setSectionScores] = useState({ reading: 0, listening: 0, writing: 0, speaking: 0 });
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [analyzingText, setAnalyzingText] = useState('');
  const [assessmentTimer, setAssessmentTimer] = useState(600);
  const [timerActive, setTimerActive] = useState(false);
  
  // Writing assessment
  const [writingText, setWritingText] = useState('');
  const [writingScore, setWritingScore] = useState<number | null>(null);
  const [writingLoading, setWritingLoading] = useState(false);
  const [writingFeedback, setWritingFeedback] = useState('');
  
  // Speaking assessment
  const [isRecording, setIsRecording] = useState(false);
  const [speakingTimer, setSpeakingTimer] = useState(45);
  const [speakingDone, setSpeakingDone] = useState(false);
  const [speakingScore, setSpeakingScore] = useState<number | null>(null);
  const [speakingLoading, setSpeakingLoading] = useState(false);
  const [speakingFeedback, setSpeakingFeedback] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  // Audio ref
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const SECTION_COLORS: Record<string, string> = {
    reading: '#10b981',
    listening: '#f97316',
    writing: '#8b5cf6',
    speaking: '#0ea5e9'
  };

  const SECTION_ICONS: Record<string, string> = {
    reading: '📖',
    listening: '🎧',
    writing: '✍️',
    speaking: '🎤'
  };

  const assessmentTasks: AssessmentTask[] = [
    // ── Task 1: Listening (audio) ──
    {
      section: 'listening',
      type: 'mc',
      title: 'Listening Comprehension',
      instruction: 'Listen to the audio carefully. You can only play it ONCE. Then answer the questions.',
      audioSrc: '/audio/assessment-listening.mp3',
      questions: [
        {
          question: 'Why will employees work from home on Monday and Tuesday?',
          options: ['There is a holiday', 'Building maintenance', 'A company event', 'Bad weather'],
          correct: 1
        },
        {
          question: 'When was the team lunch moved to?',
          options: ['Monday at noon', 'Wednesday at noon', 'Thursday at noon', 'Friday at noon'],
          correct: 2
        },
        {
          question: 'What should employees do if they need supplies from the office?',
          options: ['Wait until Wednesday', 'Ask a colleague', 'Pick them up on Friday', 'Email the manager before Friday'],
          correct: 0
        },
        {
          question: 'What is the overall tone of this announcement?',
          options: ['Apologetic and concerned', 'Informative and practical', 'Urgent and alarming', 'Casual and humorous'],
          correct: 1
        }
      ]
    },
    // ── Task 2: Reading (passage) ──
    {
      section: 'reading',
      type: 'mc',
      title: 'Reading Comprehension',
      instruction: 'Read the passage below and answer the questions.',
      context: `The City of Vancouver has announced a new program to help small business owners recover from the economic downturn. Starting in March, eligible businesses can apply for grants of up to $15,000. To qualify, businesses must have fewer than 20 employees and demonstrate a revenue decline of at least 25% compared to the previous year.\n\nApplications will be reviewed on a first-come, first-served basis, and the city expects to fund approximately 500 businesses. Mayor Johnson stated, "Small businesses are the backbone of our community, and this program ensures they have the support needed to thrive again."`,
      questions: [
        {
          question: 'What is the maximum grant amount a business can receive?',
          options: ['$10,000', '$15,000', '$20,000', '$25,000'],
          correct: 1
        },
        {
          question: 'What must a business demonstrate to qualify?',
          options: [
            'At least 50 employees',
            'A revenue increase of 25%',
            'A revenue decline of at least 25%',
            'Being in operation for 10+ years'
          ],
          correct: 2
        },
        {
          question: 'How will applications be processed?',
          options: [
            'By a random lottery',
            'Based on the severity of revenue decline',
            'On a first-come, first-served basis',
            'Through a committee review'
          ],
          correct: 2
        },
        {
          question: 'What can be inferred from Mayor Johnson\'s statement?',
          options: [
            'The city has unlimited funding for the program',
            'Large corporations are not affected by the downturn',
            'The city values the role of small businesses in the economy',
            'The program will be extended to other cities'
          ],
          correct: 2
        }
      ]
    },
    // ── Task 3: Writing (mini email) ──
    {
      section: 'writing',
      type: 'write',
      title: 'Writing Task',
      instruction: 'Write a short email (3-5 sentences).',
      writePrompt: 'Your neighbor has been playing loud music late at night. Write an email to your building manager to complain about the noise and request a solution.'
    },
    // ── Task 4: Speaking (record) ──
    {
      section: 'speaking',
      type: 'speak',
      title: 'Speaking Task',
      instruction: 'You have 45 seconds to respond. Speak clearly and give a complete answer.',
      speakPrompt: 'A friend is thinking about moving to a new city for a job opportunity. Give them advice about what they should consider before making this decision.',
      speakTime: 45
    }
  ];

  // Timer effect
  // Track purchase from Stripe redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgraded') === 'true') {
      analytics.purchase(0, 'CAD', 'stripe-redirect');
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && assessmentTimer > 0) {
      interval = setInterval(() => {
        setAssessmentTimer(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            finishAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Speaking timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && speakingTimer > 0) {
      interval = setInterval(() => {
        setSpeakingTimer(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, speakingTimer]);
  
  const [stats, setStats] = useState<DashboardStats>({
    writing: { sessions: 0, lastPractice: null },
    listening: { sessions: 0, lastPractice: null },
    reading: { sessions: 0, lastPractice: null },
    speaking: { sessions: 0, lastPractice: null },
    totalPractices: 0,
    currentStreak: 0
  });

  useEffect(() => {
    // Onboarding disabled — skip check
    setShowOnboarding(false);
    loadStats();
  }, []);

  const checkOnboardingStatus = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      // 1. Try server first (cross-device sync)
      const res = await fetch('/api/onboarding');
      const json = await res.json();
      
      if (json.data && json.data.completed) {
        // Server says onboarding done — sync to localStorage and skip
        localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(json.data));
        setShowOnboarding(false);
        return;
      }
      
      if (json.data && !json.data.completed) {
        // Partial onboarding on server — resume
        setOnboardingData(json.data);
        setShowOnboarding(true);
        return;
      }

      // No server data for this user — start fresh onboarding
      // Don't fall back to localStorage (might belong to a different account)
      localStorage.removeItem(STORAGE_KEYS.onboarding);
      setShowOnboarding(true);
    } catch (err) {
      // Server unreachable — use localStorage as last resort
      console.error('Onboarding check error:', err);
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.onboarding);
        if (!stored) {
          setShowOnboarding(true);
          return;
        }
        const data = JSON.parse(stored) as OnboardingData;
        if (!data.completed) {
          setShowOnboarding(true);
          setOnboardingData(data);
        }
      } catch {
        setShowOnboarding(true);
      }
    }
  };

  const syncOnboardingToServer = async (data: OnboardingData) => {
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // Silent fail — will retry next load
    }
  };

  const updateOnboardingData = (key: keyof OnboardingData, value: OnboardingData[keyof OnboardingData]) => {
    const newData = { ...onboardingData, [key]: value };
    setOnboardingData(newData);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(newData));
    }
  };

  const nextStep = () => {
    const steps: OnboardingStep[] = ['welcome', 'target', 'goal', 'experience', 'timeline', 'assessment', 'analyzing', 'results'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      const next = steps[currentIndex + 1];
      setCurrentStep(next);
      
      // Start timer when entering assessment
      if (next === 'assessment') {
        setTimerActive(true);
      }
      
      // Start analyzing animation
      if (next === 'analyzing') {
        startAnalyzing();
      }
    } else {
      // Complete onboarding — save locally + sync to server
      const finalData = { ...onboardingData, completed: true };
      setOnboardingData(finalData);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.onboarding, JSON.stringify(finalData));
      }
      syncOnboardingToServer(finalData);
      setShowOnboarding(false);
    }
  };

  const startAnalyzing = () => {
    const messages = [
      'Analyzing your Listening skills...',
      'Evaluating Reading comprehension...',
      'Checking Writing quality...',
      'Assessing Speaking fluency...',
      'Building your AI profile...',
      'Generating personalized study plan...'
    ];
    
    let progress = 0;
    let msgIndex = 0;
    setAnalyzingProgress(0);
    setAnalyzingText(messages[0]);
    
    const interval = setInterval(() => {
      progress += 3;
      setAnalyzingProgress(Math.min(progress, 100));
      
      const newMsgIndex = Math.floor((progress / 100) * messages.length);
      if (newMsgIndex !== msgIndex && newMsgIndex < messages.length) {
        msgIndex = newMsgIndex;
        setAnalyzingText(messages[msgIndex]);
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setCurrentStep('results'), 500);
      }
    }, 70);
  };

  const finishAssessment = () => {
    const finalScores = { ...sectionScores };
    // Add writing score if AI evaluated (now on 0-4 scale)
    if (writingScore !== null) {
      finalScores.writing = writingScore >= 9 ? 4 : writingScore >= 7 ? 3 : writingScore >= 5 ? 2 : writingScore >= 3 ? 1 : 0;
    }
    // Add speaking score if AI evaluated (now on 0-4 scale)
    if (speakingScore !== null) {
      finalScores.speaking = speakingScore >= 9 ? 4 : speakingScore >= 7 ? 3 : speakingScore >= 5 ? 2 : speakingScore >= 3 ? 1 : 0;
    }
    setSectionScores(finalScores);
    updateOnboardingData('assessmentScores', finalScores);
    setTimerActive(false);
    setCurrentStep('analyzing');
    startAnalyzing();
  };

  const currentTask = assessmentTasks[taskIndex];

  const handleMCAnswer = (answerIndex: number) => {
    if (quizAnswered || !currentTask.questions) return;
    
    setSelectedAnswer(answerIndex);
    setQuizAnswered(true);
    
    const currentQ = currentTask.questions[mcIndex];
    const isCorrect = answerIndex === currentQ.correct;
    
    if (isCorrect) {
      setSectionScores(prev => ({
        ...prev,
        [currentTask.section]: prev[currentTask.section] + 1
      }));
    }
    
    setTimeout(() => {
      // More questions in this task?
      if (currentTask.questions && mcIndex < currentTask.questions.length - 1) {
        setMcIndex(prev => prev + 1);
        setQuizAnswered(false);
        setSelectedAnswer(null);
      } else {
        // Move to next task
        goToNextTask();
      }
    }, 800);
  };

  const goToNextTask = () => {
    if (taskIndex < assessmentTasks.length - 1) {
      setTaskIndex(prev => prev + 1);
      setMcIndex(0);
      setQuizAnswered(false);
      setSelectedAnswer(null);
      setAudioPlayed(false);
      setAudioPlaying(false);
    } else {
      finishAssessment();
    }
  };

  // Audio controls
  const playAudio = () => {
    if (audioRef.current && !audioPlayed) {
      audioRef.current.play();
      setAudioPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setAudioPlaying(false);
    setAudioPlayed(true);
  };

  // Writing submit — uses free assessment route (no paywall)
  const submitWriting = async () => {
    if (writingText.trim().length < 20) return;
    setWritingLoading(true);
    
    try {
      const res = await fetch('/api/assessment-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: writingText,
          type: 'writing',
          prompt: currentTask.writePrompt || ''
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        const score = data.score || 5;
        setWritingScore(score);
        setWritingFeedback(data.feedback || `Score: ${score}/12`);
        setSectionScores(prev => ({
          ...prev,
          writing: score >= 10 ? 4 : score >= 8 ? 3 : score >= 6 ? 2 : score >= 4 ? 1 : 0
        }));
      } else {
        // Fallback
        const words = writingText.trim().split(/\s+/).length;
        const estimate = Math.min(Math.floor(words / 10) + 3, 8);
        setWritingScore(estimate);
        setWritingFeedback('AI evaluation unavailable. Estimated from response length.');
        setSectionScores(prev => ({
          ...prev,
          writing: estimate >= 10 ? 4 : estimate >= 8 ? 3 : estimate >= 6 ? 2 : estimate >= 4 ? 1 : 0
        }));
      }
    } catch {
      const words = writingText.trim().split(/\s+/).length;
      const estimate = Math.min(Math.floor(words / 10) + 3, 8);
      setWritingScore(estimate);
      setWritingFeedback('AI evaluation unavailable. Estimated from response length.');
      setSectionScores(prev => ({
        ...prev,
        writing: estimate >= 10 ? 4 : estimate >= 8 ? 3 : estimate >= 6 ? 2 : estimate >= 4 ? 1 : 0
      }));
    }
    
    setWritingLoading(false);
  };

  // Speaking recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        setAudioChunks(chunks);
        stream.getTracks().forEach(t => t.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setSpeakingTimer(45);
    } catch {
      // Microphone not available — skip with estimate
      setSpeakingDone(true);
      setSpeakingScore(5);
      setSpeakingFeedback('Microphone not available. Using estimated score.');
      setSectionScores(prev => ({ ...prev, speaking: 1 }));
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    setSpeakingDone(true);
    
    // Submit for AI evaluation
    submitSpeaking();
  };

  const submitSpeaking = async () => {
    setSpeakingLoading(true);
    
    setTimeout(async () => {
      try {
        if (audioChunks.length > 0) {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          
          // Step 1: Transcribe with Whisper via speaking-feedback
          const formData = new FormData();
          formData.append('audio', audioBlob, 'assessment.webm');
          formData.append('taskId', 'giving-advice');
          formData.append('prompt', currentTask.speakPrompt || '');
          
          const res = await fetch('/api/speaking-feedback', {
            method: 'POST',
            body: formData
          });
          
          if (res.ok) {
            const data = await res.json();
            const score = data.overallScore || 6;
            setSpeakingScore(score);
            setSpeakingFeedback(data.strengths?.[0] || data.feedback || `Speaking assessed by AI.`);
            setSectionScores(prev => ({
              ...prev,
              speaking: score >= 10 ? 4 : score >= 8 ? 3 : score >= 6 ? 2 : score >= 4 ? 1 : 0
            }));
          } else {
            // Fallback: try assessment-evaluate with a generic transcript
            setSpeakingScore(6);
            setSpeakingFeedback('Recording captured! Full AI analysis available with Pro ✨');
            setSectionScores(prev => ({ ...prev, speaking: 2 }));
          }
        } else {
          setSpeakingScore(5);
          setSpeakingFeedback('No audio captured.');
          setSectionScores(prev => ({ ...prev, speaking: 1 }));
        }
      } catch {
        setSpeakingScore(6);
        setSpeakingFeedback('Recording captured! Full AI analysis available with Pro ✨');
        setSectionScores(prev => ({ ...prev, speaking: 1 }));
      }
      setSpeakingLoading(false);
    }, 500);
  };

  const formatTimer = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getScoreLevel = (score: number, total: number): { label: string; color: string } => {
    const pct = (score / total) * 100;
    if (pct >= 80) return { label: 'Strong', color: '#10b981' };
    if (pct >= 50) return { label: 'Moderate', color: '#f59e0b' };
    return { label: 'Needs Focus', color: '#ef4444' };
  };

  const getEstimatedCLB = (): number => {
    // MC sections: now 0-4 each (4 questions)
    // AI sections: 0-4 scale from score mapping
    const total = sectionScores.reading + sectionScores.listening + sectionScores.writing + sectionScores.speaking;
    // Max possible: 16 (4 per section)
    if (total >= 15) return 12;
    if (total >= 13) return 11;
    if (total >= 11) return 10;
    if (total >= 9) return 9;
    if (total >= 7) return 8;
    if (total >= 5) return 7;
    if (total >= 3) return 6;
    if (total >= 1) return 5;
    return 4;
  };

  const handleOptionSelect = (key: keyof OnboardingData, value: string | number) => {
    updateOnboardingData(key, value);
    setTimeout(() => nextStep(), 300); // Smooth transition
  };

  const steps: OnboardingStep[] = ['welcome', 'target', 'goal', 'experience', 'timeline', 'assessment'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progressPercent = currentStep === 'analyzing' || currentStep === 'results' 
    ? 100 
    : Math.round(((currentStepIndex + 1) / steps.length) * 100);

  // Rest of the existing dashboard code (loadStats, etc.)
  const loadStats = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const writing = loadModuleStats('writing');
      const speaking = loadModuleStats('speaking');
      const reading = loadModuleStats('reading');
      const listening = loadModuleStats('listening');
      
      const total = writing.sessions + speaking.sessions + reading.sessions + listening.sessions;
      
      setStats({
        writing,
        speaking,
        reading,
        listening,
        totalPractices: total,
        currentStreak: calculateStreak()
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadModuleStats = (module: keyof typeof STORAGE_KEYS): SkillProgress => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS[module]);
      if (!stored) return { sessions: 0, lastPractice: null };
      
      const sessions = JSON.parse(stored);
      if (!Array.isArray(sessions) || sessions.length === 0) {
        return { sessions: 0, lastPractice: null };
      }

      return {
        sessions: sessions.length,
        lastPractice: sessions[0]?.date || null
      };
    } catch {
      return { sessions: 0, lastPractice: null };
    }
  };

  const calculateStreak = (): number => {
    try {
      const allSessions: { date?: string; timestamp?: string }[] = [];
      
      Object.values(STORAGE_KEYS).forEach(key => {
        if (key === STORAGE_KEYS.onboarding) return; // Skip onboarding data
        const stored = localStorage.getItem(key);
        if (stored) {
          const sessions = JSON.parse(stored);
          if (Array.isArray(sessions)) {
            allSessions.push(...sessions);
          }
        }
      });

      if (allSessions.length === 0) return 0;

      // Get unique dates in YYYY-MM-DD format, sorted descending
      const dates = [...new Set(
        allSessions
          .map(s => (s.date || s.timestamp)?.split('T')[0])
          .filter((d): d is string => !!d)
      )].sort().reverse();

      if (dates.length === 0) return 0;

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Streak only counts if last practice was today or yesterday
      if (dates[0] !== today && dates[0] !== yesterday) return 0;

      let streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const curr = new Date(dates[i - 1]);
        const prev = new Date(dates[i]);
        const diff = (curr.getTime() - prev.getTime()) / 86400000;
        if (diff === 1) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch {
      return 0;
    }
  };

  const skills = [
    {
      id: 'writing',
      title: 'Writing',
      icon: PenTool,
      color: '#10b981',
      description: 'Email & Survey Response',
      route: '/ai-coach',
      sessions: stats.writing.sessions
    },
    {
      id: 'listening',
      title: 'Listening',
      icon: Headphones,
      color: '#f59e0b',
      description: 'Problem Solving & News',
      route: '/ai-coach',
      sessions: stats.listening.sessions
    },
    {
      id: 'reading',
      title: 'Reading',
      icon: BookOpen,
      color: '#06b6d4',
      description: 'Correspondence & Diagrams',
      route: '/ai-coach',
      sessions: stats.reading.sessions
    },
    {
      id: 'speaking',
      title: 'Speaking',
      icon: Mic,
      color: '#8b5cf6',
      description: 'Advice & Descriptions',
      route: '/ai-coach',
      sessions: stats.speaking.sessions
    }
  ];

  // If onboarding is active, show onboarding flow
  if (showOnboarding) {
    return (
      <div className={onboardingStyles.container}>
        {currentStep === 'welcome' ? (
          <div className={onboardingStyles.welcomeScreen}>
            <div className={onboardingStyles.header}>
              <div className={onboardingStyles.logo}>
                <Target size={32} />
                <span>CELPIP AI Coach</span>
              </div>
            </div>

            <div className={onboardingStyles.hero}>
              <h1>Get Your CELPIP Score Faster with AI</h1>
              <p className={onboardingStyles.subtitle}>
                Take a quick assessment and get a personalized study plan to reach CLB 9+
              </p>

              {/* Social Proof */}
              <div className={onboardingStyles.socialProof}>
                <div className={onboardingStyles.proofItem}>
                  <CheckCircle size={16} />
                  <span>Trusted by 2,000+ CELPIP students</span>
                </div>
                <div className={onboardingStyles.proofItem}>
                  <CheckCircle size={16} />
                  <span>Helped students reach CLB 9 faster</span>
                </div>
                <div className={onboardingStyles.proofItem}>
                  <CheckCircle size={16} />
                  <span>AI-powered personalized training</span>
                </div>
              </div>

              <div className={onboardingStyles.features}>
                <div className={onboardingStyles.feature}>
                  <Users className={onboardingStyles.featureIcon} />
                  <span>Personalized study plan</span>
                </div>
                <div className={onboardingStyles.feature}>
                  <TrendingUp className={onboardingStyles.featureIcon} />
                  <span>AI score prediction</span>
                </div>
                <div className={onboardingStyles.feature}>
                  <Target className={onboardingStyles.featureIcon} />
                  <span>Focus on your weak areas</span>
                </div>
                <div className={onboardingStyles.feature}>
                  <ClockIcon className={onboardingStyles.featureIcon} />
                  <span>Reach your goal 8-12 weeks faster</span>
                </div>
              </div>
            </div>

            <div className={onboardingStyles.actions}>
              <button 
                className={onboardingStyles.primaryBtn}
                onClick={() => setCurrentStep('target')}
              >
                Start Assessment
                <ArrowRight size={16} />
              </button>
              <p className={onboardingStyles.timeEstimate}>
                Takes 5-10 minutes • Free assessment
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Progress Bar */}
            <div className={onboardingStyles.progressContainer}>
              <div className={onboardingStyles.progressBar}>
                <div 
                  className={onboardingStyles.progressFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className={onboardingStyles.progressText}>
                Step {currentStepIndex + 1} of {steps.length} • {progressPercent}% complete
              </span>
            </div>

            {/* Step Content */}
            <div className={onboardingStyles.stepContent}>
              {currentStep === 'target' && (
                <div className={onboardingStyles.step}>
                  <h2>What CELPIP score do you NEED?</h2>
                  <p className={onboardingStyles.stepSubtitle}>This helps us create your plan</p>
                  
                  <div className={onboardingStyles.options}>
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('targetCLB', 6)}
                    >
                      <span className={onboardingStyles.optionEmoji}>🇨🇦</span>
                      <div>
                        <strong>CLB 5-6</strong>
                        <span>Basic immigration</span>
                      </div>
                    </button>
                    
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('targetCLB', 7)}
                    >
                      <span className={onboardingStyles.optionEmoji}>🎯</span>
                      <div>
                        <strong>CLB 7</strong>
                        <span>Skilled Worker Program</span>
                      </div>
                    </button>
                    
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('targetCLB', 9)}
                    >
                      <span className={onboardingStyles.optionEmoji}>🏆</span>
                      <div>
                        <strong>CLB 9+</strong>
                        <span>Express Entry competitive</span>
                      </div>
                    </button>
                    
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('targetCLB', 0)}
                    >
                      <span className={onboardingStyles.optionEmoji}>🤔</span>
                      <div>
                        <strong>I'm not sure</strong>
                        <span>Help me decide</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'goal' && (
                <div className={onboardingStyles.step}>
                  <h2>What's your main goal?</h2>
                  <p className={onboardingStyles.stepSubtitle}>We'll personalize your training for this goal</p>
                  
                  <div className={onboardingStyles.options}>
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('mainGoal', 'immigration')}
                    >
                      <span className={onboardingStyles.optionEmoji}>🇨🇦</span>
                      <div>
                        <strong>Immigration (Express Entry)</strong>
                      </div>
                    </button>
                    
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('mainGoal', 'work')}
                    >
                      <span className={onboardingStyles.optionEmoji}>💼</span>
                      <div>
                        <strong>Work visa in Canada</strong>
                      </div>
                    </button>
                    
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('mainGoal', 'study')}
                    >
                      <span className={onboardingStyles.optionEmoji}>🎓</span>
                      <div>
                        <strong>Study in Canada</strong>
                      </div>
                    </button>
                    
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('mainGoal', 'improvement')}
                    >
                      <span className={onboardingStyles.optionEmoji}>📈</span>
                      <div>
                        <strong>Personal improvement</strong>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'experience' && (
                <div className={onboardingStyles.step}>
                  <h2>How's your CELPIP experience?</h2>
                  <p className={onboardingStyles.stepSubtitle}>This activates emotional retention and improves recommendations</p>
                  
                  <div className={onboardingStyles.options}>
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('experience', 'first-time')}
                    >
                      <span className={onboardingStyles.optionEmoji}>✨</span>
                      <div>
                        <strong>First time taking it</strong>
                        <span>Starting fresh</span>
                      </div>
                    </button>
                    
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('experience', 'took-once')}
                    >
                      <span className={onboardingStyles.optionEmoji}>🔄</span>
                      <div>
                        <strong>Took it once before</strong>
                        <span>Need to improve</span>
                      </div>
                    </button>
                    
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('experience', 'multiple-times')}
                    >
                      <span className={onboardingStyles.optionEmoji}>😤</span>
                      <div>
                        <strong>Took it multiple times</strong>
                        <span>(still not my target)</span>
                      </div>
                    </button>
                    
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('experience', 'preparing')}
                    >
                      <span className={onboardingStyles.optionEmoji}>📚</span>
                      <div>
                        <strong>Still preparing</strong>
                        <span>Haven't taken it yet</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'timeline' && (
                <div className={onboardingStyles.step}>
                  <h2>When do you need your score?</h2>
                  <p className={onboardingStyles.stepSubtitle}>Without a plan, most students take 3-6 months longer to reach their target</p>
                  
                  <div className={onboardingStyles.options}>
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('timeline', '1-month')}
                    >
                      <span className={onboardingStyles.optionEmoji}>⚡</span>
                      <div>
                        <strong>Within 1 month</strong>
                        <span>Intensive training needed</span>
                      </div>
                    </button>
                    
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('timeline', '2-3-months')}
                    >
                      <span className={onboardingStyles.optionEmoji}>🎯</span>
                      <div>
                        <strong>2-3 months</strong>
                        <span>Focused preparation</span>
                      </div>
                    </button>
                    
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('timeline', '3-6-months')}
                    >
                      <span className={onboardingStyles.optionEmoji}>📈</span>
                      <div>
                        <strong>3-6 months</strong>
                        <span>Steady improvement</span>
                      </div>
                    </button>
                    
                    <button 
                      className={onboardingStyles.option}
                      onClick={() => handleOptionSelect('timeline', 'flexible')}
                    >
                      <span className={onboardingStyles.optionEmoji}>🌱</span>
                      <div>
                        <strong>No rush</strong>
                        <span>Learning at my pace</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'assessment' && currentTask && (
                <div className={onboardingStyles.step}>
                  {/* Timer + Section Header */}
                  <div className={onboardingStyles.assessmentHeader}>
                    <div 
                      className={onboardingStyles.sectionBadge}
                      style={{ background: `${SECTION_COLORS[currentTask.section]}20`, color: SECTION_COLORS[currentTask.section], borderColor: `${SECTION_COLORS[currentTask.section]}40` }}
                    >
                      {SECTION_ICONS[currentTask.section]} {currentTask.section.charAt(0).toUpperCase() + currentTask.section.slice(1)}
                    </div>
                    <div className={`${onboardingStyles.timer} ${assessmentTimer < 60 ? onboardingStyles.timerUrgent : ''}`}>
                      <Clock size={14} />
                      {formatTimer(assessmentTimer)}
                    </div>
                  </div>

                  <h2>{currentTask.title}</h2>
                  <p className={onboardingStyles.stepSubtitle}>
                    Task {taskIndex + 1} of {assessmentTasks.length} — {currentTask.instruction}
                  </p>

                  {/* Task Progress */}
                  <div className={onboardingStyles.sectionDots}>
                    {assessmentTasks.map((t, i) => (
                      <div
                        key={i}
                        className={`${onboardingStyles.taskDot} ${i === taskIndex ? onboardingStyles.dotActive : ''} ${i < taskIndex ? onboardingStyles.dotDone : ''}`}
                        style={{ background: i <= taskIndex ? SECTION_COLORS[t.section] : undefined }}
                      >
                        {SECTION_ICONS[t.section]}
                      </div>
                    ))}
                  </div>

                  {/* ── MC Tasks (Listening & Reading) ── */}
                  {currentTask.type === 'mc' && currentTask.questions && (
                    <div className={onboardingStyles.quizCard}>
                      {/* Audio Player for Listening */}
                      {currentTask.audioSrc && (
                        <div className={onboardingStyles.audioSection}>
                          <audio ref={audioRef} src={currentTask.audioSrc} onEnded={handleAudioEnded} />
                          {!audioPlayed ? (
                            <button 
                              className={onboardingStyles.audioBtn}
                              onClick={playAudio}
                              disabled={audioPlaying}
                            >
                              <Headphones size={20} />
                              {audioPlaying ? 'Playing... Listen carefully' : 'Play Audio (one chance)'}
                            </button>
                          ) : (
                            <div className={onboardingStyles.audioPlayed}>
                              ✓ Audio played — now answer the questions
                            </div>
                          )}
                        </div>
                      )}

                      {/* Reading Context */}
                      {currentTask.context && !currentTask.audioSrc && (
                        <div className={onboardingStyles.quizContext}>
                          {currentTask.context}
                        </div>
                      )}

                      {/* Show questions only after audio played (or if no audio) */}
                      {(!currentTask.audioSrc || audioPlayed) && (
                        <>
                          <p className={onboardingStyles.quizQuestion}>
                            {currentTask.questions[mcIndex].question}
                          </p>
                          
                          <div className={onboardingStyles.quizOptions}>
                            {currentTask.questions[mcIndex].options.map((opt, i) => {
                              let optClass = onboardingStyles.quizOption;
                              if (quizAnswered) {
                                if (i === currentTask.questions![mcIndex].correct) {
                                  optClass += ` ${onboardingStyles.correct}`;
                                } else if (i === selectedAnswer && i !== currentTask.questions![mcIndex].correct) {
                                  optClass += ` ${onboardingStyles.incorrect}`;
                                }
                              }
                              
                              return (
                                <button
                                  key={i}
                                  className={optClass}
                                  onClick={() => handleMCAnswer(i)}
                                  disabled={quizAnswered}
                                >
                                  <span className={onboardingStyles.quizLetter}>
                                    {String.fromCharCode(65 + i)}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* ── Writing Task ── */}
                  {currentTask.type === 'write' && (
                    <div className={onboardingStyles.writeCard}>
                      <div className={onboardingStyles.writePrompt}>
                        <PenTool size={16} />
                        <span>{currentTask.writePrompt}</span>
                      </div>
                      
                      <textarea
                        className={onboardingStyles.writeTextarea}
                        placeholder="Write your email here... (3-5 sentences)"
                        value={writingText}
                        onChange={(e) => setWritingText(e.target.value)}
                        rows={6}
                        disabled={writingScore !== null}
                      />
                      
                      <div className={onboardingStyles.writeFooter}>
                        <span className={onboardingStyles.wordCount}>
                          {writingText.trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                        
                        {writingScore === null ? (
                          writingLoading ? (
                            <button
                              className={onboardingStyles.submitBtn}
                              disabled
                            >
                              <Sparkles size={14} /> AI is reading your email...
                            </button>
                          ) : (
                            <button
                              className={onboardingStyles.submitBtn}
                              onClick={submitWriting}
                              disabled={writingText.trim().split(/\s+/).length < 10}
                            >
                              Submit & Get AI Score
                            </button>
                          )
                        ) : (
                          <div className={onboardingStyles.writeResult}>
                            <span className={onboardingStyles.writeScore}>Score: {writingScore}/12</span>
                            <button className={onboardingStyles.nextTaskBtn} onClick={goToNextTask}>
                              Next Task <ArrowRight size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {writingFeedback && (
                        <div className={onboardingStyles.aiFeedbackNote}>
                          <Sparkles size={14} />
                          <span>{writingFeedback}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Speaking Task ── */}
                  {currentTask.type === 'speak' && (
                    <div className={onboardingStyles.speakCard}>
                      <div className={onboardingStyles.speakPrompt}>
                        <Mic size={16} />
                        <span>{currentTask.speakPrompt}</span>
                      </div>
                      
                      {!isRecording && !speakingDone && (
                        <button className={onboardingStyles.recordBtn} onClick={startRecording}>
                          <Mic size={24} />
                          <span>Tap to Start Recording</span>
                          <span className={onboardingStyles.recordHint}>45 seconds</span>
                        </button>
                      )}

                      {isRecording && (
                        <div className={onboardingStyles.recordingActive}>
                          <div className={onboardingStyles.recordingPulse}>
                            <Mic size={32} />
                          </div>
                          <span className={onboardingStyles.recordingTimer}>{formatTimer(speakingTimer)}</span>
                          <span className={onboardingStyles.recordingLabel}>Recording...</span>
                          <button className={onboardingStyles.stopBtn} onClick={stopRecording}>
                            Stop Recording
                          </button>
                        </div>
                      )}

                      {speakingDone && (
                        <div className={onboardingStyles.speakResult}>
                          {speakingLoading ? (
                            <div className={onboardingStyles.speakLoading}>
                              <Sparkles size={20} />
                              <span>AI analyzing your speech...</span>
                            </div>
                          ) : (
                            <>
                              {speakingScore !== null && (
                                <div className={onboardingStyles.speakScoreDisplay}>
                                  <span className={onboardingStyles.speakScoreNum}>{speakingScore}/12</span>
                                  <span className={onboardingStyles.speakScoreLabel}>Speaking Score</span>
                                </div>
                              )}
                              {speakingFeedback && (
                                <div className={onboardingStyles.aiFeedbackNote}>
                                  <Sparkles size={14} />
                                  <span>{speakingFeedback}</span>
                                </div>
                              )}
                              <button className={onboardingStyles.nextTaskBtn} onClick={finishAssessment}>
                                See My Results <ArrowRight size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentStep === 'analyzing' && (
                <div className={onboardingStyles.step}>
                  <div className={onboardingStyles.analyzingScreen}>
                    <div className={onboardingStyles.analyzingIcon}>
                      <Sparkles size={40} />
                    </div>
                    <h2>{analyzingText}</h2>
                    <div className={onboardingStyles.analyzingBar}>
                      <div 
                        className={onboardingStyles.analyzingFill}
                        style={{ width: `${analyzingProgress}%` }}
                      />
                    </div>
                    <p className={onboardingStyles.analyzingPercent}>{analyzingProgress}%</p>
                  </div>
                </div>
              )}

              {currentStep === 'results' && (
                <div className={onboardingStyles.step}>
                  <div className={onboardingStyles.resultsHeader}>
                    <h2>Your CELPIP Profile</h2>
                    <div className={onboardingStyles.clbEstimate}>
                      <span className={onboardingStyles.clbNumber}>CLB {getEstimatedCLB()}</span>
                      <span className={onboardingStyles.clbLabel}>Estimated Level</span>
                    </div>
                  </div>

                  {onboardingData.targetCLB && onboardingData.targetCLB > 0 && (
                    <p className={onboardingStyles.targetGap}>
                      {getEstimatedCLB() >= (onboardingData.targetCLB || 0)
                        ? `✅ You're already near your CLB ${onboardingData.targetCLB} target!`
                        : `📈 You need +${(onboardingData.targetCLB || 0) - getEstimatedCLB()} CLB levels to reach your target of CLB ${onboardingData.targetCLB}`
                      }
                    </p>
                  )}

                  {/* 4 Section Score Cards */}
                  <div className={onboardingStyles.scoreGrid}>
                    {(['reading', 'listening', 'writing', 'speaking'] as const).map(section => {
                      const score = sectionScores[section];
                      const level = getScoreLevel(score, 4);
                      return (
                        <div key={section} className={onboardingStyles.scoreCard}>
                          <div className={onboardingStyles.scoreCardHeader}>
                            <span>{SECTION_ICONS[section]}</span>
                            <span className={onboardingStyles.scoreCardTitle}>
                              {section.charAt(0).toUpperCase() + section.slice(1)}
                            </span>
                          </div>
                          <div className={onboardingStyles.scoreBarContainer}>
                            <div
                              className={onboardingStyles.scoreBar}
                              style={{ width: `${(score / 4) * 100}%`, background: SECTION_COLORS[section] }}
                            />
                          </div>
                          <div className={onboardingStyles.scoreCardFooter}>
                            <span style={{ color: level.color, fontWeight: 600 }}>{level.label}</span>
                            <span>{score}/4</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Personalized Recommendation */}
                  <div className={onboardingStyles.recommendationCard}>
                    <h4>🎯 Your Personalized Plan</h4>
                    <div className={onboardingStyles.recommendationList}>
                      {([...['reading', 'listening', 'writing', 'speaking']] as ('reading' | 'listening' | 'writing' | 'speaking')[])
                        .sort((a, b) => sectionScores[a] - sectionScores[b])
                        .map((section, i) => {
                          const score = sectionScores[section];
                          const priority = i === 0 ? 'High Priority' : i === 1 ? 'Medium Priority' : 'Maintain';
                          const priorityColor = i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#10b981';
                          return (
                            <div key={section} className={onboardingStyles.recommendationItem}>
                              <span>{SECTION_ICONS[section]}</span>
                              <span className={onboardingStyles.recommendationSection}>
                                {section.charAt(0).toUpperCase() + section.slice(1)}
                              </span>
                              <span 
                                className={onboardingStyles.recommendationPriority}
                                style={{ color: priorityColor }}
                              >
                                {priority}
                              </span>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>

                  {/* Urgency Message */}
                  <div className={onboardingStyles.urgencyCard}>
                    <p>⚡ Students with a personalized plan reach their target <strong>8-12 weeks faster</strong></p>
                  </div>

                  {/* Premium Teaser */}
                  <div className={onboardingStyles.premiumTeaser}>
                    <div className={onboardingStyles.planColumn}>
                      <h4>Free</h4>
                      <ul>
                        <li>✓ Technique guides</li>
                        <li>✓ Basic practice</li>
                        <li>✓ Score tracking</li>
                      </ul>
                    </div>
                    <div className={`${onboardingStyles.planColumn} ${onboardingStyles.proPlan}`}>
                      <h4>Pro ✨</h4>
                      <ul>
                        <li>✓ Unlimited AI feedback</li>
                        <li>✓ Mock exams</li>
                        <li>✓ Adaptive difficulty</li>
                        <li>✓ Weakness analysis</li>
                      </ul>
                    </div>
                  </div>

                  {/* CTA */}
                  <button 
                    className={onboardingStyles.primaryBtn}
                    onClick={() => nextStep()}
                  >
                    Start Training Now
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Regular dashboard content
  // Check if we have assessment data from onboarding
  const onboardingRaw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.onboarding) : null;
  const savedOnboarding = onboardingRaw ? JSON.parse(onboardingRaw) : null;
  const hasAssessment = savedOnboarding?.assessmentScores;

  return (
    <div className={styles.container}>
      {/* Welcome + CLB Level */}
      {hasAssessment && (
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeCard}>
            {isPro && (
              <div className={styles.proCrown}>
                <Crown size={16} />
                <span>PRO</span>
              </div>
            )}
            <div className={styles.welcomeLeft}>
              <h2 className={styles.welcomeTitle}>
                {savedOnboarding.targetCLB 
                  ? `Target: CLB ${savedOnboarding.targetCLB}`
                  : 'Your CELPIP Journey'
                }
              </h2>
              <p className={styles.welcomeSubtitle}>
                {savedOnboarding.goal === 'immigration' ? 'Immigration Pathway' :
                 savedOnboarding.goal === 'work' ? 'Career Advancement' :
                 savedOnboarding.goal === 'study' ? 'Academic Goals' : 'English Improvement'}
                {savedOnboarding.timeline ? ` · ${savedOnboarding.timeline}` : ''}
              </p>
            </div>
            <div className={styles.clbBadge}>
              <span className={styles.clbValue}>CLB {
                (() => {
                  const s = savedOnboarding.assessmentScores;
                  const total = (s.reading || 0) + (s.listening || 0) + (s.writing || 0) + (s.speaking || 0);
                  if (total >= 7) return 10;
                  if (total >= 6) return 9;
                  if (total >= 5) return 8;
                  if (total >= 4) return 7;
                  if (total >= 2) return 6;
                  return 5;
                })()
              }</span>
              <span className={styles.clbCaption}>Est. Level</span>
            </div>
          </div>
        </section>
      )}

      {/* Quick Stats */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Target size={18} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.totalPractices}</span>
              <span className={styles.statLabel}>Sessions</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Flame size={18} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.currentStreak}</span>
              <span className={styles.statLabel}>Day Streak</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Clock size={18} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {stats.totalPractices > 0 ? 'Today' : '—'}
              </span>
              <span className={styles.statLabel}>Last Practice</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Coach CTAs */}
      <section className={styles.aiCoachSection}>
        <div className={styles.aiCoachGrid}>
          <div 
            className={`${styles.aiCoachCard} ${styles.primary}`}
            onClick={() => router.push('/ai-coach')}
          >
            <div className={styles.aiCoachIcon}>
              <Sparkles size={24} />
            </div>
            <div className={styles.aiCoachContent}>
              <h3>AI Practice Generator</h3>
              <p>Infinite exercises, adaptive difficulty</p>
            </div>
            <ArrowRight size={16} className={styles.aiCoachArrow} />
          </div>

          <div 
            className={`${styles.aiCoachCard} ${styles.secondary}`}
            onClick={() => router.push('/mock-exam')}
          >
            <div className={styles.aiCoachIcon}>
              <Trophy size={24} />
            </div>
            <div className={styles.aiCoachContent}>
              <h3>AI Mock Exam</h3>
              <p>Full test simulation with CLB estimation</p>
            </div>
            <ArrowRight size={16} className={styles.aiCoachArrow} />
          </div>

          <div 
            className={`${styles.aiCoachCard} ${styles.tertiary}`}
            onClick={() => router.push('/weakness-report')}
          >
            <div className={styles.aiCoachIcon}>
              <BarChart3 size={24} />
            </div>
            <div className={styles.aiCoachContent}>
              <h3>Weakness Report</h3>
              <p>Personalized improvement recommendations</p>
            </div>
            <ArrowRight size={16} className={styles.aiCoachArrow} />
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className={styles.skillsSection}>
        <h2 className={styles.sectionTitle}>Practice by Skill</h2>
        <div className={styles.skillsGrid}>
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <article 
                key={skill.id}
                className={`${styles.skillCard} ${styles[skill.id]}`}
                onClick={() => router.push(skill.route)}
                style={{ '--skill-color': skill.color } as React.CSSProperties}
              >
                <div className={styles.skillHeader}>
                  <div className={styles.skillIconBox}>
                    <Icon size={24} />
                  </div>
                  {skill.sessions > 0 && (
                    <div className={styles.sessionBadge}>
                      <Award size={12} />
                      <span>{skill.sessions}</span>
                    </div>
                  )}
                </div>

                <h3 className={styles.skillName}>{skill.title}</h3>
                <p className={styles.skillDesc}>{skill.description}</p>

                <div className={styles.skillAction}>
                  <span>{skill.sessions > 0 ? 'Continue' : 'Start'}</span>
                  <ArrowRight size={16} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Motivation */}
      {stats.totalPractices === 0 && (
        <div className={styles.motivationCard}>
          <Sparkles size={24} />
          <div className={styles.motivationText}>
            <h3>Ready to start?</h3>
            <p>Pick any skill above and begin your CELPIP preparation!</p>
          </div>
        </div>
      )}

      {stats.currentStreak >= 3 && (
        <div className={`${styles.motivationCard} ${styles.success}`}>
          <Flame size={24} />
          <div className={styles.motivationText}>
            <h3>🔥 {stats.currentStreak} day streak!</h3>
            <p>Amazing consistency! Keep it going!</p>
          </div>
        </div>
      )}
    </div>
  );
}