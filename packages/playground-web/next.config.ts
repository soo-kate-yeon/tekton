import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@tekton/core'],
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
