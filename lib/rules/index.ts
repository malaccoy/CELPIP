/**
 * Rules module for CELPIP writing evaluation
 * Exports all rule functions for Task 1 and Task 2
 */

export * from './common';
export * from './task1';
export * from './task2';
export * from './task1-evaluation';
export * from './task1-prompt';

import { 
  Issue, 
  Suggestion, 
  checkContractions, 
  checkConnectors, 
  checkWordCount,
  checkGenericPleaseLetMeKnow,
  checkRepeatedVocabulary
} from './common';

import {
  checkDearOpening,
  checkWhoAmI,
  checkWhyWriting,
  checkRegardsAndName,
  checkIntroduction,
  checkCallToAction,
  checkClosingLine,
  checkParagraphStructure,
  checkToneConsistency
} from './task1';

import {
  checkOptionReferences,
  checkOpinionStatement,
  checkConclusion,
  checkExamples,
  checkReasons,
  checkRhetoricalQuestions,
  checkPREStructure,
  checkFenceSitting,
  checkConclusionQuality
} from './task2';

export interface EvaluationContext {
  formality?: 'formal' | 'semi-formal';
  [key: string]: unknown;
}

export interface EvaluationResult {
  scoreEstimate: number;
  issues: Issue[];
  suggestions: Suggestion[];
  bonuses: string[];
}

/**
 * Calculate bonuses for good practices
 */
function calculateBonuses(text: string, task: 'task1' | 'task2'): { bonuses: string[], bonusScore: number } {
  const lowerText = text.toLowerCase();
  const bonuses: string[] = [];
  let bonusScore = 0;

  // Word count in ideal range (160-190 is optimal)
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount >= 160 && wordCount <= 190) {
    bonuses.push('✨ Contagem de palavras ideal (160-190)');
    bonusScore += 0.3;
  }

  // Good variety of connectors
  const connectors = ['first', 'second', 'third', 'finally', 'additionally', 'moreover', 'furthermore'];
  const usedConnectors = connectors.filter(c => lowerText.includes(c));
  if (usedConnectors.length >= 3) {
    bonuses.push('✨ Excelente uso de conectores');
    bonusScore += 0.3;
  }

  // Specific examples (numbers, names, places)
  const hasSpecificDetails = /\d+%|\d+ years?|\d+ months?|last (year|month|week)|my (friend|neighbor|colleague|cousin)/i.test(text);
  if (hasSpecificDetails) {
    bonuses.push('✨ Exemplos específicos com detalhes');
    bonusScore += 0.3;
  }

  // Task-specific bonuses
  if (task === 'task1') {
    // Check for polite language
    const politeMarkers = ['kindly', 'would appreciate', 'grateful', 'thank you'];
    const usedPolite = politeMarkers.filter(p => lowerText.includes(p));
    if (usedPolite.length >= 2) {
      bonuses.push('✨ Tom educado e profissional');
      bonusScore += 0.2;
    }
  } else {
    // Task 2: Strong opinion words
    const strongOpinion = ['strongly believe', 'firmly believe', 'am convinced', 'without a doubt', 'certainly'];
    if (strongOpinion.some(s => lowerText.includes(s))) {
      bonuses.push('✨ Opinião expressa com confiança');
      bonusScore += 0.2;
    }

    // Good conclusion with summary
    if (lowerText.includes('in conclusion') && (lowerText.includes('because') || lowerText.includes('for these reasons'))) {
      bonuses.push('✨ Conclusão bem estruturada');
      bonusScore += 0.2;
    }
  }

  return { bonuses, bonusScore };
}

/**
 * Evaluate Task 1 (Email) text
 */
export function evaluateTask1(text: string, context: EvaluationContext = {}): EvaluationResult {
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let totalPenalty = 0;

  // Run all Task 1 rules
  const rules = [
    checkDearOpening(text),
    checkWhoAmI(text),
    checkWhyWriting(text),
    checkRegardsAndName(text),
    checkIntroduction(text),
    checkCallToAction(text),
    checkClosingLine(text),
    checkParagraphStructure(text),
    checkToneConsistency(text),
    checkConnectors(text, 2),
    checkWordCount(text, 150, 200),
    checkRepeatedVocabulary(text)
  ];

  // Check contractions only for formal emails
  if (context.formality !== 'semi-formal') {
    rules.push(checkContractions(text));
  }

  // Aggregate results
  for (const result of rules) {
    issues.push(...result.issues);
    suggestions.push(...result.suggestions);
    totalPenalty += result.penalty;
  }

  // Calculate bonuses
  const { bonuses, bonusScore } = calculateBonuses(text, 'task1');

  // Calculate score estimate (starting from 12, max CELPIP score)
  // Apply penalty then add bonus, cap between 4 and 12
  const rawScore = 12 - totalPenalty + bonusScore;
  const scoreEstimate = Math.min(12, Math.max(4, Math.round(rawScore * 10) / 10));

  return {
    scoreEstimate,
    issues,
    suggestions,
    bonuses
  };
}

/**
 * Evaluate Task 2 (Survey Response) text
 */
export function evaluateTask2(text: string, context: EvaluationContext = {}): EvaluationResult {
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let totalPenalty = 0;

  // Run all Task 2 rules
  const rules = [
    checkOptionReferences(text),
    checkOpinionStatement(text),
    checkConclusion(text),
    checkConclusionQuality(text),
    checkPREStructure(text),
    checkFenceSitting(text),
    checkConnectors(text, 2),
    checkExamples(text),
    checkReasons(text),
    checkRhetoricalQuestions(text),
    checkContractions(text),
    checkWordCount(text, 150, 200),
    checkRepeatedVocabulary(text)
  ];

  // Aggregate results
  for (const result of rules) {
    issues.push(...result.issues);
    suggestions.push(...result.suggestions);
    totalPenalty += result.penalty;
  }

  // Calculate bonuses
  const { bonuses, bonusScore } = calculateBonuses(text, 'task2');

  // Calculate score estimate
  const rawScore = 12 - totalPenalty + bonusScore;
  const scoreEstimate = Math.min(12, Math.max(4, Math.round(rawScore * 10) / 10));

  return {
    scoreEstimate,
    issues,
    suggestions,
    bonuses
  };
}

/**
 * Main evaluation function that routes to the appropriate task evaluator
 */
export function evaluate(task: 'task1' | 'task2', text: string, context: EvaluationContext = {}): EvaluationResult {
  if (task === 'task1') {
    return evaluateTask1(text, context);
  } else {
    return evaluateTask2(text, context);
  }
}
