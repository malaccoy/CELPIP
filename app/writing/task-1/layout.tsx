import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Writing Task 1 — Email Practice with AI Feedback',
  description: 'Practice CELPIP Writing Task 1 (email writing) with built-in editor, timer, word count & AI scoring. Get instant feedback on grammar, vocabulary & structure.',
  keywords: ['CELPIP writing task 1', 'CELPIP email writing', 'CELPIP writing practice', 'CELPIP writing AI feedback'],
  alternates: { canonical: 'https://celpipaicoach.com/writing/task-1' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
