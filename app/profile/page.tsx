'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, Trophy, Target, Clock, Flame, TrendingUp, 
  ChevronRight, Award, Zap, BookOpen, Headphones, 
  Mic, PenTool, Calendar, Star, Lock, Settings,
  AlertTriangle, Download, Trash2
} from 'lucide-react';
import RadarChart from '@/components/RadarChart';
import styles from '@/styles/Profile.module.scss';

interface PracticeRecord {
  date: string;
  score?: number;
  type?: string;
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
  const [activeTab, setActiveTab] = useState<'progress' | 'achievements' | 'goals' | 'settings'>('progress');
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
  const [dailyGoal, setDailyGoal] = useState({ current: 0, target: 5 });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = () => {
    // Load from all localStorage keys
    const writingHistory = JSON.parse(localStorage.getItem('celpip_practice_history') || '[]');
    const readingHistory = JSON.parse(localStorage.getItem('celpip_reading_history') || '[]');
    const speakingHistory = JSON.parse(localStorage.getItem('celpip_speaking_history') || '[]');
    const listeningHistory = JSON.parse(localStorage.getItem('celpip_listening_history') || '[]');

    // Combine all history
    const allHistory = [
      ...writingHistory.map((p: PracticeRecord) => ({ ...p, module: 'writing' })),
      ...readingHistory.map((p: PracticeRecord) => ({ ...p, module: 'reading' })),
      ...speakingHistory.map((p: PracticeRecord) => ({ ...p, module: 'speaking' })),
      ...listeningHistory.map((p: PracticeRecord) => ({ ...p, module: 'listening' }))
    ];

    // Calculate total practices
    const totalPractices = allHistory.length;

    // Calculate total minutes (estimate 5-15 min per practice depending on type)
    const totalMinutes = allHistory.reduce((acc: number, p: PracticeRecord & { module: string }) => {
      if (p.module === 'writing') return acc + 15;
      if (p.module === 'speaking') return acc + 5;
      if (p.module === 'reading') return acc + 10;
      if (p.module === 'listening') return acc + 8;
      return acc + 10;
    }, 0);

    // Calculate streak
    const dayStreak = calculateStreak(allHistory);

    // Calculate average score
    const scoresOnly = allHistory.filter((p: PracticeRecord) => p.score).map((p: PracticeRecord) => p.score as number);
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

    // Calculate daily goal (practices today)
    const today = new Date().toISOString().split('T')[0];
    const todayPractices = allHistory.filter((p: PracticeRecord) => p.date?.startsWith(today)).length;
    setDailyGoal({ current: todayPractices, target: 5 });

    // Calculate overall score (average of module averages)
    const moduleScores = Object.values(modStats).filter(m => m.avgScore > 0).map(m => m.avgScore);
    const overall = moduleScores.length > 0 
      ? Math.round((moduleScores.reduce((a, b) => a + b, 0) / moduleScores.length) * 10) / 10
      : 0;
    setOverallScore(overall);

    // Generate achievements
    const achievementsList = generateAchievements(allHistory, modStats, dayStreak);
    setAchievements(achievementsList);
  };

  const calculateStreak = (history: PracticeRecord[]): number => {
    if (history.length === 0) return 0;

    const dates = [...new Set(history.map(p => p.date?.split('T')[0]).filter(Boolean))].sort().reverse();
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
    const lastPractice = history.length > 0 ? history[history.length - 1].date : null;
    
    return { practices, avgScore, lastPractice };
  };

