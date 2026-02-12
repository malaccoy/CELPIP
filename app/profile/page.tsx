'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, Trophy, Target, Clock, Flame, TrendingUp, 
  ChevronRight, Award, Zap, BookOpen, Headphones, 
  Mic, PenTool, Calendar, Star, Lock, Settings,
  AlertTriangle, Download, Trash2, LogOut, RefreshCw,
  Sparkles, TrendingDown, Minus, BarChart3
} from 'lucide-react';
import RadarChart from '@/components/RadarChart';
import { useUser } from '@/hooks/useUser';
import { useAdaptiveDifficulty } from '@/hooks/useAdaptiveDifficulty';
import { createClient } from '@/lib/supabase/client';
import { fullSync } from '@/hooks/useProgressSync';
import styles from '@/styles/Profile.module.scss';

interface PracticeRecord {
  date?: string;
  timestamp?: string;
  score?: number;
  type?: string;
  task?: string;
  wordCount?: number;
  timeMinutes?: number;
}

interface ModuleStats {
  practices: number;
  avgScore: number;
  lastPractice: string | null;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'progress' | 'achievements' | 'settings'>('progress');
  const [stats, setStats] = useState({
    totalPractices: 0,
    totalMinutes: 0,
    dayStreak: 0,
    avgScore: 0
  });
  const [weeklyActivity, setWeeklyActivity] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [moduleStats, setModuleStats] = useState<Record<string, ModuleStats>>({
    writing: { practices: 0, avgScore: 0, lastPractice: null },
    reading: { practices: 0, avgScore: 0, lastPractice: null },
    speaking: { practices: 0, avgScore: 0, lastPractice: null },
    listening: { practices: 0, avgScore: 0, lastPractice: null }
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  
  const router = useRouter();
  const { user } = useUser();
  const { performances, loaded: adaptiveLoaded } = useAdaptiveDifficulty();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Sync from cloud first if logged in, then load stats
    const initProfile = async () => {
      if (user) {
        setIsSyncing(true);
        await fullSync();
        await syncAchievementsFromCloud();
        setIsSyncing(false);
      }
      loadAllStats();
    };
    initProfile();
  }, [user]);

  const syncAchievementsFromCloud = async () => {
    try {
      const response = await fetch('/api/achievements');
      if (!response.ok) return;
      
      const { data } = await response.json();
      if (data && Array.isArray(data)) {
        // Save to localStorage
        const stored = JSON.parse(localStorage.getItem('celpip_achievements') || '{}');
        for (const ach of data) {
          stored[ach.id] = ach.unlockedAt;
        }
        localStorage.setItem('celpip_achievements', JSON.stringify(stored));
      }
    } catch (e) {
      console.error('Failed to sync achievements:', e);
    }
  };

