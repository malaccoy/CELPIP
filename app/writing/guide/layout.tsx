import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Writing Guide — Lessons & Examples',
  description: 'Step-by-step CELPIP writing lessons with examples, practice exercises & scoring rubrics. Learn email format, survey response structure & common mistakes.',
  keywords: ['CELPIP writing guide', 'CELPIP writing lessons', 'CELPIP writing examples', 'CELPIP writing help'],
  alternates: { canonical: 'https://celpipaicoach.com/writing/guide' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
