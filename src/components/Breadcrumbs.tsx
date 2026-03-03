'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import styles from '@/styles/Breadcrumbs.module.scss';

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://celpipaicoach.com' },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `https://celpipaicoach.com${item.href}` } : {}),
      })),
    ],
  };

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ol>
        <li>
          <Link href="/"><Home size={14} /></Link>
        </li>
        {items.map((item, i) => (
          <li key={i}>
            <ChevronRight size={12} className={styles.separator} />
            {item.href && i < items.length - 1 ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
