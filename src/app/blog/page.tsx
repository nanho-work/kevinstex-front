
import BlogCardSection from '@/components/blog/BlogSection';

export const metadata = {
  title: '세무 정보 블로그 | 디케빈즈택스랩',
  description: '사업자에게 필요한 최신 세무 정보와 절세 팁을 블로그에서 확인하세요.',
  keywords: ['세무 블로그', '세무 정보', '세금 팁', '절세 방법', '사업자 세금'],
  openGraph: {
    title: '세무 정보 블로그 | 디케빈즈택스랩',
    description: '디케빈즈택스랩의 전문 세무사가 알려주는 꿀팁과 실무 정보!',
    url: 'https://thekevinstaxlab.com/blog',
    siteName: 'thekevinstaxlab',
    images: [
      {
        url: 'https://thekevinstaxlab.com/kwon_profile.png',
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
    <section className="min-h-screen bg-white px-6">
        <BlogCardSection />
    </section>
  )
}