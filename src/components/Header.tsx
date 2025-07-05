/* components/Header.tsx */
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const prefix = process.env.NODE_ENV === 'production' ? '/kevinstex-front' : ''


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="w-full h-24 bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-24 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center space-x-2">
          <img src={`${prefix}/logo.png`} alt="로고" className="w-56 h-40 object-contain" />
        </Link>

        {/* 네비게이션 메뉴 (Desktop Only) */}
        <nav className="hidden md:flex space-x-6 text-lg text-gray-700">
          <Link href="/about" className={`${pathname === '/customer/about' ? 'text-blue-700 font-bold' : 'text-gray-700'} transition`}>
            세무사소개
          </Link>
          <Link href="/service" className={`${pathname === '/customer/service' ? 'text-blue-700 font-bold' : 'text-gray-700'} transition`}>
            서비스소개
          </Link>
          <Link href="/blog" className={`${pathname === '/customer/blog' ? 'text-blue-700 font-bold' : 'text-gray-700'} transition`}>
            블로그
          </Link>
          <Link href="/location" className={`${pathname === '/customer/location' ? 'text-blue-700 font-bold' : 'text-gray-700'} transition`}>
            오시는길
          </Link>
        </nav>

        {/* Hamburger Button (Mobile Only) */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 상담 버튼 (Desktop) */}
        <div className="hidden md:flex space-x-2">
          <Link href="/consult" className="px-4 py-1.5 text-sm rounded border font-bold border-gray-300 text-gray-700 hover:bg-gray-100">
            상담 신청하기
          </Link>
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
          <Link href="/blog" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/customer/blog' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            블로그
          </Link>
          <Link href="/location" onClick={() => setMenuOpen(false)} className={`block px-2 py-1 ${pathname === '/customer/location' ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
            오시는길
          </Link>
        </div>
      )}
    </header>
  )
}