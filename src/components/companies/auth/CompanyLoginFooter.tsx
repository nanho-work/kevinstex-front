// src/components/companies/auth/CompanyLoginFooter.tsx

import Link from 'next/link'

export default function CompanyLoginFooter() {
  return (
    <div className="mt-6 text-center">
      <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
        홈으로 돌아가기
      </Link>
    </div>
  )
}