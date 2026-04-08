

import LocationMap from '@/components/LocationMap/LocationMap';

export const metadata = {
  title: '오시는 길 | 디케빈즈택스랩',
  description: '경기도 성남시 수정구 위례서로 24, 행복빌딩 5층 502호. 디케빈즈택스랩 오시는 길 안내입니다.',
  keywords: ['오시는길', '디케빈즈택스랩 위치', '성남세무사 위치', '위례 세무사'],
  openGraph: {
    title: '오시는 길 | 디케빈즈택스랩',
    description: '경기도 성남시 수정구 위례서로 24, 행복빌딩 5층 502호. 디케빈즈택스랩의 정확한 위치를 확인하세요.',
    url: 'https://thekevinstaxlab.com/location',
    siteName: 'thekevinstaxlab',
    images: [
      {
        url: 'https://thekevinstaxlab.com/kwon_profile.png',
        width: 1200,
        height: 630,
        alt: '디케빈즈택스랩 위치 안내',
      },
    ],
    type: 'website',
  },
}

export default function CustomerLocationPage() {
  return (
    <main className="px-4 py-16 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">오시는 길</h1>
      <LocationMap />
    </main>
  );
}
