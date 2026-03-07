import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Writing Sentence Starters — Free Templates',
  description: 'Ready-to-use sentence starters and templates for CELPIP Writing Task 1 & Task 2. Categorized by function: openings, transitions, conclusions & more.',
  keywords: ['CELPIP sentence starters', 'CELPIP writing templates', 'CELPIP writing phrases', 'CELPIP email templates'],
  alternates: { canonical: 'https://celpipaicoach.com/writing/starters' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
