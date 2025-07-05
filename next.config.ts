const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ static export 사용 (next export 전용)
  trailingSlash: true,
  assetPrefix: isProd ? '/' : '', // ✅ "/" 루트 도메인용 프리픽스 (GitHub Pages 루트 도메인에 연결 시)
  images: {
    unoptimized: true, // ✅ next/image 비활성화 → 정적 export에 맞춤
  },
};