'use client';

import { services } from '@/data/serviceList';
import ReactMarkdown from 'react-markdown';

interface ServiceSectionProps {
  selectedId: string;
}

export default function ServiceSection({ selectedId }: ServiceSectionProps) {
  const selectedService = services.find((service) => service.id === selectedId);

  if (!selectedService) return null;

  return (
    <div className="px-4 md:px-8 lg:px-16 space-y-24">
      <section id={selectedService.id} className="scroll-mt-24">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{selectedService.title}</h2>
          <p className="text-gray-600 mt-1">{selectedService.subtitle}</p>
        </div>
        <div className="aspect-video overflow-hidden rounded-md mb-4">
          <img
            src={selectedService.image}
            alt={selectedService.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="prose prose-neutral max-w-none">
          <ReactMarkdown>{selectedService.content}</ReactMarkdown>
        </div>
      </section>
    </div>
  );
}