import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Listening Practice — Free Audio Exercises & Technique Guide',
  description: 'Practice CELPIP Listening with 16 audio exercises covering all 6 parts. Free technique guide, tips & strategies. AI-powered adaptive practice for Pro users.',
  alternates: { canonical: 'https://celpipaicoach.com/listening' },
};

export default function ListeningLayout({ children }: { children: React.ReactNode }) {
  return children;
}
