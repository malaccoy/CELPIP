import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  generateBuildId: () => `build-${Date.now()}`,
  async redirects() {
    return [
      { source: '/listening/practice/:partId', destination: '/ai-coach', permanent: false },
      { source: '/reading/practice', destination: '/ai-coach', permanent: false },
      { source: '/reading/practice/:partId', destination: '/ai-coach', permanent: false },
      { source: '/speaking/practice/:taskId', destination: '/ai-coach', permanent: false },
    ];
  },
};

export default nextConfig;
