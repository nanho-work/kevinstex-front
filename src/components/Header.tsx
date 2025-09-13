/* components/Header.tsx */
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Button from './ui/Button'

const prefix = ''


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="w-full h-24 bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto h-24 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center space-x-2 pl-4">
          <img src={`${prefix}/logo.png`} alt="로고" className="w-56 h-40 object-contain" />
        </Link>

        {/* 네비게이션 메뉴 (Desktop Only) */}
        <nav className="hidden md:flex space-x-14 text-lg text-gray-800 font-bold tracking-tight ml-auto">
          <Link href="/about" className={`${pathname === '/about' ? 'text-blue-700 bg-blue-50 rounded px-2 py-1' : ''} transition`}>
            세무사소개
          </Link>
          <Link href="/service" className={`${pathname === '/service' ? 'text-blue-700 bg-blue-50 rounded px-2 py-1' : ''} transition`}>
            서비스소개
          </Link>
          <Link href="/correction" className={`${pathname === '/correction' ? 'text-blue-700 bg-blue-50 rounded px-2 py-1' : ''} transition`}>
            경정청구
          </Link>
          <Link href="/blog" className={`${pathname === '/blog' ? 'text-blue-700 bg-blue-50 rounded px-2 py-1' : ''} transition`}>
            블로그
          </Link>
          <Link href="/location" className={`${pathname === '/location' ? 'text-blue-700 bg-blue-50 rounded px-2 py-1' : ''} transition`}>
            오시는길
          </Link>
          <Link href="/faq" className={`${pathname === '/faq' ? 'text-blue-700 bg-blue-50 rounded px-2 py-1' : ''} transition`}>
            자주묻는질문
          </Link>
        </nav>

        {/* Hamburger Button (Mobile Only) */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 상담 버튼 (Desktop) */}
        <div className="hidden md:flex ml-24 pr-4 space-x-4">
          <Button
            href="https://map.naver.com/p/entry/place/1166913410..."
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
          >
            상담신청
          </Button>
          <Button
            href="/solution"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
          >
            세급환급조회
          </Button>
        </div>
      </div>


      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md p-4 space-y-2">
          <Link href="/about" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/customer/about' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            세무사소개
          </Link>
          <Link href="/service" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/customer/service' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            서비스소개
          </Link>
          <Link href="/correction" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/customer/correction' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            경정청구
          </Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/customer/blog' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            블로그
          </Link>
          <Link href="/location" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/customer/location' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            오시는길
          </Link>
          <Link href="/faq" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/customer/faq' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            자주묻는질문
          </Link>
        </div>
      )}
    </header>
  )
}