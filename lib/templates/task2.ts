/**
 * Task 2 skeleton builder for survey response
 * Generates well-formatted base text with line breaks and connectors
 */

import { Task2State, Task2Point } from '@/types';

/**
 * Connectors used for structuring the body paragraphs
 */
const BODY_CONNECTORS = ['First', 'Second', 'Finally'];

/**
 * Plan type for Task 2 skeleton building
 */
export type Task2Plan = Pick<
  Task2State,
  'topic' | 'opinionLine' | 'points'
>;

/**
 * Formats a single body paragraph with Point, Reason, and Example structure
 */
function formatBodyParagraph(
  point: Task2Point,
  connector: string,
  index: number
): string {
  const pointText = point.point?.trim() || `[argument ${index + 1}]`;
  const reasonText = point.reason?.trim() || '[explain why]';
  const exampleText = point.example?.trim() || '[give a specific example]';

  return `${connector}, ${pointText}. This is because ${reasonText}. For example, ${exampleText}.`;
}

/**
 * Builds a well-formatted survey response skeleton based on the provided plan
 *
 * @param plan - The Task 2 plan containing topic, opinion, and supporting points
 * @returns A formatted survey response skeleton with proper line breaks and connectors
 */
export function buildTask2Skeleton(plan: Task2Plan): string {
  const lines: string[] = [];

  // Introduction paragraph with opinion statement
  const topic = plan.topic?.trim() || '[survey topic]';
  const opinionLine = plan.opinionLine?.trim() || '[state your opinion]';
  lines.push(
    `In my opinion, regarding the ${topic}, I believe that ${opinionLine}. ` +
    'I am convinced that this is the best choice for several reasons.'
  );
  lines.push('');

  // Body paragraphs with PRE (Point, Reason, Example) structure
  const points = plan.points || [];
  const bodyPointsCount = Math.min(points.length, BODY_CONNECTORS.length);

  if (bodyPointsCount > 0) {
    for (let i = 0; i < bodyPointsCount; i++) {
      const connector = BODY_CONNECTORS[i];
      const paragraph = formatBodyParagraph(points[i], connector, i);
      lines.push(paragraph);
      lines.push('');
    }
  } else {
    // Default body structure if no points provided
    lines.push('First, [main argument]. This is because [reason]. For example, [example].');
    lines.push('');
    lines.push('Second, [supporting argument]. This is because [reason]. For example, [example].');
    lines.push('');
  }

  // Conclusion paragraph
  const pointsSummary = points
    .map((p, i) => p.point?.trim() || `[point ${i + 1}]`)
    .filter((p) => p)
    .slice(0, 2);

  if (pointsSummary.length >= 2) {
    lines.push(
      `In conclusion, considering ${pointsSummary[0]} and ${pointsSummary[1]}, ` +
      'I am convinced that this is the superior option.'
    );
  } else {
    lines.push(
      'In conclusion, considering all these reasons, I am convinced that this is the superior option.'
    );
  }

  return lines.join('\n');
}
