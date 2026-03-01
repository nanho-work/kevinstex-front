import type { CompanySession } from '@/types/company'
import CompanyProfileField from './CompanyProfileField'

type Props = {
  session: CompanySession | null
}

export default function CompanyProfileCard({ session }: Props) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
        <CompanyProfileField
          label="회사명"
          value={session?.company_name}
        />

        <CompanyProfileField
          label="사업자등록번호"
          value={session?.registration_number}
        />

        <CompanyProfileField
          label="대표자명"
          value={session?.owner_name}
        />

        <CompanyProfileField
          label="업태"
          value={session?.industry_type}
        />

        <CompanyProfileField
          label="종목"
          value={session?.business_type}
        />

        <CompanyProfileField
          label="우편번호"
          value={session?.postal_code}
        />

        <div className="md:col-span-2">
          <CompanyProfileField
            label="사업장 주소"
            value={
              session
                ? `${session.address1 ?? ''} ${session.address2 ?? ''}`
                : undefined
            }
          />
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