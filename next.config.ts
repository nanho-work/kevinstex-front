const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ Vercel에서는 export 불필요
  // output: 'export',

  trailingSlash: false, // 선택사항 (Vercel은 문제 없음)
  assetPrefix: '',       // ❌ 보통 사용 안 함
  images: {
    unoptimized: false,  // ❌ Vercel은 이미지 최적화 가능
  },
  experimental: {
    appDir: true,         // ✅ src/app 쓰는 경우 명시
  },
};

export default nextConfig;