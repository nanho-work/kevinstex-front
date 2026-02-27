'use client'
import type { ReactNode } from 'react'
import { useState } from 'react'
import ClientSidebar from '@/components/client/Sidebar'
import ClientHeader from '@/components/client/Header'

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const toggleSidebar = () => setIsSidebarOpen((v) => !v)

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Client Header */}
      <ClientHeader />

      {/* Body */}
      <div className="relative flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar (toggle) */}
        <div
          className={`shrink-0 overflow-hidden border-r border-neutral-200 bg-white transition-[width] duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-0'
          }`}
        >
          <aside className="h-full w-64">
            <div className="h-full overflow-y-auto">
              <ClientSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
            </div>
          </aside>
        </div>

        {/* Re-open handle (when collapsed) */}
        {!isSidebarOpen ? (
          <button
            type="button"
            onClick={toggleSidebar}
            className="absolute left-0 top-4 z-10 rounded-r-lg border border-neutral-200 bg-white px-2 py-2 text-xs text-neutral-600 shadow-sm hover:bg-neutral-50 hover:text-neutral-900"
            aria-label="사이드바 열기"
          >
            {'>>'}
          </button>
        ) : null}

        {/* Content (scrolls) */}
        <main className="flex-1 overflow-y-auto px-6 py-8">{children}</main>
      </div>
    </div>
  )
}