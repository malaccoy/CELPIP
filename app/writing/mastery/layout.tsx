import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Writing Mastery — Free Technique Guide',
  description: 'Master CELPIP Writing with proven techniques for Task 1 (email) and Task 2 (survey). Structure templates, vocabulary tips & scoring criteria explained.',
  keywords: ['CELPIP writing tips', 'CELPIP writing mastery', 'CELPIP writing technique', 'CELPIP writing guide'],
  alternates: { canonical: 'https://celpipaicoach.com/writing/mastery' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
