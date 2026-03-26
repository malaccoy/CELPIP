import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { EventBanner } from '@/components/EventBanner';
import { CommunityPopup } from '@/components/CommunityPopup';
import EmailCapturePopup from '@/components/EmailCapturePopup';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import FAB from '@/components/FAB';
import FeedbackPopup from '@/components/FeedbackPopup';
import MilestoneCelebration from '@/components/MilestoneCelebration';
import PageTransition from '@/components/PageTransition';
import { ThemeProvider } from '@/components/ThemeProvider';
import { PlanProvider } from '@/hooks/usePlan';
import styles from '@/styles/Layout.module.scss';

export const metadata: Metadata = {
  title: {
    default: 'CELPIP AI Coach — Free Practice Tests & AI-Powered Exam Prep',
    template: '%s | CELPIP AI Coach',
  },
  description: 'Free CELPIP practice tests for Reading, Writing, Listening & Speaking. AI-powered feedback, mock exams, adaptive difficulty & technique guides. Score CLB 7+ with smart prep.',
  keywords: ['CELPIP', 'CELPIP practice test', 'CELPIP preparation', 'CELPIP AI', 'CELPIP exam prep', 'CELPIP writing', 'CELPIP speaking', 'CELPIP reading', 'CELPIP listening', 'CELPIP mock exam', 'CELPIP online practice', 'CELPIP free test', 'Canadian English test', 'CLB score', 'immigration English test'],
  metadataBase: new URL('https://celpipaicoach.com'),
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://celpipaicoach.com',
    siteName: 'CELPIP AI Coach',
    title: 'CELPIP AI Coach — Free Practice Tests & AI-Powered Exam Prep',
    description: 'Free CELPIP practice tests with AI feedback. Master Reading, Writing, Listening & Speaking. Mock exams, adaptive difficulty, score CLB 7+.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CELPIP AI Coach — Free Practice & AI Exam Prep',
    description: 'Free CELPIP practice tests with AI-powered feedback. Score CLB 7+ with smart prep.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://celpipaicoach.com' },
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
        <meta name="google-site-verification" content="B9m2vW-OETB5S5rmyCuvbkOTjyNltG-G4gW6fO16gCI" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SD2516DCJM"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-SD2516DCJM');
        `}} />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1b1f2a" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "CELPIP AI Coach",
              "url": "https://celpipaicoach.com",
              "description": "Free CELPIP practice tests with AI-powered feedback for Reading, Writing, Listening & Speaking.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Free",
                  "price": "0",
                  "priceCurrency": "CAD",
                  "description": "17 reading passages, 16 listening exercises, writing editor, speaking recorder, technique guides"
                },
                {
                  "@type": "Offer",
                  "name": "Pro Monthly",
                  "price": "29.99",
                  "priceCurrency": "CAD",
                  "priceValidUntil": "2027-12-31",
                  "description": "Unlimited AI practice, mock exams, writing tutor, speaking coach, adaptive difficulty"
                },
                {
                  "@type": "Offer",
                  "name": "Pro Annual",
                  "price": "149.99",
                  "priceCurrency": "CAD",
                  "priceValidUntil": "2027-12-31",
                  "description": "All Pro features billed annually — save 58%"
                }
              ]
            })
          }}
        />
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
            {/* EventBanner removed — discount only on pricing page */}
            <CommunityPopup />
            <EmailCapturePopup />
            <Header />
            <div className={styles.container}>
              <Sidebar />
              <main className={styles.main}>
                <div className={styles.mainContent}>
                  <PageTransition>{children}</PageTransition>
                </div>
                <Footer />
              </main>
            </div>
            <BottomNav />
            <FAB />
            <FeedbackPopup />
            <MilestoneCelebration />
          </PlanProvider>
        </ThemeProvider>
        {/* Tawk.to Live Chat — set NEXT_PUBLIC_TAWK_ID in .env */}
        {process.env.NEXT_PUBLIC_TAWK_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                
                Tawk_API.onLoad = function(){
                  Tawk_API.setAttributes({
                    'name': 'Visitor',
                  }, function(error){});
                };

                Tawk_API.onChatStarted = function(){
                  Tawk_API.sendMessage('Hi! Thanks for reaching out to CELPIP AI Coach. How can we help you today?');
                };

                Tawk_API.customStyle = {
                  visibility: {
                    desktop: { position: 'br', xOffset: 20, yOffset: 20 },
                    mobile: { position: 'br', xOffset: 10, yOffset: 70 },
                  }
                };

                (function(){
                  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                  s1.async=true;
                  s1.src='https://embed.tawk.to/${process.env.NEXT_PUBLIC_TAWK_ID}';
                  s1.charset='UTF-8';
                  s1.setAttribute('crossorigin','*');
                  s0.parentNode.insertBefore(s1,s0);
                })();
              `,
            }}
          />
        )}
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}` }} />
      </body>
    </html>
  );
}
