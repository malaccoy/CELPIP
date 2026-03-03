import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Practice Timer — Free Tool',
  description: 'Free CELPIP practice timer with real exam timing for all sections. Writing, Speaking, Reading, and Listening presets. Simulate test conditions.',
  keywords: ['CELPIP timer', 'CELPIP practice timer', 'CELPIP writing timer', 'CELPIP speaking timer', 'CELPIP exam timer'],
  alternates: { canonical: 'https://celpipaicoach.com/tools/practice-timer' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
