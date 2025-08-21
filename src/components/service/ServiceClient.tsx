'use client';

import { useState } from 'react';

import ServiceSection from '@/components/service/ServiceSection';
import ServiceTabBar from '@/components/service/ServiceTabBar';

export default function ServiceClient() {
  const [selectedId, setSelectedId] = useState('consulting');

  return (
    <section className="min-h-screen bg-white  px-4">
      <div className="max-w-7xl mx-auto space-y-10 ">
        
        <div className="text-center px-2">
          <h2 className="text-xl md:text-3xl font-extrabold text-gray-900 leading-snug">
            기장, 절세, 창업, 컨설팅까지<br className="hidden md:inline" />
            어떤 세무 서비스도 전문가가 도와드립니다.
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-3">
            아래 항목에서 필요한 서비스를 찾아 자세히 확인해보세요.
          </p>
        </div>
        <ServiceTabBar selectedId={selectedId} setSelectedId={setSelectedId} />
        <ServiceSection selectedId={selectedId} />
      </div>
    </section>
  );
}