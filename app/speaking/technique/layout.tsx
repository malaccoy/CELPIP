import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Speaking Technique — Free Strategy Guide & Tips',
  description: 'Master all 8 CELPIP Speaking tasks with the CSF method. Free technique guide covering advice, scene description, predictions & opinion tasks.',
  keywords: ['CELPIP speaking tips', 'CELPIP speaking technique', 'CELPIP speaking strategy', 'CELPIP speaking guide'],
  alternates: { canonical: 'https://celpipaicoach.com/speaking/technique' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
