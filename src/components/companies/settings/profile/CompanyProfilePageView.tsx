'use client'

import { useCompanySession } from '@/app/(protected)/companies/layout'
import CompanyProfileHeader from './CompanyProfileHeader'
import CompanyProfileCard from './CompanyProfileCard'

import Company_Document_Card from './Company_Document_Card'

export default function CompanyProfilePageView() {
  const session = useCompanySession()

  return (
    <div className="w-full px-6 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <CompanyProfileHeader />

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 ">
          {/* LEFT: 회사정보 카드 */}
          <CompanyProfileCard session={session} />

          {/* RIGHT: 사업자등록증 카드 */}
          <Company_Document_Card />
        </div>
      </div>
    </div>
  )
}