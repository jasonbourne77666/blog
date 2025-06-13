import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  distDir: 'dist',
  // 启用独立输出模式，适合 Docker 部署
  output: 'standalone',
};

export default nextConfig;
