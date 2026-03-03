import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Blog — Tips, Strategies & Study Guides',
  description: 'Free CELPIP preparation tips, study plans, score charts, and expert strategies for Writing, Speaking, Reading, and Listening. Ace your test with AI coaching.',
  keywords: ['CELPIP tips', 'CELPIP blog', 'CELPIP study guide', 'CELPIP strategies', 'CELPIP preparation'],
  alternates: { canonical: 'https://celpipaicoach.com/blog' },
  openGraph: {
    title: 'CELPIP Blog — Tips, Strategies & Study Guides',
    description: 'Free expert advice to help you score higher on CELPIP',
    url: 'https://celpipaicoach.com/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
