'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, Tag, BookOpen } from 'lucide-react';
import { BlogPost } from '@content/blog-posts';
import styles from '@/styles/BlogArticle.module.scss';

const categoryColors: Record<string, string> = {
  writing: '#a78bfa',
  speaking: '#38bdf8',
  reading: '#34d399',
  listening: '#fb923c',
  general: '#94a3b8',
  tips: '#f472b6',
};

export default function BlogArticle({ post }: { post: BlogPost }) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'CELPIP AI Coach' },
    publisher: { '@type': 'Organization', name: 'CELPIP AI Coach', url: 'https://celpipaicoach.com' },
    mainEntityOfPage: `https://celpipaicoach.com/blog/${post.slug}`,
  };

  return (
    <div className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Link href="/blog" className={styles.backLink}>
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.category} style={{ color: categoryColors[post.category] }}>
              <Tag size={12} />
              {post.category}
            </span>
            <span className={styles.date}>{new Date(post.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className={styles.readTime}>
              <Clock size={12} />
              {post.readTime}
            </span>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.description}>{post.description}</p>
        </header>

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className={styles.footer}>
          <div className={styles.cta}>
            <BookOpen size={20} />
            <div>
              <h3>Ready to practice?</h3>
              <p>200+ free exercises across all sections. Try Pro free for 3 days — AI feedback, mock exams, and more.</p>
            </div>
            <Link href="/pricing" className={styles.ctaBtn}>Start 3-Day Free Trial</Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
