import type { ReactNode } from 'react'
import ClientSidebar from '@/components/client/Sidebar'
import ClientHeader from '@/components/client/Header'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Client Header */}
      <ClientHeader />

      {/* Body */}
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar (stays visible) */}
        <aside className="sticky top-0 h-full w-64 shrink-0 border-r border-neutral-200 bg-white">
          <div className="h-full overflow-y-auto">
            <ClientSidebar />
          </div>
        </aside>

        {/* Content (scrolls) */}
        <main className="flex-1 overflow-y-auto px-6 py-8">{children}</main>
      </div>
    </div>
  )
}