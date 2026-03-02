import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP AI Coach Pro — Pricing & Plans',
  description: 'Upgrade to CELPIP AI Coach Pro: unlimited AI practice, mock exams, adaptive difficulty, writing tutor & speaking coach. From CA$8.25/month.',
  alternates: { canonical: 'https://celpipaicoach.com/pricing' },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
