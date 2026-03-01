'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { changeCompanyPassword } from '@/service/company/auth'

export default function CompanyPasswordForm() {
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // 실시간 검증: 새 비밀번호/확인 불일치
  const isConfirmTouched = confirmPassword.length > 0
  const isPasswordMismatch = isConfirmTouched && newPassword !== confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('모든 항목을 입력해 주세요.')
      return
    }

    if (isPasswordMismatch) {
      setError('새 비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      setLoading(true)

      await changeCompanyPassword({
        current_password: currentPassword,
        new_password: newPassword,
      })

      setSuccess('비밀번호가 정상적으로 변경되었습니다.')

      // 입력값 초기화
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // 필요하면 강제 로그아웃 처리 가능
      // router.push('/companies/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : '비밀번호 변경 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-neutral-900">
          비밀번호 변경
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          현재 비밀번호 확인 후 새 비밀번호로 변경합니다.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* 현재 비밀번호 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">
            현재 비밀번호
          </label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 pr-12 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-1 py-1 text-xs font-medium text-neutral-500 transition hover:text-neutral-900 hover:font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/10"
              aria-label="현재 비밀번호 표시 전환"
            >
              {showCurrent ? '숨김' : '보기'}
            </button>
          </div>
        </div>

        {/* 새 비밀번호 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">
            새 비밀번호
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                if (success) setSuccess(null)
                if (error) setError(null)
              }}
              placeholder="새 비밀번호"
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 pr-12 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-1 py-1 text-xs font-medium text-neutral-500 transition hover:text-neutral-900 hover:font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/10"
              aria-label="새 비밀번호 표시 전환"
            >
              {showNew ? '숨김' : '보기'}
            </button>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            권장: 8자 이상, 영문/숫자/특수문자 조합
          </p>
        </div>

        {/* 새 비밀번호 확인 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-800">
            새 비밀번호 확인
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (success) setSuccess(null)
                if (error) setError(null)
              }}
              placeholder="새 비밀번호 재입력"
              className={`w-full rounded-lg border bg-white px-3 py-2 pr-12 text-sm text-neutral-900 outline-none transition ${
                isPasswordMismatch
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                  : 'border-neutral-300 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-1 py-1 text-xs font-medium text-neutral-500 transition hover:text-neutral-900 hover:font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/10"
              aria-label="새 비밀번호 확인 표시 전환"
            >
              {showConfirm ? '숨김' : '보기'}
            </button>
          </div>
          {isPasswordMismatch ? (
            <p className="mt-2 text-xs text-red-600">새 비밀번호가 일치하지 않습니다.</p>
          ) : null}
        </div>

        {/* 에러/성공 메시지 */}
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {success}
          </div>
        ) : null}

        {/* 버튼 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/companies"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
          >
            취소
          </Link>

          <button
            type="submit"
            disabled={loading || isPasswordMismatch}
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 active:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </div>
      </form>
    </div>
  )
}