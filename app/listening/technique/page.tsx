'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Headphones, ArrowLeft, ArrowRight, ChevronRight, Lock,
  CheckCircle, BookOpen, Target, Lightbulb, AlertTriangle,
  Star, Zap, TrendingUp, Eye, Clock, MessageCircle,
  PenTool, Volume2
} from 'lucide-react';
import {
  taskTechniques,
  universalSteps,
  scoringStrategy,
  testOverview,
  noteTakingGuide,
  highScoreRequirements,
} from '@content/listening-technique-guide';
import QuizCard from '@/components/QuizCard';
import { getQuizForModule } from '@content/quiz-data';
import styles from '@/styles/ListeningTechnique.module.scss';

// ─── Module Definitions ──────────────────────────────────────────────────────

interface Module {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: 'overview' | 'task' | 'strategy' | 'notes';
  taskNumber?: number;
  locked?: boolean;
}

const modules: Module[] = [
  { id: 'overview', label: 'Overview', icon: <BookOpen size={18} />, type: 'overview' },
  { id: 'task-1', label: 'Task 1', icon: <span className={styles.taskEmoji}>🔧</span>, type: 'task', taskNumber: 1 },
  { id: 'task-2', label: 'Task 2', icon: <span className={styles.taskEmoji}>🏠</span>, type: 'task', taskNumber: 2 },
  { id: 'task-3', label: 'Task 3', icon: <span className={styles.taskEmoji}>📢</span>, type: 'task', taskNumber: 3 },
  { id: 'task-4', label: 'Task 4', icon: <span className={styles.taskEmoji}>📰</span>, type: 'task', taskNumber: 4 },
  { id: 'task-5', label: 'Task 5', icon: <span className={styles.taskEmoji}>💬</span>, type: 'task', taskNumber: 5 },
  { id: 'task-6', label: 'Task 6', icon: <span className={styles.taskEmoji}>🎙️</span>, type: 'task', taskNumber: 6 },
  { id: 'notes', label: 'Note-Taking', icon: <PenTool size={18} />, type: 'notes' },
  { id: 'strategy', label: 'Strategy', icon: <TrendingUp size={18} />, type: 'strategy' },
];

// ─── Step Icons ──────────────────────────────────────────────────────────────

