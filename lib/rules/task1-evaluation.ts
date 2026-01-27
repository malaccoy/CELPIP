/**
 * Task 1 Email Writing Evaluation Engine
 * 
 * Rule-based (no AI) evaluation for CELPIP Task 1 email writing.
 * Returns structured feedback with explicit, actionable errors, warnings, and suggestions.
 */

import {
  parseTask1Prompt,
  isBulletCovered,
  truncateBullet,
  type ParsedTask1Prompt,
} from './task1-prompt';

// Re-export for external use
export { parseTask1Prompt, type ParsedTask1Prompt };

// ============================================================
// Types
// ============================================================

export type EvaluationLevel = 'weak' | 'ok' | 'strong';

export interface Task1EvaluationResult {
  score: number;         // 0–12 CELPIP scale
  level: EvaluationLevel;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  wordCount: number;
  /** Parsed bullets from promptText (if provided) */
  parsedBullets?: string[];
  /** Detected audience from promptText (if provided) */
  audienceHint?: string;
}

export interface Task1EvaluationOptions {
  /** Raw CELPIP prompt text to parse for bullets */
  promptText?: string;
  /** Optional override if UI provides extracted bullets directly */
  bullets?: string[];
  /** Questions from the prompt (backward compatibility) */
  questions?: string[];
}

// ============================================================
// Constants
// ============================================================

const MIN_WORD_COUNT = 150;
const MAX_WORD_COUNT = 200;
const MAX_SCORE = 12;
const ERROR_PENALTY = 3;
const WARNING_PENALTY = 1;
// Note: MIN_KEYWORD_LENGTH = 2 is used for legacy question coverage
// The new task1-prompt.ts uses MIN_KEYWORD_LENGTH = 4 for more precise bullet matching
const MIN_KEYWORD_LENGTH = 2;
const MIN_CONNECTORS_FOR_POSITIVE = 2;
const MAX_CONNECTORS_TO_DISPLAY = 3;

// Common stop words to exclude from question keyword matching
// Note: task1-prompt.ts has its own STOPWORDS set optimized for bullet matching
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'can', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
  'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'just', 'and', 'but', 'if', 'or', 'because', 'until', 'while', 'what',
  'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'it',
  'its', 'your', 'you', 'they', 'them', 'their', 'we', 'us', 'our', 'i',
  'me', 'my', 'he', 'him', 'his', 'she', 'her', '?'
]);

// Valid opening patterns (case-insensitive)
const OPENING_PATTERNS = [
  /^\s*dear\s+/i,
  /^\s*to\s+whom\s+it\s+may\s+concern/i,
];

// Valid closing patterns (case-insensitive)
const CLOSING_KEYWORDS = [
  'sincerely',
  'regards',
  'kind regards',
  'yours faithfully',
  'yours sincerely',
  'best regards',
  'warm regards',
  'respectfully',
];

// Purpose clarity keywords (first paragraph)
const PURPOSE_KEYWORDS = [
  'i am writing to',
  'i\'m writing to',
  'i would like to',
  'i\'d like to',
  'this email is regarding',
  'this email is to',
  'the purpose of this email',
  'the purpose of this letter',
];

// Connector keywords for structured arguments
const CONNECTOR_KEYWORDS = [
  'firstly',
  'secondly',
  'thirdly',
  'moreover',
  'additionally',
  'finally',
  'furthermore',
  'in addition',
  'first of all',
  'first,',
  'second,',
  'third,',
  'lastly',
];

// CTA / Request keywords
const CTA_KEYWORDS = [
  'i would appreciate',
  'i\'d appreciate',
  'i kindly ask',
  'please let me know',
  'i look forward',
  'i would be grateful',
  'i\'d be grateful',
  'please contact',
  'please respond',
  'please advise',
  'i request',
  'i hope to hear',
  'awaiting your',
];

