'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, ChevronRight, BookOpen, Target,
  Lightbulb, AlertTriangle, Star, Zap, Mic, Eye,
  MessageSquare, Clock, Sparkles, Brain, CheckCircle,
  Layers, Image, Volume2, FileText, HelpCircle
} from 'lucide-react';
import {
  speakingOverview,
  csfFramework,
  creativityGuide,
  adviceExpressions,
  locationWords,
  vocabularyTips,
  speakingTasks,
  type SpeakingTask,
} from '@content/speaking-technique-guide';
import QuizCard from '@/components/QuizCard';
import { getQuizForModule } from '@content/quiz-data';
import styles from '@/styles/SpeakingTechnique.module.scss';

// ─── Module Definitions ──────────────────────────────────────────────────────

interface Module {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: 'overview' | 'csf' | 'creativity' | 'task' | 'vocabulary';
}

const modules: Module[] = [
  { id: 'overview', label: 'Overview', icon: <BookOpen size={18} />, type: 'overview' },
  { id: 'csf', label: 'CSF Technique', icon: <Target size={18} />, type: 'csf' },
  { id: 'task-1', label: 'Task 1', icon: <MessageSquare size={18} />, type: 'task' },
  { id: 'creativity', label: 'Creativity', icon: <Sparkles size={18} />, type: 'creativity' },
  { id: 'task-2', label: 'Task 2', icon: <Clock size={18} />, type: 'task' },
  { id: 'task-3', label: 'Task 3', icon: <Image size={18} />, type: 'task' },
  { id: 'task-4', label: 'Task 4', icon: <Eye size={18} />, type: 'task' },
  { id: 'task-5', label: 'Task 5', icon: <Layers size={18} />, type: 'task' },
  { id: 'task-6', label: 'Task 6', icon: <AlertTriangle size={18} />, type: 'task' },
  { id: 'task-7', label: 'Task 7', icon: <Brain size={18} />, type: 'task' },
  { id: 'task-8', label: 'Task 8', icon: <HelpCircle size={18} />, type: 'task' },
  { id: 'vocabulary', label: 'Vocabulary', icon: <FileText size={18} />, type: 'vocabulary' },
];

