'use client';

import React, { useState } from 'react';
import { X, Lightbulb, CheckCircle, AlertTriangle, Target, BookOpen } from 'lucide-react';
import styles from '@/styles/HelpGuidePanel.module.scss';

interface HelpGuidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'task1' | 'task2';
}

const task1Guide = {
  title: 'Email Writing Guide',
  objective: {
    title: 'Task Objective',
    content: 'Write a 150–200 word email responding to a given scenario. You will have 27 minutes. The email must address all points mentioned in the prompt and use appropriate tone (formal or semi-formal).',
  },
  structure: {
    title: 'Recommended Structure',
    sections: [
      {
        name: 'Opening (2-3 sentences)',
        items: [
          'Greeting: "Dear Mr./Ms. [Name]," or "Dear [Title],"',
          'Introduction: State who you are',
          'Purpose: Explain why you are writing',
        ],
      },
      {
        name: 'Body (3-4 paragraphs)',
        items: [
          'Address each question from the prompt',
          'Use sequence connectors: First, Second, Third, Finally',
          'Provide specific details and examples',
        ],
      },
      {
        name: 'Closing (2-3 sentences)',
        items: [
          'Include a call-to-action or request',
          'Closing line: "Please let me know if you have any questions."',
          'Sign-off: "Regards," or "Sincerely," + your name',
        ],
      },
    ],
  },
  mistakes: {
    title: 'Common Mistakes',
    items: [
      { mistake: 'Not answering all questions in the prompt', fix: 'Check off each question as you address it' },
      { mistake: 'Inconsistent tone throughout the email', fix: 'Decide formal or semi-formal and stick to it' },
      { mistake: 'Missing greeting or sign-off', fix: 'Always start with "Dear..." and end with a sign-off' },
      { mistake: 'Writing too little (under 150 words)', fix: 'Expand your details and examples' },
      { mistake: 'Forgetting the call-to-action', fix: 'Always include a request or suggestion' },
    ],
  },
  tips: {
    title: 'Practical Tips',
    items: [
      'Spend 5 minutes planning before writing',
      'You can invent details — the test does not verify facts',
      'Use vocabulary you are confident with',
      'Save 3-4 minutes at the end for revision',
      'Check for subject-verb agreement and article usage',
    ],
  },
};

const task2Guide = {
  title: 'Survey Response Guide',
  objective: {
    title: 'Task Objective',
    content: 'Write a 150–200 word survey response in 26 minutes. You must choose one option from two choices and defend your position with clear arguments and specific examples.',
  },
  structure: {
    title: 'PRE Structure (Point-Reason-Example)',
    sections: [
      {
        name: 'Introduction (2-3 sentences)',
        items: [
          'State your position clearly: "In my opinion, I prefer Option A..."',
          'Briefly mention the topic',
          'Preview your main arguments',
        ],
      },
      {
        name: 'Body (2-3 PRE paragraphs)',
        items: [
          'Point: State your main idea clearly',
          'Reason: Explain WHY this point is valid',
          'Example: Give a specific example (can be invented)',
          'Use connectors: First, Second, Finally',
        ],
      },
      {
        name: 'Conclusion (1-2 sentences)',
        items: [
          'Restate your position',
          'Summarize your key reasons',
        ],
      },
    ],
  },
  mistakes: {
    title: 'Common Mistakes',
    items: [
      { mistake: 'Being indecisive or choosing both options', fix: 'Pick ONE side and defend it strongly' },
      { mistake: 'Arguments without examples', fix: 'Every Point needs a specific Example' },
      { mistake: 'Vague examples like "many people benefit"', fix: 'Use specific names, numbers, or places' },
      { mistake: 'Forgetting the conclusion', fix: 'Always end by restating your position' },
      { mistake: 'Mixing connector series (First... Moreover...)', fix: 'Stick to one series: First, Second, Third' },
    ],
  },
  tips: {
    title: 'Practical Tips',
    items: [
      'Choose your position in the first 30 seconds',
      'Your first instinct is usually the easiest to defend',
      'You can invent statistics and examples',
      'Two strong arguments beat three weak ones',
      'Keep paragraphs balanced in length',
    ],
  },
};

export const HelpGuidePanel: React.FC<HelpGuidePanelProps> = ({ isOpen, onClose, initialTab = 'task1' }) => {
  const [activeTab, setActiveTab] = useState<'task1' | 'task2'>(initialTab);

  const guide = activeTab === 'task1' ? task1Guide : task2Guide;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} />
      
      {/* Panel */}
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <BookOpen size={20} />
            <h2>Writing Guide</h2>
          </div>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close panel">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'task1' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('task1')}
          >
            Task 1 – Email
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'task2' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('task2')}
          >
            Task 2 – Survey
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h3 className={styles.guideTitle}>{guide.title}</h3>

          {/* Objective */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Target size={16} />
              <h4>{guide.objective.title}</h4>
            </div>
            <p className={styles.objectiveText}>{guide.objective.content}</p>
          </section>

          {/* Structure */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <BookOpen size={16} />
              <h4>{guide.structure.title}</h4>
            </div>
            <div className={styles.structureList}>
              {guide.structure.sections.map((section, idx) => (
                <div key={idx} className={styles.structureItem}>
                  <h5 className={styles.structureName}>{section.name}</h5>
                  <ul className={styles.structurePoints}>
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Common Mistakes */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <AlertTriangle size={16} />
              <h4>{guide.mistakes.title}</h4>
            </div>
            <div className={styles.mistakesList}>
              {guide.mistakes.items.map((item, idx) => (
                <div key={idx} className={styles.mistakeItem}>
                  <div className={styles.mistakeText}>
                    <span className={styles.mistakeLabel}>✗</span>
                    {item.mistake}
                  </div>
                  <div className={styles.fixText}>
                    <span className={styles.fixLabel}>✓</span>
                    {item.fix}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Practical Tips */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <Lightbulb size={16} />
              <h4>{guide.tips.title}</h4>
            </div>
            <ul className={styles.tipsList}>
              {guide.tips.items.map((tip, idx) => (
                <li key={idx}>
                  <CheckCircle size={14} />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};
