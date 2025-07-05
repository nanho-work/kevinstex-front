import { useEffect } from 'react';
import type { Service } from '@/types/admin';

interface ServiceDetailModalProps {
  service: Service; // ✅ 이 부분이 없어서 오류 발생
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceDetailModal({
  service,
  isOpen,
  onClose,
}: ServiceDetailModalProps) {
  const { title, description, image_url } = service;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto transition-transform transform scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="닫기"
        >
          ×
        </button>
        {image_url && (
          <img
            src={image_url}
            alt={title}
            className="w-full h-60 object-cover rounded-md mb-4"
          />
        )}
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {description || '설명이 없습니다.'}
        </p>
      </div>
    </div>
  );
}