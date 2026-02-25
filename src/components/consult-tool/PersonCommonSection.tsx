'use client'

import React from 'react'

interface Props {
  deductionTotal: number
  setDeductionTotal: (v: number) => void
  deductionItems: any
  setDeductionItems: (v: any) => void
  prepaidTax: number
  setPrepaidTax: (v: number) => void
  taxYear: number
  setTaxYear: (v: number) => void
}

export default function PersonCommonSection({
  deductionTotal,
  setDeductionTotal,
  deductionItems,
  setDeductionItems,
  prepaidTax,
  setPrepaidTax,
  taxYear,
  setTaxYear,
}: Props) {
  const [showDetail, setShowDetail] = React.useState(false)

  const items = (deductionItems ?? {}) as any

  const toMoney = (v: unknown) => {
    const n = typeof v === 'number' ? v : Number(String(v ?? '').replace(/,/g, ''))
    return Number.isFinite(n) ? n : 0
  }

  type AllocMode = 'AMOUNT' | 'PERCENT'
  type AllocInput = { mode: AllocMode; value: string }
  type DeductionKey = 'pension' | 'norangUmbrella' | 'retirementPension' | 'user1' | 'user2'
  type DeductionAllocation = Partial<Record<DeductionKey, AllocInput>>

  const alloc = (items.__alloc ?? {}) as DeductionAllocation

  const allocation = React.useMemo(() => {
    const total = Math.round(toMoney(deductionTotal))

    const computed: Record<DeductionKey, number> = {
      pension: 0,
      norangUmbrella: 0,
      retirementPension: 0,
      user1: 0,
      user2: 0, // 남는 금액 자동
    }

    const keys: DeductionKey[] = ['pension', 'norangUmbrella', 'retirementPension', 'user1']
    for (const k of keys) {
      const a = alloc[k]
      if (!a) continue

      if (a.mode === 'AMOUNT') {
        computed[k] = Math.max(0, Math.round(toMoney(a.value)))
      } else {
        // percent -> rate(0~1), then amount = total * rate
        const r = Number.isFinite(Number(a.value)) ? a.value : String(a.value ?? '')
        // 퍼센트 정규화는 taxCalculator.ts의 normalizePercentToRate를 써도 되지만,
        // 여기서는 입력 UX만을 위해 간단 정규화(%, 공백 제거 후 /100)를 적용
        const cleaned = String(r).trim().replace(/[%\\s,]/g, '')
        const v = Number(cleaned)
        const rate = Number.isFinite(v) ? (v >= 0 && v <= 1 ? v : v / 100) : 0
        computed[k] = Math.max(0, Math.round(total * Math.min(1, Math.max(0, rate))))
      }
    }

    const allocatedSum = keys.reduce((s, k) => s + computed[k], 0)
    const remain = Math.round(total - allocatedSum)

    const over = allocatedSum > total
    computed.user2 = over ? 0 : Math.max(0, remain)

    const warning =
      over && total > 0
        ? `배분 합계(${allocatedSum.toLocaleString()}원)가 소득공제 총액(${total.toLocaleString()}원)을 초과했습니다.`
        : null

    return { total, computed, allocatedSum, remain, warning }
  }, [alloc, deductionTotal])

  const formatWithCommas = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, '')
    if (!digits) return ''
    // remove leading zeros but keep single zero if all zeros
    const normalized = digits.replace(/^0+(?=\d)/, '')
    return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const normalizePercentText = (raw: string) => {
    const s = String(raw ?? '').trim().replace(/[%\s,]/g, '')
    // keep digits and dot only
    const cleaned = s.replace(/[^\d.]/g, '')
    // allow only one dot
    const parts = cleaned.split('.')
    if (parts.length <= 1) return cleaned
    return `${parts[0]}.${parts.slice(1).join('')}`
  }

  return (
    <div className="border p-6 rounded space-y-4">
      <div className="space-y-1">
        <div className="font-semibold">공통 사항</div>
        <div className="text-xs text-gray-500">
          여러 사업장을 입력해도 아래 항목은 1회만 입력합니다. (새로고침 시 초기화)
        </div>
      </div>

      {/* 귀속연도 */}
      <div className="space-y-1">
        <div className="text-sm font-medium">귀속연도</div>
        <select
          value={taxYear}
          onChange={(e) => setTaxYear(Number(e.target.value))}
          className="w-full border p-2 rounded"
        >
          <option value={2024}>2024 귀속</option>
          <option value={2023}>2023 귀속</option>
          <option value={2022}>2022 귀속</option>
          <option value={2021}>2021 귀속</option>
          <option value={2020}>2020 귀속</option>
          <option value={2019}>2019 귀속</option>
          <option value={2018}>2018 귀속</option>
          <option value={2017}>2017 귀속</option>
        </select>
        <div className="text-xs text-gray-500">
          종합소득세 누진세율표를 적용하기 위한 연도입니다.
        </div>
      </div>

      {/* 소득공제 */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">소득공제</div>
          <button
            type="button"
            onClick={() => setShowDetail((v) => !v)}
            className="text-xs px-2 py-1 border rounded"
          >
            {showDetail ? '접기' : '배분(선택)'}
          </button>
        </div>

        {/* 총액 입력(기준) */}
        <div className="space-y-1">
          <div className="text-xs text-gray-500">소득공제 총액(기준)</div>
          <input
            type="text"
            placeholder="예: 1500000"
            value={deductionTotal ? deductionTotal.toLocaleString() : ''}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, '')
              const n = Number(raw)
              if (!Number.isFinite(n)) {
                setDeductionTotal(0)
              } else {
                setDeductionTotal(n)
              }
            }}
            className="w-full border p-2 rounded"
          />
          <div className="text-xs text-gray-500">
            상세 항목은 위 총액을 어떻게 배분할지 기록하는 용도입니다. (합계가 총액을 초과하면 경고)
          </div>
        </div>

        {showDetail && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(
                [
                  ['pension', '연금'],
                  ['norangUmbrella', '노란우산'],
                  ['retirementPension', '퇴직연금'],
                  ['user1', '사용자 입력 1'],
                  ['user2', '사용자 입력 2(자동 배정)'],
                ] as Array<[DeductionKey, string]>
              ).map(([key, label]) => {
                const k: DeductionKey = key
                const disabled = k === 'user2'
                const current: AllocInput = alloc[k] ?? { mode: 'AMOUNT', value: '' }
                const computed = allocation.computed[k] ?? 0

                const setMode = (mode: AllocMode) => {
                  const nextAlloc: DeductionAllocation = { ...alloc, [k]: { mode, value: current.value ?? '' } }
                  setDeductionItems({
                    ...items,
                    __alloc: nextAlloc,
                    pension: allocation.computed.pension,
                    norangUmbrella: allocation.computed.norangUmbrella,
                    retirementPension: allocation.computed.retirementPension,
                    user1: allocation.computed.user1,
                    user2: allocation.computed.user2,
                  })
                }

                const setValue = (value: string) => {
                  const mode: AllocMode = current.mode
                  const nextValue = mode === 'AMOUNT' ? formatWithCommas(value) : normalizePercentText(value)

                  const nextAlloc: DeductionAllocation = { ...alloc, [k]: { ...current, value: nextValue } }

                  // UI 입력(__alloc)만 먼저 갱신(계산값은 아래 '배분 결과 적용' 또는 다음 렌더에서 확정)
                  setDeductionItems({
                    ...items,
                    __alloc: nextAlloc,
                  })
                }

                return (
                  <div key={k} className="border p-3 rounded space-y-2">
                    <div className="text-sm font-medium">{label}</div>

                    <div className="flex gap-2">
                      <select
                        className="border p-2 rounded text-sm"
                        value={current.mode}
                        onChange={(e) => setMode(e.target.value as AllocMode)}
                        disabled={disabled}
                        title={disabled ? '남는 금액이 자동 배정됩니다.' : '입력 방식 선택'}
                      >
                        <option value="AMOUNT">금액</option>
                        <option value="PERCENT">퍼센트</option>
                      </select>

                      <div className="relative w-full">
                        <input
                          type="text"
                          inputMode="numeric"
                          className="w-full border p-2 rounded pr-10"
                          placeholder={
                            disabled
                              ? '자동'
                              : current.mode === 'AMOUNT'
                              ? '원 단위 (예: 1,500,000)'
                              : '퍼센트 (예: 30 또는 30.5)'
                          }
                          value={disabled ? '' : current.value}
                          onChange={(e) => setValue(e.target.value)}
                          disabled={disabled}
                        />
                        {!disabled && current.mode === 'PERCENT' && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            %
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-600">
                      배정 금액: <span className="font-semibold">{computed.toLocaleString()}원</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border rounded p-3 space-y-1 text-sm">
              <div>
                총액(기준): <span className="font-semibold">{allocation.total.toLocaleString()}원</span>
              </div>
              <div>
                배분합계(자동항목 제외):{' '}
                <span className="font-semibold">{allocation.allocatedSum.toLocaleString()}원</span>
              </div>
              <div>
                남는 금액: <span className="font-semibold">{allocation.remain.toLocaleString()}원</span>
                <span className="ml-2 text-xs text-gray-500">(양수일 때 사용자 입력 2로 자동 배정)</span>
              </div>
              {allocation.warning && <div className="text-sm text-red-600">{allocation.warning}</div>}
              <div className="text-xs text-gray-400">
                참고: 상세 배분값은 저장되며, 최종 적용되는 소득공제는 총액과 동일하도록 자동 조정됩니다.
              </div>
            </div>

            {/* 최신 계산값을 service 입력에 확정 반영 */}
            <button
              type="button"
              className="px-3 py-2 border rounded text-sm"
              onClick={() =>
                setDeductionItems({
                  ...items,
                  pension: allocation.computed.pension,
                  norangUmbrella: allocation.computed.norangUmbrella,
                  retirementPension: allocation.computed.retirementPension,
                  user1: allocation.computed.user1,
                  user2: allocation.computed.user2,
                })
              }
            >
              배분 결과 적용
            </button>
          </div>
        )}
      </div>

      {/* 기납부세액 */}
      <div className="border-t pt-4 space-y-2">
        <div className="text-sm font-medium">기납부세액</div>
        <input
          type="text"
          placeholder="예: 0"
          value={prepaidTax ? prepaidTax.toLocaleString() : ''}
          onChange={(e) => {
            const raw = e.target.value.replace(/,/g, '')
            const n = Number(raw)
            if (!Number.isFinite(n)) {
              setPrepaidTax(0)
            } else {
              setPrepaidTax(n)
            }
          }}
          className="w-full border p-2 rounded"
        />
        <div className="text-xs text-gray-500">
          이미 납부한 세액(원). 최종 차가감세액 = 총세액 − 기납부세액.
        </div>
      </div>
    </div>
  )
}