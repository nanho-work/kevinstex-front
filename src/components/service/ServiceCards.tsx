'use client'


import ServiceDetailModal from '@/components/service/ServiceDetailModal'
import { useState } from 'react'

// ✅ 하드코딩된 정적 서비스 데이터
const services = [
  {
    title: '간편한 세무 신고',
    summary: '법인세, 종소세, 부가세까지 한 번에!',
    image_url: '/images/service1.png',
    description: '상세 설명 1',
  },
  {
    title: '절세 전략',
    summary: '전담 직원이 기장부터 절세까지 챙깁니다.',
    image_url: '/images/service2.png',
    description: '상세 설명 2',
  },
  {
    title: '창업 지원',
    summary: '사업 초기에 꼭 필요한 지원을 해드립니다.',
    image_url: '/images/service3.png',
    description: '상세 설명 3',
  },
  {
    title: '전략 컨설팅',
    summary: '경영 전략부터 재무 설계까지 전문 지원',
    image_url: '/images/service4.png',
    description: '상세 설명 4',
  },
]

export default function ServicesCardView() {
  const [selectedService, setSelectedService] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onOpenModal = (service: any) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const onCloseModal = () => setIsModalOpen(false)

  return (
    <section className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-20">
        {/* 설명 배너 */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            기장, 절세, 창업, 컨설팅까지<br className="hidden md:inline" />
            어떤 세무 서비스도 전문가가 도와드립니다.
          </h2>
          <p className="text-gray-600 mt-2">
            아래 항목에서 필요한 서비스를 찾아 자세히 확인해보세요.
          </p>
        </div>

        {/* 카드뷰 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className={`col-span-1 rounded-2xl p-6 shadow-md relative min-h-[180px] ${
                i % 2 === 0 ? 'bg-pink-50' : 'bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4 text-left">
                  <h2 className="text-xl font-bold text-gray-800">{service.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{service.summary}</p>
                </div>
                <div className="w-40 h-40 rounded-xl overflow-hidden">
                  <img src={service.image_url} alt="icon" className="w-full h-full object-cover" />
                </div>
              </div>
              <button
                onClick={() => onOpenModal(service)}
                className="absolute bottom-4 left-6 text-xl text-gray-500 hover:text-gray-700"
              >
                ❯❯❯
              </button>
            </div>
          ))}
        </div>

        {/* 상세보기 모달 */}
        {selectedService && (
          <ServiceDetailModal
            service={selectedService}
            isOpen={isModalOpen}
            onClose={onCloseModal}
          />
        )}

      </div>
    </section>
  )
}