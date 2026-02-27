'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menus = [
  { label: '대시보드', href: '/client' },
  { label: '사업소득(3.3%)', href: '/client/business' },
  { label: '근로소득(4대보험)', href: '/client/payroll' },
  { label: '직원관리', href: '/client/employees' },
]

export default function ClientSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col">
      {/* 사업장 정보 */}
      <div className="border-b border-neutral-200 px-5 py-6">
        <p className="text-xs text-neutral-500">로그인 사업장</p>
        <p className="mt-1 text-sm font-semibold text-neutral-900">00회사</p>
        <p className="mt-1 text-xs text-neutral-500">
          사업자번호: 123-45-67890
        </p>
        <p className="mt-2 text-xs text-neutral-400">
          {new Date().toLocaleDateString('ko-KR')}
        </p>
      </div>

      {/* 메뉴 */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-2 pb-2 text-xs font-medium text-neutral-500">메뉴</p>
        <ul className="space-y-1">
          {menus.map((m) => {
            const active = pathname === m.href
            return (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className={`block rounded-lg px-4 py-2 text-sm transition ${
                    active
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {m.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 하단 정보(선택) */}
      <div className="border-t border-neutral-200 px-5 py-4">
        <p className="text-xs text-neutral-500">문의</p>
        <p className="mt-1 text-sm text-neutral-700">담당자에게 연락</p>
      </div>
    </div>
  )
}