'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, ChevronRight, BookOpen, Target,
  Lightbulb, AlertTriangle, Star, Zap, TrendingUp, Eye,
  Mail, ClipboardList, CheckCircle, PenTool, MessageSquareText,
  MessageCircle, SearchX, Sparkles, GraduationCap
} from 'lucide-react';
import {
  csfFramework,
  makeItRealTechnique,
  task1Formula,
  task2Formula,
  commonMistakes,
  writingChecklist,
  task1Template,
  task2Template,
  type GuideSection,
  type ContentBlock,
} from '@content/writing-guide';
import { closingCategories } from '@content/writing-tools';
import { STARTER_CATEGORIES } from '@content/sentence-starters';
import QuizCard from '@/components/QuizCard';
import { getQuizForModule } from '@content/quiz-data';
import styles from '@/styles/WritingMastery.module.scss';

// ─── Module Definitions ──────────────────────────────────────────────────────

interface Module {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: 'overview' | 'guide' | 'starters' | 'closings' | 'checklist' | 'templates';
}

const modules: Module[] = [
  { id: 'overview', label: 'Overview', icon: <BookOpen size={18} />, type: 'overview' },
  { id: 'csf', label: 'CSF Framework', icon: <Target size={18} />, type: 'guide' },
  { id: 'make-it-real', label: 'Make It Real', icon: <Sparkles size={18} />, type: 'guide' },
  { id: 'task1-formula', label: 'Task 1 Formula', icon: <Mail size={18} />, type: 'guide' },
  { id: 'task2-formula', label: 'Task 2 Formula', icon: <ClipboardList size={18} />, type: 'guide' },
  { id: 'mistakes', label: 'Common Mistakes', icon: <AlertTriangle size={18} />, type: 'guide' },
  { id: 'starters', label: 'Sentence Starters', icon: <MessageSquareText size={18} />, type: 'starters' },
  { id: 'closings', label: 'Closing Builder', icon: <MessageCircle size={18} />, type: 'closings' },
  { id: 'checklist', label: 'Checklist', icon: <CheckCircle size={18} />, type: 'checklist' },
  { id: 'templates', label: 'Templates', icon: <PenTool size={18} />, type: 'templates' },
];

const guideSectionMap: Record<string, GuideSection> = {
  csf: csfFramework,
  'make-it-real': makeItRealTechnique,
  'task1-formula': task1Formula,
  'task2-formula': task2Formula,
  mistakes: commonMistakes,
};

// ─── Page Component ──────────────────────────────────────────────────────────

