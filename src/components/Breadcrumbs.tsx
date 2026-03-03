'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import styles from '@/styles/Breadcrumbs.module.scss';

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
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
