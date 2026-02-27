'use client'

import Link from 'next/link'

export default function ClientHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-semibold text-neutral-900">
            The Kevin’s Tax Lab
          </Link>
          <span className="text-xs text-neutral-400">|</span>
          <span className="text-sm font-medium text-neutral-700">고객사</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
          >
            홈으로
          </Link>
          <button
            type="button"
            className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 active:bg-neutral-950"
          >
            로그아웃(예시)
          </button>
        </div>
      </div>
    </header>
  )
}