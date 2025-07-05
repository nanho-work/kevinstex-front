// ✅ src/app/layout.tsx
import './globals.css'
import Header from '@/components/Header'
import FloatingButton from '@/components/FloatingButton'
import Footer from '@/components/Footer'

const prefix = ''

export const metadata = {
  title: '디케빈즈택스랩 | 대한민국 No.1 세무서비스',
  description: '세무 전문가의 종합 솔루션을 KEVIN TAX에서 경험하세요',
  keywords: ['디케빈즈택스랩', '케빈택스', '권도윤', '권도윤세무사', '송파세무사', '세무상담', '세금신고', '개인사업자', '법인사업자', '절세', '세무사'],
  authors: [{ name: 'KevinTax', url: 'https://thekevinstaxlab.com' }],
  creator: 'KevinTax',
  publisher: 'KevinTax',
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',

  alternates: {
    canonical: 'https://thekevinstaxlab.com',
  },

  openGraph: {
    title: '디케빈즈택스랩 | 대한민국 No.1 세무서비스',
    description: '세무 전문가의 종합 솔루션을 KEVIN TAX에서 경험하세요',
    url: 'https://thekevinstaxlab.com',
    siteName: 'thekevinstaxlab',
    images: [
      {
        url: 'https://thekevinstaxlab.com/kwon_profile.png',
        width: 1200,
        height: 630,
        alt: 'KevinTax 대표 이미지',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },

  icons: {
    icon: `${prefix}/favicon.ico`,
    shortcut: `${prefix}/favicon.ico`,
    apple: `${prefix}/apple-touch-icon.png`,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-800 overflow-x-hidden">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-16">{children}</main>
          <FloatingButton />
          <Footer />
        </div>
      </body>
    </html>
  )
}