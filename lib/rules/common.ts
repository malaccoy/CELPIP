/**
 * Common rule functions shared between Task 1 and Task 2
 */

export interface Issue {
  code: string;
  message: string;
  severity: 'blocker' | 'important' | 'polish';
}

export interface Suggestion {
  code: string;
  message: string;
}

export interface RuleResult {
  issues: Issue[];
  suggestions: Suggestion[];
  penalty: number;
}

// List of common contractions to check for
const CONTRACTIONS = [
  "don't", "can't", "won't", "shouldn't", "wouldn't", "couldn't", "haven't",
  "hasn't", "hadn't", "isn't", "aren't", "wasn't", "weren't", "didn't",
  "doesn't", "i'm", "i've", "i'll", "i'd", "you're", "you've", "you'll",
  "you'd", "he's", "she's", "it's", "we're", "we've", "we'll", "we'd",
  "they're", "they've", "they'll", "they'd", "that's", "there's", "here's",
  "what's", "who's", "let's"
];

// Common connectors for ordered arguments
const CONNECTORS = [
  'first', 'firstly', 'second', 'secondly', 'third', 'thirdly',
  'finally', 'lastly', 'additionally', 'moreover', 'furthermore',
  'in addition', 'on top of that', 'another reason', 'one more thing'
];

/**
 * Check for contractions in text (formal writing should avoid these)
 */
export function checkContractions(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const foundContractions = CONTRACTIONS.filter(c => lowerText.includes(c));

  if (foundContractions.length > 0) {
    issues.push({
      code: 'CONTRACTIONS_FOUND',
      message: `Avoid contractions in formal writing. Found: ${foundContractions.join(', ')}`,
      severity: 'polish'
    });
    suggestions.push({
      code: 'EXPAND_CONTRACTIONS',
      message: `Expand contractions: don't → do not, can't → cannot, I'm → I am, etc.`
    });
    penalty = Math.min(foundContractions.length * 0.5, 2);
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for ordering connectors in the text
 */
export function checkConnectors(text: string, minRequired: number = 2): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const foundConnectors = CONNECTORS.filter(c => lowerText.includes(c));

  if (foundConnectors.length < minRequired) {
    issues.push({
      code: 'MISSING_CONNECTORS',
      message: `Use ordering connectors to structure your arguments. Found ${foundConnectors.length}, recommended at least ${minRequired}.`,
      severity: 'important'
    });
    suggestions.push({
      code: 'ADD_CONNECTORS',
      message: 'Use connectors like "First,", "Second,", "Finally," to organize your points.'
    });
    penalty = 1;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check word count is within expected range
 */
export function checkWordCount(text: string, min: number, max: number): RuleResult {
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  if (wordCount < min) {
    issues.push({
      code: 'TOO_SHORT',
      message: `Text is too short. Word count: ${wordCount}, minimum recommended: ${min}`,
      severity: 'important'
    });
    suggestions.push({
      code: 'ADD_DETAILS',
      message: 'Add more details, examples, or explanations to meet the word count.'
    });
    penalty = 1;
  } else if (wordCount > max) {
    issues.push({
      code: 'TOO_LONG',
      message: `Text may be too long. Word count: ${wordCount}, maximum recommended: ${max}`,
      severity: 'polish'
    });
    suggestions.push({
      code: 'REDUCE_LENGTH',
      message: 'Consider removing redundant phrases or being more concise.'
    });
    penalty = 0.5;
  }

  return { issues, suggestions, penalty };
}

/**
 * Check for generic "please let me know if" phrase
 */
export function checkGenericPleaseLetMeKnow(text: string): RuleResult {
  const lowerText = text.toLowerCase();
  const issues: Issue[] = [];
  const suggestions: Suggestion[] = [];
  let penalty = 0;

  // Check for very generic/template-like closings
  const genericPatterns = [
    'please let me know if you have any questions',
    'please let me know if you need any further information',
    'please let me know if you require any further information'
  ];

  const hasGenericClosing = genericPatterns.some(p => lowerText.includes(p));

  if (hasGenericClosing) {
    issues.push({
      code: 'GENERIC_CLOSING',
      message: 'The closing phrase is too generic. Try to make it more specific to the context.',
      severity: 'polish'
    });
    suggestions.push({
      code: 'PERSONALIZE_CLOSING',
      message: 'Personalize your closing: "Please let me know when would be a convenient time to discuss this" or "I look forward to hearing your decision."'
    });
    penalty = 0.5;
  }

  return { issues, suggestions, penalty };
}
