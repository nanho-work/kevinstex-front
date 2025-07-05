// ReviewSlider.tsx
'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import ReviewCard from './ReviewCard'

const reviews = [
  {
    id: 1,
    customer_name: '홍길동',
    comment: '정말 친절한 상담이었습니다.',
    rating: 5,
    created_at: '2024-06-01T12:00:00Z',
    category: '양도소득세',
  },
  {
    id: 2,
    customer_name: '김철수',
    comment: '믿고 맡길 수 있는 세무사님!',
    rating: 4,
    created_at: '2024-06-05T15:00:00Z',
    category: '법인세',
  },
  // ...추가 리뷰
]

export default function ReviewSlider() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold text-blue-900 mb-6">실제 고객 후기</h2>
        <Swiper
          spaceBetween={16}
          slidesPerView={'auto'}
          loop
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="min-w-[280px]">
              <ReviewCard {...review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}