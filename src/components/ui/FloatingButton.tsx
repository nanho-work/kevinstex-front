'use client';

import Image from 'next/image';
import { FaYoutube } from 'react-icons/fa';
import { PenLine } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { KAKAO_CHAT_URL, NAVER_RESERVATION_URL, YOUTUBE_CHANNEL_URL } from '@/constants/externalLinks';

export default function FloatingButton() {
  const pathname = usePathname();

  if (pathname === '/' || pathname.startsWith('/solution')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-0 z-50 flex flex-col items-center bg-[#F9FAFB]/20 rounded-l-xl shadow-lg overflow-hidden border border-[#D1D5DB]">

      {/* 상담 신청하기 */}
      <a
        href={NAVER_RESERVATION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-24 h-16 border-b border-[#D1D5DB] hover:bg-[#EDF2F7]"
      >
        <div className="flex flex-col items-center text-[#2563eb]">
          <PenLine className="w-5 h-5" />
          <span className="text-xs mt-1">상담신청</span>
        </div>
      </a>

      {/* 카카오톡 상담 */}
      <a href={KAKAO_CHAT_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-24 h-16 border-b border-[#D1D5DB] hover:bg-[#EDF2F7]">
        <div className="flex flex-col items-center text-[#2563eb]">
          <Image src="/kakao-talk.png" alt="KakaoTalk" width={20} height={20} className="mb-1 h-5 w-5" />
          <span className="text-xs">카톡상담</span>
        </div>
      </a>

      {/* 유튜브 바로가기 */}
      <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center w-24 h-16 border-b border-[#D1D5DB] hover:bg-[#EDF2F7]">
        <div className="flex flex-col items-center text-[#2563eb]">
          <FaYoutube size={20} />
          <span className="text-xs mt-1">Youtube</span>
        </div>
      </a>

      {/* TOP 버튼 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex items-center justify-center w-24 h-10 bg-[#2563eb] text-white text-xs"
      >
        ↑ TOP
      </button>
    </div>
  );
}
