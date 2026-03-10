import { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import BlogIndex from './BlogIndex';

export const metadata: Metadata = {
  title: 'CELPIP Learning Hub — Tips, Strategies & Templates | CELPIP AI Coach',
  description: 'Free CELPIP guides, speaking templates, writing tips, and study plans. Expert strategies to help you score 9+ on every section of the CELPIP test.',
  openGraph: {
    title: 'CELPIP Learning Hub — Tips, Strategies & Templates',
    description: 'Free guides, templates and strategies for CELPIP success.',
    url: 'https://celpipaicoach.com/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogIndex posts={posts} />;
}
