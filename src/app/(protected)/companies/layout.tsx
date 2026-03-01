'use client'
import type { CompanySession } from '@/types/company'
import type { ReactNode } from 'react'
import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { getCompanySession } from '@/service/company/auth'
import ClientSidebar from '@/components/companies/Sidebar'
import ClientHeader from '@/components/companies/Header'

const CompanySessionContext = createContext<CompanySession | null>(null)

export function useCompanySession() {
  return useContext(CompanySessionContext)
}

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const toggleSidebar = () => setIsSidebarOpen((v) => !v)

  const router = useRouter()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [session, setSession] = useState<CompanySession | null>(null)

  useEffect(() => {
    let alive = true

    ;(async () => {
      try {
        const s = await getCompanySession()
        if (!alive) return
        setSession(s)
        setSessionChecked(true)
      } catch {
        if (!alive) return
        setSession(null)
        setSessionChecked(true)
        router.replace('/companies/login')
      }
    })()

    return () => {
      alive = false
    }
  }, [router])

  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-sm text-neutral-500">
        세션 확인 중...
      </div>
    )
  }

  return (
    <CompanySessionContext.Provider value={session}>
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <ClientHeader session={session} />

        {/* Body */}
        <div className="relative flex h-[calc(100vh-64px)] overflow-hidden">
          {/* Sidebar */}
          <div
            className={`shrink-0 overflow-hidden border-r border-neutral-200 bg-white transition-[width] duration-300 ease-in-out ${
              isSidebarOpen ? 'w-64' : 'w-0'
            }`}
          >
            <aside className="h-full w-64">
              <div className="h-full overflow-y-auto">
                <ClientSidebar
                  isOpen={isSidebarOpen}
                  onToggle={toggleSidebar}
                  session={session}
                />
              </div>
            </aside>
          </div>

          {/* Re-open handle */}
          {!isSidebarOpen && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="absolute left-0 top-4 z-10 rounded-r-lg border border-neutral-200 bg-white px-2 py-2 text-xs text-neutral-600 shadow-sm hover:bg-neutral-50 hover:text-neutral-900"
              aria-label="사이드바 열기"
            >
              {'>>'}
            </button>
          )}

          {/* Content */}
          <main className="flex-1 overflow-y-auto px-6 py-8">
            {children}
          </main>
        </div>
      </div>
    </CompanySessionContext.Provider>
  )
}