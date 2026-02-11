'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Target, 
  Sparkles, 
  Mail, 
  FileText, 
  AlertTriangle,
  CheckCircle2,
  Lock,
  ChevronRight,
  BookOpen,
  PenLine,
  Lightbulb,
  Zap
} from 'lucide-react';
import styles from '@/styles/StudyGuide.module.scss';

// ============================================
// DATA STRUCTURE - Elsa-style Units & Lessons
// ============================================

interface Lesson {
  id: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  icon: React.ReactNode;
  duration: string;
  hasPractice: boolean;
}

interface Unit {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
  isPremium?: boolean;
}

const writingUnits: Unit[] = [
  {
    id: 'foundations',
    number: 1,
    title: 'Foundations',
    description: 'Master the core framework that guarantees a structured response',
    lessons: [
      {
        id: 'csf-framework',
        title: 'The CSF Framework',
        difficulty: 'EASY',
        icon: <Target size={20} />,
        duration: '5 min',
        hasPractice: true
      },
      {
        id: 'tone-formality',
        title: 'Tone & Formality',
        difficulty: 'EASY',
        icon: <Sparkles size={20} />,
        duration: '4 min',
        hasPractice: true
      },
      {
        id: 'word-count',
        title: 'Word Count Strategy',
        difficulty: 'EASY',
        icon: <FileText size={20} />,
        duration: '3 min',
        hasPractice: false
      }
    ]
  },
  {
    id: 'task1-mastery',
    number: 2,
    title: 'Task 1 Mastery',
    description: 'Learn the exact formula for writing high-scoring emails',
    lessons: [
      {
        id: 'email-structure',
        title: 'Email Structure',
        difficulty: 'EASY',
        icon: <Mail size={20} />,
        duration: '6 min',
        hasPractice: true
      },
      {
        id: 'opening-lines',
        title: 'Opening Lines',
        difficulty: 'MEDIUM',
        icon: <PenLine size={20} />,
        duration: '5 min',
        hasPractice: true
      },
      {
        id: 'make-it-real',
        title: 'Make It Real',
        difficulty: 'MEDIUM',
        icon: <Sparkles size={20} />,
        duration: '5 min',
        hasPractice: true
      },
      {
        id: 'closing-strong',
        title: 'Closing Strong',
        difficulty: 'EASY',
        icon: <CheckCircle2 size={20} />,
        duration: '4 min',
        hasPractice: true
      }
    ]
  },
  {
    id: 'task2-mastery',
    number: 3,
    title: 'Task 2 Mastery',
    description: 'Master survey responses with clear opinions and structure',
    lessons: [
      {
        id: 'survey-structure',
        title: 'Survey Structure',
        difficulty: 'MEDIUM',
        icon: <FileText size={20} />,
        duration: '6 min',
        hasPractice: true
      },
      {
        id: 'opinion-expression',
        title: 'Expressing Opinions',
        difficulty: 'MEDIUM',
        icon: <Lightbulb size={20} />,
        duration: '5 min',
        hasPractice: true
      },
      {
        id: 'supporting-arguments',
        title: 'Supporting Arguments',
        difficulty: 'HARD',
        icon: <Zap size={20} />,
        duration: '7 min',
        hasPractice: true
      }
    ]
  },
  {
    id: 'advanced',
    number: 4,
    title: 'Advanced Techniques',
    description: 'Polish your writing to achieve band 10-12 scores',
    isPremium: false,
    lessons: [
      {
        id: 'common-mistakes',
        title: 'Common Mistakes',
        difficulty: 'MEDIUM',
        icon: <AlertTriangle size={20} />,
        duration: '6 min',
        hasPractice: true
      },
      {
        id: 'vocabulary-boost',
        title: 'Vocabulary Boost',
        difficulty: 'HARD',
        icon: <BookOpen size={20} />,
        duration: '8 min',
        hasPractice: true
      },
      {
        id: 'time-management',
        title: 'Time Management',
        difficulty: 'EASY',
        icon: <Target size={20} />,
        duration: '4 min',
        hasPractice: false
      }
    ]
  }
];

const outcomes = [
  'Write structured emails that score 9+ on Task 1',
  'Express clear opinions in survey responses (Task 2)',
  'Use the CSF Framework to plan any response in 2 minutes',
  'Avoid the 10 most common mistakes that lower scores'
];

// ============================================
// COMPONENT
// ============================================