const taskMap: Record<string, SpeakingTask> = {};
speakingTasks.forEach((t) => { taskMap[`task-${t.taskNumber}`] = t; });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SpeakingTechniquePage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('overview');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/speaking')}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.headerInfo}>
          <span className={styles.breadcrumb}>Speaking → Technique</span>
          <h1>Speaking Technique Guide</h1>
        </div>
        <div className={styles.headerIcon}>
          <Mic size={20} />
        </div>
      </header>

      <div className={styles.layout}>
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

        <main className={styles.content}>
          {activeModule === 'overview' && <OverviewSection />}
          {activeModule === 'csf' && <CSFSection />}
          {activeModule === 'creativity' && <CreativitySection />}
          {activeModule === 'vocabulary' && <VocabularySection />}
          {activeModule.startsWith('task-') && taskMap[activeModule] && (
            <TaskSection
              task={taskMap[activeModule]}
              expandedItem={expandedItem}
              onToggle={(id) => setExpandedItem(expandedItem === id ? null : id)}
            />
          )}

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
        <h2>Speaking Technique Guide</h2>
        <p className={styles.sectionSubtitle}>
          8 tasks, each with its own technique. Learn the CSF framework, then master each task individually.
        </p>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.overviewStats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{speakingOverview.totalTasks}</span>
            <span className={styles.statLabel}>Tasks</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{speakingOverview.prepTimeRange}</span>
            <span className={styles.statLabel}>Prep Time</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{speakingOverview.speakTimeRange}</span>
            <span className={styles.statLabel}>Speak Time</span>
          </div>
        </div>
      </div>

      {/* Score Bands */}
      <div className={styles.scoreTableCard}>
        <h3>
          <Target size={16} />
          Score Bands
        </h3>
        <div className={styles.scoreGrid}>
          {speakingOverview.scoreBands.map((band) => (
            <div key={band.score} className={styles.scoreRow}>
              <span className={styles.scoreBadge}>{band.score}</span>
              <span className={styles.scoreDesc}>{band.descriptor}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.examOrderCard}>
        <Volume2 size={16} />
        <div>
          <h4>Exam Order</h4>
          <p>{speakingOverview.examOrder}</p>
          <p className={styles.examOrderNote}>Speaking is LAST — use the breaks between sections to calm down.</p>
        </div>
      </div>

      <div className={styles.taskGridCard}>
        <h3>
          <Layers size={16} />
          8 Tasks at a Glance
        </h3>
        <div className={styles.taskGrid}>
          {speakingTasks.map((task) => (
            <div key={task.id} className={styles.taskGridItem}>
              <span className={styles.taskGridNumber}>{task.taskNumber}</span>
              <div>
                <h4>{task.title}</h4>
                <span className={styles.taskGridTime}>⏱ {task.speakTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.rulesCard}>
        <h3>
          <Star size={16} />
          Golden Rules
        </h3>
        <ul>
          {speakingOverview.goldenRules.map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── CSF Section ─────────────────────────────────────────────────────────────

function CSFSection() {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>The CSF Technique</h2>
        <p className={styles.sectionSubtitle}>{csfFramework.description}</p>
      </div>

      {csfFramework.components.map((comp) => (
        <div key={comp.letter} className={styles.csfCard}>
          <div className={styles.csfHeader}>
            <span className={styles.csfLetter}>{comp.letter}</span>
            <div>
              <h3>{comp.name}</h3>
              <p className={styles.csfQuestion}>{comp.question}</p>
            </div>
          </div>
          <p className={styles.csfDesc}>{comp.description}</p>
        </div>
      ))}

      <div className={styles.csfNote}>
        <Brain size={16} />
        <p>{csfFramework.whyItWorks}</p>
      </div>

      {(() => {
        const quiz = getQuizForModule('speaking', 'csf');
        return quiz ? <QuizCard quiz={quiz} accentColor="#3b82f6" /> : null;
      })()}
    </div>
  );
}

// ─── Creativity Section ──────────────────────────────────────────────────────

function CreativitySection() {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>How to Be More Creative</h2>
        <p className={styles.sectionSubtitle}>
          Three principles that will unlock your creativity on test day.
        </p>
      </div>

      {creativityGuide.principles.map((p) => (
        <div key={p.number} className={styles.creativityCard}>
          <div className={styles.creativityHeader}>
            <span className={styles.creativityNumber}>{p.number}</span>
            <h3>{p.title}</h3>
          </div>
          <p className={styles.creativityDesc}>{p.description}</p>
          <div className={styles.creativityTakeaway}>
            <Lightbulb size={14} />
            <p><strong>Key Takeaway:</strong> {p.keyTakeaway}</p>
          </div>
        </div>
      ))}

      {(() => {
        const quiz = getQuizForModule('speaking', 'creativity');
        return quiz ? <QuizCard quiz={quiz} accentColor="#3b82f6" /> : null;
      })()}
    </div>
  );
}

// ─── Task Section ────────────────────────────────────────────────────────────

function TaskSection({
  task,
  expandedItem,
  onToggle,
}: {
  task: SpeakingTask;
  expandedItem: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>Task {task.taskNumber}: {task.title}</h2>
        <p className={styles.sectionSubtitle}>{task.description}</p>
      </div>

      <div className={styles.taskChips}>
        <span className={styles.chip}>🎤 Prep: {task.prepTime}</span>
        <span className={styles.chip}>⏱ Speak: {task.speakTime}</span>
      </div>

      {/* Context */}
      <div className={styles.contextCard}>
        <h3>
          <Target size={16} />
          Context — What to Know
        </h3>
        <div className={styles.contextSection}>
          <h4>✅ Read This</h4>
          {task.context.whatToRead.map((item, i) => (
            <div key={i} className={styles.contextItem}>
              <CheckCircle size={12} />
              <p>{item}</p>
            </div>
          ))}
        </div>
        <div className={styles.contextSection}>
          <h4>⏭ Skip This</h4>
          {task.context.whatToSkip.map((item, i) => (
            <div key={i} className={styles.contextItemSkip}>
              <ArrowRight size={12} />
              <p>{item}</p>
            </div>
          ))}
        </div>
        {task.context.identifyItems.length > 0 && (
          <div className={styles.contextSection}>
            <h4>💡 Important</h4>
            {task.context.identifyItems.map((item, i) => (
              <div key={i} className={styles.contextItemNote}>
                <Lightbulb size={12} />
                <p>{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skill */}
      <div className={styles.skillCard}>
        <h3>
          <Zap size={16} />
          Skill — What the Examiner Wants
        </h3>
        <div className={styles.skillMain}>
          <span className={styles.skillBadge}>{task.skill.mainSkill}</span>
        </div>
        <div className={styles.skillDetail}>
          <p><strong>Grammar:</strong> {task.skill.grammar}</p>
          <p><strong>Examiner expects:</strong> {task.skill.examinersWant}</p>
        </div>
        <div className={styles.skillVocab}>
          {task.skill.vocabularyFocus.map((v, i) => (
            <span key={i} className={styles.vocabTag}>{v}</span>
          ))}
        </div>
      </div>

      {/* Formula */}
      <div className={styles.formulaCard}>
        <h3>
          <FileText size={16} />
          Formula — Step by Step
        </h3>
        <div className={styles.formulaSteps}>
          {task.formula.map((step) => (
            <div key={step.order} className={styles.formulaStep}>
              <div className={styles.formulaNumber}>{step.order}</div>
              <div className={styles.formulaContent}>
                <h4>{step.label}</h4>
                <p className={styles.formulaDesc}>{step.description}</p>
                {step.example && (
                  <div className={styles.formulaExample}>
                    <span>💬</span>
                    <p>{step.example}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advice Expressions — only for Task 1 */}
      {task.taskNumber === 1 && (
        <div
          className={`${styles.accordionCard} ${expandedItem === 'expressions' ? styles.expanded : ''}`}
        >
          <button className={styles.accordionHeader} onClick={() => onToggle('expressions')}>
            <MessageSquare size={16} />
            <span>Advice Expressions ({adviceExpressions.length})</span>
            <ChevronRight size={14} className={styles.chevron} />
          </button>
          {expandedItem === 'expressions' && (
            <div className={styles.accordionBody}>
              {adviceExpressions.map((expr, i) => (
                <div key={i} className={styles.expressionItem}>
                  <h4>{expr.expression}</h4>
                  <p>{expr.example}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Location Words — only for Task 3 */}
      {task.taskNumber === 3 && (
        <div
          className={`${styles.accordionCard} ${expandedItem === 'locations' ? styles.expanded : ''}`}
        >
          <button className={styles.accordionHeader} onClick={() => onToggle('locations')}>
            <Eye size={16} />
            <span>Location Words ({locationWords.length})</span>
            <ChevronRight size={14} className={styles.chevron} />
          </button>
          {expandedItem === 'locations' && (
            <div className={styles.accordionBody}>
              {locationWords.map((loc, i) => (
                <div key={i} className={styles.locationItem}>
                  <h4>{loc.word}</h4>
                  <p>{loc.usage}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
        className={`${styles.accordionCard} ${expandedItem === 'mistakes' ? styles.expanded : ''}`}
      >
        <button className={styles.accordionHeader} onClick={() => onToggle('mistakes')}>
          <AlertTriangle size={16} />
          <span>Common Mistakes ({task.commonMistakes.length})</span>
          <ChevronRight size={14} className={styles.chevron} />
        </button>
        {expandedItem === 'mistakes' && (
          <div className={styles.accordionBody}>
            {task.commonMistakes.map((m, i) => (
              <div key={i} className={styles.mistakeItem}>
                <AlertTriangle size={12} />
                <p>{m}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pro Tips */}
      <div
        className={`${styles.accordionCard} ${expandedItem === 'tips' ? styles.expanded : ''}`}
      >
        <button className={styles.accordionHeader} onClick={() => onToggle('tips')}>
          <Lightbulb size={16} />
          <span>Pro Tips ({task.proTips.length})</span>
          <ChevronRight size={14} className={styles.chevron} />
        </button>
        {expandedItem === 'tips' && (
          <div className={styles.accordionBody}>
            {task.proTips.map((tip, i) => (
              <div key={i} className={styles.tipItem}>
                <Lightbulb size={12} />
                <p>{tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Quiz */}
      {(() => {
        const quiz = getQuizForModule('speaking', `task-${task.taskNumber}`) || getQuizForModule('speaking', activeModuleId(task));
        return quiz ? <QuizCard quiz={quiz} accentColor="#3b82f6" /> : null;
      })()}
    </div>
  );
}

function activeModuleId(task: SpeakingTask): string {
  // map task numbers that use non-task module ids
  return `task-${task.taskNumber}`;
}

// ─── Vocabulary Section ──────────────────────────────────────────────────────

function VocabularySection() {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>Vocabulary Tips</h2>
        <p className={styles.sectionSubtitle}>
          How to build the vocabulary you need for a high speaking score.
        </p>
      </div>

      {vocabularyTips.map((tip, i) => (
        <div key={i} className={styles.vocabCard}>
          <div className={styles.vocabHeader}>
            <span className={styles.vocabNumber}>{i + 1}</span>
            <h3>{tip.title}</h3>
          </div>
          <p>{tip.description}</p>
        </div>
      ))}

      <div className={styles.vocabNote}>
        <Volume2 size={16} />
        <p>
          The CELPIP test does NOT want incredible grammar or advanced vocabulary.
          They want normal, daily, conversational English — well organized and clearly spoken.
        </p>
      </div>
    </div>
  );
}