  const generateAchievements = (
    history: PracticeRecord[], 
    modStats: Record<string, ModuleStats>,
    streak: number
  ): Achievement[] => {
    const achievements: Achievement[] = [
      {
        id: 'first_practice',
        name: 'First Steps',
        description: 'Complete your first practice',
        icon: '🎯',
        unlocked: history.length > 0
      },
      {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        unlocked: streak >= 7
      },
      {
        id: 'all_rounder',
        name: 'All Rounder',
        description: 'Practice all 4 modules',
        icon: '🌟',
        unlocked: Object.values(modStats).every(m => m.practices > 0)
      },
      {
        id: 'writing_master',
        name: 'Writing Master',
        description: 'Score 10+ on a writing task',
        icon: '✍️',
        unlocked: modStats.writing.avgScore >= 10
      },
      {
        id: 'listener',
        name: 'Active Listener',
        description: 'Complete 10 listening practices',
        icon: '🎧',
        unlocked: modStats.listening.practices >= 10
      },
      {
        id: 'speaker',
        name: 'Confident Speaker',
        description: 'Complete 10 speaking practices',
        icon: '🎤',
        unlocked: modStats.speaking.practices >= 10
      },
      {
        id: 'reader',
        name: 'Avid Reader',
        description: 'Complete 10 reading practices',
        icon: '📖',
        unlocked: modStats.reading.practices >= 10
      },
      {
        id: 'dedicated',
        name: 'Dedicated Learner',
        description: 'Complete 50 total practices',
        icon: '💪',
        unlocked: history.length >= 50
      },
      {
        id: 'perfect_score',
        name: 'Perfect Score',
        description: 'Get 12/12 on any practice',
        icon: '👑',
        unlocked: history.some(p => p.score === 12)
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

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            <User size={32} />
          </div>
          <div className={styles.profileInfo}>
            <h1>CELPIP Student</h1>
            <p>Preparing for CELPIP General</p>
          </div>
          <ChevronRight size={20} className={styles.chevron} />
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
          className={`${styles.tab} ${activeTab === 'goals' ? styles.active : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          <Target size={16} />
          Goals
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

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className={styles.goalsTab}>
          {/* Daily Goal */}
          <section className={styles.dailyGoalSection}>
            <h2>Daily Goal</h2>
            <div className={styles.goalCard}>
              <div className={styles.goalRing}>
                <svg viewBox="0 0 100 100">
                  <circle
                    className={styles.goalBg}
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="8"
                  />
                  <circle
                    className={styles.goalProgress}
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="8"
                    strokeDasharray={`${(dailyGoal.current / dailyGoal.target) * 283} 283`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className={styles.goalText}>
                  <span className={styles.goalCurrent}>{dailyGoal.current}</span>
                  <span className={styles.goalTarget}>/{dailyGoal.target}</span>
                </div>
              </div>
              <p className={styles.goalLabel}>
                {dailyGoal.current >= dailyGoal.target 
                  ? '🎉 Goal Complete!' 
                  : `${dailyGoal.target - dailyGoal.current} more to go`}
              </p>
            </div>
          </section>

          {/* Quick Actions */}
          <section className={styles.quickActions}>
            <h2>Quick Practice</h2>
            <div className={styles.actionButtons}>
              <Link href="/writing" className={styles.actionBtn}>
                <PenTool size={20} />
                Writing
              </Link>
              <Link href="/reading" className={styles.actionBtn}>
                <BookOpen size={20} />
                Reading
              </Link>
              <Link href="/speaking" className={styles.actionBtn}>
                <Mic size={20} />
                Speaking
              </Link>
              <Link href="/listening" className={styles.actionBtn}>
                <Headphones size={20} />
                Listening
              </Link>
            </div>
          </section>

          {/* Suggested Focus */}
          <section className={styles.suggestedSection}>
            <h2>
              <Zap size={18} />
              Suggested Focus
            </h2>
            <div className={styles.suggestionCard}>
              {(() => {
                const weakest = Object.entries(moduleStats)
                  .filter(([, data]) => data.practices > 0)
                  .sort(([, a], [, b]) => a.avgScore - b.avgScore)[0];
                
                if (!weakest) {
                  return (
                    <p>Complete some practices to get personalized suggestions!</p>
                  );
                }
                
                const [module, data] = weakest;
                return (
                  <>
                    <p>
                      Your <strong>{module}</strong> score ({data.avgScore}/12) could use some improvement.
                    </p>
                    <Link href={`/${module}`} className={styles.suggestionBtn}>
                      Practice {module.charAt(0).toUpperCase() + module.slice(1)}
                      <ChevronRight size={18} />
                    </Link>
                  </>
                );
              })()}
            </div>
          </section>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className={styles.settingsTab}>
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
