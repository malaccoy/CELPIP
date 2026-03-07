import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Writing Task 2 — Survey Response Practice with AI',
  description: 'Practice CELPIP Writing Task 2 (responding to survey questions) with timer, editor & AI-powered scoring. Get CLB-level feedback on your responses.',
  keywords: ['CELPIP writing task 2', 'CELPIP survey response', 'CELPIP writing practice', 'CELPIP writing score'],
  alternates: { canonical: 'https://celpipaicoach.com/writing/task-2' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
