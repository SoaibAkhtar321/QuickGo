import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  // Ensure image domains or remote patterns if needed
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
