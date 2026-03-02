'use client';

import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Tag } from 'lucide-react';
import { getAllBlogPosts } from '@content/blog-posts';
import styles from '@/styles/Blog.module.scss';

const categoryColors: Record<string, string> = {
  writing: '#a78bfa',
  speaking: '#38bdf8',
  reading: '#34d399',
  listening: '#fb923c',
  general: '#94a3b8',
  tips: '#f472b6',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.badge}>
          <BookOpen size={14} />
          <span>CELPIP Blog</span>
        </div>
        <h1 className={styles.title}>Tips, Strategies & Study Guides</h1>
        <p className={styles.subtitle}>
          Free expert advice to help you score higher on CELPIP
        </p>
      </div>

      <div className={styles.grid}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
            <div className={styles.cardMeta}>
              <span
                className={styles.category}
                style={{ color: categoryColors[post.category] }}
              >
                <Tag size={12} />
                {post.category}
              </span>
              <span className={styles.readTime}>
                <Clock size={12} />
                {post.readTime}
              </span>
            </div>
            <h2 className={styles.cardTitle}>{post.title}</h2>
            <p className={styles.cardDesc}>{post.description}</p>
            <span className={styles.readMore}>
              Read article <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
