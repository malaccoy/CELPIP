import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { Sidebar } from '@/components/Sidebar';
import styles from '@/styles/Layout.module.scss';

export const metadata: Metadata = {
  title: 'CELPIP Writing Coach',
  description: 'Writing Mastery MVP - Practice CELPIP writing tasks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className={styles.container}>
          <Sidebar />
          <main className={styles.main}>
            <div className={styles.mainContent}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