export default function WritingMasteryPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('overview');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const currentModule = modules.find((m) => m.id === activeModule)!;

  return (
    <div className={styles.container}>
      {/* ── Header ────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/writing')}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.headerInfo}>
          <span className={styles.breadcrumb}>Writing → Mastery</span>
          <h1>Writing Mastery</h1>
        </div>
        <div className={styles.headerIcon}>
          <GraduationCap size={20} />
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

        {/* ── Main Content ────────────────────────────────────────── */}
        <main className={styles.content}>
          {currentModule.type === 'overview' && <OverviewSection />}
          {currentModule.type === 'guide' && (
            <GuideSectionView
              section={guideSectionMap[currentModule.id]}
              expandedItem={expandedItem}
              onToggle={(id) => setExpandedItem(expandedItem === id ? null : id)}
              moduleId={currentModule.id}
            />
          )}
          {currentModule.type === 'starters' && (
            <StartersSection
              expandedItem={expandedItem}
              onToggle={(id) => setExpandedItem(expandedItem === id ? null : id)}
            />
          )}
          {currentModule.type === 'closings' && (
            <ClosingsSection
              expandedItem={expandedItem}
              onToggle={(id) => setExpandedItem(expandedItem === id ? null : id)}
            />
          )}
          {currentModule.type === 'checklist' && <ChecklistSection />}
          {currentModule.type === 'templates' && <TemplatesSection />}

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
        <h2>Writing Mastery Guide</h2>
        <p className={styles.sectionSubtitle}>
          Everything you need to score high on CELPIP Writing — frameworks, formulas, and practice tools.
        </p>
      </div>

      {/* Stats */}
      <div className={styles.overviewCard}>
        <div className={styles.overviewStats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>2</span>
            <span className={styles.statLabel}>Tasks</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>53</span>
            <span className={styles.statLabel}>Minutes</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>150-200</span>
            <span className={styles.statLabel}>Words Each</span>
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
          {[
            { score: '5-6', descriptor: 'Limited — basic ideas, frequent grammar errors, unclear structure' },
            { score: '7', descriptor: 'Adequate — covers the topic, some errors, limited vocabulary' },
            { score: '8', descriptor: 'Good — clear ideas, minor errors, uses organizational words' },
            { score: '9', descriptor: 'Very Good — well-structured, varied vocabulary, few errors' },
            { score: '10', descriptor: 'Excellent — coherent, precise word choice, natural flow' },
            { score: '11-12', descriptor: 'Expert — sophisticated language, flawless structure, publication-ready' },
          ].map((band) => (
            <div key={band.score} className={styles.scoreRow}>
              <span className={styles.scoreBadge}>{band.score}</span>
              <span className={styles.scoreDesc}>{band.descriptor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Concepts */}
      <div className={styles.conceptsGrid}>
        <div className={styles.conceptCard}>
          <div className={styles.conceptIcon}>
            <Target size={20} />
          </div>
          <h4>CSF Framework</h4>
          <p>Context → Skill → Formula. The foundation of every response.</p>
        </div>
        <div className={styles.conceptCard}>
          <div className={styles.conceptIcon}>
            <Sparkles size={20} />
          </div>
          <h4>Make It Real</h4>
          <p>Invent names, places, and details to boost your score.</p>
        </div>
        <div className={styles.conceptCard}>
          <div className={styles.conceptIcon}>
            <Mail size={20} />
          </div>
          <h4>Task 1: Email</h4>
          <p>5-part formula: Opening → Intro → Body → Closing → Sign-off.</p>
        </div>
        <div className={styles.conceptCard}>
          <div className={styles.conceptIcon}>
            <ClipboardList size={20} />
          </div>
          <h4>Task 2: Opinion</h4>
          <p>PRE technique: Point → Reason → Example for every argument.</p>
        </div>
      </div>

      {/* Golden Rules */}
      <div className={styles.rulesCard}>
        <h3>
          <AlertTriangle size={16} />
          Golden Rules
        </h3>
        <ul>
          <li>NEVER use contractions (don&apos;t → do not, can&apos;t → cannot)</li>
          <li>ALWAYS use organization words: First of all, Second, Finally</li>
          <li>Answer ALL questions from the prompt — missing one drops your score</li>
          <li>Task 1: Always include &ldquo;Please let me know if...&rdquo; before sign-off</li>
          <li>Task 2: NEVER say &ldquo;Option A&rdquo; or &ldquo;Option B&rdquo; — paraphrase instead</li>
          <li>Generic = low score. Realistic details = high score</li>
          <li>Keep introductions SHORT — max 2 sentences</li>
          <li>Word count matters: 150-200 words, no more, no less</li>
        </ul>
      </div>

      {/* Learning Path */}
      <div className={styles.learningPath}>
        <h3>
          <TrendingUp size={16} />
          Recommended Learning Path
        </h3>
        <div className={styles.pathSteps}>
          <div className={styles.pathStep}>
            <div className={styles.pathNumber}>1</div>
            <div>
              <h4>CSF Framework</h4>
              <p>Learn to analyze any prompt</p>
            </div>
          </div>
          <div className={styles.pathStep}>
            <div className={styles.pathNumber}>2</div>
            <div>
              <h4>Make It Real</h4>
              <p>Master realistic details</p>
            </div>
          </div>
          <div className={styles.pathStep}>
            <div className={styles.pathNumber}>3</div>
            <div>
              <h4>Task 1 & 2 Formulas</h4>
              <p>Learn the exact structures</p>
            </div>
          </div>
          <div className={styles.pathStep}>
            <div className={styles.pathNumber}>4</div>
            <div>
              <h4>Sentence Starters & Closings</h4>
              <p>Build your vocabulary toolkit</p>
            </div>
          </div>
          <div className={styles.pathStep}>
            <div className={styles.pathNumber}>5</div>
            <div>
              <h4>Checklist & Practice</h4>
              <p>Write and self-evaluate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Guide Section View (CSF, Make It Real, Task 1/2, Mistakes) ──────────────

function GuideSectionView({
  section,
  expandedItem,
  onToggle,
  moduleId,
}: {
  section: GuideSection;
  expandedItem: string | null;
  onToggle: (id: string) => void;
  moduleId: string;
}) {
  const quizModuleMap: Record<string, string> = {
    'csf': 'csf',
    'task1-formula': 'task-1',
    'task2-formula': 'task-2',
  };
  const quizId = quizModuleMap[moduleId];

  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>{section.icon}</div>
        <h2>{section.title}</h2>
        <p className={styles.sectionSubtitle}>{section.description}</p>
      </div>

      <div className={styles.contentBlocks}>
        {section.content.map((block, i) => (
          <ContentBlockView key={i} block={block} index={i} />
        ))}
      </div>

      {quizId && (() => {
        const quiz = getQuizForModule('writing', quizId);
        return quiz ? <QuizCard quiz={quiz} accentColor="#8b5cf6" /> : null;
      })()}
    </div>
  );
}

function ContentBlockView({ block, index }: { block: ContentBlock; index: number }) {
  switch (block.type) {
    case 'heading':
      return <h3 className={styles.contentHeading}>{block.content}</h3>;

    case 'text':
      return <p className={styles.contentText}>{block.content}</p>;

    case 'tip':
      return (
        <div className={styles.tipBox}>
          <Lightbulb size={14} />
          <p>{block.content}</p>
        </div>
      );

    case 'warning':
      return (
        <div className={styles.warningBox}>
          <AlertTriangle size={14} />
          <p>{block.content}</p>
        </div>
      );

    case 'example':
      return (
        <div className={styles.exampleBox}>
          <Eye size={14} />
          <p>{block.content}</p>
        </div>
      );

    case 'formula':
      return (
        <pre className={styles.formulaBlock}>
          <code>{block.content}</code>
        </pre>
      );

    case 'list':
      return (
        <div className={styles.listBlock}>
          {block.content && <p className={styles.listLabel}>{block.content}</p>}
          <ul>
            {block.items?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      );

    case 'comparison':
      return (
        <div className={styles.comparisonBlock}>
          {block.content && <p className={styles.comparisonLabel}>{block.content}</p>}
          <div className={styles.comparisonGrid}>
            <div className={styles.compBad}>
              <span className={styles.compTag}>✗ Bad</span>
              <p>{block.bad}</p>
            </div>
            <div className={styles.compGood}>
              <span className={styles.compTag}>✓ Good</span>
              <p>{block.good}</p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ─── Sentence Starters Section ───────────────────────────────────────────────

function StartersSection({
  expandedItem,
  onToggle,
}: {
  expandedItem: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>Sentence Starters</h2>
        <p className={styles.sectionSubtitle}>
          Ready-to-use phrases organized by purpose. Tap a category to see examples.
        </p>
      </div>

      {STARTER_CATEGORIES.map((cat) => (
        <div
          key={cat.id}
          className={`${styles.accordionCard} ${expandedItem === cat.id ? styles.expanded : ''}`}
        >
          <button className={styles.accordionHeader} onClick={() => onToggle(cat.id)}>
            <span className={styles.accordionIcon}>{cat.icon}</span>
            <div className={styles.accordionInfo}>
              <h4>{cat.title}</h4>
              <p>{cat.phrases.length} phrases</p>
            </div>
            <ChevronRight size={16} className={styles.chevron} />
          </button>
          {expandedItem === cat.id && (
            <div className={styles.accordionBody}>
              {cat.phrases.map((phrase, i) => (
                <div key={i} className={styles.phraseItem}>
                  <p className={styles.phraseText}>{phrase.phrase}</p>
                  <p className={styles.phraseExample}>
                    <em>&ldquo;{phrase.example}&rdquo;</em>
                  </p>
                  <div className={styles.phraseTags}>
                    {phrase.tags.map((tag) => (
                      <span key={tag} className={styles.phraseTag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Closing Builder Section ─────────────────────────────────────────────────

function ClosingsSection({
  expandedItem,
  onToggle,
}: {
  expandedItem: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>Closing Builder</h2>
        <p className={styles.sectionSubtitle}>
          &ldquo;Please let me know if...&rdquo; templates by situation. Essential for Task 1 closings.
        </p>
      </div>

      {closingCategories.map((cat) => (
        <div
          key={cat.id}
          className={`${styles.accordionCard} ${expandedItem === cat.id ? styles.expanded : ''}`}
        >
          <button className={styles.accordionHeader} onClick={() => onToggle(cat.id)}>
            <span className={styles.accordionIcon}>{cat.icon}</span>
            <div className={styles.accordionInfo}>
              <h4>{cat.title}</h4>
              <p>{cat.closings.length} closings</p>
            </div>
            <ChevronRight size={16} className={styles.chevron} />
          </button>
          {expandedItem === cat.id && (
            <div className={styles.accordionBody}>
              {cat.closings.map((closing) => (
                <div key={closing.id} className={styles.closingItem}>
                  <p className={styles.closingTemplate}>{closing.template}</p>
                  <p className={styles.closingContext}>
                    <Lightbulb size={12} /> {closing.context}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Checklist Section ───────────────────────────────────────────────────────

function ChecklistSection() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [activeTask, setActiveTask] = useState<'task1' | 'task2'>('task1');

  const filteredItems = writingChecklist.filter(
    (item) => item.task === activeTask || item.task === 'both'
  );

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>Pre-Submit Checklist</h2>
        <p className={styles.sectionSubtitle}>
          Check every item before submitting your response.
        </p>
      </div>

      {/* Task Toggle */}
      <div className={styles.taskToggle}>
        <button
          className={`${styles.toggleBtn} ${activeTask === 'task1' ? styles.active : ''}`}
          onClick={() => { setActiveTask('task1'); setCheckedItems(new Set()); }}
        >
          <Mail size={14} /> Task 1
        </button>
        <button
          className={`${styles.toggleBtn} ${activeTask === 'task2' ? styles.active : ''}`}
          onClick={() => { setActiveTask('task2'); setCheckedItems(new Set()); }}
        >
          <ClipboardList size={14} /> Task 2
        </button>
      </div>

      {/* Progress */}
      <div className={styles.checkProgress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(checkedItems.size / filteredItems.length) * 100}%` }}
          />
        </div>
        <span>{checkedItems.size}/{filteredItems.length}</span>
      </div>

      {/* Items */}
      <div className={styles.checklistItems}>
        {filteredItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.checkItem} ${checkedItems.has(item.id) ? styles.checked : ''} ${item.critical ? styles.critical : ''}`}
            onClick={() => toggleCheck(item.id)}
          >
            <div className={styles.checkbox}>
              {checkedItems.has(item.id) && <CheckCircle size={16} />}
            </div>
            <span>{item.text}</span>
            {item.critical && <span className={styles.criticalBadge}>Critical</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Templates Section ───────────────────────────────────────────────────────

function TemplatesSection() {
  const [activeTemplate, setActiveTemplate] = useState<'task1' | 'task2'>('task1');
  const [showExample, setShowExample] = useState(false);

  const template = activeTemplate === 'task1' ? task1Template : task2Template;

  return (
    <div className={styles.sectionContent}>
      <div className={styles.sectionHeader}>
        <h2>Full Templates</h2>
        <p className={styles.sectionSubtitle}>
          Complete structure + real example for each task type.
        </p>
      </div>

      {/* Task Toggle */}
      <div className={styles.taskToggle}>
        <button
          className={`${styles.toggleBtn} ${activeTemplate === 'task1' ? styles.active : ''}`}
          onClick={() => { setActiveTemplate('task1'); setShowExample(false); }}
        >
          <Mail size={14} /> Task 1: Email
        </button>
        <button
          className={`${styles.toggleBtn} ${activeTemplate === 'task2' ? styles.active : ''}`}
          onClick={() => { setActiveTemplate('task2'); setShowExample(false); }}
        >
          <ClipboardList size={14} /> Task 2: Opinion
        </button>
      </div>

      {/* Structure */}
      <div className={styles.templateCard}>
        <h3>
          <PenTool size={16} />
          Structure
        </h3>
        <pre className={styles.templatePre}>
          <code>{template.structure}</code>
        </pre>
      </div>

      {/* Toggle Example */}
      <button
        className={styles.showExampleBtn}
        onClick={() => setShowExample(!showExample)}
      >
        <Eye size={16} />
        <span>{showExample ? 'Hide' : 'Show'} Full Example</span>
        <ChevronRight size={14} className={`${styles.chevron} ${showExample ? styles.rotated : ''}`} />
      </button>

      {showExample && (
        <div className={styles.exampleTemplate}>
          <h3>
            <Star size={16} />
            Example Response
          </h3>
          <pre className={styles.templatePre}>
            <code>{template.example}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
