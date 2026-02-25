'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'

export default function ReviewSliderSection() {
    const reviews = [
        { id: 1, customer_name: '홍**', comment: '처음 세무 상담을 받아봤는데 너무 친절하게 설명해주시고 절세 방법까지 알려주셔서 신뢰가 생겼어요. 다시 이용할 의향이 있습니다.', rating: 5, created_at: '2024-06-01', category: '양도소득세' },
        { id: 2, customer_name: '김**', comment: '법인세 처리 관련해서 막막했는데 처음부터 끝까지 자세히 알려주시고 필요한 자료도 정리해주셔서 마음이 놓였습니다.', rating: 4, created_at: '2024-06-05', category: '법인세' },
        { id: 3, customer_name: '이**', comment: '기장 업무에 대해 잘 몰랐는데 상담부터 수임까지 전반적인 프로세스가 체계적이고 설명도 이해하기 쉽게 해주셨어요.', rating: 5, created_at: '2024-06-10', category: '기장업무' },
        { id: 4, customer_name: '박**', comment: '종합소득세 신고를 준비하면서 걱정이 많았는데, 담당 세무사님이 하나하나 정리해주셔서 불안함 없이 신고를 마칠 수 있었어요.', rating: 5, created_at: '2024-06-15', category: '종합소득세' },
        { id: 5, customer_name: '최**', comment: '부가세 신고 마감일 직전에 문의드렸는데도 신속하게 응대해주시고 필요한 자료도 빠르게 정리해주셨어요. 감사했습니다.', rating: 4, created_at: '2024-06-20', category: '부가가치세' },
        { id: 6, customer_name: '장**', comment: '답변이 빠르고 명확해서 세무 업무가 훨씬 수월해졌습니다. 다음에도 꼭 다시 맡기고 싶어요.', rating: 5, created_at: '2024-06-25', category: '양도소득세' },
        { id: 7, customer_name: '정**', comment: '모르는 세무 용어도 쉽게 풀어서 설명해주셔서 정말 좋았어요. 초보 사업자분들께 꼭 추천드리고 싶습니다.', rating: 4, created_at: '2024-06-28', category: '종합소득세' },
        { id: 8, customer_name: '한**', comment: '서류 준비나 전달이 번거롭지 않게 시스템화되어 있어서 매우 편리했습니다. 지방에서도 충분히 이용 가능한 서비스였어요.', rating: 5, created_at: '2024-06-30', category: '기장업무' },
    ]

    return (
        <section className="py-16 bg-white">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                  <p className="text-xs tracking-widest text-gray-400 bg-gray-100 inline-block px-2 py-1 rounded">REVIEW</p>
                  <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">실제 고객 후기</h2>
                  <p className="mt-3 text-sm sm:text-base text-gray-600">디케빈즈택스랩 이용 고객의 실제 후기입니다.</p>
                </div>
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={20}
                    loop={reviews.length > 5}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    rewind={true}
                    breakpoints={{
                        0: { slidesPerView: 1.1 },
                        480: { slidesPerView: 1.2 },
                        640: { slidesPerView: 1.5 },
                        768: { slidesPerView: 2.2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 5 },
                    }}
                    className="pb-2"
                >
                    {reviews.map((r) => (
                        <SwiperSlide
                            key={r.id}
                            className="w-full min-w-0 bg-white border border-gray-200 rounded-xl p-6 h-full hover:border-gray-300 transition"
                        >
                            <div className="flex flex-col justify-between h-full min-h-[180px] max-h-[240px] md:max-h-[280px] overflow-hidden">
                                <div>
                                    <div className="text-sm md:text-base text-gray-900 font-semibold mb-2">{r.customer_name}</div>
                                    <div className="flex justify-center">
                                        <p className="text-sm md:text-base text-gray-600 mb-2 leading-relaxed break-words text-center max-w-[34ch]">
                                            "{r.comment}"
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-end mt-auto">
                                    <div className="text-xs text-gray-400 mb-2">{r.category} | {r.created_at}</div>
                                    <div className="text-gray-400 text-sm md:text-base tracking-wide">
                                        {"★".repeat(r.rating)}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}