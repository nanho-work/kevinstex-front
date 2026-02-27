/* components/Header.tsx */
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Button from './Button'

const prefix = ''


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="w-full h-24 bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-8xl h-24 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src={`${prefix}/logo.png`}
            alt="로고"
            className="w-36 h-12 md:w-40 md:h-14 lg:w-44 lg:h-16 object-contain"
          />
        </Link>

        {/* 네비게이션 메뉴 (Desktop Only) */}
        <div className="hidden md:flex flex-1 justify-center">
          <nav className="flex items-center gap-8 lg:gap-10 text-sm lg:text-base text-gray-800 font-semibold tracking-tight">
            <Link
              href="/about"
              className={`${pathname === '/about'
                ? 'text-blue-800 bg-blue-50 scale-125 font-bold'
                : 'text-gray-800 hover:text-blue-800 hover:bg-gray-50'} transform transition duration-200 rounded-lg px-3 py-2`}
            >
              세무사소개
            </Link>
            <Link
              href="/service"
              className={`${pathname === '/service'
                ? 'text-blue-800 bg-blue-50 scale-125 font-bold'
                : 'text-gray-800 hover:text-blue-800 hover:bg-gray-50'} transform transition duration-200 rounded-lg px-3 py-2`}
            >
              서비스소개
            </Link>
            {/* <Link
              href="/correction"
              className={`${pathname === '/correction' ? 'text-blue-800 bg-blue-50' : 'text-gray-800 hover:text-blue-800 hover:bg-gray-50'} transition rounded-lg px-3 py-2`}
            >
              경정청구
            </Link> */}
            <Link
              href="/blog"
              className={`${pathname === '/blog'
                ? 'text-blue-800 bg-blue-50 scale-125 font-bold'
                : 'text-gray-800 hover:text-blue-800 hover:bg-gray-50'} transform transition duration-200 rounded-lg px-3 py-2`}
            >
              블로그
            </Link>
            <Link
              href="/location"
              className={`${pathname === '/location'
                ? 'text-blue-800 bg-blue-50 scale-125 font-bold'
                : 'text-gray-800 hover:text-blue-800 hover:bg-gray-50'} transform transition duration-200 rounded-lg px-3 py-2`}
            >
              오시는길
            </Link>
            <Link
              href="/faq"
              className={`${pathname === '/faq'
                ? 'text-blue-800 bg-blue-50 scale-125 font-bold'
                : 'text-gray-800 hover:text-blue-800 hover:bg-gray-50'} transform transition duration-200 rounded-lg px-3 py-2`}
            >
              자주묻는질문
            </Link>
          </nav>
        </div>

        {/* Hamburger Button (Mobile Only) */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="메뉴 열기">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 상담 버튼 (Desktop) */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4 justify-end">
          <Button
            href="https://map.naver.com/p/entry/place/1166913410..."
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="px-2 py-1 text-sm md:px-3 md:py-1.5 md:text-sm lg:px-4 lg:py-2 lg:text-base"
          >
            바로예약
          </Button>
          <Button
            href="https://pf.kakao.com/_qJhkn/chat"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="px-2 py-1 text-sm md:px-3 md:py-1.5 md:text-sm lg:px-4 lg:py-2 lg:text-base"
          >
            카카오상담
          </Button>
        </div>
      </div>


      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md p-4 space-y-2">
          <Link href="/about" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/about' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            세무사소개
          </Link>
          <Link href="/service" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/service' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            서비스소개
          </Link>
          <Link href="/correction" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/correction' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            경정청구
          </Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/blog' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            블로그
          </Link>
          <Link href="/location" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/location' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            오시는길
          </Link>
          <Link href="/faq" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/faq' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            자주묻는질문
          </Link>
        </div>
      )}
    </header>
  )
}