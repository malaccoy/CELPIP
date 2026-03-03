import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free CELPIP Tools — Calculator, Timer & More',
  description: 'Free CELPIP preparation tools: CRS Score Calculator, Practice Timer, and more. No signup required.',
  keywords: ['CELPIP tools', 'CELPIP calculator', 'CELPIP timer', 'free CELPIP tools'],
  alternates: { canonical: 'https://celpipaicoach.com/tools' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
