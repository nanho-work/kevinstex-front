'use client'

import Company_Document_Preview from './Company_Document_Preview'
import Company_Document_Actions from './Company_Document_Actions'
import { useCompanyBusinessLicenseDocument } from './Company_Document_State'

export default function Company_Document_Card() {
  const doc = useCompanyBusinessLicenseDocument()

  return (
    <div className="flex flex-col">
      <div className="min-h-full flex-1">
        <Company_Document_Preview doc={doc} />
      </div>

      <Company_Document_Actions doc={doc} />
    </div>
  )
}