import type { CompanySession } from '@/types/company'
import CompanyProfileField from './CompanyProfileField'

import Company_Document_Preview from './Company_Document_Preview'
import Company_Document_Actions from './Company_Document_Actions'
import { useCompanyBusinessLicenseDocument } from './Company_Document_State'

type Props = {
  session: CompanySession | null
}

export default function CompanyProfileCard({ session }: Props) {
  const doc = useCompanyBusinessLicenseDocument()

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
        {/* LEFT: 회사정보 (기존 그대로) */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="grid grid-cols-1 gap-6">
            <CompanyProfileField label="회사명" value={session?.company_name} />
            <CompanyProfileField label="사업자등록번호" value={session?.registration_number} />
            <CompanyProfileField label="대표자명" value={session?.owner_name} />
            <CompanyProfileField label="업태" value={session?.industry_type} />
            <CompanyProfileField label="종목" value={session?.business_type} />
            <CompanyProfileField label="우편번호" value={session?.postal_code} />
            <CompanyProfileField
              label="사업장 주소"
              value={session ? `${session.address1 ?? ''} ${session.address2 ?? ''}` : undefined}
            />
          </div>
        </div>

        {/* RIGHT: 사업자등록증 프리뷰 + 하단 액션 */}
        <div className="flex flex-col">
          <div className="min-h-[360px] flex-1">
            <Company_Document_Preview doc={doc} />
          </div>
          <Company_Document_Actions doc={doc} />
        </div>
      </div>

      <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4">
        <p className="text-xs text-neutral-500">
          사업장 정보 수정이 필요한 경우 담당 세무사에게 문의해 주세요.
        </p>
      </div>
    </div>
  )
}