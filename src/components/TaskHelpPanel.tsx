'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, HelpCircle, Mail, ClipboardList, CheckCircle, AlertTriangle, Lightbulb, Target, BookOpen, FileText } from 'lucide-react';
import styles from '@/styles/TaskHelpPanel.module.scss';

type TaskTab = 'task1' | 'task2';

interface TaskHelpPanelProps {
  defaultTab?: TaskTab;
}

// Condensed guide content for Task 1 - Email Writing
const task1Guide = {
  title: 'Email Writing Guide',
  icon: Mail,
  sections: {
    objective: {
      title: 'Task Objective',
      content: [
        'Write a 150-200 word email in 27 minutes',
        'Respond to ALL questions in the prompt',
        'Maintain appropriate tone (formal or semi-formal)',
        'Use clear structure with opening, body, and closing'
      ]
    },
    structure: {
      title: 'Recommended Structure',
      blocks: [
        {
          name: 'Opening',
          example: '"Dear Mr. Smith," + "I am writing to..."',
          tip: 'Always state your purpose in the first paragraph'
        },
        {
          name: 'Body (2-3 paragraphs)',
          example: '"First of all... Secondly... Thirdly..."',
          tip: 'Use sequence connectors to organize your points'
        },
        {
          name: 'Closing',
          example: '"Please let me know if..." + "Regards, [Name]"',
          tip: 'Include a call-to-action before signing off'
        }
      ]
    },
    mistakes: {
      title: 'Common Mistakes',
      items: [
        { mistake: 'Missing questions from prompt', fix: 'Check off each question as you address it' },
        { mistake: 'Inconsistent tone', fix: 'Formal = no contractions, no slang' },
        { mistake: 'No closing line', fix: 'Always end with "Please let me know..." type phrase' },
        { mistake: 'Too short or too long', fix: 'Aim for 150-200 words exactly' }
      ]
    },
    tips: {
      title: 'Practical Tips',
      content: [
        'You can invent details - CELPIP does not verify facts',
        'Spend 3-5 minutes planning before writing',
        'Reserve 3-5 minutes at the end for revision',
        'Use the word counter to stay in the ideal range',
        'Keep paragraphs balanced in length'
      ]
    }
  }
};

// Condensed guide content for Task 2 - Survey Response
const task2Guide = {
  title: 'Survey Response Guide',
  icon: ClipboardList,
  sections: {
    objective: {
      title: 'Task Objective',
      content: [
        'Write a 150-200 word opinion response in 26 minutes',
        'Choose ONE option and defend it clearly',
        'Provide specific reasons and examples',
        'Write a structured argumentative text (not an email)'
      ]
    },
    structure: {
      title: 'PRE Structure (Point-Reason-Example)',
      blocks: [
        {
          name: 'Introduction',
          example: '"In my opinion, I would choose Option A because..."',
          tip: 'State your position immediately - no fence-sitting'
        },
        {
          name: 'Body (2-3 PRE blocks)',
          example: '"First, [Point]. This is because [Reason]. For example, [Example]."',
          tip: 'Each argument needs a specific example (can be invented)'
        },
        {
          name: 'Conclusion',
          example: '"In conclusion, I am convinced that Option A is the better choice."',
          tip: 'Reaffirm your position - never change sides'
        }
      ]
    },
    mistakes: {
      title: 'Common Mistakes',
      items: [
        { mistake: 'Sitting on the fence', fix: 'Pick ONE side and commit to it' },
        { mistake: 'Generic examples', fix: 'Add names, numbers, specific places' },
        { mistake: 'Arguments without examples', fix: 'Every Point needs a concrete Example' },
        { mistake: 'Missing conclusion', fix: 'Always restate your position at the end' }
      ]
    },
    tips: {
      title: 'Practical Tips',
      content: [
        'Use your first instinct - do not overthink the choice',
        'You can invent statistics and examples',
        '2 well-developed arguments beat 3 weak ones',
        'Use connectors: First, Second, Finally (or Additionally, Moreover)',
        'Keep the conclusion short - 1-2 sentences max'
      ]
    }
  }
};

export default function TaskHelpPanel({ defaultTab = 'task1' }: TaskHelpPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TaskTab>(defaultTab);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const currentGuide = activeTab === 'task1' ? task1Guide : task2Guide;
  const IconComponent = currentGuide.icon;

  return (
    <>
      {/* Help Button/Icon */}
      <button
        className={styles.helpButton}
        onClick={handleOpen}
        title="Open Writing Guide"
        aria-label="Open Writing Guide"
      >
        <HelpCircle size={18} />
      </button>

      {/* Overlay + Panel */}
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div 
            className={styles.panel} 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-panel-title"
          >
            {/* Panel Header */}
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <BookOpen size={20} />
                <h2 id="help-panel-title">CELPIP Writing Guide</h2>
              </div>
              <button
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="Close guide panel"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className={styles.tabNav}>
              <button
                className={`${styles.tabButton} ${activeTab === 'task1' ? styles.tabButtonActive : ''}`}
                onClick={() => setActiveTab('task1')}
              >
                <Mail size={16} />
                <span>Task 1 — Email</span>
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === 'task2' ? styles.tabButtonActive : ''}`}
                onClick={() => setActiveTab('task2')}
              >
                <ClipboardList size={16} />
                <span>Task 2 — Survey</span>
              </button>
            </div>

            {/* Panel Content */}
            <div className={styles.panelContent}>
              {/* Objective Section */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Target size={16} />
                  <h3>{currentGuide.sections.objective.title}</h3>
                </div>
                <ul className={styles.objectiveList}>
                  {currentGuide.sections.objective.content.map((item, index) => (
                    <li key={index}>
                      <CheckCircle size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Structure Section */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <FileText size={16} />
                  <h3>{currentGuide.sections.structure.title}</h3>
                </div>
                <div className={styles.structureBlocks}>
                  {currentGuide.sections.structure.blocks.map((block, index) => (
                    <div key={index} className={styles.structureBlock}>
                      <div className={styles.structureBlockHeader}>
                        <span className={styles.structureNumber}>{index + 1}</span>
                        <span className={styles.structureName}>{block.name}</span>
                      </div>
                      <code className={styles.structureExample}>{block.example}</code>
                      <p className={styles.structureTip}>
                        <Lightbulb size={12} />
                        {block.tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes Section */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <AlertTriangle size={16} />
                  <h3>{currentGuide.sections.mistakes.title}</h3>
                </div>
                <div className={styles.mistakesList}>
                  {currentGuide.sections.mistakes.items.map((item, index) => (
                    <div key={index} className={styles.mistakeItem}>
                      <div className={styles.mistakeLabel}>
                        <span className={styles.mistakeBadge}>✗</span>
                        <span>{item.mistake}</span>
                      </div>
                      <div className={styles.mistakeFix}>
                        <span className={styles.fixBadge}>✓</span>
                        <span>{item.fix}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Tips Section */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Lightbulb size={16} />
                  <h3>{currentGuide.sections.tips.title}</h3>
                </div>
                <ul className={styles.tipsList}>
                  {currentGuide.sections.tips.content.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
