import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(self), geolocation=()',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];

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
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // Cache static assets aggressively
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Prevent caching of API routes
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },
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
