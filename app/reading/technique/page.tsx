'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, ChevronRight, BookOpen, Target,
  Lightbulb, AlertTriangle, Star, Zap, TrendingUp, Eye,
  Mail, BarChart3, CheckCircle, FileText, Brain,
  Search, Layers, GraduationCap, MessageSquare
} from 'lucide-react';
import {
  readingOverview,
  taskTechniques,
  truthTrio,
  scoreStrategies,
  corePrinciples,
  type TaskTechnique,
  type TaskPart,
} from '@content/reading-technique-guide';
import QuizCard from '@/components/QuizCard';
import { getQuizForModule } from '@content/quiz-data';
import styles from '@/styles/ReadingTechnique.module.scss';

// ─── Module Definitions ──────────────────────────────────────────────────────

interface Module {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: 'overview' | 'task' | 'truth-trio' | 'strategy';
}

const modules: Module[] = [
  { id: 'overview', label: 'Overview', icon: <BookOpen size={18} />, type: 'overview' },
  { id: 'task-1', label: 'Task 1', icon: <Mail size={18} />, type: 'task' },
  { id: 'task-2', label: 'Task 2', icon: <BarChart3 size={18} />, type: 'task' },
  { id: 'truth-trio', label: 'Truth Trio', icon: <AlertTriangle size={18} />, type: 'truth-trio' },
  { id: 'task-3', label: 'Task 3', icon: <FileText size={18} />, type: 'task' },
  { id: 'task-4', label: 'Task 4', icon: <MessageSquare size={18} />, type: 'task' },
  { id: 'strategy', label: 'Score Strategy', icon: <Target size={18} />, type: 'strategy' },
];

const taskMap: Record<string, TaskTechnique> = {};
taskTechniques.forEach((t) => { taskMap[`task-${t.taskNumber}`] = t; });

// ─── Page Component ──────────────────────────────────────────────────────────

