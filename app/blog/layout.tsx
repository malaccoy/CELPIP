import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CELPIP Preparation Blog — Tips, Strategies & Study Guides',
  description: 'Free CELPIP tips, strategies, and study guides. Expert advice for Writing, Speaking, Reading & Listening. Score CLB 7+ with proven techniques.',
  alternates: { canonical: 'https://celpipaicoach.com/blog' },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
