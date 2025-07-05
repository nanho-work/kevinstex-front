'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'

export default function ReviewSliderSection() {
    const reviews = [
        { id: 1, customer_name: '홍길동', comment: '세무 상담이 명확하고 친절했어요.', rating: 5, created_at: '2024-06-01', category: '양도소득세' },
        { id: 2, customer_name: '김철수', comment: '상세한 설명 덕분에 불안함이 해소됐습니다.', rating: 4, created_at: '2024-06-05', category: '법인세' },
        { id: 3, customer_name: '이영희', comment: '초보자도 이해하기 쉽게 설명해줘서 좋았어요.', rating: 5, created_at: '2024-06-10', category: '기장업무' },
        { id: 4, customer_name: '박민수', comment: '복잡한 세금 문제도 쉽게 해결됐습니다.', rating: 5, created_at: '2024-06-15', category: '종합소득세' },
        { id: 5, customer_name: '최지현', comment: '신고 준비가 편하고 빠르게 처리됐어요.', rating: 4, created_at: '2024-06-20', category: '부가가치세' },
        { id: 6, customer_name: '장예은', comment: '빠른 대응과 정확한 상담이 인상 깊었어요.', rating: 5, created_at: '2024-06-25', category: '양도소득세' },
        { id: 7, customer_name: '정우진', comment: '어려운 세무 용어를 쉽게 설명해주셔서 좋았습니다.', rating: 4, created_at: '2024-06-28', category: '종합소득세' },
        { id: 8, customer_name: '한소영', comment: '서류 준비부터 마무리까지 너무 편했어요.', rating: 5, created_at: '2024-06-30', category: '기장업무' },
    ]

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto overflow-x-hidden">
                <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-6">실제 고객 후기</h2>
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={16}
                    loop
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    observer
                    observeParents
                    breakpoints={{
                        0: { slidesPerView: 1.1 },
                        480: { slidesPerView: 1.2 },
                        640: { slidesPerView: 1.5 },
                        768: { slidesPerView: 2.2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                    className="pb-2"
                >
                    {reviews.map((r) => (
                        <SwiperSlide
                            key={r.id}
                            className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-gray-50 rounded-xl shadow p-4 h-full flex-shrink-0"
                        >
                            <div className="flex flex-col justify-between h-full min-h-[180px] max-h-[240px] md:max-h-[280px] overflow-hidden">
                                <div>
                                    <div className="text-sm md:text-base text-blue-700 font-semibold mb-1">{r.customer_name}</div>
                                    <p className="text-sm md:text-base text-gray-700 mb-2 line-clamp-3">"{r.comment}"</p>
                                    <div className="text-xs text-gray-500">{r.category} | {r.created_at}</div>
                                </div>
                                <div className="mt-2 text-yellow-400 text-sm md:text-base">
                                    {"★".repeat(r.rating)}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}