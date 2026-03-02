import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Reading Practice — Free Passages & Technique Guide',
  description: 'Practice CELPIP Reading with 17 passages across all 4 parts. Free technique guide with Truth Trio method, score strategy & tips. AI practice for Pro.',
  alternates: { canonical: 'https://celpipaicoach.com/reading' },
};

export default function ReadingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
