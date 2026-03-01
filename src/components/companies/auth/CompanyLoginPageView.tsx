// src/components/companies/auth/CompanyLoginPageView.tsx

import CompanyLoginHeader from './CompanyLoginHeader'
import CompanyLoginForm from './CompanyLoginForm'
import CompanyLoginFooter from './CompanyLoginFooter'

type Props = {
  /**
   * 로그인 성공 후 이동 경로 (기본: /companies)
   * - 아직 실제 로그인 연동 전이라도, 화면 플로우 테스트에 사용 가능
   */
  redirectTo?: string
}

export default function CompanyLoginPageView({ redirectTo = '/companies' }: Props) {
  return (
    <main className="min-h-[calc(100vh-80px)] w-full px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <CompanyLoginHeader />
          <CompanyLoginForm redirectTo={redirectTo} />
          <div className="pt-2 text-center">
            <p className="text-xs text-neutral-500">
              계정/비밀번호 관련 문의는 담당자에게 연락해 주세요.
            </p>
          </div>
        </div>

        <CompanyLoginFooter />
      </div>
    </main>
  )
}