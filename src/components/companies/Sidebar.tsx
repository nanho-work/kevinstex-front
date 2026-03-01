'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { CompanySession } from '@/types/company'

const menus = [
  { label: '대시보드', href: '/companies' },
  { label: '사업소득(3.3%)', href: '/companies/business' },
  { label: '근로소득(4대보험)', href: '/companies/payroll' },
  { label: '직원관리', href: '/companies/employees' },
]

const settingsMenus = [
  { label: '사업장 정보', href: '/companies/settings/profile' },
  { label: '비밀번호 변경', href: '/companies/settings/password' },
]

type ClientSidebarProps = {
  isOpen: boolean
  onToggle: () => void
  session: CompanySession | null
  sessionLoading?: boolean
  sessionError?: string | null
}

export default function ClientSidebar({ isOpen, onToggle, session, sessionLoading = false, sessionError = null }: ClientSidebarProps) {
  const pathname = usePathname()

  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    // settings 하위 페이지에 들어오면 자동으로 펼침
    if (pathname?.startsWith('/companies/settings')) {
      setSettingsOpen(true)
    }
  }, [pathname])

  const todayText = useMemo(() => {
    try {
      return new Date().toLocaleDateString('ko-KR')
    } catch {
      return ''
    }
  }, [])

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col">

      {/* 사업장 정보 */}
      <div className="border-b border-neutral-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-500">사업장</p>
          <button
            onClick={onToggle}
            className="rounded-md px-2 py-1 text-lg font-medium text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label={isOpen ? '사이드바 접기' : '사이드바 펼치기'}
          >
            {isOpen ? '<<' : '>>'}
          </button>
        </div>

        {sessionLoading ? (
          <>
            <div className="mt-2 h-4 w-40 animate-pulse rounded bg-neutral-100" />
            <div className="mt-2 h-3 w-56 animate-pulse rounded bg-neutral-100" />
          </>
        ) : session ? (
          <>
            <p className="mt-1 text-sm font-semibold text-neutral-900">{session.company_name}</p>
            <p className="mt-1 text-xs text-neutral-500">사업자번호: {session.registration_number}</p>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm font-semibold text-neutral-900">세션 없음</p>
            <p className="mt-1 text-xs text-neutral-500">
              {sessionError ? sessionError : '로그인 후 이용해 주세요.'}
            </p>
          </>
        )}

        <p className="mt-2 text-xs text-neutral-400">{todayText}</p>
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

          {/* 설정(트리) */}
          <li className="pt-3">
            <button
              type="button"
              onClick={() => setSettingsOpen((v) => !v)}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm transition ${
                pathname?.startsWith('/companies/settings')
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              aria-expanded={settingsOpen}
            >
              <span className="font-medium">설정</span>
              <span className="text-lg font-semibold text-neutral-600">
                {settingsOpen ? '▾' : '▸'}
              </span>
            </button>

            {settingsOpen && (
              <ul className="mt-1 space-y-1 pl-2">
                {settingsMenus.map((m) => {
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
            )}
          </li>
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