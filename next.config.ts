const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  assetPrefix: isProd ? '/' : '', // GitHub Pages + 도메인 대응
  images: {
    unoptimized: true, // next/image 최적화 비활성화 (static export용)
  },
};

export default nextConfig;