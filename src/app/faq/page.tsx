// src/app/customer/faq/page.tsx
import FAQ from '@/components/FAQ/FAQ';


export const metadata = {
  title: '자주 묻는 질문 | 디케빈즈택스랩',
  description: '디케빈즈택스랩의 자주 묻는 질문을 통해 궁금한 점을 빠르게 확인하세요.',
  keywords: ['FAQ', '자주 묻는 질문', '세무 FAQ', '케빈택스', '디케빈즈택스랩'],
  openGraph: {
    title: '자주 묻는 질문 | 디케빈즈택스랩',
    description: '고객들이 자주 묻는 질문을 통해 세무 서비스에 대한 궁금증을 해결해보세요.',
    url: 'https://thekevinstaxlab.com/customer/faq',
    siteName: 'thekevinstaxlab',
    images: [
      {
        url: 'https://thekevinstaxlab.com/faq_og.png',
        width: 1200,
        height: 630,
        alt: '자주 묻는 질문 이미지',
      },
    ],
    type: 'website',
  },
}

export default function FAQPage() {
  return (
    <div className="w-full max-w-7xl px-4 py-8 space-y-12">

      <FAQ />
    </div>
  );
}