export default function ReadingTechniquePage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('overview');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/reading')}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.headerInfo}>
          <span className={styles.breadcrumb}>Reading → Technique</span>
          <h1>Reading Technique Guide</h1>
        </div>
        <div className={styles.headerIcon}>
          <Eye size={20} />
        </div>
      </header>

      {/* Layout */}
      <div className={styles.layout}>
        {/* Sidebar — desktop */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>
            <BookOpen size={14} />
            <span>Modules</span>
          </div>
          <nav className={styles.sidebarNav}>
            {modules.map((mod) => (
              <button
                key={mod.id}
                className={`${styles.sidebarItem} ${activeModule === mod.id ? styles.active : ''}`}
                onClick={() => { setActiveModule(mod.id); setExpandedItem(null); }}
              >
                <span className={styles.sidebarIcon}>{mod.icon}</span>
                <span className={styles.sidebarLabel}>{mod.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile tab bar */}
        <div className={styles.mobileTabBar}>
          <div className={styles.mobileTabScroll}>
            {modules.map((mod) => (
              <button
                key={mod.id}
                className={`${styles.mobileTab} ${activeModule === mod.id ? styles.active : ''}`}
                onClick={() => { setActiveModule(mod.id); setExpandedItem(null); }}
              >
                <span className={styles.mobileTabIcon}>{mod.icon}</span>
                <span>{mod.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className={styles.content}>
          {activeModule === 'overview' && <OverviewSection />}
          {activeModule === 'truth-trio' && <TruthTrioSection />}
          {activeModule === 'strategy' && <StrategySection />}
          {activeModule.startsWith('task-') && taskMap[activeModule] && (
            <TaskSection
              task={taskMap[activeModule]}
              expandedItem={expandedItem}
              onToggle={(id) => setExpandedItem(expandedItem === id ? null : id)}
            />
          )}

          {/* Navigation Arrows */}
          <div className={styles.navArrows}>
            {modules.findIndex((m) => m.id === activeModule) > 0 && (
              <button
                className={styles.navArrow}
                onClick={() => {
                  const idx = modules.findIndex((m) => m.id === activeModule);
                  setActiveModule(modules[idx - 1].id);
                  setExpandedItem(null);
                }}
              >
                <ArrowLeft size={16} />
                <span>{modules[modules.findIndex((m) => m.id === activeModule) - 1].label}</span>
              </button>
            )}
            <div style={{ flex: 1 }} />
            {modules.findIndex((m) => m.id === activeModule) < modules.length - 1 && (
              <button
                className={styles.navArrow}
                onClick={() => {
                  const idx = modules.findIndex((m) => m.id === activeModule);
                  setActiveModule(modules[idx + 1].id);
                  setExpandedItem(null);
                }}
              >
                <span>{modules[modules.findIndex((m) => m.id === activeModule) + 1].label}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Overview Section ────────────────────────────────────────────────────────

function OverviewSection() {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>Reading Technique Guide</h2>
        <p className={styles.sectionSubtitle}>
          Master the right techniques to make fewer mistakes and maximize your reading score.
        </p>
      </div>

      {/* Stats */}
      <div className={styles.overviewCard}>
        <div className={styles.overviewStats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{readingOverview.totalTasks}</span>
            <span className={styles.statLabel}>Tasks</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{readingOverview.totalQuestions}</span>
            <span className={styles.statLabel}>Questions</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{readingOverview.totalTime}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>
      </div>

      {/* Score Table */}
      <div className={styles.scoreTableCard}>
        <h3>
          <Target size={16} />
          Score Table
        </h3>
        <div className={styles.scoreGrid}>
          {readingOverview.scoreTable.map((entry) => (
            <div key={entry.score} className={styles.scoreRow}>
              <span className={styles.scoreLabel}>Score {entry.score}</span>
              <div className={styles.scoreBar}>
                <div
                  className={styles.scoreFill}
                  style={{ width: `${(entry.correctMax / readingOverview.totalQuestions) * 100}%` }}
                />
              </div>
              <span className={styles.scoreCount}>
                {entry.correctMin === entry.correctMax ? entry.correctMin : `${entry.correctMin}-${entry.correctMax}`}/{readingOverview.totalQuestions}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Task Difficulty */}
      <div className={styles.difficultyCard}>
        <h3>
          <Layers size={16} />
          Task Difficulty
        </h3>
        <div className={styles.difficultyGrid}>
          <div className={styles.diffEasy}>
            <span className={styles.diffLabel}>Easier</span>
            <div className={styles.diffTasks}>
              <span>Task 1 (11 min)</span>
              <span>Task 2 (9 min)</span>
            </div>
            <span className={styles.diffCount}>19 questions</span>
          </div>
          <div className={styles.diffHard}>
            <span className={styles.diffLabel}>Harder</span>
            <div className={styles.diffTasks}>
              <span>Task 3 (10 min)</span>
              <span>Task 4 (10 min)</span>
            </div>
            <span className={styles.diffCount}>19 questions</span>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className={styles.principlesCard}>
        <h3>
          <Brain size={16} />
          3 Core Principles
        </h3>
        {corePrinciples.map((p) => (
          <div key={p.number} className={styles.principleItem}>
            <div className={styles.principleIcon}>{p.icon}</div>
            <div>
              <h4>{p.title}</h4>
              <p>{p.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Golden Rules */}
      <div className={styles.rulesCard}>
        <h3>
          <AlertTriangle size={16} />
          Golden Rules
        </h3>
        <ul>
          {readingOverview.goldenRules.map((rule, i) => (
            <li key={i} className={rule.emphasis ? styles.emphasisRule : ''}>
              {rule.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Task Section ────────────────────────────────────────────────────────────

function TaskSection({
  task,
  expandedItem,
  onToggle,
}: {
  task: TaskTechnique;
  expandedItem: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>Task {task.taskNumber}: {task.title}</h2>
        <p className={styles.sectionSubtitle}>{task.description}</p>
      </div>

      {/* Chips */}
      <div className={styles.taskChips}>
        <span className={styles.chip}>⏱ {task.time}</span>
        <span className={styles.chip}>❓ {task.questions} questions</span>
        <span className={styles.chip}>{task.detailsMatter ? '🔍 Details matter' : '💡 Main ideas only'}</span>
      </div>

      {/* Parts */}
      {task.parts.map((part) => (
        <div key={part.partNumber} className={styles.partCard}>
          <div className={styles.partHeader}>
            <span className={styles.partBadge}>Part {part.partNumber}</span>
            <h3>{part.title}</h3>
          </div>
          <div className={styles.techniqueTag}>
            <Zap size={12} />
            <span>{part.technique}</span>
          </div>

          {/* Steps */}
          <div className={styles.stepsList}>
            {part.steps.map((step, i) => (
              <div key={i} className={styles.stepItem}>
                <div className={styles.stepNumber}>{i + 1}</div>
                <p>{step}</p>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div
            className={`${styles.accordionCard} ${expandedItem === `tips-${task.taskNumber}-${part.partNumber}` ? styles.expanded : ''}`}
          >
            <button
              className={styles.accordionHeader}
              onClick={() => onToggle(`tips-${task.taskNumber}-${part.partNumber}`)}
            >
              <Lightbulb size={16} />
              <span>Tips ({part.tips.length})</span>
              <ChevronRight size={14} className={styles.chevron} />
            </button>
            {expandedItem === `tips-${task.taskNumber}-${part.partNumber}` && (
              <div className={styles.accordionBody}>
                {part.tips.map((tip, i) => (
                  <div key={i} className={styles.tipItem}>
                    <Lightbulb size={12} />
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Key Insights */}
      <div className={styles.insightsCard}>
        <h3>
          <Star size={16} />
          Key Insights
        </h3>
        {task.keyInsights.map((insight, i) => (
          <div key={i} className={styles.insightItem}>
            <Star size={12} />
            <p>{insight}</p>
          </div>
        ))}
      </div>

      {/* Common Mistakes */}
      <div
        className={`${styles.accordionCard} ${expandedItem === `mistakes-${task.taskNumber}` ? styles.expanded : ''}`}
      >
        <button
          className={styles.accordionHeader}
          onClick={() => onToggle(`mistakes-${task.taskNumber}`)}
        >
          <AlertTriangle size={16} />
          <span>Common Mistakes ({task.commonMistakes.length})</span>
          <ChevronRight size={14} className={styles.chevron} />
        </button>
        {expandedItem === `mistakes-${task.taskNumber}` && (
          <div className={styles.accordionBody}>
            {task.commonMistakes.map((mistake, i) => (
              <div key={i} className={styles.mistakeItem}>
                <AlertTriangle size={12} />
                <p>{mistake}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Quiz */}
      {(() => {
        const quiz = getQuizForModule('reading', `task-${task.taskNumber}`);
        return quiz ? <QuizCard quiz={quiz} accentColor="#14b8a6" /> : null;
      })()}
    </div>
  );
}

// ─── Truth Trio Section ──────────────────────────────────────────────────────

function TruthTrioSection() {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>The Truth Trio</h2>
        <p className={styles.sectionSubtitle}>
          The only 3 reasons you make mistakes on Reading — and how to fix each one.
        </p>
      </div>

      {truthTrio.reasons.map((reason) => (
        <div key={reason.number} className={styles.truthCard}>
          <div className={styles.truthHeader}>
            <span className={styles.truthNumber}>{reason.number}</span>
            <h3>{reason.title}</h3>
          </div>
          <p className={styles.truthDesc}>{reason.description}</p>
          <div className={styles.truthSolution}>
            <CheckCircle size={14} />
            <p><strong>Solution:</strong> {reason.solution}</p>
          </div>
        </div>
      ))}

      <div className={styles.truthNote}>
        <Brain size={16} />
        <p>
          99.9% of students fall into Reason 3: they understand the text and the question, but misinterpret.
          The fix? More practice with the right techniques. Interpretation improves with repetition.
        </p>
      </div>

      {(() => {
        const quiz = getQuizForModule('reading', 'truth-trio');
        return quiz ? <QuizCard quiz={quiz} accentColor="#14b8a6" /> : null;
      })()}
    </div>
  );
}

// ─── Score Strategy Section ──────────────────────────────────────────────────

function StrategySection() {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>Score Strategy</h2>
        <p className={styles.sectionSubtitle}>
          Where to focus your energy based on your target score.
        </p>
      </div>

      {scoreStrategies.map((strategy) => (
        <div key={strategy.targetScore} className={styles.strategyCard}>
          <div className={styles.strategyHeader}>
            <span className={styles.strategyScore}>{strategy.label}</span>
            <span className={styles.strategyNeeded}>
              {strategy.correctNeeded}/{strategy.totalQuestions} correct
            </span>
          </div>
          <div className={styles.strategyMistakes}>
            <span>{strategy.mistakesAllowed} mistakes allowed</span>
          </div>
          <div className={styles.strategyFocus}>
            <Target size={14} />
            <p><strong>Focus:</strong> {strategy.focus}</p>
          </div>
          <div className={styles.strategyTip}>
            <Lightbulb size={14} />
            <p>{strategy.tip}</p>
          </div>
        </div>
      ))}

      <div className={styles.practiceCard}>
        <h3>
          <TrendingUp size={16} />
          How to Practice
        </h3>
        <div className={styles.practiceSteps}>
          <div className={styles.practiceStep}>
            <div className={styles.practiceNumber}>1</div>
            <div>
              <h4>Start task by task</h4>
              <p>Learn one task technique, then practice 3-4 tests for that task only.</p>
            </div>
          </div>
          <div className={styles.practiceStep}>
            <div className={styles.practiceNumber}>2</div>
            <div>
              <h4>Track your score</h4>
              <p>Count correct answers per task. Know exactly where you lose points.</p>
            </div>
          </div>
          <div className={styles.practiceStep}>
            <div className={styles.practiceNumber}>3</div>
            <div>
              <h4>Combine gradually</h4>
              <p>Once comfortable, do Tasks 1+2 together, then all 4. Aim for 16-18 practice tests total.</p>
            </div>
          </div>
          <div className={styles.practiceStep}>
            <div className={styles.practiceNumber}>4</div>
            <div>
              <h4>Fix Tasks 1-2 first</h4>
              <p>If stuck at 7-8, check your score tracker. Many students lose points in the &ldquo;easy&rdquo; tasks without realizing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
