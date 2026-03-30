import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
    ],
  },
  devIndicators: false,
  generateBuildId: () => `build-${Date.now()}`,
  async redirects() {
    return [
      { source: '/listening/practice/:partId', destination: '/ai-coach', permanent: false },
      { source: '/reading/practice', destination: '/ai-coach', permanent: false },
      { source: '/reading/practice/:partId', destination: '/ai-coach', permanent: false },
      { source: '/speaking/practice/:taskId', destination: '/ai-coach', permanent: false },
      { source: '/learn', destination: '/english', permanent: true },
      { source: '/learn/:path*', destination: '/english/:path*', permanent: true },
      // Fix old blog URLs (Google Search Console 404s)
      { source: '/blog/celpip-writing-task-1-complete-guide', destination: '/blog/celpip-writing-task-1-email-guide', permanent: true },
      { source: '/blog/celpip-speaking-tips-score-9', destination: '/blog/celpip-speaking-score-9', permanent: true },
      { source: '/blog/celpip-listening-tips-perfect-score', destination: '/blog/celpip-listening-tips-score-9', permanent: true },
      { source: '/blog/celpip-score-chart-clb-levels-2026', destination: '/blog/celpip-score-chart-clb-levels', permanent: true },
      { source: '/blog/celpip-express-entry-canada-pr', destination: '/blog/celpip-express-entry-crs-points', permanent: true },
    ];
  },
};

export default nextConfig;
