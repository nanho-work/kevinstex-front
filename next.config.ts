// 프로덕션 환경 여부 확인 (NODE_ENV가 'production'이면 true)
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❗ Next.js 13 이상에서 정적 사이트로 내보내기 (GitHub Pages 등 static hosting 용)
  output: 'export',

  // ❗ 모든 경로에 슬래시(/) 추가 (정적 호스팅에서 링크 오류 방지)
  // 예: /about → /about/
  trailingSlash: true,

  // ❗ GitHub Pages나 커스텀 도메인을 사용할 경우 경로 앞에 prefix 추가
  // 예: https://username.github.io/repo-name/ → assetPrefix = '/repo-name'
  //     커스텀 도메인 사용 시에는 ''(빈 문자열)이어야 함
  assetPrefix: isProd ? '/' : '',

  // ❗ next/image 최적화 기능 비활성화
  //    static export에서는 next/image를 최적화할 수 없기 때문에 unoptimized: true 필요
  images: {
    unoptimized: true,
  },
};

// ❗ Next.js 설정 객체를 export하여 빌드 시 사용
export default nextConfig;