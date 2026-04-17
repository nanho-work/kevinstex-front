import ServiceClient from '@/components/service/ServiceClient'
import { OG_DEFAULT_IMAGE_URL, SITE_NAME, SITE_URL } from '@/constants/siteConfig'


export const metadata = {
  title: '세무 서비스 안내 | 디케빈즈택스랩',
  description: '양도소득세, 종합소득세, 부가가치세, 기장대행 등 다양한 세무 서비스를 확인해보세요.',
  keywords: ['세무서비스', '양도소득세', '종합소득세', '기장', '부가세', '세금신고'],
  openGraph: {
    title: '세무 서비스 안내 | 디케빈즈택스랩',
    description: '개인사업자부터 법인까지 맞춤형 세무 서비스 제공. 디케빈즈택스랩에서 확인하세요.',
    url: `${SITE_URL}/services`,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_DEFAULT_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: '세무 서비스 소개',
      },
    ],
    type: 'website',
  },
}

export default function ServicePage() {
  return <ServiceClient />
}
