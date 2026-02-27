'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ClientLoginPage() {
  const router = useRouter()
  return (
    <main className="min-h-[calc(100vh-80px)] w-full px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm text-neutral-500">고객사 전용</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
              고객사 로그인
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              아이디(이메일/업체코드)와 비밀번호를 입력해 주세요.
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              router.push('/client')
            }}
          >
            <div>
              <label
                htmlFor="loginId"
                className="mb-1 block text-sm font-medium text-neutral-800"
              >
                아이디
              </label>
              <input
                id="loginId"
                name="loginId"
                type="text"
                autoComplete="username"
                placeholder="예) client@company.com 또는 업체코드"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-neutral-800"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호를 입력하세요"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 active:bg-neutral-950"
            >
              로그인
            </button>

            <div className="pt-2 text-center">
              <p className="text-xs text-neutral-500">
                계정/비밀번호 관련 문의는 담당자에게 연락해 주세요.
              </p>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  )
}