/**
 * Rules module for CELPIP writing evaluation
 * Exports all rule functions for Task 1 and Task 2
 */

export * from './common';
export * from './task1';
export * from './task2';
export * from './task1-evaluation';

import { 
  Issue, 
  Suggestion, 
  checkContractions, 
  checkConnectors, 
  checkWordCount,
  checkGenericPleaseLetMeKnow
} from './common';

import {
  checkDearOpening,
  checkWhoAmI,
  checkWhyWriting,
  checkRegardsAndName,
  checkIntroduction
} from './task1';

import {
  checkOptionReferences,
  checkOpinionStatement,
  checkConclusion,
  checkExamples,
  checkReasons,
  checkRhetoricalQuestions
} from './task2';

export interface EvaluationContext {
  formality?: 'formal' | 'semi-formal';
  [key: string]: unknown;
}

export interface EvaluationResult {
  scoreEstimate: number;
  issues: Issue[];
  suggestions: Suggestion[];
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
    checkConnectors(text, 2),
    checkWordCount(text, 150, 200),
    checkGenericPleaseLetMeKnow(text)
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

  // Calculate score estimate (starting from 12, which is the max CELPIP score)
  const scoreEstimate = Math.max(4, Math.round((12 - totalPenalty) * 10) / 10);

  return {
    scoreEstimate,
    issues,
    suggestions
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
    checkConnectors(text, 2),
    checkExamples(text),
    checkReasons(text),
    checkRhetoricalQuestions(text),
    checkContractions(text),
    checkWordCount(text, 150, 200)
  ];

  // Aggregate results
  for (const result of rules) {
    issues.push(...result.issues);
    suggestions.push(...result.suggestions);
    totalPenalty += result.penalty;
  }

  // Calculate score estimate
  const scoreEstimate = Math.max(4, Math.round((12 - totalPenalty) * 10) / 10);

  return {
    scoreEstimate,
    issues,
    suggestions
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