// Common contractions with their full forms for formal writing warnings
// Key: contraction pattern (lowercase), Value: suggested full form
const CONTRACTIONS_MAP: Record<string, string> = {
  "don't": "do not",
  "can't": "cannot",
  "won't": "will not",
  "i'm": "I am",
  "it's": "it is",
  "you're": "you are",
  "we've": "we have",
  "they've": "they have",
  "i'd": "I would/had",
  "we'll": "we will",
  "isn't": "is not",
  "aren't": "are not",
  "didn't": "did not",
  "doesn't": "does not",
  "couldn't": "could not",
  "shouldn't": "should not",
  "would've": "would have",
  "could've": "could have",
  "should've": "should have",
  "must've": "must have",
  "might've": "might have",
  "i've": "I have",
  "you've": "you have",
  "he's": "he is/has",
  "she's": "she is/has",
  "that's": "that is",
  "there's": "there is",
  "here's": "here is",
  "what's": "what is",
  "who's": "who is/has",
  "let's": "let us",
  "wasn't": "was not",
  "weren't": "were not",
  "haven't": "have not",
  "hasn't": "has not",
  "hadn't": "had not",
  "wouldn't": "would not",
  "you'd": "you would/had",
  "he'd": "he would/had",
  "she'd": "she would/had",
  "we'd": "we would/had",
  "they'd": "they would/had",
  "i'll": "I will",
  "you'll": "you will",
  "he'll": "he will",
  "she'll": "she will",
  "they'll": "they will",
  "we're": "we are",
  "they're": "they are",
};

// Regex pattern to match contractions with word boundaries
// Dynamically generated from CONTRACTIONS_MAP keys to avoid duplication
// Uses word boundary \b to avoid matching partial words or possessives
const CONTRACTION_REGEX = new RegExp(
  '\\b(' + Object.keys(CONTRACTIONS_MAP).join('|') + ')\\b',
  'gi'
);

// ============================================================
// Helper Functions
// ============================================================

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Get the first paragraph (non-empty text before second line break or first 2 sentences)
 */
function getFirstParagraph(text: string): string {
  const lines = text.split(/\n\n+/);
  // Skip the opening line if it starts with "Dear"
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0 && !OPENING_PATTERNS.some(p => p.test(trimmed))) {
      return trimmed.toLowerCase();
    }
  }
  return '';
}

/**
 * Map score to level
 */
function getLevel(score: number): EvaluationLevel {
  if (score <= 5) return 'weak';
  if (score <= 8) return 'ok';
  return 'strong';
}

// ============================================================
// Rule Implementations
// ============================================================

/**
 * Rule 1: Word Count
 * - If wordCount < 150 → error
 * - If wordCount > 200 → warning
 * - If 150–200 → ok
 */
function checkWordCount(wordCount: number): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (wordCount < MIN_WORD_COUNT) {
    errors.push(
      `Word count is ${wordCount}, which is below the minimum of ${MIN_WORD_COUNT}. ` +
      `Add ${MIN_WORD_COUNT - wordCount} more words to meet the requirement.`
    );
  } else if (wordCount > MAX_WORD_COUNT) {
    warnings.push(
      `Word count is ${wordCount}, which exceeds the recommended maximum of ${MAX_WORD_COUNT}. ` +
      `Consider removing ${wordCount - MAX_WORD_COUNT} words for conciseness.`
    );
  }

  return { errors, warnings };
}

/**
 * Rule 2: Opening Line
 * Must start with a valid opening such as "Dear" or "To whom it may concern"
 */
function checkOpening(text: string): { errors: string[] } {
  const errors: string[] = [];
  const hasValidOpening = OPENING_PATTERNS.some(pattern => pattern.test(text));

  if (!hasValidOpening) {
    errors.push(
      'Email must start with a proper opening. ' +
      'Use "Dear [Name/Title]," or "To whom it may concern," at the beginning.'
    );
  }

  return { errors };
}

/**
 * Rule 3: Closing Line
 * Must contain a valid closing such as "Sincerely", "Regards", etc.
 */
function checkClosing(text: string): { errors: string[] } {
  const errors: string[] = [];
  const lowerText = text.toLowerCase();
  const hasValidClosing = CLOSING_KEYWORDS.some(keyword => lowerText.includes(keyword));

  if (!hasValidClosing) {
    errors.push(
      'Email must end with a proper closing. ' +
      'Add "Sincerely,", "Regards,", "Kind regards,", or "Yours faithfully," before your name.'
    );
  }

  return { errors };
}

/**
 * Rule 4: Purpose Clarity
 * First paragraph must contain intent keywords
 */
