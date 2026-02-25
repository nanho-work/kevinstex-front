'use client'

import IndustryCodeLookup from '@/components/consult-tool/IndustryCodeLookup'
import TaxCalculatorPanel from '@/components/consult-tool/TaxCalculatorPanel'

export default function ConsultToolPage() {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: 24 }}>
      <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 10 }}>
        상담용 계산기
      </div>
      <div
        style={{
          fontSize: 12,
          color: '#666',
          marginBottom: 16,
          lineHeight: 1.5,
        }}
      >
        사업장(1~4개)은 각각 입력하고, 소득공제/세율/기납부/차가감은 동일인 기준으로
        합산 계산합니다.
      </div>

      <div style={{ marginBottom: 18 }}>
        <IndustryCodeLookup />
      </div>

      <TaxCalculatorPanel />
    </div>
  )
}