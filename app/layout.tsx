import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { ThemeProvider } from '@/components/ThemeProvider';
import { PlanProvider } from '@/hooks/usePlan';
import styles from '@/styles/Layout.module.scss';

export const metadata: Metadata = {
  title: 'CELPIP Coach - Complete Exam Prep',
  description: 'Master all 4 CELPIP skills with AI-powered practice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0a0f1a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Nunito:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
          <PlanProvider>
            <Header />
            <div className={styles.container}>
              <Sidebar />
              <main className={styles.main}>
                <div className={styles.mainContent}>
                  {children}
                </div>
              </main>
            </div>
            <BottomNav />
          </PlanProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
