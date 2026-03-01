'use client'

import Link from 'next/link'

export default function CompanyPasswordHeader() {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-neutral-500">설정</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
            비밀번호 변경
          </h1>
        </div>

        <Link
          href="/companies/settings/profile"
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          프로필 보기
        </Link>
      </div>

      <p className="text-sm text-neutral-600">
        보안을 위해 주기적으로 비밀번호를 변경해 주세요.
      </p>
    </div>
  )
}