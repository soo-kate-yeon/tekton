import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@tekton/token-contract'],
  experimental: {
    optimizePackageImports: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  },
};

export default nextConfig;
