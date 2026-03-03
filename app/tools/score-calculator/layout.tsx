import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP CRS Score Calculator — Free Tool',
  description: 'Calculate your Express Entry CRS points from CELPIP scores. See CLB levels, eligibility for FSW, CEC, and citizenship. Free online calculator.',
  keywords: ['CELPIP CRS calculator', 'CELPIP score calculator', 'CLB to CRS points', 'Express Entry points calculator', 'CELPIP CLB calculator'],
  alternates: { canonical: 'https://celpipaicoach.com/tools/score-calculator' },
  openGraph: {
    title: 'CELPIP CRS Score Calculator',
    description: 'Calculate your Express Entry CRS points from CELPIP scores instantly.',
    url: 'https://celpipaicoach.com/tools/score-calculator',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