function getStepIcon(step: number) {
  switch (step) {
    case 1: return <Target size={16} />;
    case 2: return <Eye size={16} />;
    case 3: return <MessageCircle size={16} />;
    case 4: return <Star size={16} />;
    case 5: return <Clock size={16} />;
    case 6: return <Lightbulb size={16} />;
    case 7: return <Zap size={16} />;
    default: return <ChevronRight size={16} />;
  }
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function ListeningTechniquePage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('overview');
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const currentModule = modules.find((m) => m.id === activeModule)!;

  return (
    <div className={styles.container}>
      {/* ── Header ────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/listening')}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.headerInfo}>
          <span className={styles.breadcrumb}>Listening → Technique</span>
          <h1>7 Secret Steps</h1>
        </div>
        <div className={styles.headerIcon}>
          <Headphones size={20} />
        </div>
      </header>

      {/* ── Layout: Sidebar + Content ─────────────────────────────── */}
      <div className={styles.layout}>
        {/* Sidebar — desktop only */}
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
                onClick={() => { setActiveModule(mod.id); setExpandedStep(null); }}
              >
                <span className={styles.sidebarIcon}>{mod.icon}</span>
                <span className={styles.sidebarLabel}>{mod.label}</span>
                {mod.locked && <Lock size={12} className={styles.lockIcon} />}
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
                onClick={() => { setActiveModule(mod.id); setExpandedStep(null); }}
              >
                <span className={styles.mobileTabIcon}>{mod.icon}</span>
                <span>{mod.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Content ────────────────────────────────────────── */}
        <main className={styles.content}>
          {currentModule.type === 'overview' && <OverviewSection />}
          {currentModule.type === 'task' && currentModule.taskNumber && (
            <TaskSection
              taskNumber={currentModule.taskNumber}
              expandedStep={expandedStep}
              onToggleStep={(s) => setExpandedStep(expandedStep === s ? null : s)}
            />
          )}
          {currentModule.type === 'notes' && <NoteTakingSection />}
          {currentModule.type === 'strategy' && <StrategySection />}

          {/* Navigation Arrows */}
          <div className={styles.navArrows}>
            {modules.findIndex((m) => m.id === activeModule) > 0 && (
              <button
                className={styles.navArrow}
                onClick={() => {
                  const idx = modules.findIndex((m) => m.id === activeModule);
                  setActiveModule(modules[idx - 1].id);
                  setExpandedStep(null);
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
                  setExpandedStep(null);
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
        <h2>The 7 Secret Steps Framework</h2>
        <p className={styles.sectionSubtitle}>
          Master these 7 steps and you&apos;ll predict the questions before they appear.
        </p>
      </div>

      {/* Test Overview Card */}
      <div className={styles.overviewCard}>
        <div className={styles.overviewStats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{testOverview.totalParts}</span>
            <span className={styles.statLabel}>Parts</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{testOverview.totalQuestions}</span>
            <span className={styles.statLabel}>Questions</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{testOverview.duration}</span>
            <span className={styles.statLabel}>Duration</span>
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
          {testOverview.scoreTable.map((entry) => (
            <div key={entry.score} className={styles.scoreRow}>
              <span className={styles.scoreLabel}>Score {entry.score}</span>
              <div className={styles.scoreBar}>
                <div
                  className={styles.scoreFill}
                  style={{ width: `${(entry.correctMax / testOverview.totalQuestions) * 100}%` }}
                />
              </div>
              <span className={styles.scoreCount}>
                {entry.correctMin === entry.correctMax ? entry.correctMin : `${entry.correctMin}-${entry.correctMax}`}/{testOverview.totalQuestions}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Golden Rules */}
      <div className={styles.rulesCard}>
        <h3>
          <AlertTriangle size={16} />
          Golden Rules
        </h3>
        <ul>
          {testOverview.goldenRules.map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ul>
      </div>

      {/* High Score Requirements */}
      <div className={styles.highScoreCard}>
        <h3>
          <Target size={16} />
          What&apos;s Required for a High Score?
        </h3>
        <ol>
          {highScoreRequirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ol>
      </div>

      {/* Two Key Screens */}
      <div className={styles.screensGrid}>
        {testOverview.keyScreens.map((screen) => (
          <div key={screen.name} className={styles.screenCard}>
            <div className={styles.screenBadge}>
              {screen.importance === 'critical' ? <Zap size={12} /> : <Eye size={12} />}
              <span>{screen.importance}</span>
            </div>
            <h4>{screen.name}</h4>
            <p>{screen.description}</p>
          </div>
        ))}
      </div>

      {/* Universal Steps Preview */}
      <div className={styles.universalPreview}>
        <h3>
          <Star size={16} />
          Universal Steps (4–7)
        </h3>
        <p className={styles.universalSubtitle}>
          These 4 steps apply to EVERY task, EVERY time. No exceptions.
        </p>
        <div className={styles.stepPreviewGrid}>
          {universalSteps.map((step) => (
            <div key={step.step} className={styles.stepPreviewCard}>
              <div className={styles.stepPreviewNumber}>{step.step}</div>
              <div>
                <h4>{step.title}</h4>
                <p>{step.description.slice(0, 80)}…</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Task Section ────────────────────────────────────────────────────────────

function TaskSection({
  taskNumber,
  expandedStep,
  onToggleStep,
}: {
  taskNumber: number;
  expandedStep: number | null;
  onToggleStep: (step: number) => void;
}) {
  const task = taskTechniques.find((t) => t.taskNumber === taskNumber);
  if (!task) return null;

  const specificSteps = task.steps.filter((s) => !s.isUniversal);

  return (
    <div className={styles.sectionContent}>
      {/* Task Header */}
      <div className={styles.taskHeader}>
        <div className={styles.taskIconLarge}>
          <span>{task.icon}</span>
        </div>
        <div className={styles.taskMeta}>
          <span className={styles.taskBadge}>Task {task.taskNumber}</span>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
        </div>
      </div>

      {/* Task Info Chips */}
      <div className={styles.taskChips}>
        <div className={`${styles.chip} ${styles[task.difficulty]}`}>
          {task.difficulty === 'easier' ? '🟢' : task.difficulty === 'moderate' ? '🟡' : '🔴'}{' '}
          {task.difficulty}
        </div>
        <div className={styles.chip}>
          <Target size={12} /> {task.questionCount} questions
        </div>
        <div className={styles.chip}>
          <PenTool size={12} /> {task.noteStrategy === 'no-notes' ? 'No notes needed' : task.noteStrategy === 'table-notes' ? 'Table notes' : 'Optional notes'}
        </div>
        {task.hasVideo && (
          <div className={styles.chip}>
            <Volume2 size={12} /> Video
          </div>
        )}
        {task.detailsImportant && (
          <div className={`${styles.chip} ${styles.detailsChip}`}>
            <AlertTriangle size={12} /> Details matter!
          </div>
        )}
      </div>

      {/* Steps 1-3 (Task-Specific) */}
      <div className={styles.stepsSection}>
        <h3 className={styles.stepsTitle}>
          <Zap size={16} />
          Task-Specific Steps
        </h3>

        {specificSteps.map((step) => (
          <div
            key={step.step}
            className={`${styles.stepCard} ${expandedStep === step.step ? styles.expanded : ''}`}
          >
            <button className={styles.stepCardHeader} onClick={() => onToggleStep(step.step)}>
              <div className={styles.stepNumber}>{step.step}</div>
              <div className={styles.stepInfo}>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
              <ChevronRight size={16} className={styles.chevron} />
            </button>
            {expandedStep === step.step && (
              <div className={styles.stepBody}>
                <ul>
                  {step.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Steps 4-7 (Universal) */}
      <div className={styles.stepsSection}>
        <h3 className={styles.stepsTitle}>
          <Star size={16} />
          Universal Steps
        </h3>

        {universalSteps.map((step) => (
          <div
            key={step.step}
            className={`${styles.stepCard} ${styles.universal} ${expandedStep === step.step ? styles.expanded : ''}`}
          >
            <button className={styles.stepCardHeader} onClick={() => onToggleStep(step.step)}>
              <div className={`${styles.stepNumber} ${styles.universalNumber}`}>{step.step}</div>
              <div className={styles.stepInfo}>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
              <ChevronRight size={16} className={styles.chevron} />
            </button>
            {expandedStep === step.step && (
              <div className={styles.stepBody}>
                <ul>
                  {step.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
                {step.examples && step.examples.length > 0 && (
                  <div className={styles.examplesBox}>
                    <h5>
                      <Lightbulb size={14} /> Examples
                    </h5>
                    <ul className={styles.examplesList}>
                      {step.examples.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div className={styles.insightsCard}>
        <h3>
          <Lightbulb size={16} />
          Key Insights
        </h3>
        <ul>
          {task.keyInsights.map((insight, i) => (
            <li key={i}>{insight}</li>
          ))}
        </ul>
      </div>

      {/* Practice Walkthrough */}
      {task.practiceExample && (
        <div className={styles.walkthroughSection}>
          <h3>
            <BookOpen size={16} />
            Walkthrough: {task.practiceExample.title}
          </h3>
          <p className={styles.walkthroughContext}>
            <em>{task.practiceExample.context}</em>
          </p>
          <div className={styles.walkthroughTimeline}>
            {task.practiceExample.walkthrough.map((moment, i) => (
              <div key={i} className={styles.walkthroughMoment}>
                <div className={styles.momentDot}>
                  {getStepIcon(moment.stepApplied)}
                </div>
                <div className={styles.momentContent}>
                  <div className={styles.momentLabel}>
                    <span>{moment.label}</span>
                    <span className={styles.momentStep}>Step {moment.stepApplied}</span>
                  </div>
                  <blockquote className={styles.audioSnippet}>
                    &ldquo;{moment.audioSnippet}&rdquo;
                  </blockquote>
                  <p className={styles.momentInsight}>
                    <Lightbulb size={12} /> {moment.insight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Quiz */}
      {(() => {
        const quiz = getQuizForModule('listening', `task-${task.taskNumber}`);
        return quiz ? <QuizCard quiz={quiz} accentColor="#f97316" /> : null;
      })()}
    </div>
  );
}

// ─── Note-Taking Section ────────────────────────────────────────────────────

function NoteTakingSection() {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>{noteTakingGuide.title}</h2>
        <p className={styles.sectionSubtitle}>{noteTakingGuide.description}</p>
      </div>

      {/* Table Setup */}
      <div className={styles.noteCard}>
        <h3>
          <PenTool size={16} />
          Table Setup
        </h3>
        <p>{noteTakingGuide.tableSetup}</p>

        <div className={styles.tableDemo}>
          <div className={styles.tableHeader}>
            <span>Left</span>
            <span>Middle</span>
            <span>Right</span>
          </div>
          <div className={styles.tableBody}>
            <span>Nick</span>
            <span>Ron</span>
            <span>Claudia</span>
          </div>
          <div className={styles.tableBody}>
            <span>favoritism +</span>
            <span>😐 legal</span>
            <span>😞 no conf.</span>
          </div>
          <div className={styles.tableBody}>
            <span>→ union?</span>
            <span>talked HR</span>
            <span>- union</span>
          </div>
          <div className={styles.tableBody}>
            <span>⭕ accept</span>
            <span>⭕ accept</span>
            <span>⭕ volunteer</span>
          </div>
        </div>
      </div>

      {/* Identifying People */}
      <div className={styles.noteCard}>
        <h3>
          <Eye size={16} />
          Identifying People
        </h3>
        <ul>
          {noteTakingGuide.identifyPeople.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Symbols */}
      <div className={styles.noteCard}>
        <h3>
          <Zap size={16} />
          Quick Symbols
        </h3>
        <div className={styles.symbolsGrid}>
          {noteTakingGuide.symbols.map((s, i) => (
            <div key={i} className={styles.symbolItem}>
              <span className={styles.symbol}>{s.symbol}</span>
              <span className={styles.symbolMeaning}>{s.meaning}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className={styles.noteCard}>
        <h3>
          <AlertTriangle size={16} />
          Rules
        </h3>
        <ul>
          {noteTakingGuide.rules.map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Strategy Section ────────────────────────────────────────────────────────

function StrategySection() {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>{scoringStrategy.title}</h2>
        <p className={styles.sectionSubtitle}>{scoringStrategy.description}</p>
      </div>

      <div className={styles.strategyGrid}>
        {scoringStrategy.tips.map((tip, i) => {
          const isHighlight = tip.startsWith('📎');
          return (
            <div
              key={i}
              className={`${styles.strategyTip} ${isHighlight ? styles.highlight : ''}`}
            >
              {isHighlight ? (
                <p>{tip.replace('📎 ', '')}</p>
              ) : (
                <p>{tip}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Score Targets */}
      <div className={styles.scoreTargets}>
        <div className={`${styles.scoreTarget} ${styles.score78}`}>
          <div className={styles.scoreValue}>7-8</div>
          <div className={styles.scoreAdvice}>
            <h4>Target: 7-8</h4>
            <p>Focus ALL energy on Tasks 1-3. Accept mistakes in 4-6.</p>
          </div>
        </div>
        <div className={`${styles.scoreTarget} ${styles.score910}`}>
          <div className={styles.scoreValue}>9-10</div>
          <div className={styles.scoreAdvice}>
            <h4>Target: 9-10</h4>
            <p>Master Tasks 1-3 first, then improve 4-6.</p>
          </div>
        </div>
        <div className={`${styles.scoreTarget} ${styles.score10plus}`}>
          <div className={styles.scoreValue}>10+</div>
          <div className={styles.scoreAdvice}>
            <h4>Target: 10+</h4>
            <p>Near-perfect 1-3 AND strong 4-6. Elite level.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
