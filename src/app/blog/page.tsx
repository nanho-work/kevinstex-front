
import BlogCardSection from '@/components/blog/BlogSection';
import { OG_DEFAULT_IMAGE_URL, SITE_NAME, SITE_URL } from '@/constants/siteConfig';

export const metadata = {
  title: '세무 정보 블로그 | 디케빈즈택스랩',
  description: '사업자에게 필요한 최신 세무 정보와 절세 팁을 블로그에서 확인하세요.',
  keywords: ['세무 블로그', '세무 정보', '세금 팁', '절세 방법', '사업자 세금'],
  openGraph: {
    title: '세무 정보 블로그 | 디케빈즈택스랩',
    description: '디케빈즈택스랩의 전문 세무사가 알려주는 꿀팁과 실무 정보!',
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_DEFAULT_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: '세무 블로그 썸네일',
      },
    ],
    type: 'article',
  },
}


export default function CustomerBlogPage() {
  return (
    <section className="min-h-screen bg-white px-6 mb-10">
        <BlogCardSection />
    </section>
  )
}
