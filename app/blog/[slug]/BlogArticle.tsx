'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight, Zap } from 'lucide-react';
import type { BlogPost } from '@/lib/blog';
import styles from '@/styles/Blog.module.scss';

interface Props {
  post: BlogPost;
}

export default function BlogArticle({ post }: Props) {
  return (
    <div className={styles.articleContainer}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/blog">Blog</Link>
        <span>/</span>
        <span className={styles.breadcrumbCurrent}>{post.title}</span>
      </nav>

      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <div className={styles.articleMeta}>
            <span className={styles.articleCategory}>
              <Tag size={12} /> {post.category}
            </span>
            <span><Clock size={12} /> {post.readTime} min read</span>
            <span>
              <Calendar size={12} /> {new Date(post.date).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <p className={styles.articleDesc}>{post.description}</p>
        </header>

        {/* Mid-article CTA */}
        <div
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: post.htmlContent || '' }}
        />

        {/* End CTA */}
        <div className={styles.articleCta}>
          <Zap size={20} />
          <div>
            <h3>Ready to practice?</h3>
            <p>Put these strategies to work with free AI-powered exercises.</p>
          </div>
          <Link href={post.cta.href} className={styles.articleCtaBtn}>
            {post.cta.text} <ArrowRight size={16} />
          </Link>
        </div>
      </article>

      <div className={styles.backLink}>
        <Link href="/blog">
          <ArrowLeft size={16} /> Back to all articles
        </Link>
      </div>
    </div>
  );
}
