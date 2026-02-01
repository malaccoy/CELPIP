import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ThemeProvider } from '@/components/ThemeProvider';
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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('celpip_theme');
                  if (theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          <div className={styles.container}>
            <Sidebar />
            <main className={styles.main}>
              <div className={styles.mainContent}>
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
