'use client'

import { useMemo, useState } from 'react'
import {
  calculatePersonTax,
  PersonTaxInput,
  ExpenseMode,
} from '@/service/taxCalculator'
import BusinessSection from './BusinessSection'
import PersonCommonSection from './PersonCommonSection'
import PersonSummarySection from './PersonSummarySection'

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x))
}

function formatRate(rate: number, digits = 1) {
  const v = Number.isFinite(rate) ? rate : 0
  return `${(v * 100).toFixed(digits)}%`
}

// 퍼센트포인트(pp) 델타 라벨: -0.04 -> "-4%p"
function percentLabel(delta: number) {
  const pp = Math.round(delta * 1000) / 10 // 0.02 -> 2.0
  if (pp === 0) return '기준'
  const sign = pp > 0 ? '+' : ''
  return `${sign}${pp}%p`
}

export default function TaxCalculatorPanel() {
  const [businesses, setBusinesses] = useState<
    PersonTaxInput['businesses']
  >([
    {
      industryCode: '',
      grossIncome: 0,
      expenseMode: 'RATE' as ExpenseMode,
      expenseRate: 0,
      expenseItems: {},
    },
  ])

  const [deductionTotal, setDeductionTotal] = useState<number>(0)
  const [deductionItems, setDeductionItems] = useState({})
  const [prepaidTax, setPrepaidTax] = useState<number>(0)
  const [taxYear, setTaxYear] = useState<number>(2024)

  // ±2,4,6,8,10%p 시뮬레이션 (퍼센트포인트 기준)
  const deltas = useMemo(
    () => [-0.10, -0.08, -0.06, -0.04, -0.02, 0, 0.02, 0.04, 0.06, 0.08, 0.10],
    []
  )
  const baseIndex = deltas.indexOf(0)

  const [selectedDeltaIndex, setSelectedDeltaIndex] = useState<number>(baseIndex)
  const [showSettings, setShowSettings] = useState(false)

  // delta별 결과를 미리 계산(표시/이동이 즉시 되도록)
  const simulations = useMemo(() => {
    return deltas.map((delta) => {
      const adjustedBusinesses: PersonTaxInput['businesses'] = businesses.map((b) => {
        const baseRate = typeof b.expenseRate === 'number' ? b.expenseRate : 0
        const nextRate = clamp01(baseRate + delta)

        return {
          ...b,
          expenseMode: 'RATE',
          expenseRate: nextRate,
        }
      })

      const result = calculatePersonTax({
        businesses: adjustedBusinesses,
        deductionTotal,
        deductionItems,
        prepaidTax,
        taxYear,
      })

      return {
        delta,
        label: percentLabel(delta),
        businesses: adjustedBusinesses,
        summary: result.summary,
      }
    })
  }, [deltas, businesses, deductionTotal, deductionItems, prepaidTax, taxYear])

  const current = simulations[selectedDeltaIndex] ?? simulations[baseIndex]
  const left = simulations[selectedDeltaIndex - 1] ?? null
  const right = simulations[selectedDeltaIndex + 1] ?? null

  const canLeft = selectedDeltaIndex > 0
  const canRight = selectedDeltaIndex < simulations.length - 1

  const goBase = () => setSelectedDeltaIndex(baseIndex)

  return (
    <div className="space-y-10">
      <BusinessSection
        businesses={businesses}
        setBusinesses={setBusinesses}
      />

      <PersonCommonSection
        deductionTotal={deductionTotal}
        setDeductionTotal={setDeductionTotal}
        deductionItems={deductionItems}
        setDeductionItems={setDeductionItems}
        prepaidTax={prepaidTax}
        setPrepaidTax={setPrepaidTax}
        taxYear={taxYear}
        setTaxYear={setTaxYear}
      />

      {/* 합산 결과: 3-card 캐러셀 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="font-semibold">합산 결과(시뮬레이션)</div>
            <div className="text-xs text-gray-500">
              기준(현재 적용 경비율) 대비 ±10%p 범위에서 차가감세액 변화를 빠르게 확인합니다.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-2 border rounded text-sm"
              onClick={() => setSelectedDeltaIndex((i) => Math.max(0, i - 1))}
              disabled={!canLeft}
              title="이전"
            >
              ◀
            </button>
            <button
              type="button"
              className="px-3 py-2 border rounded text-sm"
              onClick={goBase}
              title="기준(0%p)로"
            >
              기준으로
            </button>
            <button
              type="button"
              className="px-3 py-2 border rounded text-sm"
              onClick={() => setSelectedDeltaIndex((i) => Math.min(simulations.length - 1, i + 1))}
              disabled={!canRight}
              title="다음"
            >
              ▶
            </button>

            <button
              type="button"
              className="px-3 py-2 border rounded text-sm"
              onClick={() => setShowSettings((v) => !v)}
              title="현재 적용값 보기"
            >
              {showSettings ? '설정 닫기' : '설정값 보기'}
            </button>
          </div>
        </div>

        {showSettings && current && (
          <div className="border p-4 rounded space-y-2">
            <div className="text-sm font-medium">현재 보기: {current.label}</div>
            <div className="text-xs text-gray-500">
              아래 경비율(사업장별)은 ‘현재 입력된 경비율’에 delta를 더해(±%p) 시뮬레이션한 값입니다.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {current.businesses.map((b, idx) => (
                <div key={idx} className="border rounded p-3">
                  <div className="text-sm font-medium">사업장 {idx + 1}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    업종코드: <span className="font-semibold">{b.industryCode || '-'}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    적용 경비율: <span className="font-semibold">{formatRate(b.expenseRate ?? 0, 1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left */}
          <div className="space-y-2">
            <div className="text-xs text-gray-500">{left ? left.label : ''}</div>
            {left ? <PersonSummarySection summary={left.summary} /> : <div className="border p-6 rounded text-sm text-gray-400">-</div>}
          </div>

          {/* Center */}
          <div className="space-y-2">
            <div className="text-xs text-gray-500">{current ? current.label : '기준'}</div>
            {current ? <PersonSummarySection summary={current.summary} /> : null}
          </div>

          {/* Right */}
          <div className="space-y-2">
            <div className="text-xs text-gray-500">{right ? right.label : ''}</div>
            {right ? <PersonSummarySection summary={right.summary} /> : <div className="border p-6 rounded text-sm text-gray-400">-</div>}
          </div>
        </div>
      </div>
    </div>
  )
}