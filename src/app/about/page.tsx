

import About from '@/components/about/About';

export const metadata = {
  title: '회사소개 | 디케빈즈택스랩',
  description: '디케빈즈택스랩은 송파에 위치한 대한민국 대표 세무사무소로, 개인 및 법인을 위한 맞춤형 세무 서비스를 제공합니다.',
  keywords: ['회사소개', '디케빈즈택스랩', '케빈택스', '송파세무사', '권도윤 세무사'],
  openGraph: {
    title: '회사소개 | 디케빈즈택스랩',
    description: '대한민국 No.1 세무서비스, 디케빈즈택스랩의 철학과 가치를 소개합니다.',
    url: 'https://thekevinstaxlab.com/about',
    siteName: 'thekevinstaxlab',
    images: [
      {
        url: 'https://thekevinstaxlab.com/kwon_profile.png',
        width: 1200,
        height: 630,
        alt: '회사소개 이미지',
      },
    ],
    type: 'website',
  },
}
export default function AboutPage() {
  return <About />;
}