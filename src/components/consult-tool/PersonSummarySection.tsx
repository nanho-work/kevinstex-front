'use client'

interface Props {
  summary: any
}

function won(v: any) {
  const n = typeof v === 'number' ? v : Number(v)
  return (Number.isFinite(n) ? Math.round(n) : 0).toLocaleString()
}

function percent(rate: any, digits = 1) {
  const n = typeof rate === 'number' ? rate : Number(rate)
  if (!Number.isFinite(n)) return '-'
  return `${(n * 100).toFixed(digits)}%`
}

function Row({ label, value, strong }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm text-gray-600">{label}</div>
      <div className={strong ? 'text-sm font-semibold' : 'text-sm'}>{value}</div>
    </div>
  )
}

export default function PersonSummarySection({ summary }: Props) {
  return (
    <div className="border p-6 rounded space-y-4">
      <div className="space-y-1">
        <div className="font-semibold">합산 결과</div>
        <div className="text-xs text-gray-500">
          동일인 기준으로 사업장 소득을 합산한 뒤, 과세표준·세율(누진공제)로 1회 계산한 결과입니다.
        </div>
      </div>

      <div className="space-y-2">
        <Row label="소득금액 합계" value={`${won(summary.totalIncomeAmount)}원`} strong />
        <Row label="소득공제" value={`${won(summary.incomeDeduction)}원`} />
        <Row label="과세표준" value={`${won(summary.taxBase)}원`} strong />
      </div>

      <div className="border-t pt-4 space-y-2">
        <Row label="적용 세율" value={percent(summary.taxRate, 1)} />
        <Row label="누진공제" value={`${won(summary.progressiveDeduction)}원`} />
        <Row label="산출세액(소득세)" value={`${won(summary.incomeTax)}원`} strong />
      </div>

      <div className="border-t pt-4 space-y-2">
        <Row label="지방세" value={`${won(summary.localTax)}원`} />
        <Row label="총세액" value={`${won(summary.totalTax)}원`} strong />
      </div>

      <div className="border-t pt-4 space-y-2">
        <Row label="기납부세액" value={`${won(summary.prepaidTax)}원`} />
        <Row label="차(가)감세액" value={`${won(summary.diffTax)}원`} strong />
      </div>
    </div>
  )
}