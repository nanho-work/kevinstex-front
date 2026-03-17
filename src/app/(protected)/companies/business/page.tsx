'use client'

import { useEffect, useMemo, useState } from 'react'

type Employee = {
  id: string
  name: string
  rrnMasked: string // 예: 900101-1******
}

type Business33Row = {
  id: string
  month: string
  employeeId: string
  employeeName: string
  rrnMasked: string
  grossPay: number
  incomeTax: number
  localTax: number
  netPay: number
  payDate: string
  deletedAt?: string
  createdAt: string
}

const mockEmployees: Employee[] = [
  { id: 'e1', name: '홍길동', rrnMasked: '900101-1******' },
  { id: 'e2', name: '김철수', rrnMasked: '910203-1******' },
]

function roundDownTo10Won(value: number) {
  // Excel ROUNDDOWN(x, -1) 과 동일: 10원 단위 버림
  if (!Number.isFinite(value)) return 0
  return Math.floor(value / 10) * 10
}

function formatWon(n: number) {
  if (!Number.isFinite(n)) return ''
  return n.toLocaleString('ko-KR')
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-800">
        {label}
      </label>
      <div className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800">
        {value || '-'}
      </div>
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  helper,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  helper?: string
  type?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-800">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
      />
      {helper ? <p className="mt-1 text-xs text-neutral-500">{helper}</p> : null}
    </div>
  )
}


