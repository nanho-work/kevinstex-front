'use client'

import { useMemo, useState } from 'react'
import {
  calcRequiredExpenseByRate,
  findIndustryRateByCode,
  formatRatePercent,
  normalizePercentToRate,
  pickExpenseRate,
  resolveExpenseRate,
  type IndustryRatesMap,
} from '@/service/taxCalculator'

// 기본 경비율 자동 채움용(최신 귀속연도 파일로 고정)
// - 추후 PersonCommonSection의 taxYear 선택값에 맞춰 동적 교체 가능
import rates2024 from '@/data/normalized/industryRates_2024.json'

const RATES = rates2024 as unknown as IndustryRatesMap

type ExpenseKey = 'businessPromotion' | 'commission' | 'supplies' | 'travel' | 'other'

const EXPENSE_LABELS: Record<ExpenseKey, string> = {
  businessPromotion: '업무추진비',
  commission: '지급수수료',
  supplies: '소모품비',
  travel: '여비교통비',
  other: '기타(자동 배정)',
}

type AllocMode = 'AMOUNT' | 'PERCENT'
type AllocInput = { mode: AllocMode; value: string }
type ExpenseAllocation = Partial<Record<ExpenseKey, AllocInput>>

interface Props {
  index: number
  data: any
  onChange: (val: any) => void
  onRemove: () => void
  canRemove: boolean
}

