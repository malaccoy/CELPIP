import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Reading Technique — Free Strategy Guide & Tips',
  description: 'Master CELPIP Reading with the Truth Trio method and proven strategies for all 4 parts. Free guide with skimming, scanning & inference techniques.',
  keywords: ['CELPIP reading tips', 'CELPIP reading technique', 'CELPIP reading strategy', 'CELPIP reading guide'],
  alternates: { canonical: 'https://celpipaicoach.com/reading/technique' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
