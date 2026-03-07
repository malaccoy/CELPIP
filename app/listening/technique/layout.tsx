import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Listening Technique — Free Strategy Guide & Tips',
  description: 'Master CELPIP Listening with proven techniques: prediction, keyword spotting, note-taking strategies. Free guide for all 6 parts. Score CLB 7+ on test day.',
  keywords: ['CELPIP listening tips', 'CELPIP listening technique', 'CELPIP listening strategy', 'CELPIP listening guide'],
  alternates: { canonical: 'https://celpipaicoach.com/listening/technique' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
