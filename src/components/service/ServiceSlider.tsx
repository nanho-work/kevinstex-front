'use client'

import Lottie from 'lottie-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'

const sliderItems = [
  {
    color: 'bg-yellow-50',
    title: '“간편한 세무 신고”',
    desc: ['법인세, 종소세, 부가세까지', '고객님의 상황에 꼭 맞는 세무 신고,', '전문가와 함께하세요.'],
    animation: require('/public/animations/Animation - 1749372495197.json'),
  },
  {
    color: 'bg-green-50',
    title: '세금, 덜 낼 수 있다면 더 좋겠죠?',
    desc: ['기장부터 절세 전략까지, 전담 직원이 챙깁니다.', '기업의 수익과 비용을 꼼꼼히 기록하고,', 'CFO처럼 관리해드립니다.'],
    animation: require('/public/animations/Animation - 1749373280064.json'),
  },
  {
    color: 'bg-blue-50',
    title: '처음 시작하는 사업, 어디서부터 어떻게?',
    desc: ['창업 단계부터 함께 케어 해드립니다.', '처음 시작도 걱정 없이 준비하세요.'],
    animation: require('/public/animations/Animation - 1749376199100.json'),
  },
  {
    color: 'bg-purple-50',
    title: '“혼자서 경영 고민, 버겁지 않으셨나요?”',
    desc: ['전문 세무사의 전략적 컨설팅', '재무 개선부터 성장 전략까지 지원합니다.'],
    animation: require('/public/animations/Animation - 1749373179302.json'),
  },
]

export default function ServiceSlider() {
  return (
    <Swiper
      spaceBetween={40}
      loop
      autoplay={{ delay: 5000 }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination, Navigation]}
      className="max-w-5xl mx-auto swiper-container"
    >
      {sliderItems.map((item, index) => (
        <SwiperSlide key={index}>
          <div className={`${item.color} rounded-3xl p-10 flex flex-col items-center text-center space-y-6 shadow-md`}>
            <div className="w-60 h-60">
              <Lottie animationData={item.animation} loop autoplay />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{item.title}</h1>
              {item.desc.map((line, i) => (
                <p key={i} className="text-gray-600 text-lg md:text-xl">{line}</p>
              ))}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}