/**
 * Task 1 Email Writing Evaluation Engine
 * 
 * Rule-based (no AI) evaluation for CELPIP Task 1 email writing.
 * Returns structured feedback with explicit, actionable errors, warnings, and suggestions.
 */

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
}

export interface Task1EvaluationOptions {
  questions?: string[];  // Questions from the prompt that must be addressed
}

// ============================================================
// Constants
// ============================================================

const MIN_WORD_COUNT = 150;
const MAX_WORD_COUNT = 200;
const MAX_SCORE = 12;
const ERROR_PENALTY = 3;
const WARNING_PENALTY = 1;

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
    
    // Extract key words from the question (excluding common stop words)
    const stopWords = new Set([
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

    // Extract meaningful keywords from the question
    const keywords = lowerQuestion
      .replace(/[?.,!;:'"]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

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
  } else if (connectorCount >= 2) {
    suggestions.push(
      `Good use of connectors (${foundConnectors.slice(0, 3).join(', ')}). ` +
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

// ============================================================
// Main Evaluation Function
// ============================================================

/**
 * Evaluate Task 1 (Email Writing) text using deterministic rules.
 * 
 * @param text - The email text to evaluate
 * @param options - Optional configuration including questions from the prompt
 * @returns Structured evaluation result with score, level, and feedback
 */
export function evaluateTask1Email(
  text: string,
  options: Task1EvaluationOptions = {}
): Task1EvaluationResult {
  const { questions = [] } = options;
  
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

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

  // Rule 5: Question Coverage
  const questionResult = checkQuestionCoverage(text, questions);
  errors.push(...questionResult.errors);

  // Rule 6: Connectors
  const connectorResult = checkConnectors(text);
  suggestions.push(...connectorResult.suggestions);

  // Rule 7: CTA / Request
  const ctaResult = checkCTA(text);
  suggestions.push(...ctaResult.suggestions);

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
  };
}
