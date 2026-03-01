'use client'

import { useCompanySession } from '@/app/(protected)/companies/layout'
import CompanyProfileHeader from './CompanyProfileHeader'
import CompanyProfileCard from './CompanyProfileCard'

export default function CompanyProfilePageView() {
  const session = useCompanySession()

  return (
    <div className="w-full px-6 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <CompanyProfileHeader />
        <CompanyProfileCard session={session} />
      </div>
    </div>
  )
}