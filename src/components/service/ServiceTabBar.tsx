'use client';

import { services } from '@/data/serviceList';


interface ServiceTabBarProps {
  selectedId: string;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
}


export default function ServiceTabBar({ selectedId, setSelectedId }: ServiceTabBarProps) {
  return (
    <nav className="sticky top-0 z-20 bg-white border-b shadow-sm">
      <ul className="flex overflow-x-auto whitespace-nowrap text-sm md:text-base font-medium px-4">
        {services.map((service) => (
          <li
            key={service.id}
            onClick={() => setSelectedId(service.id)}  // scrollToSection 대신 상태 변경
            className={`cursor-pointer py-4 px-3 hover:text-blue-600 transition-colors flex-shrink-0 ${
              selectedId === service.id ? 'text-blue-600 font-bold' : ''
            }`}
          >
            {service.title}
          </li>
        ))}
      </ul>
    </nav>
  );
}