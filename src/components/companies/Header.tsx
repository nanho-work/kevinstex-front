'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { companyLogout } from '@/service/company/auth'
import type { CompanySession } from '@/types/company'

function labelForSegment(seg: string): string {
  const map: Record<string, string> = {
    // 공통
    companies: '홈',
    employees: '직원관리',
    payroll: '급여관리',
    settings: '설정',
    profile: '사업장 정보',
    password: '비밀번호 변경',

    // 원천세
    withholding: '원천세 관리',
    'business-33': '사업소득(3.3%)',
    etc: '기타소득',
  }

  if (map[seg]) return map[seg]

  // id성 경로는 의미 없는 숫자 노출 대신 상세로 통일
  if (/^\d+$/.test(seg)) return '상세'

  // 기본 fallback: 하이픈/언더스코어를 공백으로
  return decodeURIComponent(seg).replace(/[-_]/g, ' ')
}

function buildBreadcrumb(pathname: string): string {
  const parts = pathname.split('?')[0].split('#')[0].split('/').filter(Boolean)

  // 포털 라우트 기준: /companies/...
  const idx = parts.indexOf('companies')
  const scoped = idx >= 0 ? parts.slice(idx) : parts

  // 로그인/공개 페이지는 브레드크럼 숨김
  if (scoped[0] === 'companies' && scoped[1] === 'login') return ''

  // /companies 만 있으면 "홈"
  if (scoped.length <= 1) return '홈'

  // 첫 세그먼트(companies=홈)는 표시에서 제외하고 하위만 표시
  const labels = scoped.slice(1).map(labelForSegment).filter(Boolean)
  return labels.length ? labels.join(' > ') : '홈'
}

export default function ClientHeader({
  session,
}: {
  session: CompanySession | null
}) {
  const router = useRouter()
  const pathname = usePathname()

  const breadcrumb = useMemo(() => buildBreadcrumb(pathname || '/'), [pathname])

  const handleLogout = () => {
    companyLogout()
    router.push('/companies/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="w-full px-4 py-3">
        <div className="flex w-full items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <Link href="/companies" className="text-sm font-semibold text-neutral-900">
                {session?.client_company_name ?? '세무사'}
              </Link>
              <span className="text-xs text-neutral-400">|</span>
              <span className="text-sm font-medium text-neutral-700">고객사 포털</span>
            </div>

            {breadcrumb ? (
              <div className="mt-1 text-xs text-neutral-500">{breadcrumb}</div>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* 검색: UI만(현재는 동작 없음) */}
            <div className="hidden sm:block">
              <label htmlFor="portalSearch" className="sr-only">
                검색
              </label>
              <input
                id="portalSearch"
                type="search"
                placeholder="검색"
                className="w-56 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 active:bg-neutral-950"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 모바일 검색(하단 한 줄) */}
        <div className="mt-2 sm:hidden">
          <label htmlFor="portalSearchMobile" className="sr-only">
            검색
          </label>
          <input
            id="portalSearchMobile"
            type="search"
            placeholder="검색"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
          />
        </div>
      </div>
    </header>
  )
}