function toMoney(v: unknown) {
  const n = typeof v === 'number' ? v : Number(String(v ?? '').replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

function toMoneyText(v: number) {
  return Math.round(v).toLocaleString()
}

function formatWithCommas(raw: string) {
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return ''
  const normalized = digits.replace(/^0+(?=\d)/, '')
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function normalizePercentText(raw: string) {
  const s = String(raw ?? '').trim().replace(/[%\s,]/g, '')
  const cleaned = s.replace(/[^\d.]/g, '')
  const parts = cleaned.split('.')
  if (parts.length <= 1) return cleaned
  return `${parts[0]}.${parts.slice(1).join('')}`
}

export default function BusinessCard({ index, data, onChange, onRemove, canRemove }: Props) {
  const [showAllocation, setShowAllocation] = useState(false)

  const industryCode = String(data.industryCode ?? '')
  const grossIncome = toMoney(data.grossIncome)

  const row = findIndustryRateByCode(RATES, industryCode)
  const baseRate = row ? pickExpenseRate(row, 'SIMPLE_GENERAL') : 0

  // 사용자 override 입력(예: "70", "70%", "0.7")
  const overrideInput: string = String(data.expenseRateOverrideInput ?? '').trim()

  // RATE 모드의 "최종" 경비율(업종 기본 + override)
  const resolvedRate = resolveExpenseRate(baseRate, overrideInput)

  // UI 표시용: override 미입력 시에도 기본 경비율이 "입력칸에 채워져 보이게" 처리
  const baseRateDisplay = (() => {
    const v = baseRate * 100
    if (!Number.isFinite(v)) return ''
    const s = v.toFixed(1).replace(/\.0$/, '')
    return s
  })()
  const expenseRateInputValue = overrideInput !== '' ? overrideInput : baseRateDisplay

  // 필요경비는 항상 경비율로 자동 산정
  const requiredExpensePreview = calcRequiredExpenseByRate(grossIncome, resolvedRate)
  const incomeAmountPreview = Math.round(grossIncome - requiredExpensePreview)

  const expenseAllocation = (data.expenseAllocation ?? {}) as ExpenseAllocation

  const allocation = useMemo(() => {
    const amounts: Record<ExpenseKey, number> = {
      businessPromotion: 0,
      commission: 0,
      supplies: 0,
      travel: 0,
      other: 0,
    }

    // other 제외 항목 먼저 계산
    const keys: ExpenseKey[] = ['businessPromotion', 'commission', 'supplies', 'travel']
    for (const k of keys) {
      const a = expenseAllocation[k]
      if (!a) continue

      if (a.mode === 'AMOUNT') {
        amounts[k] = Math.max(0, Math.round(toMoney(a.value)))
      } else {
        const r = normalizePercentToRate(a.value)
        const rate = r == null ? 0 : r
        amounts[k] = Math.max(0, Math.round(requiredExpensePreview * rate))
      }
    }

    const allocatedSum = keys.reduce((s, k) => s + amounts[k], 0)
    const remain = Math.round(requiredExpensePreview - allocatedSum)

    // 남는 금액은 기타로 자동 배정(양수만)
    amounts.other = Math.max(0, remain)

    const over = allocatedSum > requiredExpensePreview
    const warning = over
      ? `배분 합계(${toMoneyText(allocatedSum)}원)가 기준 필요경비(${toMoneyText(
          requiredExpensePreview
        )}원)를 초과했습니다.`
      : null

    return {
      amounts,
      allocatedSum,
      remain,
      warning,
    }
  }, [expenseAllocation, requiredExpensePreview])

  const computeAllocationAmounts = (nextAllocation: ExpenseAllocation) => {
    const amounts: Record<ExpenseKey, number> = {
      businessPromotion: 0,
      commission: 0,
      supplies: 0,
      travel: 0,
      other: 0,
    }

    const keys: ExpenseKey[] = ['businessPromotion', 'commission', 'supplies', 'travel']
    for (const k of keys) {
      const a = nextAllocation[k]
      if (!a) continue

      if (a.mode === 'AMOUNT') {
        amounts[k] = Math.max(0, Math.round(toMoney(a.value)))
      } else {
        const r = normalizePercentToRate(a.value)
        const rate = r == null ? 0 : r
        amounts[k] = Math.max(0, Math.round(requiredExpensePreview * rate))
      }
    }

    const allocatedSum = keys.reduce((s, k) => s + amounts[k], 0)
    const remain = Math.round(requiredExpensePreview - allocatedSum)
    amounts.other = Math.max(0, remain)

    return amounts
  }

  const pushAllocation = (nextAllocation: ExpenseAllocation) => {
    const amounts = computeAllocationAmounts(nextAllocation)

    onChange({
      expenseMode: 'RATE',
      expenseRate: resolvedRate,
      expenseAllocation: nextAllocation,
      expenseItems: {
        businessPromotion: amounts.businessPromotion,
        commission: amounts.commission,
        supplies: amounts.supplies,
        travel: amounts.travel,
        other: amounts.other,
      },
    })
  }

  const setAllocMode = (key: ExpenseKey, mode: AllocMode) => {
    const prev = expenseAllocation[key]
    const next: ExpenseAllocation = {
      ...expenseAllocation,
      [key]: { mode, value: prev?.value ?? '' },
    }
    pushAllocation(next)
  }

  const setAllocValue = (key: ExpenseKey, value: string) => {
    const prev = expenseAllocation[key] ?? { mode: 'AMOUNT' as const, value: '' }
    const next: ExpenseAllocation = {
      ...expenseAllocation,
      [key]: { ...prev, value },
    }
    pushAllocation(next)
  }

  const clearAlloc = () => {
    pushAllocation({})
  }

  const onIndustryCodeChange = (value: string) => {
    const nextRow = findIndustryRateByCode(RATES, value)
    const nextBaseRate = nextRow ? pickExpenseRate(nextRow, 'SIMPLE_GENERAL') : 0
    const nextResolved = resolveExpenseRate(nextBaseRate, data.expenseRateOverrideInput ?? '')

    onChange({
      industryCode: value,
      expenseMode: 'RATE',
      expenseRate: nextResolved,
    })
  }

  const onGrossIncomeChange = (value: string) => {
    const formatted = formatWithCommas(value)
    onChange({ grossIncome: toMoney(formatted), expenseMode: 'RATE', expenseRate: resolvedRate })
  }

  const onOverrideChange = (value: string) => {
    const cleaned = normalizePercentText(value)
    const nextResolved = resolveExpenseRate(baseRate, cleaned)
    onChange({
      expenseMode: 'RATE',
      expenseRateOverrideInput: cleaned,
      expenseRate: nextResolved,
    })
  }

  return (
    <div className="border p-6 rounded space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">사업장 {index + 1}</h3>
        {canRemove && (
          <button onClick={onRemove} className="text-red-500 text-sm">
            삭제
          </button>
        )}
      </div>

      {/* 업종코드 */}
      <div className="space-y-1">
        <div className="text-xs text-gray-600">업종코드</div>
        <input
          type="text"
          placeholder="예: 940909"
          value={industryCode}
          onChange={(e) => onIndustryCodeChange(e.target.value)}
          className="w-full border p-2"
        />
        <div className="text-xs text-gray-500">
          기본(단순경비율 일반율):{' '}
          <span className="font-medium">{formatRatePercent(baseRate, 1)}</span>
          {row?.industryName ? (
            <>
              {' '}
              · <span className="font-medium">{row.industryName}</span>
            </>
          ) : (
            <> · 코드 조회 결과 없음</>
          )}
        </div>
      </div>

      {/* 총수입금액 */}
      <div className="space-y-1">
        <div className="text-xs text-gray-600">총수입금액</div>
        <input
          type="text"
          inputMode="numeric"
          placeholder="원 단위 숫자 (예: 42,892,000)"
          value={data.grossIncome ? toMoneyText(toMoney(data.grossIncome)) : ''}
          onChange={(e) => onGrossIncomeChange(e.target.value)}
          className="w-full border p-2"
        />
      </div>

      {/* RATE 모드: 경비율 자동 + override */}
      <div className="space-y-2">
        <div className="text-xs text-gray-600">경비율(업종코드로 자동, 필요 시 override)</div>
        <div className="flex gap-2">
          <div className="relative w-full">
            <input
              type="text"
              inputMode="decimal"
              placeholder='예: 70 또는 70.5 (기본값 자동)'
              value={expenseRateInputValue}
              onChange={(e) => onOverrideChange(e.target.value)}
              className="w-full border p-2 pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              %
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOverrideChange('')}
            className="shrink-0 px-3 border rounded text-sm"
            title="업종 기본 경비율로 되돌리기"
          >
            기본값
          </button>
        </div>
        <div className="text-xs text-gray-500">
          적용 경비율:{' '}
          <span className="font-medium">{formatRatePercent(resolvedRate, 1)}</span>
          <span className="ml-2">({overrideInput !== '' ? '사용자 입력' : '업종 기본값'})</span>
        </div>
      </div>

      {/* 세부항목 배분(선택) */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">세부항목 배분(선택)</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAllocation((v) => !v)}
              className="px-3 py-1 border rounded text-sm"
            >
              {showAllocation ? '접기' : '펼치기'}
            </button>
            <button
              type="button"
              onClick={clearAlloc}
              className="px-3 py-1 border rounded text-sm"
              title="배분 입력 초기화"
            >
              초기화
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          필요경비는 경비율로 자동 산정되며, 세부항목은 그 금액을 어떻게 배분할지 기록하는 용도입니다.
          (입력은 금액 또는 퍼센트 가능, 남는 금액은 기타로 자동 배정)
        </div>

        {showAllocation && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Object.keys(EXPENSE_LABELS) as ExpenseKey[]).map((k) => {
                const input: AllocInput = expenseAllocation[k] ?? { mode: 'AMOUNT', value: '' }
                const computed = allocation.amounts[k]
                const disabledOther = k === 'other'

                return (
                  <div key={k} className="border rounded p-3 space-y-2">
                    <div className="text-sm font-medium">{EXPENSE_LABELS[k]}</div>

                    <div className="flex gap-2">
                      <select
                        className="border p-2 rounded text-sm"
                        value={input.mode}
                        onChange={(e) => setAllocMode(k, e.target.value as AllocMode)}
                        disabled={disabledOther}
                        title={disabledOther ? '기타는 남는 금액이 자동 배정됩니다.' : '입력 방식 선택'}
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
                            disabledOther
                              ? '자동'
                              : input.mode === 'AMOUNT'
                              ? '원 단위 (예: 1,500,000)'
                              : '퍼센트 (예: 30 또는 30.5)'
                          }
                          value={disabledOther ? '' : input.value}
                          onChange={(e) => {
                            const v =
                              input.mode === 'AMOUNT'
                                ? formatWithCommas(e.target.value)
                                : normalizePercentText(e.target.value)
                            setAllocValue(k, v)
                          }}
                          disabled={disabledOther}
                        />
                        {!disabledOther && input.mode === 'PERCENT' && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            %
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-600">
                      배정 금액: <span className="font-semibold">{toMoneyText(computed)}원</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border rounded p-3 space-y-1 text-sm">
              <div>
                기준 필요경비(자동):{' '}
                <span className="font-semibold">{toMoneyText(requiredExpensePreview)}원</span>
              </div>
              <div>
                배분합계(기타 제외):{' '}
                <span className="font-semibold">{toMoneyText(allocation.allocatedSum)}원</span>
              </div>
              <div>
                남는 금액: <span className="font-semibold">{toMoneyText(allocation.remain)}원</span>
                <span className="ml-2 text-xs text-gray-500">(양수일 때 기타로 자동 배정)</span>
              </div>

              {allocation.warning && (
                <div className="text-sm text-red-600">{allocation.warning}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 미리보기(자동 계산) */}
      <div className="border-t pt-4 space-y-1">
        <div className="text-sm">
          필요경비(자동):{' '}
          <span className="font-semibold">{requiredExpensePreview.toLocaleString()}원</span>
        </div>
        <div className="text-sm">
          소득금액(자동):{' '}
          <span className="font-semibold">{incomeAmountPreview.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  )
}