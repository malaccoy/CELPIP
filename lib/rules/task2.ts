/**
 * Task 2 specific rules for survey response evaluation
 */

import { Issue, Suggestion, RuleResult } from './common';

/**
 * Check for forbidden "Option A" or "Option B" references
 */
export function checkOptionReferences(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const forbiddenPatterns = [
    'option a', 'option b', 'option 1', 'option 2',
    'first option', 'second option', 'choose option',
    'select option', 'pick option'
  ];

  const foundReferences = forbiddenPatterns.filter(p => lowerText.includes(p));

  if (foundReferences.length > 0) {
    issues.push({
      code: 'OPTION_REFERENCE',
      message: `Do NOT use "Option A" or "Option B" in your response. Found: ${foundReferences.join(', ')}`,
      severity: 'blocker'
    });
    suggestions.push({
      code: 'USE_TOPIC_NAME',
      message: 'Refer to the topic directly instead of saying "Option A/B". Example: Instead of "I prefer Option A", say "I believe building a new park would be beneficial"'
    });
    penalty = 3;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for clear opinion statement in introduction
 */
export function checkOpinionStatement(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const opinionIndicators = [
    'in my opinion', 'i believe', 'i think', 'i strongly believe',
    'i am convinced', 'i feel that', 'i would recommend', 'i suggest',
    'i would rather', 'i prefer', 'i support', 'i agree', 'i disagree'
  ];

  const hasOpinion = opinionIndicators.some(indicator => lowerText.includes(indicator));

  if (!hasOpinion) {
    issues.push({
      code: 'MISSING_OPINION',
      message: 'The introduction must clearly state your opinion/position',
      severity: 'blocker'
    });
    suggestions.push({
      code: 'ADD_OPINION',
      message: 'Start with a clear opinion: "In my opinion, ...", "I believe that...", or "I strongly recommend..."'
    });
    penalty = 2;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for conclusion paragraph
 */
export function checkConclusion(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const conclusionIndicators = [
    'in conclusion', 'to conclude', 'to sum up', 'to summarize',
    'in summary', 'all in all', 'overall', 'therefore, i believe',
    'for these reasons', 'considering all', 'taking everything into account'
  ];

  const hasConclusion = conclusionIndicators.some(indicator => lowerText.includes(indicator));

  if (!hasConclusion) {
    issues.push({
      code: 'MISSING_CONCLUSION',
      message: 'The response should have a conclusion paragraph',
      severity: 'important'
    });
    suggestions.push({
      code: 'ADD_CONCLUSION',
      message: 'Add a conclusion starting with: "In conclusion, ..." or "To sum up, ..." that restates your opinion'
    });
    penalty = 1.5;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for examples in arguments
 */
export function checkExamples(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const exampleIndicators = [
    'for example', 'for instance', 'such as', 'like when',
    'in my experience', 'i have seen', 'i once', 'last year',
    'a good example', 'to illustrate', 'specifically'
  ];

  const foundExamples = exampleIndicators.filter(indicator => lowerText.includes(indicator));

  if (foundExamples.length < 1) {
    issues.push({
      code: 'MISSING_EXAMPLES',
      message: 'Use concrete examples to support your arguments',
      severity: 'important'
    });
    suggestions.push({
      code: 'ADD_EXAMPLES',
      message: 'Add examples: "For example, ...", "For instance, ...", or share a personal experience'
    });
    penalty = 1;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for reasons/explanations in arguments
 */
export function checkReasons(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const reasonIndicators = [
    'because', 'since', 'as a result', 'therefore', 'thus',
    'consequently', 'due to', 'owing to', 'the reason is',
    'this is why', 'that is why', 'this means', 'which means'
  ];

  const foundReasons = reasonIndicators.filter(indicator => lowerText.includes(indicator));

  if (foundReasons.length < 2) {
    issues.push({
      code: 'INSUFFICIENT_REASONING',
      message: 'Provide clear reasons to support your points',
      severity: 'important'
    });
    suggestions.push({
      code: 'ADD_REASONS',
      message: 'Explain why: "This is because...", "The reason is...", or "As a result of this..."'
    });
    penalty = 1;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for rhetorical questions (discouraged in CELPIP Task 2)
 */
export function checkRhetoricalQuestions(text: string): RuleResult {
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  // Count question marks
  const questionMarks = (text.match(/\?/g) || []).length;

  if (questionMarks > 0) {
    issues.push({
      code: 'RHETORICAL_QUESTIONS',
      message: `Avoid using rhetorical questions in Task 2. Found ${questionMarks} question(s).`,
      severity: 'polish'
    });
    suggestions.push({
      code: 'REMOVE_QUESTIONS',
      message: 'Convert questions to statements. Instead of "Why is this good?" write "This is beneficial because..."'
    });
    penalty = questionMarks * 0.3;
  }

  return { issues, suggestions, penalty };
}
