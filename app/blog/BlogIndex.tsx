'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Clock, ArrowRight, BookOpen, Tag } from 'lucide-react';
import type { BlogPost } from '@/lib/blog';
import styles from '@/styles/Blog.module.scss';

interface Props {
  posts: BlogPost[];
}

export default function BlogIndex({ posts }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(posts.map(p => p.category))];

  const filtered = posts.filter(p => {
    const matchSearch = search === '' || 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          <BookOpen size={28} />
          CELPIP Learning Hub
        </h1>
        <p className={styles.subtitle}>
          Free guides, strategies, and templates to help you ace the CELPIP test
        </p>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.catBtn} ${activeCategory === cat ? styles.catActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
            <div className={styles.cardCategory}>
              <Tag size={12} />
              {post.category}
            </div>
            <h2 className={styles.cardTitle}>{post.title}</h2>
            <p className={styles.cardDesc}>{post.description}</p>
            <div className={styles.cardMeta}>
              <span className={styles.cardTime}>
                <Clock size={12} />
                {post.readTime} min read
              </span>
              <span className={styles.cardDate}>
                {new Date(post.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className={styles.cardCta}>
              Read More <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <p>No articles found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
