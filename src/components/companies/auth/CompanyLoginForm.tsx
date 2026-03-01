'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { companyLogin, getCompanySession } from '@/service/company/auth'

type Props = {
  /**
   * 로그인 성공 후 이동 경로
   * - 기본값: /companies
   */
  redirectTo?: string

  /**
   * 로그인 처리 함수를 외부에서 주입하고 싶을 때 사용
   * - 예) await onLogin({ login_id, password })
   * - 미지정 시, 이 컴포넌트가 기본 서비스(companyLogin/getCompanySession)로 로그인 처리
   */
  onLogin?: (payload: { login_id: string; password: string }) => Promise<void>

  /**
   * 로그인 직후 세션(/company/session) 확인까지 수행할지 여부
   * - 기본값: true
   */
  verifySessionAfterLogin?: boolean
}

export default function CompanyLoginForm({
  redirectTo = '/companies',
  onLogin,
  verifySessionAfterLogin = true,
}: Props) {
  const router = useRouter()

  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    return loginId.trim().length > 0 && password.trim().length > 0 && !loading
  }, [loginId, password, loading])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    const trimmedLoginId = loginId.trim()
    const trimmedPassword = password.trim()

    if (!trimmedLoginId || !trimmedPassword) {
      setErrorMessage('아이디와 비밀번호를 입력해 주세요.')
      return
    }

    try {
      setLoading(true)

      // 로그인 처리
      if (onLogin) {
        // 상위에서 주입한 로그인 로직 사용
        await onLogin({ login_id: trimmedLoginId, password: trimmedPassword })
      } else {
        // 기본 로그인 서비스 사용 (POST /company/login)
        await companyLogin({ login_id: trimmedLoginId, password: trimmedPassword })

        // 필요 시 세션 확인 (GET /company/session)
        if (verifySessionAfterLogin) {
          await getCompanySession()
        }
      }

      // 로그인 성공 후 이동
      router.push(redirectTo)
    } catch (err: any) {
      // fetch 기반 서비스는 보통 Error(message) 형태로 throw
      const msg =
        err?.message ||
        '로그인에 실패했습니다. 아이디/비밀번호를 확인해 주세요.'
      setErrorMessage(String(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="loginId" className="mb-1 block text-sm font-medium text-neutral-800">
          아이디
        </label>
        <input
          id="loginId"
          name="loginId"
          type="text"
          autoComplete="username"
          placeholder="예) client@company.com 또는 업체코드"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-neutral-800">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
        />
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 active:bg-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}