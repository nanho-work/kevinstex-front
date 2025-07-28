'use client'

import Lottie from 'lottie-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'

import animation1 from '@/animations/Animation - 1749372495197.json';
import animation2 from '@/animations/Animation - 1749373280064.json';
import animation3 from '@/animations/Animation - 1749376199100.json';
import animation4 from '@/animations/Animation - 1749373179302.json';

const sliderItems = [
    {
        color: 'bg-yellow-200',
        title: '“간편한 세무 신고”',
        desc: ['법인세, 종소세, 부가세까지', '고객님의 상황에 꼭 맞는 세무 신고,', '전문가와 함께하세요.'],
        animation: animation1,
    },
    {
        color: 'bg-green-200',
        title: '세금, 덜 낼 수 있다면 더 좋겠죠?',
        desc: ['기장부터 절세 전략까지, 전담 직원이 챙깁니다.', '기업의 수익과 비용을 꼼꼼히 기록하고,', 'CFO처럼 관리해드립니다.'],
        animation: animation2,
    },
    {
        color: 'bg-blue-200',
        title: '처음 시작하는 사업, 어디서부터 어떻게?',
        desc: ['창업 단계부터 함께 케어 해드립니다.', '처음 시작도 걱정 없이 준비하세요.'],
        animation: animation3,
    },
    {
        color: 'bg-purple-200',
        title: '“혼자서 경영 고민, 버겁지 않으셨나요?”',
        desc: ['전문 세무사의 전략적 컨설팅', '재무 개선부터 성장 전략까지 지원합니다.'],
        animation: animation4,
    },
]

export default function ServiceSlider() {
    return (
        <Swiper
            spaceBetween={24}
            loop
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination, Navigation]}
            breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 1 },
                1024: { slidesPerView: 1 },
            }}
            className="max-w-5xl mx-auto px-4"
        >
            {sliderItems.map((item, index) => (
                <SwiperSlide key={index}>
                    <div className={`${item.color} rounded-3xl p-6 md:p-10 flex flex-col items-center text-center space-y-6 shadow-md transition-all duration-700 ease-in-out`}>
                        <div className="w-40 h-40 md:w-60 md:h-60">
                            <Lottie animationData={item.animation} loop autoplay />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{item.title}</h1>
                            {item.desc.map((line, i) => (
                                <p key={i} className="text-sm md:text-lg text-gray-700">{line}</p>
                            ))}
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}