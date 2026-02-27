'use client';

import Link from 'next/link';
import { FaCommentDots, FaYoutube, FaArrowUp } from 'react-icons/fa';
import { PenLine } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function FloatingButton() {
  const pathname = usePathname();

  if (pathname.startsWith('/solution')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-0 z-50 flex flex-col items-center bg-[#F9FAFB]/20 rounded-l-xl shadow-lg overflow-hidden border border-[#D1D5DB]">

      {/* 상담 신청하기 */}
      <a
        href="https://map.naver.com/p/search/%EB%94%94%EC%BC%80%EB%B9%88%EC%A6%88%ED%83%9D%EC%8A%A4%EB%9E%A9/place/1166913410?c=15.00,0,0,0,dh&isCorrectAnswer=true&placePath=/ticket?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202507060007&locale=ko&svcName=map_pcv5&searchText=%EB%94%94%EC%BC%80%EB%B9%88%EC%A6%88%ED%83%9D%EC%8A%A4%EB%9E%A9"
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
      <a href="https://pf.kakao.com/_qJhkn/chat" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-24 h-16 border-b border-[#D1D5DB] hover:bg-[#EDF2F7]">
        <div className="flex flex-col items-center text-[#2563eb]">
          <img src="/kakao-talk.png" alt="KakaoTalk" className="w-5 h-5 mb-1" />
          <span className="text-xs">카톡상담</span>
        </div>
      </a>

      {/* 유튜브 바로가기 */}
      <a href="https://www.youtube.com/@%EC%84%B8%EB%AC%B4%EC%82%AC%EA%B6%8C%EB%8F%84%EC%9C%A4" target="_blank" rel="noopener noreferrer"
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