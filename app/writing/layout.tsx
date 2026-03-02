import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Writing Practice — Free Editor, Timer & AI Writing Tutor',
  description: 'Practice CELPIP Writing Task 1 & Task 2 with built-in editor, timer & sentence starters. Free technique mastery guide. AI Writing Tutor scores 1-12 for Pro users.',
  alternates: { canonical: 'https://celpipaicoach.com/writing' },
};

export default function WritingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
