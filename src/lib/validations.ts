/**
 * Centralized Zod validation schemas for all API routes.
 *
 * Benefits:
 *  - Runtime type safety (TypeScript only checks at compile time)
 *  - Automatic input sanitization (trim, length limits)
 *  - Consistent error messages across all endpoints
 *  - Protection against malformed payloads and injection attempts
 */

import { z } from 'zod';

// ─── Shared Primitives ───────────────────────────

/** Sanitized string: trimmed, max length enforced */
const safeString = (max = 500) =>
  z.string().trim().min(1, 'Field cannot be empty').max(max, `Maximum ${max} characters`);

/** Email with basic validation and normalization */
const safeEmail = z
  .string()
  .trim()
  .toLowerCase()
  .email('Invalid email address')
  .max(254, 'Email too long');

// ─── AI Feedback (Writing) ───────────────────────

export const AIFeedbackSchema = z.object({
  task: z.enum(['task1', 'task2'], {
    errorMap: () => ({ message: 'Task must be "task1" or "task2"' }),
  }),
  text: z
    .string()
    .trim()
    .min(50, 'Text too short for analysis. Write at least 50 words.')
    .max(5000, 'Text too long. Maximum 5000 characters.')
    .transform((val) => val.slice(0, 5000)),
  action: z.enum(['score', 'make-it-real', 'corrected', 'full', 'full-enhanced'], {
    errorMap: () => ({ message: 'Invalid action type' }),
  }),
  context: z
    .object({
      scenario: z.string().max(2000).optional(),
      questions: z.array(z.string().max(500)).max(10).optional(),
    })
    .optional(),
});

export type AIFeedbackInput = z.infer<typeof AIFeedbackSchema>;

// ─── Support Ticket ──────────────────────────────

export const SupportTicketSchema = z.object({
  name: safeString(100).optional().default(''),
  email: safeEmail,
  subject: safeString(200),
  message: safeString(5000),
});

export type SupportTicketInput = z.infer<typeof SupportTicketSchema>;

// ─── Email Capture ───────────────────────────────

export const EmailCaptureSchema = z.object({
  email: safeEmail,
  name: z.string().trim().max(100).optional().default(''),
  source: z.string().trim().max(50).optional().default('popup'),
});

export type EmailCaptureInput = z.infer<typeof EmailCaptureSchema>;

// ─── Feedback / Rating ───────────────────────────

export const FeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional().default(''),
  page: z.string().trim().max(200).optional().default(''),
});

export type FeedbackInput = z.infer<typeof FeedbackSchema>;

// ─── AI Practice (AI Coach) ──────────────────────

export const AIPracticeSchema = z.object({
  section: z.enum(['reading', 'writing', 'listening', 'speaking']),
  part: safeString(100),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().default('intermediate'),
});

export type AIPracticeInput = z.infer<typeof AIPracticeSchema>;

// ─── Quiz Score Submission ───────────────────────

export const QuizScoreSchema = z.object({
  sectionId: safeString(100),
  score: z.number().int().min(0).max(100),
  total: z.number().int().min(1).max(100),
  answers: z.record(z.string(), z.number()).optional(),
});

export type QuizScoreInput = z.infer<typeof QuizScoreSchema>;

// ─── Onboarding ──────────────────────────────────

export const OnboardingSchema = z.object({
  goal: z.string().trim().max(200).optional().default(''),
  source: z.string().trim().max(200).optional().default(''),
  completed: z.boolean().optional().default(false),
  date: z.string().optional(),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;

// ─── Utility: Parse & Validate ───────────────────

/**
 * Safely parse and validate a request body against a Zod schema.
 * Returns either the validated data or a formatted error response.
 *
 * Usage in API routes:
 * ```ts
 * const result = await parseBody(request, AIFeedbackSchema);
 * if (!result.success) return result.error; // NextResponse with 400
 * const data = result.data; // Fully typed and validated
 * ```
 */
export async function parseBody<T extends z.ZodTypeAny>(
  request: Request,
  schema: T
): Promise<
  | { success: true; data: z.infer<T> }
  | { success: false; error: Response }
> {
  try {
    const raw = await request.json();
    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return {
        success: false,
        error: new Response(
          JSON.stringify({
            error: 'Validation failed',
            details: errors,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        ),
      };
    }

    return { success: true, data: parsed.data };
  } catch {
    return {
      success: false,
      error: new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      ),
    };
  }
}
