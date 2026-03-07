import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP AI Mock Exam — Simulate the Real Test',
  description: 'Take a full CELPIP mock exam with AI-generated questions, real-time scoring & CLB estimate. Adaptive difficulty adjusts to your level. Pro feature.',
  keywords: ['CELPIP mock exam', 'CELPIP practice test', 'CELPIP simulation', 'CELPIP AI exam', 'CELPIP full test'],
  alternates: { canonical: 'https://celpipaicoach.com/mock-exam' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