function EmployeeComboBox({
  label,
  employees,
  selectedId,
  onSelect,
  helper,
}: {
  label: string
  employees: Employee[]
  selectedId: string
  onSelect: (id: string) => void
  helper?: string
}) {
  const selected = employees.find((e) => e.id === selectedId) || null

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return employees
    return employees.filter((e) => e.name.includes(q))
  }, [employees, query])

  // When selection changes from outside, reflect in input
  useEffect(() => {
    if (selected) setQuery(selected.name)
  }, [selectedId, selected])

  const selectAt = (idx: number) => {
    const item = filtered[idx]
    if (!item) return
    onSelect(item.id)
    setQuery(item.name)
    setOpen(false)
  }

  return (
    <div className="relative">
      <label className="mb-1 block text-sm font-medium text-neutral-800">
        {label}
      </label>

      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          setActiveIndex(0)
          // typing cancels selection until user chooses
          if (selectedId) onSelect('')
        }}
        onFocus={() => {
          setOpen(true)
          setActiveIndex(0)
        }}
        onBlur={() => {
          // Close after click selection
          setTimeout(() => setOpen(false), 120)
        }}
        onKeyDown={(e) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            setOpen(true)
            return
          }

          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex((prev) =>
              Math.min(prev + 1, Math.max(filtered.length - 1, 0)),
            )
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((prev) => Math.max(prev - 1, 0))
          }
          if (e.key === 'Enter') {
            if (!open) return
            e.preventDefault()
            selectAt(activeIndex)
          }
          if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
        placeholder="이름을 입력하세요 (예: 최, 최남)"
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
      />

      {helper ? <p className="mt-1 text-xs text-neutral-500">{helper}</p> : null}

      {open ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
          <div className="max-h-56 overflow-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-sm text-neutral-500">
                검색 결과가 없습니다.
              </div>
            ) : (
              filtered.map((e, idx) => {
                const isActive = idx === activeIndex
                return (
                  <button
                    key={e.id}
                    type="button"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => selectAt(idx)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                      isActive ? 'bg-neutral-50' : 'bg-white'
                    }`}
                  >
                    <span className="truncate font-medium text-neutral-900">
                      {e.name}
                    </span>
                    <span className="ml-3 shrink-0 text-xs text-neutral-500">
                      {e.rrnMasked}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default function ClientBusinessIncome33Page() {
  // 대상월: 입력 가능 (예: 2026-02)
  const [targetMonth, setTargetMonth] = useState('2026-02')

  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)

  // 직원 선택
  const [employeeId, setEmployeeId] = useState('')
  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === employeeId) || null,
    [employeeId, employees],
  )

  const [employeeMode, setEmployeeMode] = useState<'existing' | 'new'>('existing')
  const [newEmployeeName, setNewEmployeeName] = useState('')
  const [newEmployeeRrn, setNewEmployeeRrn] = useState('')

  const maskRrn = (rrnInput: string) => {
    const v = rrnInput.trim()
    if (v.length >= 8) {
      const front = v.slice(0, 6)
      const seventh = v.includes('-') ? v.slice(7, 8) : v.slice(6, 7)
      return `${front}-${seventh}******`
    }
    return '******-*******'
  }

  const createEmployeeIfNeeded = () => {
    if (employeeMode !== 'new') return selectedEmployee

    const name = newEmployeeName.trim()
    const rrn = newEmployeeRrn.trim()
    if (!name || !rrn) return null

    const id = `e${Date.now()}-${Math.random().toString(16).slice(2)}`
    const next: Employee = { id, name, rrnMasked: maskRrn(rrn) }

    setEmployees((prev) => [next, ...prev])
    setEmployeeId(id)

    // 생성 후에는 기존 선택 모드로 복귀(다음 입력이 편해짐)
    setEmployeeMode('existing')
    setNewEmployeeName('')
    setNewEmployeeRrn('')

    return next
  }

  // 세전급여(입력)
  const [grossPay, setGrossPay] = useState('')
  // 지급일(입력) - UI only
  const [payDate, setPayDate] = useState('')

  const [rows, setRows] = useState<Business33Row[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [dupOpen, setDupOpen] = useState(false)

  const grossPayNumber = useMemo(() => {
    const cleaned = grossPay.replace(/,/g, '').trim()
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : 0
  }, [grossPay])

  const incomeTax = useMemo(() => {
    // =ROUNDDOWN(E5*3%,-1)
    return roundDownTo10Won(grossPayNumber * 0.03)
  }, [grossPayNumber])

  const localTax = useMemo(() => {
    // =ROUNDDOWN(F5*10%,-1)
    return roundDownTo10Won(incomeTax * 0.1)
  }, [incomeTax])

  const netPay = useMemo(() => {
    return grossPayNumber - incomeTax - localTax
  }, [grossPayNumber, incomeTax, localTax])

  const employeeLabel = selectedEmployee
    ? `${selectedEmployee.name} (${selectedEmployee.rrnMasked})`
    : employeeMode === 'new' && newEmployeeName.trim()
      ? `${newEmployeeName.trim()} (${newEmployeeRrn ? maskRrn(newEmployeeRrn) : '******-*******'})`
      : ''

  const canSave =
    Boolean(targetMonth.trim()) &&
    grossPayNumber > 0 &&
    (employeeMode === 'existing'
      ? Boolean(selectedEmployee)
      : Boolean(newEmployeeName.trim()) && Boolean(newEmployeeRrn.trim()))

  const hasDuplicate = useMemo(() => {
    if (employeeMode !== 'existing') return false
    if (!selectedEmployee) return false
    return rows.some(
      (r) =>
        !r.deletedAt &&
        r.month === targetMonth &&
        r.employeeId === selectedEmployee.id,
    )
  }, [rows, selectedEmployee, targetMonth, employeeMode])

  const resetInputsAfterSave = () => {
    // 대상월/직원 선택은 유지, 금액/지급일만 초기화
    setGrossPay('')
    setPayDate('')
  }

  const doSave = async () => {
    const emp = employeeMode === 'new' ? createEmployeeIfNeeded() : selectedEmployee
    if (!emp) return

    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`

    setIsSaving(true)
    await new Promise((res) => setTimeout(res, 650))

    const next: Business33Row = {
      id,
      month: targetMonth,
      employeeId: emp.id,
      employeeName: emp.name,
      rrnMasked: emp.rrnMasked,
      grossPay: grossPayNumber,
      incomeTax,
      localTax,
      netPay,
      payDate: payDate.trim() || `${targetMonth.trim()}-25`,
      createdAt: new Date().toISOString(),
    }

    setRows((prev) => [next, ...prev])
    setIsSaving(false)

    resetInputsAfterSave()
  }

  const handleSave = async () => {
    if (isSaving) return
    if (!canSave) return

    if (hasDuplicate) {
      setDupOpen(true)
      return
    }

    await doSave()
  }

  const handleConfirmDuplicate = async () => {
    if (isSaving) return
    setDupOpen(false)
    await doSave()
  }

  const handleDeleteRow = (rowId: string) => {
    // UI-only: 소프트 삭제 (화면/내부직원 비노출)
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId ? { ...r, deletedAt: new Date().toISOString() } : r,
      ),
    )
  }


  const monthRows = useMemo(
    () => rows.filter((r) => !r.deletedAt && r.month === targetMonth),
    [rows, targetMonth],
  )

  const monthSummary = useMemo(() => {
    const sum = monthRows.reduce(
      (acc, r) => {
        acc.gross += r.grossPay
        acc.income += r.incomeTax
        acc.local += r.localTax
        acc.net += r.netPay
        return acc
      },
      { gross: 0, income: 0, local: 0, net: 0 },
    )
    return sum
  }, [monthRows])

  return (
    <main className="min-h-[calc(100vh-80px)] w-full">
      <div className="mb-6">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">고객사 전용</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
              사업소득(3.3%) 신고 입력
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              프리랜서/사업소득(3.3% 원천징수) 지급 내역을 입력합니다. (UI-only)
            </p>
          </div>
        </div>


        {/* Payment Input */}
        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                지급 내역 입력
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                직원(프리랜서)을 선택하고 세전급여를 입력하면 세액이 자동 계산됩니다.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
              자동 계산
            </span>
          </div>

          {/* One-row inputs (desktop-first) */}
          <div className="mt-5 rounded-xl border border-neutral-200 p-4">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-2">
                <TextField
                  label="대상 월"
                  value={targetMonth}
                  onChange={setTargetMonth}
                  placeholder="예) 2026-02"
                  helper="현재 선택된 대상월로 저장됩니다."
                />
              </div>

              <div className="col-span-6">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="mb-1 block text-sm font-medium text-neutral-800">
                      직원 입력 방식
                    </p>
                    <div className="flex items-center gap-3 text-sm">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="employeeMode"
                          value="existing"
                          checked={employeeMode === 'existing'}
                          onChange={() => setEmployeeMode('existing')}
                        />
                        <span>기존 직원 선택</span>
                      </label>

                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="employeeMode"
                          value="new"
                          checked={employeeMode === 'new'}
                          onChange={() => {
                            setEmployeeMode('new')
                            setEmployeeId('')
                          }}
                        />
                        <span>신규 직원 입력</span>
                      </label>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-500">
                    {employeeMode === 'existing'
                      ? '이름 검색 후 선택하면 주민번호가 자동 채움됩니다.'
                      : '신규 인물은 이름/주민번호를 직접 입력합니다.'}
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-12 gap-3">
                  {employeeMode === 'existing' ? (
                    <>
                      <div className="col-span-7">
                        <EmployeeComboBox
                          label="직원 선택"
                          employees={employees}
                          selectedId={employeeId}
                          onSelect={setEmployeeId}
                          helper="이름을 입력하면 목록이 자동완성됩니다. (↑/↓, Enter 지원)"
                        />
                      </div>

                      <div className="col-span-5">
                        <ReadOnlyField
                          label="주민번호(마스킹)"
                          value={selectedEmployee?.rrnMasked || '-'}
                        />
                        <p className="mt-1 text-xs text-neutral-500">
                          직원 선택 시 자동으로 채워집니다.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-7">
                        <TextField
                          label="이름"
                          value={newEmployeeName}
                          onChange={setNewEmployeeName}
                          placeholder="예) 최남호"
                        />
                      </div>

                      <div className="col-span-5">
                        <TextField
                          label="주민등록번호"
                          value={newEmployeeRrn}
                          onChange={setNewEmployeeRrn}
                          placeholder="예) 900101-1234567"
                          helper="UI-only: 저장 시 화면에서는 마스킹 처리됩니다."
                        />
                        <p className="mt-1 text-xs text-neutral-500">
                          미리보기: {newEmployeeRrn ? maskRrn(newEmployeeRrn) : '-'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <TextField
                  label="세전급여(지급액)"
                  value={grossPay}
                  onChange={setGrossPay}
                  placeholder="예) 1000000"
                  helper="숫자만 입력(콤마는 자동 반영 전 단계 UI)"
                  type="text"
                />
              </div>

              <div className="col-span-2">
                <TextField
                  label="지급일"
                  value={payDate}
                  onChange={setPayDate}
                  placeholder="예) 2026-02-25"
                  helper="미입력 시 기본값(예: 25일)로 저장됩니다."
                />
              </div>

              <div className="col-span-12 mt-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!canSave || isSaving}
                    className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition active:bg-neutral-950 ${
                      !canSave || isSaving
                        ? 'cursor-not-allowed bg-neutral-300'
                        : 'bg-neutral-900 hover:bg-neutral-800'
                    }`}
                  >
                    {isSaving ? '저장중…' : '등록'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // 대상월/직원은 유지하고 입력만 초기화
                      resetInputsAfterSave()
                    }}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    초기화
                  </button>
                </div>

                <div className="flex flex-col items-end gap-1 text-xs">
                  <p className="text-neutral-500">
                    {selectedEmployee
                      ? `선택 직원: ${employeeLabel}`
                      : employeeMode === 'new' && newEmployeeName.trim()
                        ? `입력 직원: ${employeeLabel}`
                        : '직원을 선택해 주세요.'}
                  </p>
                  <p className="text-neutral-600">
                    소득세 <span className="font-medium text-neutral-900">{formatWon(incomeTax)}원</span>
                    <span className="mx-2 text-neutral-300">|</span>
                    지방세 <span className="font-medium text-neutral-900">{formatWon(localTax)}원</span>
                    <span className="mx-2 text-neutral-300">|</span>
                    세후 <span className="font-medium text-neutral-900">{formatWon(netPay)}원</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Saved rows list (UI-only) */}
        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                등록된 내역
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                선택한 대상 월({targetMonth}) 기준으로 등록된 항목을 표시합니다.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between bg-neutral-50 px-4 py-3">
              <p className="text-sm font-medium text-neutral-900">
                등록된 내역 ({monthRows.length}건)
              </p>
              <p className="text-xs text-neutral-500">
                * 삭제는 소프트 삭제로 처리되며 화면에는 노출되지 않습니다.
              </p>
            </div>

            <div className="divide-y divide-neutral-100 bg-white">
              {monthRows.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-neutral-500">
                  등록된 내역이 없습니다.
                </div>
              ) : (
                monthRows.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="min-w-0">
                        <p className="truncate text-sm text-neutral-900">
                            <span className="font-medium">{r.employeeName}</span>
                            <span className="ml-2 text-xs text-neutral-500">{r.rrnMasked}</span>
                            <span className="mx-2 text-neutral-300">|</span>
                            <span className="text-xs text-neutral-600">{r.payDate}</span>
                            <span className="mx-2 text-neutral-300">|</span>
                            <span className="text-xs text-neutral-600">
                            세전 {formatWon(r.grossPay)}원 · 소득세 {formatWon(r.incomeTax)}원 · 지방세 {formatWon(r.localTax)}원 · 세후 {formatWon(r.netPay)}원
                            </span>
                        </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(r.id)}
                      disabled={isSaving}
                      className="text-sm text-neutral-600 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      삭제
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Duplicate confirm modal (UI-only) */}
        {dupOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-neutral-900">
                중복 등록 확인
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                이미 등록된 인원입니다. 추가 등록 하시겠습니까?
              </p>

              <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
                <p className="text-xs text-neutral-600">
                  대상월: <span className="font-medium text-neutral-900">{targetMonth}</span>
                </p>
                <p className="mt-1 text-xs text-neutral-600">
                  직원: <span className="font-medium text-neutral-900">{selectedEmployee?.name || '-'}</span>
                </p>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDupOpen(false)}
                  disabled={isSaving}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDuplicate}
                  disabled={isSaving}
                  className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition ${
                    isSaving
                      ? 'cursor-not-allowed bg-neutral-400'
                      : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950'
                  }`}
                >
                  {isSaving ? '저장중…' : '추가 등록'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Info */}
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
          <p className="text-sm font-medium text-neutral-900">안내</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-600">
            <li>현재는 UI/계산만 구성되어 있으며, 저장/제출/직원 데이터 연동은 추후 진행합니다.</li>
            <li>중복 지급이 가능하며, 대상월에 동일 직원이 있으면 추가 등록 여부를 한 번 확인합니다.</li>
            <li>삭제는 소프트 삭제로 처리되며, 화면/내부직원에게는 노출하지 않는 방식을 기준으로 합니다.</li>
          </ul>
        </div>
      </div>
    </main>
  )
}