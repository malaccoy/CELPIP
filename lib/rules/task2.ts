/**
 * Task 2 specific rules for survey response evaluation
 */

import { Issue, Suggestion, RuleResult } from './common';

// Configuration constants
const MIN_REQUIRED_REASONS = 2;

// PRE Structure indicators
const POINT_INDICATORS = [
  'first', 'firstly', 'second', 'secondly', 'third', 'thirdly',
  'finally', 'lastly', 'one reason', 'another reason', 'the main reason',
  'additionally', 'moreover', 'furthermore', 'one benefit', 'another benefit',
  'one advantage', 'another advantage'
];

const REASON_INDICATORS = [
  'because', 'since', 'as', 'due to', 'owing to', 'the reason is',
  'this is because', 'this is due to', 'this would', 'this will',
  'this can', 'this could', 'this helps', 'this allows', 'this means'
];

const EXAMPLE_INDICATORS = [
  'for example', 'for instance', 'such as', 'like when', 'specifically',
  'in my experience', 'i have seen', 'i once', 'last year', 'last month',
  'a good example', 'to illustrate', 'in my neighborhood', 'in my city',
  'according to', 'studies show', 'research shows', 'statistics show'
];

// Conclusion indicators
const CONCLUSION_INDICATORS = [
  'in conclusion', 'to conclude', 'to sum up', 'to summarize',
  'in summary', 'all in all', 'overall', 'therefore, i believe',
  'for these reasons', 'considering all', 'taking everything into account',
  'based on these points', 'given these reasons', 'in light of this'
];

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

  if (foundReasons.length < MIN_REQUIRED_REASONS) {
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

/**
 * Check for complete PRE structure (Point + Reason + Example for each argument)
 */
export function checkPREStructure(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  // Count each component
  const points = POINT_INDICATORS.filter(p => lowerText.includes(p)).length;
  const reasons = REASON_INDICATORS.filter(r => lowerText.includes(r)).length;
  const examples = EXAMPLE_INDICATORS.filter(e => lowerText.includes(e)).length;

  // Ideal: at least 2 of each for a well-structured response
  const hasGoodPoints = points >= 2;
  const hasGoodReasons = reasons >= 2;
  const hasGoodExamples = examples >= 1;

  // Calculate PRE score
  const preScore = (hasGoodPoints ? 1 : 0) + (hasGoodReasons ? 1 : 0) + (hasGoodExamples ? 1 : 0);

  if (preScore === 0) {
    issues.push({
      code: 'MISSING_PRE_STRUCTURE',
      message: 'Your response lacks the PRE structure (Point-Reason-Example)',
      severity: 'blocker'
    });
    suggestions.push({
      code: 'ADD_PRE_STRUCTURE',
      message: 'Structure each argument as: Point ("First,...") → Reason ("This is because...") → Example ("For example,...")'
    });
    penalty = 2.5;
  } else if (preScore === 1) {
    issues.push({
      code: 'WEAK_PRE_STRUCTURE',
      message: 'Your PRE structure is incomplete. Make sure each argument has a Point, Reason, AND Example.',
      severity: 'important'
    });
    suggestions.push({
      code: 'COMPLETE_PRE',
      message: 'Add more connectors (First/Second), explanations (because/since), and examples (For example/For instance)'
    });
    penalty = 1.5;
  } else if (preScore === 2) {
    // Minor issue - just a polish suggestion
    if (!hasGoodExamples) {
      suggestions.push({
        code: 'ADD_MORE_EXAMPLES',
        message: 'Consider adding more specific examples to strengthen your arguments.'
      });
      penalty = 0.5;
    }
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for fence-sitting (not taking a clear side)
 */
export function checkFenceSitting(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const fenceSittingIndicators = [
    'both options', 'both sides', 'either option', 'both are good',
    'both have merit', 'it depends', 'hard to choose', 'difficult to decide',
    'on one hand', 'on the other hand', 'advantages and disadvantages of both'
  ];

  const foundFenceSitting = fenceSittingIndicators.filter(f => lowerText.includes(f));

  if (foundFenceSitting.length >= 2) {
    issues.push({
      code: 'FENCE_SITTING',
      message: 'You seem undecided. Take a clear position and defend it strongly.',
      severity: 'blocker'
    });
    suggestions.push({
      code: 'PICK_A_SIDE',
      message: 'Choose ONE option and argue for it. You can briefly acknowledge the other side, but your position must be clear.'
    });
    penalty = 2;
  } else if (foundFenceSitting.length === 1) {
    issues.push({
      code: 'SLIGHT_FENCE_SITTING',
      message: 'Make sure your position is clear. Avoid appearing undecided.',
      severity: 'polish'
    });
    penalty = 0.5;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for proper conclusion format (restating opinion + summarizing points)
 */
export function checkConclusionQuality(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  // First check if conclusion exists
  const hasConclusion = CONCLUSION_INDICATORS.some(c => lowerText.includes(c));
  
  if (!hasConclusion) {
    // Already handled by checkConclusion
    return { issues, suggestions, penalty: 0 };
  }

  // Find the conclusion section (text after conclusion indicator)
  let conclusionStart = -1;
  for (const indicator of CONCLUSION_INDICATORS) {
    const idx = lowerText.indexOf(indicator);
    if (idx !== -1 && (conclusionStart === -1 || idx < conclusionStart)) {
      conclusionStart = idx;
    }
  }

  if (conclusionStart !== -1) {
    const conclusionText = lowerText.substring(conclusionStart);
    
    // Check if conclusion restates opinion
    const opinionInConclusion = [
      'i believe', 'i think', 'i recommend', 'i support', 'i prefer',
      'is the best', 'is better', 'should be', 'would be beneficial'
    ].some(o => conclusionText.includes(o));

    // Check if conclusion is too short (less than ~20 words)
    const conclusionWords = conclusionText.split(/\s+/).length;

    if (!opinionInConclusion) {
      issues.push({
        code: 'CONCLUSION_NO_OPINION',
        message: 'Your conclusion should restate your opinion/position',
        severity: 'polish'
      });
      suggestions.push({
        code: 'RESTATE_OPINION',
        message: 'In your conclusion, restate your position: "In conclusion, I firmly believe that..."'
      });
      penalty = 0.5;
    }

    if (conclusionWords < 15) {
      issues.push({
        code: 'CONCLUSION_TOO_SHORT',
        message: 'Your conclusion is too brief. Summarize your main points.',
        severity: 'polish'
      });
      suggestions.push({
        code: 'EXPAND_CONCLUSION',
        message: 'Mention your key reasons: "In conclusion, [opinion] because [point 1], [point 2], and [point 3]."'
      });
      penalty = 0.5;
    }
  }

  return { issues, suggestions, penalty };
}
