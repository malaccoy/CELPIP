'use client';

import { useRouter } from 'next/navigation';
import { Card, Button } from '@/components/Common';
import { task2GuideContent } from '@content/pt/task2-guide';
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Lightbulb, BookOpen, Sparkles } from 'lucide-react';
import styles from '@/styles/Guide.module.scss';

export default function Task2GuidePage() {
  const router = useRouter();
  const content = task2GuideContent;

  return (
    <div className={styles.guideContainer}>
      {/* Back navigation */}
      <button onClick={() => router.push('/guide')} className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Voltar ao Guia</span>
      </button>

      <div className={styles.guideHeader}>
        <h1>{content.pageTitle}</h1>
        <p>{content.pageSubtitle}</p>
      </div>

      {/* Section: What is Task 2 */}
      <Card title={content.sections.whatIsTask2.title}>
        <ul className={styles.contentList}>
          {content.sections.whatIsTask2.content.map((item, index) => (
            <li key={index} className={styles.contentItem}>{item}</li>
          ))}
        </ul>
        <div className={styles.tipBox}>
          <Lightbulb size={16} />
          <span>{content.sections.whatIsTask2.tip}</span>
        </div>
      </Card>

      {/* Section: Professor Strategy */}
      <Card title={content.sections.professorStrategy.title}>
        <p className={styles.sectionSubtitle}>{content.sections.professorStrategy.subtitle}</p>
        <ul className={styles.contentList}>
          {content.sections.professorStrategy.content.map((item, index) => (
            <li key={index} className={styles.contentItem}>{item}</li>
          ))}
        </ul>
        <div className={styles.keyPointBox}>
          <Sparkles size={16} />
          <span>{content.sections.professorStrategy.keyPoint}</span>
        </div>
      </Card>

      {/* Section: PRE Structure */}
      <Card title={content.sections.preStructure.title}>
        <p className={styles.sectionSubtitle}>{content.sections.preStructure.subtitle}</p>
        <div className={styles.preGrid}>
          {content.sections.preStructure.blocks.map((block, index) => (
            <div key={index} className={styles.preBlock}>
              <div className={styles.preLetter}>{block.letter}</div>
              <div className={styles.preContent}>
                <h4 className={styles.preName}>{block.name}</h4>
                <p className={styles.preDescription}>{block.description}</p>
                <div className={styles.preExample}>
                  <code>{block.example}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.tipBox}>
          <Lightbulb size={16} />
          <span>{content.sections.preStructure.tip}</span>
        </div>
      </Card>

      {/* Section: Email Structure */}
      <Card title={content.sections.emailStructure.title}>
        <div className={styles.structureGrid}>
          <div className={styles.structureBlock}>
            <h4 className={styles.structureBlockTitle}>
              <span className={styles.structureNumber}>1</span>
              {content.sections.emailStructure.introduction.title}
            </h4>
            <ul className={styles.structureList}>
              {content.sections.emailStructure.introduction.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className={styles.structureBlock}>
            <h4 className={styles.structureBlockTitle}>
              <span className={styles.structureNumber}>2</span>
              {content.sections.emailStructure.body.title}
            </h4>
            <ul className={styles.structureList}>
              {content.sections.emailStructure.body.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className={styles.structureBlock}>
            <h4 className={styles.structureBlockTitle}>
              <span className={styles.structureNumber}>3</span>
              {content.sections.emailStructure.conclusion.title}
            </h4>
            <ul className={styles.structureList}>
              {content.sections.emailStructure.conclusion.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Section: Scoring */}
      <Card title={content.sections.scoring.title}>
        <div className={styles.criteriaGrid}>
          {content.sections.scoring.criteria.map((criterion, index) => (
            <div key={index} className={styles.criteriaItem}>
              <h4 className={styles.criteriaName}>
                <CheckCircle size={16} />
                {criterion.name}
              </h4>
              <p className={styles.criteriaDescription}>{criterion.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Section: Common Mistakes */}
      <Card title={content.sections.commonMistakes.title}>
        <div className={styles.mistakesList}>
          {content.sections.commonMistakes.mistakes.map((item, index) => (
            <div key={index} className={styles.mistakeItem}>
              <div className={styles.mistakeHeader}>
                <AlertTriangle size={16} />
                <span className={styles.mistakeText}>{item.mistake}</span>
              </div>
              <div className={styles.mistakeFix}>
                <CheckCircle size={14} />
                <span>{item.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Section: Final Checklist */}
      <Card title={content.sections.finalChecklist.title}>
        <div className={styles.checklistGrid}>
          {content.sections.finalChecklist.items.map((section, index) => (
            <div key={index} className={styles.checklistSection}>
              <h4 className={styles.checklistCategory}>{section.category}</h4>
              <ul className={styles.checklistItems}>
                {section.checks.map((check, checkIndex) => (
                  <li key={checkIndex}>
                    <CheckCircle size={14} />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA Section */}
      <Card>
        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>{content.sections.callToAction.text}</p>
          <Button onClick={() => router.push(content.sections.callToAction.buttonLink)}>
            {content.sections.callToAction.buttonText} <ArrowRight size={16} />
          </Button>
        </div>
      </Card>
    </div>
  );
}
