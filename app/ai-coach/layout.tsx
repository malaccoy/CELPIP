import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP AI Coach — Personalized Practice & Feedback',
  description: 'Get AI-powered CELPIP coaching: adaptive exercises, instant feedback, weakness analysis & personalized study plans. Practice smarter, score higher.',
  keywords: ['CELPIP AI coach', 'CELPIP AI tutor', 'CELPIP personalized practice', 'CELPIP AI feedback'],
  alternates: { canonical: 'https://celpipaicoach.com/ai-coach' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
