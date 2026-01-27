/**
 * Task 1 template builder for email writing
 * Generates well-formatted base text with line breaks and connectors
 */

import { Task1State } from '@/types';

/**
 * Connectors used for structuring the email body paragraphs
 */
const BODY_CONNECTORS = ['First of all', 'Secondly', 'Thirdly', 'Finally'];

/**
 * Plan type for Task 1 template building
 */
export type Task1Plan = Pick<
  Task1State,
  | 'recipient'
  | 'whoAmI'
  | 'whyWriting'
  | 'questions'
  | 'cta'
  | 'pleaseLetMeKnow'
  | 'signOff'
>;

/**
 * Builds a well-formatted email template based on the provided plan
 *
 * @param plan - The Task 1 plan containing recipient, introduction, body points, and closing
 * @returns A formatted email template string with proper line breaks and connectors
 */
export function buildTask1Template(plan: Task1Plan): string {
  const lines: string[] = [];

  // Opening line
  const recipient = plan.recipient?.trim() || '[Name]';
  lines.push(`Dear ${recipient},`);
  lines.push('');

  // Introduction paragraph: who I am and why writing
  const whoAmI = plan.whoAmI?.trim() || '[who you are]';
  const whyWriting = plan.whyWriting?.trim() || '[reason for writing]';
  lines.push(
    `I am writing to ${whyWriting}. My name is ${whoAmI}.`
  );
  lines.push('');

  // Body paragraphs with connectors
  const questions = plan.questions?.filter((q) => q?.trim()) || [];
  const bodyPointsCount = Math.min(questions.length, BODY_CONNECTORS.length);

  if (bodyPointsCount > 0) {
    for (let i = 0; i < bodyPointsCount; i++) {
      const connector = BODY_CONNECTORS[i];
      const question = questions[i]?.trim() || `[point ${i + 1}]`;
      lines.push(
        `${connector}, regarding ${question}, I would like to mention that [details].`
      );
      lines.push('');
    }
  } else {
    // Default body structure if no questions provided
    lines.push('First of all, I would like to address [first point].');
    lines.push('');
    lines.push('Secondly, [second point].');
    lines.push('');
    lines.push('Thirdly, [third point].');
    lines.push('');
  }

  // Call to action (optional)
  if (plan.cta?.trim()) {
    lines.push(`${plan.cta.trim()}.`);
    lines.push('');
  }

  // Closing line
  const closingLine =
    plan.pleaseLetMeKnow?.trim() ||
    'Please let me know if you require any further information.';
  lines.push(closingLine);
  lines.push('');

  // Sign-off
  const signOff = plan.signOff?.trim() || 'Regards,\n[Your Full Name]';
  lines.push(signOff);

  return lines.join('\n');
}