function checkPurposeClarity(text: string): { warnings: string[] } {
  const warnings: string[] = [];
  const firstParagraph = getFirstParagraph(text);
  const hasPurpose = PURPOSE_KEYWORDS.some(keyword => firstParagraph.includes(keyword));

  if (!hasPurpose) {
    warnings.push(
      'The purpose of your email is unclear. ' +
      'Add a clear intent statement in your first paragraph, such as "I am writing to...", ' +
      '"I would like to...", or "This email is regarding...".'
    );
  }

  return { warnings };
}

/**
 * Rule 5: Question Coverage
 * Each question from the prompt must be addressed at least once
 */
function checkQuestionCoverage(text: string, questions: string[]): { errors: string[] } {
  const errors: string[] = [];
  const lowerText = text.toLowerCase();

  // Filter out empty questions
  const validQuestions = questions.filter(q => q && q.trim().length > 0);

  for (const question of validQuestions) {
    const lowerQuestion = question.toLowerCase().trim();
    
    // Extract meaningful keywords from the question (excluding stop words)
    const keywords = lowerQuestion
      .replace(/[?.,!;:'"]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > MIN_KEYWORD_LENGTH && !STOP_WORDS.has(word));

    // Check if at least one keyword from the question appears in the text
    const isAddressed = keywords.some(keyword => lowerText.includes(keyword));

    if (!isAddressed && keywords.length > 0) {
      errors.push(
        `Question not addressed: "${question}". ` +
        `Make sure to answer this question in your email.`
      );
    }
  }

  return { errors };
}

/**
 * Rule 5b: Bullet Coverage (for parsed prompts)
 * Each bullet from the parsed prompt must be addressed using keyword matching
 * with synonym support.
 */
function checkBulletCoverage(text: string, bullets: string[]): { errors: string[] } {
  const errors: string[] = [];

  // Filter out empty bullets
  const validBullets = bullets.filter(b => b && b.trim().length > 0);
  const missingBullets: string[] = [];

  for (const bullet of validBullets) {
    if (!isBulletCovered(bullet, text)) {
      missingBullets.push(truncateBullet(bullet, 90));
    }
  }

  // If any bullets not covered, add a single consolidated error
  if (missingBullets.length > 0) {
    errors.push(
      `Missing required item(s): ${missingBullets.join('; ')}`
    );
  }

  return { errors };
}

/**
 * Rule 6: Connectors (Quality Boost)
 * Count usage of connectors like "Firstly", "Secondly", etc.
 */
function checkConnectors(text: string): { suggestions: string[] } {
  const suggestions: string[] = [];
  const lowerText = text.toLowerCase();
  
  const foundConnectors = CONNECTOR_KEYWORDS.filter(keyword => lowerText.includes(keyword));
  const connectorCount = foundConnectors.length;

  if (connectorCount === 0) {
    suggestions.push(
      'Use ordering connectors to structure your email better. ' +
      'Consider adding "Firstly,", "Secondly,", "Moreover,", "Additionally,", or "Finally," ' +
      'to organize your points clearly.'
    );
  } else if (connectorCount >= MIN_CONNECTORS_FOR_POSITIVE) {
    suggestions.push(
      `Good use of connectors (${foundConnectors.slice(0, MAX_CONNECTORS_TO_DISPLAY).join(', ')}). ` +
      'This helps structure your email clearly.'
    );
  }

  return { suggestions };
}

/**
 * Rule 7: CTA / Request (Quality)
 * Look for phrases like "I would appreciate", "Please let me know"
 */
function checkCTA(text: string): { suggestions: string[] } {
  const suggestions: string[] = [];
  const lowerText = text.toLowerCase();
  
  const hasCTA = CTA_KEYWORDS.some(keyword => lowerText.includes(keyword));

  if (!hasCTA) {
    suggestions.push(
      'Consider adding a clear call-to-action or request. ' +
      'For example: "I would appreciate your assistance with this matter," ' +
      '"I kindly ask for your consideration," or "Please let me know if you need any further information."'
    );
  }

  return { suggestions };
}

/**
 * Rule 8: Contraction Detection
 * Detect contractions in formal email writing and warn the user.
 * Returns a warning with deduplicated contractions and suggests full forms.
 */
function checkContractions(text: string): { warnings: string[] } {
  const warnings: string[] = [];
  
  // Find all contractions using regex with word boundaries
  const matches = text.match(CONTRACTION_REGEX);
  
  if (matches && matches.length > 0) {
    // Deduplicate and normalize to lowercase for consistent display
    const uniqueContractions = [...new Set(matches.map(m => m.toLowerCase()))];
    
    // Build examples of full forms for up to 3 contractions
    const examples = uniqueContractions
      .slice(0, 3)
      .map(c => `${c} → ${CONTRACTIONS_MAP[c]}`)
      .join(', ');
    
    warnings.push(
      `Contractions detected: ${uniqueContractions.join(', ')}. ` +
      `In formal writing, use the full form instead (e.g., ${examples}).`
    );
  }

  return { warnings };
}

// ============================================================
// Main Evaluation Function
// ============================================================

/**
 * Evaluate Task 1 (Email Writing) text using deterministic rules.
 * 
 * Coverage Priority:
 * 1. options.bullets if provided and non-empty
 * 2. else if options.promptText provided, parse and use bullets
 * 3. else fallback to options.questions if provided
 * 4. else no coverage check
 * 
 * @param text - The email text to evaluate
 * @param options - Optional configuration including bullets, promptText, or questions
 * @returns Structured evaluation result with score, level, and feedback
 */
export function evaluateTask1Email(
  text: string,
  options: Task1EvaluationOptions = {}
): Task1EvaluationResult {
  const { bullets, promptText, questions = [] } = options;
  
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Variables to track parsed prompt info
  let parsedBullets: string[] | undefined;
  let audienceHint: string | undefined;

  // Calculate word count
  const wordCount = countWords(text);

  // Rule 1: Word Count
  const wordCountResult = checkWordCount(wordCount);
  errors.push(...wordCountResult.errors);
  warnings.push(...wordCountResult.warnings);

  // Rule 2: Opening Line
  const openingResult = checkOpening(text);
  errors.push(...openingResult.errors);

  // Rule 3: Closing Line
  const closingResult = checkClosing(text);
  errors.push(...closingResult.errors);

  // Rule 4: Purpose Clarity
  const purposeResult = checkPurposeClarity(text);
  warnings.push(...purposeResult.warnings);

  // Rule 5: Coverage Check (bullets > promptText > questions)
  // Priority 1: Use directly provided bullets
  if (bullets && bullets.length > 0) {
    parsedBullets = bullets;
    const bulletResult = checkBulletCoverage(text, bullets);
    errors.push(...bulletResult.errors);
  }
  // Priority 2: Parse promptText and use extracted bullets
  else if (promptText && promptText.trim().length > 0) {
    const parsed = parseTask1Prompt(promptText);
    parsedBullets = parsed.bullets.length > 0 ? parsed.bullets : undefined;
    audienceHint = parsed.audienceHint;
    
    if (parsed.bullets.length > 0) {
      const bulletResult = checkBulletCoverage(text, parsed.bullets);
      errors.push(...bulletResult.errors);
    }
  }
  // Priority 3: Fallback to questions (backward compatibility)
  else if (questions.length > 0) {
    const questionResult = checkQuestionCoverage(text, questions);
    errors.push(...questionResult.errors);
  }
  // Priority 4: No coverage check if nothing provided

  // Rule 6: Connectors
  const connectorResult = checkConnectors(text);
  suggestions.push(...connectorResult.suggestions);

  // Rule 7: CTA / Request
  const ctaResult = checkCTA(text);
  suggestions.push(...ctaResult.suggestions);

  // Rule 8: Contraction Detection
  const contractionResult = checkContractions(text);
  warnings.push(...contractionResult.warnings);

  // Calculate score
  // Start from 12, subtract 3 for each error, 1 for each warning
  let score = MAX_SCORE;
  score -= errors.length * ERROR_PENALTY;
  score -= warnings.length * WARNING_PENALTY;
  
  // Ensure minimum score of 0
  score = Math.max(0, score);

  // Determine level
  const level = getLevel(score);

  return {
    score,
    level,
    errors,
    warnings,
    suggestions,
    wordCount,
    parsedBullets,
    audienceHint,
  };
}
