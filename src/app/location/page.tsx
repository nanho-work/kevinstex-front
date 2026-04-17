

import LocationMap from '@/components/LocationMap/LocationMap';
import { OFFICE_ADDRESS, OG_DEFAULT_IMAGE_URL, SITE_NAME, SITE_URL } from '@/constants/siteConfig';

export const metadata = {
  title: '오시는 길 | 디케빈즈택스랩',
  description: `${OFFICE_ADDRESS}. 디케빈즈택스랩 오시는 길 안내입니다.`,
  keywords: ['오시는길', '디케빈즈택스랩 위치', '성남세무사 위치', '위례 세무사'],
  openGraph: {
    title: '오시는 길 | 디케빈즈택스랩',
    description: `${OFFICE_ADDRESS}. 디케빈즈택스랩의 정확한 위치를 확인하세요.`,
    url: `${SITE_URL}/location`,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_DEFAULT_IMAGE_URL,
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