  const syncAchievementsToCloud = async (unlockedAchievements: Achievement[]) => {
    if (!user) return;
    try {
      const achievements = unlockedAchievements
        .filter(a => a.unlocked)
        .map(a => ({
          id: a.id,
          unlockedAt: a.unlockedAt || new Date().toISOString()
        }));
      
      await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievements }),
      });
    } catch (e) {
      console.error('Failed to sync achievements to cloud:', e);
    }
  };

  const handleManualSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    await fullSync();
    await syncAchievementsFromCloud();
    loadAllStats();
    setIsSyncing(false);
  };

  const loadAllStats = () => {
    // Load from all localStorage keys
    const writingHistory = JSON.parse(localStorage.getItem('celpip_practice_history') || '[]');
    const readingHistory = JSON.parse(localStorage.getItem('celpip_reading_history') || '[]');
    const speakingHistory = JSON.parse(localStorage.getItem('celpip_speaking_history') || '[]');
    const listeningHistory = JSON.parse(localStorage.getItem('celpip_listening_history') || '[]');

    // Normalize history format (handle both 'date' and 'timestamp' fields)
    const normalizeHistory = (history: PracticeRecord[], module: string) => {
      return history.map((p: PracticeRecord & { timestamp?: string; timeMinutes?: number }) => ({
        ...p,
        module,
        date: p.date || p.timestamp || new Date().toISOString(),
        score: p.score || 0,
        timeMinutes: p.timeMinutes || (module === 'writing' ? 15 : module === 'speaking' ? 5 : 10)
      }));
    };

    // Combine all history with normalized format
    const allHistory = [
      ...normalizeHistory(writingHistory, 'writing'),
      ...normalizeHistory(readingHistory, 'reading'),
      ...normalizeHistory(speakingHistory, 'speaking'),
      ...normalizeHistory(listeningHistory, 'listening')
    ];

    // Calculate total practices
    const totalPractices = allHistory.length;

    // Calculate total minutes (use actual timeMinutes if available)
    const totalMinutes = allHistory.reduce((acc: number, p: PracticeRecord & { module: string; timeMinutes?: number }) => {
      return acc + (p.timeMinutes || 10);
    }, 0);

    // Calculate streak
    const dayStreak = calculateStreak(allHistory);

    // Calculate average score
    const scoresOnly = allHistory.filter((p: PracticeRecord) => p.score && p.score > 0).map((p: PracticeRecord) => p.score as number);
    const avgScore = scoresOnly.length > 0 
      ? Math.round((scoresOnly.reduce((a: number, b: number) => a + b, 0) / scoresOnly.length) * 10) / 10
      : 0;

    setStats({ totalPractices, totalMinutes, dayStreak, avgScore });

    // Calculate weekly activity (last 7 days)
    const weekly = calculateWeeklyActivity(allHistory);
    setWeeklyActivity(weekly);

    // Calculate module-specific stats
    const modStats = {
      writing: calculateModuleStats(writingHistory),
      reading: calculateModuleStats(readingHistory),
      speaking: calculateModuleStats(speakingHistory),
      listening: calculateModuleStats(listeningHistory)
    };
    setModuleStats(modStats);

    // Calculate overall score (average of module averages)
    const moduleScores = Object.values(modStats).filter(m => m.avgScore > 0).map(m => m.avgScore);
    const overall = moduleScores.length > 0 
      ? Math.round((moduleScores.reduce((a, b) => a + b, 0) / moduleScores.length) * 10) / 10
      : 0;
    setOverallScore(overall);

    // Generate achievements
    const achievementsList = generateAchievements(allHistory, modStats, dayStreak);
    setAchievements(achievementsList);
    
    // Sync unlocked achievements to cloud
    const unlockedNow = achievementsList.filter(a => a.unlocked);
    if (unlockedNow.length > 0 && user) {
      syncAchievementsToCloud(unlockedNow);
    }
  };

  const calculateStreak = (history: PracticeRecord[]): number => {
    if (history.length === 0) return 0;

    const dates = [...new Set(history.map(p => (p.date || p.timestamp)?.split('T')[0]).filter((d): d is string => !!d))].sort().reverse();
    if (dates.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

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
  };

  const calculateWeeklyActivity = (history: PracticeRecord[]): number[] => {
    const weekly = [0, 0, 0, 0, 0, 0, 0];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 86400000).toISOString().split('T')[0];
      weekly[6 - i] = history.filter(p => p.date?.startsWith(date)).length;
    }
    
    return weekly;
  };

  const calculateModuleStats = (history: PracticeRecord[]): ModuleStats => {
    const practices = history.length;
    const scores = history.filter(p => p.score).map(p => p.score as number);
    const avgScore = scores.length > 0 
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;
    const lastPractice = history.length > 0 ? (history[history.length - 1].date || history[history.length - 1].timestamp || null) : null;
    
    return { practices, avgScore, lastPractice };
  };

  const generateAchievements = (
    history: PracticeRecord[], 
    modStats: Record<string, ModuleStats>,
    streak: number
  ): Achievement[] => {
    // Load stored unlock times
    const storedTimes = JSON.parse(localStorage.getItem('celpip_achievements') || '{}');
    
    const checkUnlock = (id: string, condition: boolean): { unlocked: boolean; unlockedAt?: string } => {
      if (condition) {
        if (!storedTimes[id]) {
          storedTimes[id] = new Date().toISOString();
          localStorage.setItem('celpip_achievements', JSON.stringify(storedTimes));
        }
        return { unlocked: true, unlockedAt: storedTimes[id] };
      }
      return { unlocked: false };
    };
    
    const achievements: Achievement[] = [
      {
        id: 'first_practice',
        name: 'First Steps',
        description: 'Complete your first practice',
        icon: '🎯',
        ...checkUnlock('first_practice', history.length > 0)
      },
      {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        ...checkUnlock('week_warrior', streak >= 7)
      },
      {
        id: 'all_rounder',
        name: 'All Rounder',
        description: 'Practice all 4 modules',
        icon: '🌟',
        ...checkUnlock('all_rounder', Object.values(modStats).every(m => m.practices > 0))
      },
      {
        id: 'writing_master',
        name: 'Writing Master',
        description: 'Score 10+ on a writing task',
        icon: '✍️',
        ...checkUnlock('writing_master', modStats.writing.avgScore >= 10)
      },
      {
        id: 'listener',
        name: 'Active Listener',
        description: 'Complete 10 listening practices',
        icon: '🎧',
        ...checkUnlock('listener', modStats.listening.practices >= 10)
      },
      {
        id: 'speaker',
        name: 'Confident Speaker',
        description: 'Complete 10 speaking practices',
        icon: '🎤',
        ...checkUnlock('speaker', modStats.speaking.practices >= 10)
      },
      {
        id: 'reader',
        name: 'Avid Reader',
        description: 'Complete 10 reading practices',
        icon: '📖',
        ...checkUnlock('reader', modStats.reading.practices >= 10)
      },
      {
        id: 'dedicated',
        name: 'Dedicated Learner',
        description: 'Complete 50 total practices',
        icon: '💪',
        ...checkUnlock('dedicated', history.length >= 50)
      },
      {
        id: 'perfect_score',
        name: 'Perfect Score',
        description: 'Get 12/12 on any practice',
        icon: '👑',
        ...checkUnlock('perfect_score', history.some(p => p.score === 12))
      }
    ];

    return achievements;
  };

  const getDayName = (daysAgo: number): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(Date.now() - daysAgo * 86400000);
    return days[date.getDay()];
  };

  const handleClearStats = () => {
    if (confirm("This will delete ALL your statistics and history. Are you sure?")) {
      localStorage.removeItem('celpip_user_stats');
      localStorage.removeItem('celpip_practice_history');
      localStorage.removeItem('celpip_reading_history');
      localStorage.removeItem('celpip_speaking_history');
      localStorage.removeItem('celpip_listening_history');
      localStorage.removeItem('celpip_last_session');
      alert("Data cleared successfully!");
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      stats: localStorage.getItem('celpip_user_stats'),
      writing: localStorage.getItem('celpip_practice_history'),
      reading: localStorage.getItem('celpip_reading_history'),
      speaking: localStorage.getItem('celpip_speaking_history'),
      listening: localStorage.getItem('celpip_listening_history'),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `celpip_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Avatar" />
            ) : (
              <User size={32} />
            )}
          </div>
          <div className={styles.profileInfo}>
            <h1>{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'CELPIP Student'}</h1>
            <p>{user?.email || 'Preparing for CELPIP General'}</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'progress' ? styles.active : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <TrendingUp size={16} />
          Stats
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'achievements' ? styles.active : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          <Trophy size={16} />
          Awards
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={16} />
          Settings
        </button>
      </nav>

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className={styles.progressTab}>
          {/* Quick Stats */}
          <div className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.blue}`}>
              <div className={styles.statIcon}>
                <Trophy size={22} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.totalPractices}</span>
                <span className={styles.statLabel}>Practices</span>
              </div>
            </div>
            
            <div className={`${styles.statCard} ${styles.orange}`}>
              <div className={styles.statIcon}>
                <Clock size={22} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.totalMinutes}</span>
                <span className={styles.statLabel}>Minutes</span>
              </div>
            </div>
            
            <div className={`${styles.statCard} ${styles.red}`}>
              <div className={styles.statIcon}>
                <Flame size={22} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.dayStreak}</span>
                <span className={styles.statLabel}>Day Streak</span>
              </div>
            </div>
            
            <div className={`${styles.statCard} ${styles.green}`}>
              <div className={styles.statIcon}>
                <Star size={22} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.avgScore || '-'}</span>
                <span className={styles.statLabel}>Avg Score</span>
              </div>
            </div>
          </div>

          {/* CELPIP Radar Chart */}
          <RadarChart 
            scores={{
              writing: moduleStats.writing.avgScore,
              reading: moduleStats.reading.avgScore,
              speaking: moduleStats.speaking.avgScore,
              listening: moduleStats.listening.avgScore
            }}
          />

          {/* AI Assessment */}
          {adaptiveLoaded && Object.keys(performances).length > 0 && (
            <section className={styles.aiAssessment}>
              <h2 className={styles.assessmentTitle}>
                <Sparkles size={16} />
                AI Skill Assessment
              </h2>
              <div className={styles.assessmentGrid}>
                {[
                  { id: 'listening', label: 'Listening', Icon: Headphones, color: '#fb923c' },
                  { id: 'reading', label: 'Reading', Icon: BookOpen, color: '#2dd4bf' },
                  { id: 'writing', label: 'Writing', Icon: PenTool, color: '#c084fc' },
                  { id: 'speaking', label: 'Speaking', Icon: Mic, color: '#38bdf8' },
                ].map(sec => {
                  const perf = performances[sec.id];
                  if (!perf) return (
                    <div key={sec.id} className={styles.assessmentCard}>
                      <div className={styles.assessmentCardHeader}>
                        <sec.Icon size={16} style={{ color: sec.color }} />
                        <span>{sec.label}</span>
                      </div>
                      <span className={styles.assessmentNoData}>No data yet</span>
                    </div>
                  );
                  const levelEmoji = perf.level === 'advanced' ? '🏆' : perf.level === 'intermediate' ? '🔥' : '🌱';
                  const trendColor = perf.trend === 'improving' ? '#34d399' : perf.trend === 'declining' ? '#f87171' : 'rgba(248,250,252,0.3)';
                  return (
                    <div key={sec.id} className={styles.assessmentCard}>
                      <div className={styles.assessmentCardHeader}>
                        <sec.Icon size={16} style={{ color: sec.color }} />
                        <span>{sec.label}</span>
                        <span className={styles.assessmentLevel}>{levelEmoji} {perf.level}</span>
                      </div>
                      <div className={styles.assessmentBar}>
                        <div className={styles.assessmentBarFill} style={{ width: `${Math.round(perf.avgScore * 100)}%`, background: sec.color }} />
                      </div>
                      <div className={styles.assessmentMeta}>
                        <span style={{ color: trendColor, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          {perf.trend === 'improving' ? <TrendingUp size={12} /> : perf.trend === 'declining' ? <TrendingDown size={12} /> : <Minus size={12} />}
                          {perf.trend}
                        </span>
                        <span>{Math.round(perf.avgScore * 100)}% avg</span>
                        <span>{perf.attempts} attempts</span>
                      </div>
                      {perf.avgScore < 0.5 && (
                        <p className={styles.assessmentTip}>⚠️ Focus area — review the technique guide</p>
                      )}
                      {perf.avgScore >= 0.8 && (
                        <p className={styles.assessmentTipGood}>✨ Strong — try advanced difficulty</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <button className={styles.fullReportBtn} onClick={() => router.push('/weakness-report')}>
                <BarChart3 size={14} />
                Full Weakness Report
                <ChevronRight size={14} />
              </button>
            </section>
          )}

          {/* Weekly Activity */}
          <section className={styles.weeklySection}>
            <h2>
              <Calendar size={18} />
              Last 7 Days
            </h2>
            <div className={styles.weeklyChart}>
              {weeklyActivity.map((count, idx) => (
                <div key={idx} className={styles.dayColumn}>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.bar}
                      style={{ 
                        height: `${Math.min(count * 20, 100)}%`,
                        opacity: count > 0 ? 1 : 0.3
                      }}
                    />
                  </div>
                  <span className={styles.dayLabel}>{getDayName(6 - idx)}</span>
                  <span className={styles.countLabel}>{count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className={styles.achievementsTab}>
          <div className={styles.achievementsSummary}>
            <Award size={24} />
            <span>{achievements.filter(a => a.unlocked).length} / {achievements.length} Unlocked</span>
          </div>
          
          <div className={styles.achievementsGrid}>
            {achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`${styles.achievementCard} ${achievement.unlocked ? styles.unlocked : styles.locked}`}
              >
                <div className={styles.achievementIcon}>
                  {achievement.unlocked ? achievement.icon : <Lock size={20} />}
                </div>
                <div className={styles.achievementInfo}>
                  <h3>{achievement.name}</h3>
                  <p>{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className={styles.settingsTab}>
          {/* Account Section */}
          <section className={styles.settingsSection}>
            <h2>
              <User size={18} />
              Account
            </h2>
            <div className={styles.settingsCard}>
              {user && (
                <div className={styles.accountInfo}>
                  <div className={styles.accountRow}>
                    <span className={styles.accountLabel}>Email</span>
                    <span className={styles.accountValue}>{user.email}</span>
                  </div>
                  {user.user_metadata?.full_name && (
                    <div className={styles.accountRow}>
                      <span className={styles.accountLabel}>Name</span>
                      <span className={styles.accountValue}>{user.user_metadata.full_name}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className={styles.settingsRow}>
                <div className={styles.settingsInfo}>
                  <h3>Sign Out</h3>
                  <p>Log out of your account</p>
                </div>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section className={styles.settingsSection}>
            <h2>
              <AlertTriangle size={18} />
              Data Management
            </h2>
            <div className={styles.settingsCard}>
              <div className={styles.dataInfo}>
                <p>Your data is stored locally in your browser. Nothing is sent to external servers.</p>
              </div>
              
              <div className={styles.settingsRow}>
                <div className={styles.settingsInfo}>
                  <h3>Export Data</h3>
                  <p>Download all your practice history</p>
                </div>
                <button className={styles.exportBtn} onClick={handleExportData}>
                  <Download size={18} />
                  Export
                </button>
              </div>
              
              <div className={styles.settingsRow}>
                <div className={styles.settingsInfo}>
                  <h3>Clear All Data</h3>
                  <p>Delete all statistics and history</p>
                </div>
                <button className={styles.dangerBtn} onClick={handleClearStats}>
                  <Trash2 size={18} />
                  Clear
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
