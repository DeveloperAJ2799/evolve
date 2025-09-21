import { type NextConfig } from 'next/dist/server/config';
import type { ServerRuntime } from 'next/types';

const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript error checking
  },
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint during builds
  },
  poweredByHeader: false,
  generateBuildId: () => 'build',
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"]
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
