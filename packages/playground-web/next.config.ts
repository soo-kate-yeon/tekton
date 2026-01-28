import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Workspace 패키지 transpile (dist/ 파일 처리)
  transpilePackages: ['@tekton/core', '@tekton/ui'],
  webpack: (config) => {
    // pnpm symlink를 따라가지 않고 package.json exports 사용
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
