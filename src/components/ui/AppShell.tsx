'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/ui/Header'
import FloatingButton from '@/components/ui/FloatingButton'
import Footer from '@/components/ui/Footer'

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isClientArea = pathname.startsWith('/companies')
  const isClientLogin = pathname.startsWith('/companies/login')
  const hideMarketing = isClientArea && !isClientLogin

  if (hideMarketing) {
    // /client 이후(로그인 후): 마케팅 UI 없이 children만
    return <>{children}</>
  }

  // 일반 페이지: 마케팅 UI 포함
  return (
    <>
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-4">{children}</main>
        <FloatingButton />
      </div>
      <Footer />
    </>
  )
}