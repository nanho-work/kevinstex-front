'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'

export default function ReviewSliderSection() {
    const reviews = [
        {
            id: 1,
            customer_name: '홍길동',
            comment: '정말 친절한 상담이었습니다.',
            rating: 5,
            created_at: '2024-06-01',
            category: '양도소득세',
        },
        {
            id: 2,
            customer_name: '김철수',
            comment: '믿고 맡길 수 있는 세무사님!',
            rating: 4,
            created_at: '2024-06-05',
            category: '법인세',
        },
        {
            id: 3,
            customer_name: '이영희',
            comment: '처음 세무 상담이었는데 쉽게 설명해주셨어요.',
            rating: 5,
            created_at: '2024-06-10',
            category: '기장업무',
        },
        {
            id: 1,
            customer_name: '홍길동',
            comment: '정말 친절한 상담이었습니다.',
            rating: 5,
            created_at: '2024-06-01',
            category: '양도소득세',
        },
        {
            id: 2,
            customer_name: '김철수',
            comment: '믿고 맡길 수 있는 세무사님!',
            rating: 4,
            created_at: '2024-06-05',
            category: '법인세',
        },
        {
            id: 3,
            customer_name: '이영희',
            comment: '처음 세무 상담이었는데 쉽게 설명해주셨어요.',
            rating: 5,
            created_at: '2024-06-10',
            category: '기장업무',
        },
        {
            id: 4,
            customer_name: '박민수',
            comment: '복잡한 세금 문제를 명쾌하게 정리해주셨어요.',
            rating: 5,
            created_at: '2024-06-15',
            category: '종합소득세',
        },
        {
            id: 5,
            customer_name: '최지현',
            comment: '문서 준비부터 신고까지 너무 편했어요!',
            rating: 4,
            created_at: '2024-06-20',
            category: '부가가치세',
        },
    ]

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-xl font-bold text-blue-900 mb-6">실제 고객 후기</h2>
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={16}
                    slidesPerView={4}
                    loop
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    className="pb-2"
                >
                    {reviews.map((r) => (
                        <SwiperSlide
                            key={r.id}
                            className="min-w-[280px] bg-gray-50 rounded-xl shadow p-4"
                        >
                            <div className="text-sm text-blue-700 font-semibold mb-1">{r.customer_name}</div>
                            <p className="text-sm text-gray-700 mb-2">"{r.comment}"</p>
                            <div className="text-xs text-gray-500">{r.category} | {r.created_at}</div>
                            <div className="mt-2 text-yellow-400 text-sm">{"★".repeat(r.rating)}</div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}