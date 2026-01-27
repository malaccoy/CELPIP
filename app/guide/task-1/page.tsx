'use client';

import { useRouter } from 'next/navigation';
import { Card, Button } from '@/components/Common';
import { task1GuideContent } from '@content/pt/task1-guide';
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Lightbulb, BookOpen, Sparkles } from 'lucide-react';
import styles from '@/styles/Guide.module.scss';

export default function Task1GuidePage() {
  const router = useRouter();
  const content = task1GuideContent;

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

      {/* Section: What is Task 1 */}
      <Card title={content.sections.whatIsTask1.title}>
        <ul className={styles.contentList}>
          {content.sections.whatIsTask1.content.map((item, index) => (
            <li key={index} className={styles.contentItem}>{item}</li>
          ))}
        </ul>
        <div className={styles.tipBox}>
          <Lightbulb size={16} />
          <span>{content.sections.whatIsTask1.tip}</span>
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

      {/* Section: Mandatory Elements */}
      <Card title={content.sections.mandatoryElements.title}>
        <p className={styles.sectionSubtitle}>{content.sections.mandatoryElements.subtitle}</p>
        <div className={styles.elementsGrid}>
          {content.sections.mandatoryElements.elements.map((element, index) => (
            <div key={index} className={styles.elementCard}>
              <div className={styles.elementHeader}>
                <span className={styles.elementNumber}>{index + 1}</span>
                <h4 className={styles.elementName}>{element.name}</h4>
              </div>
              <p className={styles.elementDescription}>{element.description}</p>
              <div className={styles.elementExample}>
                <code>{element.example}</code>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Section: Structure */}
      <Card title={content.sections.structure.title}>
        <div className={styles.structureGrid}>
          <div className={styles.structureBlock}>
            <h4 className={styles.structureBlockTitle}>
              <span className={styles.structureNumber}>1</span>
              {content.sections.structure.introduction.title}
            </h4>
            <ul className={styles.structureList}>
              {content.sections.structure.introduction.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className={styles.structureBlock}>
            <h4 className={styles.structureBlockTitle}>
              <span className={styles.structureNumber}>2</span>
              {content.sections.structure.body.title}
            </h4>
            <ul className={styles.structureList}>
              {content.sections.structure.body.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className={styles.structureBlock}>
            <h4 className={styles.structureBlockTitle}>
              <span className={styles.structureNumber}>3</span>
              {content.sections.structure.closing.title}
            </h4>
            <ul className={styles.structureList}>
              {content.sections.structure.closing.points.map((point, index) => (
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

        <div className={styles.keyTipsSection}>
          <h4 className={styles.keyTipsTitle}>
            <BookOpen size={16} />
            Dicas Importantes
          </h4>
          <ul className={styles.keyTipsList}>
            {content.sections.scoring.keyTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
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

      {/* Section: How This Site Helps */}
      <Card title={content.sections.howThisSiteHelps.title}>
        <div className={styles.featuresGrid}>
          {content.sections.howThisSiteHelps.features.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <h4 className={styles.featureTitle}>{feature.title}</h4>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>{content.sections.howThisSiteHelps.callToAction.text}</p>
          <Button onClick={() => router.push(content.sections.howThisSiteHelps.callToAction.buttonLink)}>
            {content.sections.howThisSiteHelps.callToAction.buttonText} <ArrowRight size={16} />
          </Button>
        </div>
      </Card>
    </div>
  );
}
