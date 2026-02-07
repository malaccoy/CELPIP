'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Target, 
  Sparkles, 
  Mail, 
  FileText, 
  AlertTriangle,
  CheckSquare,
  ChevronRight,
  Lightbulb,
  AlertCircle,
  BookOpen,
  Check,
  X
} from 'lucide-react';
import styles from '@/styles/WritingGuide.module.scss';
import { 
  allGuideSections, 
  writingChecklist,
  task1Template,
  task2Template,
  type GuideSection,
  type ContentBlock,
  type ChecklistItem
} from '@content/writing-guide';

const sectionIcons: Record<string, React.ReactNode> = {
  'csf': <Target size={24} />,
  'make-it-real': <Sparkles size={24} />,
  'task1-formula': <Mail size={24} />,
  'task2-formula': <FileText size={24} />,
  'mistakes': <AlertTriangle size={24} />
};

export default function WritingGuidePage() {
  const [activeSection, setActiveSection] = useState<string>('csf');
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistTask, setChecklistTask] = useState<'task1' | 'task2'>('task1');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const currentSection = allGuideSections.find(s => s.id === activeSection);

  const toggleCheckItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const filteredChecklist = writingChecklist.filter(
    item => item.task === checklistTask || item.task === 'both'
  );

  const renderContentBlock = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        return <h3 key={index} className={styles.contentHeading}>{block.content}</h3>;
      
      case 'text':
        return <p key={index} className={styles.contentText}>{block.content}</p>;
      
      case 'tip':
        return (
          <div key={index} className={styles.tipBox}>
            <Lightbulb size={20} />
            <p>{block.content}</p>
          </div>
        );
      
      case 'warning':
        return (
          <div key={index} className={styles.warningBox}>
            <AlertCircle size={20} />
            <p>{block.content}</p>
          </div>
        );
      
      case 'example':
        return (
          <div key={index} className={styles.exampleBox}>
            <BookOpen size={18} />
            <p>{block.content}</p>
          </div>
        );
      
      case 'formula':
        return (
          <pre key={index} className={styles.formulaBox}>
            {block.content}
          </pre>
        );
      
      case 'list':
        return (
          <div key={index} className={styles.listBlock}>
            {block.content && <p className={styles.listIntro}>{block.content}</p>}
            <ul>
              {block.items?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        );
      
      case 'comparison':
        return (
          <div key={index} className={styles.comparisonBox}>
            {block.content && <p className={styles.comparisonIntro}>{block.content}</p>}
            <div className={styles.comparisonGrid}>
              <div className={styles.badExample}>
                <span className={styles.label}><X size={16} /> Wrong</span>
                <p>{block.bad}</p>
              </div>
              <div className={styles.goodExample}>
                <span className={styles.label}><Check size={16} /> Correct</span>
                <p>{block.good}</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/writing" className={styles.backButton}>
          <ArrowLeft size={20} />
        </Link>
        <div className={styles.headerContent}>
          <h1>Writing <span>Mastery Guide</span></h1>
          <p>Learn the techniques that guarantee a high score</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={styles.tabNav}>
        {allGuideSections.map((section) => (
          <button
            key={section.id}
            className={`${styles.tab} ${activeSection === section.id ? styles.active : ''}`}
            onClick={() => { setActiveSection(section.id); setShowChecklist(false); }}
          >
            {sectionIcons[section.id]}
            <span>{section.title}</span>
          </button>
        ))}
        <button
          className={`${styles.tab} ${showChecklist ? styles.active : ''}`}
          onClick={() => setShowChecklist(true)}
        >
          <CheckSquare size={24} />
          <span>Checklist</span>
        </button>
      </nav>

      {/* Content Area */}
      <main className={styles.content}>
        {!showChecklist && currentSection && (
          <article className={styles.sectionContent}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>{currentSection.icon}</span>
              <div>
                <h2>{currentSection.title}</h2>
                <p>{currentSection.description}</p>
              </div>
            </div>

            <div className={styles.sectionBody}>
              {currentSection.content.map((block, index) => renderContentBlock(block, index))}
            </div>

            {/* Show template for formula sections */}
            {currentSection.id === 'task1-formula' && (
              <div className={styles.templateSection}>
                <h3>📋 Complete Template</h3>
                <div className={styles.templateBox}>
                  <div className={styles.templateHeader}>
                    <span>Structure</span>
                  </div>
                  <pre>{task1Template.structure}</pre>
                </div>
                <div className={styles.templateBox}>
                  <div className={styles.templateHeader}>
                    <span>Example (Score: 12)</span>
                  </div>
                  <pre>{task1Template.example}</pre>
                </div>
              </div>
            )}

            {currentSection.id === 'task2-formula' && (
              <div className={styles.templateSection}>
                <h3>📋 Complete Template</h3>
                <div className={styles.templateBox}>
                  <div className={styles.templateHeader}>
                    <span>Structure</span>
                  </div>
                  <pre>{task2Template.structure}</pre>
                </div>
                <div className={styles.templateBox}>
                  <div className={styles.templateHeader}>
                    <span>Example (Score: 12)</span>
                  </div>
                  <pre>{task2Template.example}</pre>
                </div>
              </div>
            )}
          </article>
        )}

        {showChecklist && (
          <article className={styles.checklistSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✅</span>
              <div>
                <h2>Pre-Submit Checklist</h2>
                <p>Check these items before finishing your writing</p>
              </div>
            </div>

            <div className={styles.checklistTabs}>
              <button
                className={checklistTask === 'task1' ? styles.active : ''}
                onClick={() => { setChecklistTask('task1'); setCheckedItems(new Set()); }}
              >
                <Mail size={18} /> Task 1 (Email)
              </button>
              <button
                className={checklistTask === 'task2' ? styles.active : ''}
                onClick={() => { setChecklistTask('task2'); setCheckedItems(new Set()); }}
              >
                <FileText size={18} /> Task 2 (Opinion)
              </button>
            </div>

            <div className={styles.checklistItems}>
              {filteredChecklist.map((item) => (
                <label
                  key={item.id}
                  className={`${styles.checklistItem} ${item.critical ? styles.critical : ''} ${checkedItems.has(item.id) ? styles.checked : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={checkedItems.has(item.id)}
                    onChange={() => toggleCheckItem(item.id)}
                  />
                  <span className={styles.checkbox}>
                    {checkedItems.has(item.id) && <Check size={14} />}
                  </span>
                  <span className={styles.itemText}>
                    {item.text}
                    {item.critical && <span className={styles.criticalBadge}>Critical</span>}
                  </span>
                </label>
              ))}
            </div>

            <div className={styles.checklistProgress}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${(checkedItems.size / filteredChecklist.length) * 100}%` }}
                />
              </div>
              <span>{checkedItems.size} / {filteredChecklist.length} completed</span>
            </div>
          </article>
        )}
      </main>

      {/* Bottom CTA */}
      <div className={styles.bottomCta}>
        <Link href="/writing/task-1" className={styles.ctaButton}>
          Practice Task 1 <ChevronRight size={20} />
        </Link>
        <Link href="/writing/task-2" className={styles.ctaButtonSecondary}>
          Practice Task 2 <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );
}
