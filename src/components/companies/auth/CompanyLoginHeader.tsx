// src/components/companies/auth/CompanyLoginHeader.tsx

export default function CompanyLoginHeader() {
  return (
    <div className="mb-6">
      <p className="text-sm text-neutral-500">고객사 전용</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
        고객사 로그인
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        아이디(이메일/업체코드)와 비밀번호를 입력해 주세요.
      </p>
    </div>
  )
}