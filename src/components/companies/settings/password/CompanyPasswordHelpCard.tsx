'use client'

export default function CompanyPasswordHelpCard() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-neutral-900">안내</h3>
      <ul className="mt-3 space-y-2 text-sm text-neutral-700">
        <li className="flex gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-300" />
          비밀번호 변경 후 일부 기기에서 재로그인이 필요할 수 있습니다.
        </li>
        <li className="flex gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-300" />
          계정 관련 문의는 담당 세무사에게 연락해 주세요.
        </li>
        <li className="flex gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-300" />
          보안을 위해 주기적으로 비밀번호를 변경하는 것을 권장합니다.
        </li>
      </ul>
    </div>
  )
}