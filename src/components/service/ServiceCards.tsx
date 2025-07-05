'use client'

import { useEffect, useState } from 'react'
import ServiceDetailModal from './ServiceDetailModal'

// ✅ 타입 선언 (별도 types 파일 없이 내부에서 선언)
interface Service {
  id: number
  title: string
  summary: string
  description: string
  image_url: string
}

export default function ServiceCardList() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchServices = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services/all`)
      const data = await res.json()
      setServices(data)
    } catch (err) {
      console.error('서비스 불러오기 실패:', err)
    }
  }

  const onOpenModal = (service: Service) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const onCloseModal = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-blue-50 rounded-2xl p-6 shadow-md relative min-h-[180px] cursor-pointer"
            onClick={() => onOpenModal(service)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4 text-left">
                <h2 className="text-xl font-bold text-gray-800">{service.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{service.summary}</p>
              </div>
              <div className="w-28 h-28 rounded-xl overflow-hidden">
                <img src={service.image_url} alt="icon" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="absolute bottom-4 left-6 text-xl text-gray-500 hover:text-gray-700">
              ❯❯❯
            </span>
          </div>
        ))}
      </div>

      {/* 상세 모달 */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          isOpen={isModalOpen}
          onClose={onCloseModal}
        />
      )}
    </section>
  )
}