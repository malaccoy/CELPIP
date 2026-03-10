import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPostSlugs } from '@/lib/blog';
import BlogArticle from './BlogArticle';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getPostSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | CELPIP AI Coach`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://celpipaicoach.com/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: { '@type': 'Organization', name: 'CELPIP AI Coach' },
    publisher: { '@type': 'Organization', name: 'CELPIP AI Coach', url: 'https://celpipaicoach.com' },
    mainEntityOfPage: `https://celpipaicoach.com/blog/${slug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://celpipaicoach.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://celpipaicoach.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://celpipaicoach.com/blog/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BlogArticle post={post} />
    </>
  );
}