export default function WritingGuidePage() {
  const router = useRouter();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [expandedUnit, setExpandedUnit] = useState<string>('foundations');

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('celpip_writing_guide_progress');
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)));
    }
  }, []);

  const totalLessons = writingUnits.reduce((acc, unit) => acc + unit.lessons.length, 0);
  const completedCount = completedLessons.size;

  const getUnitProgress = (unit: Unit) => {
    const completed = unit.lessons.filter(l => completedLessons.has(l.id)).length;
    return { completed, total: unit.lessons.length };
  };

  const isLessonUnlocked = (unitIndex: number, lessonIndex: number) => {
    // First lesson of first unit is always unlocked
    if (unitIndex === 0 && lessonIndex === 0) return true;
    
    // Check if previous lesson is completed
    if (lessonIndex > 0) {
      const prevLesson = writingUnits[unitIndex].lessons[lessonIndex - 1];
      return completedLessons.has(prevLesson.id);
    }
    
    // First lesson of a unit - check if previous unit is complete
    if (unitIndex > 0) {
      const prevUnit = writingUnits[unitIndex - 1];
      const prevUnitComplete = prevUnit.lessons.every(l => completedLessons.has(l.id));
      return prevUnitComplete;
    }
    
    return false;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return styles.difficultyEasy;
      case 'MEDIUM': return styles.difficultyMedium;
      case 'HARD': return styles.difficultyHard;
      default: return '';
    }
  };

  const handleLessonClick = (lesson: Lesson, unitIndex: number, lessonIndex: number) => {
    if (!isLessonUnlocked(unitIndex, lessonIndex)) return;
    router.push(`/writing/guide/${lesson.id}`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/writing" className={styles.backButton}>
          <ArrowLeft size={20} />
        </Link>
        <div className={styles.headerInfo}>
          <span className={styles.breadcrumb}>Writing</span>
          <h1>Writing Mastery Guide</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <div className={styles.heroIcon}>
            <PenLine size={32} />
          </div>
          <p className={styles.heroDescription}>
            Master the techniques that top scorers use. Learn the exact formulas, 
            practice with AI feedback, and track your progress to band 10+.
          </p>
          <div className={styles.progressBadge}>
            <span className={styles.progressCount}>{completedCount}/{totalLessons}</span>
            <span className={styles.progressLabel}>Lessons Completed</span>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className={styles.outcomesSection}>
        <h3 className={styles.outcomesTitle}>OUTCOMES</h3>
        <div className={styles.outcomesCard}>
          <p className={styles.outcomesSubtitle}>AT THE END OF THIS GUIDE, YOU CAN:</p>
          <ul className={styles.outcomesList}>
            {outcomes.map((outcome, i) => (
              <li key={i}>
                <CheckCircle2 size={18} className={styles.checkIcon} />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Units */}
      <section className={styles.unitsSection}>
        {writingUnits.map((unit, unitIndex) => {
          const progress = getUnitProgress(unit);
          const isExpanded = expandedUnit === unit.id;
          
          return (
            <div key={unit.id} className={styles.unitCard}>
              {/* Unit Header */}
              <button 
                className={styles.unitHeader}
                onClick={() => setExpandedUnit(isExpanded ? '' : unit.id)}
              >
                <div className={styles.unitInfo}>
                  <span className={styles.unitNumber}>UNIT {unit.number}</span>
                  <h3 className={styles.unitTitle}>{unit.title}</h3>
                  <p className={styles.unitDesc}>{unit.description}</p>
                </div>
                <div className={styles.unitProgress}>
                  <span>{progress.completed}/{progress.total}</span>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
                <ChevronRight 
                  size={20} 
                  className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`} 
                />
              </button>

              {/* Lessons List */}
              {isExpanded && (
                <div className={styles.lessonsList}>
                  {unit.lessons.map((lesson, lessonIndex) => {
                    const isUnlocked = isLessonUnlocked(unitIndex, lessonIndex);
                    const isCompleted = completedLessons.has(lesson.id);
                    
                    return (
                      <button
                        key={lesson.id}
                        className={`${styles.lessonItem} ${!isUnlocked ? styles.locked : ''} ${isCompleted ? styles.completed : ''}`}
                        onClick={() => handleLessonClick(lesson, unitIndex, lessonIndex)}
                        disabled={!isUnlocked}
                      >
                        <div className={`${styles.lessonIcon} ${getDifficultyColor(lesson.difficulty)}`}>
                          {lesson.icon}
                        </div>
                        <div className={styles.lessonInfo}>
                          <span className={styles.lessonTitle}>
                            Lesson {lessonIndex + 1} - {lesson.title}
                          </span>
                          <span className={`${styles.lessonDifficulty} ${getDifficultyColor(lesson.difficulty)}`}>
                            {lesson.difficulty}
                          </span>
                        </div>
                        <div className={styles.lessonStatus}>
                          {isCompleted ? (
                            <CheckCircle2 size={20} className={styles.completedIcon} />
                          ) : !isUnlocked ? (
                            <Lock size={18} className={styles.lockIcon} />
                          ) : (
                            <ChevronRight size={18} className={styles.goIcon} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Premium Badge */}
              {unit.isPremium && (
                <div className={styles.premiumBadge}>
                  <Lock size={14} />
                  <span>Available with Premium</span>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <button 
          className={styles.ctaButton}
          onClick={() => {
            const firstUnlocked = writingUnits[0].lessons[0];
            router.push(`/writing/guide/${firstUnlocked.id}`);
          }}
        >
          {completedCount === 0 ? 'Start Learning' : 'Continue Learning'}
          <ChevronRight size={20} />
        </button>
      </section>
    </div>
  );
}
