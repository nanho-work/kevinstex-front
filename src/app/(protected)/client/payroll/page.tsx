'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'

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
  placeholder: string
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

function SelectField({
  label,
  value,
  onChange,
  helper,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  helper?: string
  options: string[]
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-800">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {helper ? <p className="mt-1 text-xs text-neutral-500">{helper}</p> : null}
    </div>
  )
}

export default function ClientPayrollPage() {
  // UI-only employees (later from 직원관리)
  const employeeOptions = ['직원을 선택하세요', '홍길동(예시)', '김철수(예시)']

  // UI state
  const [targetMonth, setTargetMonth] = useState('2026-02')
  const [employee, setEmployee] = useState(employeeOptions[0])
  const [amount, setAmount] = useState('')
  const [payDate, setPayDate] = useState('')

  const [isSaving, setIsSaving] = useState(false)

  type PayrollRow = {
    id: string
    targetMonth: string
    employee: string
    amount: number
    payDate: string
    createdAt: string
    deletedAt?: string
  }

  const [rows, setRows] = useState<PayrollRow[]>([
    {
      id: 'r1',
      targetMonth: '2026-02',
      employee: '홍길동(예시)',
      amount: 3000000,
      payDate: '2026-02-25',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'r2',
      targetMonth: '2026-02',
      employee: '김철수(예시)',
      amount: 2600000,
      payDate: '2026-02-25',
      createdAt: new Date().toISOString(),
    },
  ])

  const [dupOpen, setDupOpen] = useState(false)
  const [pendingForce, setPendingForce] = useState(false)

  const visibleRows = useMemo(() => {
    return rows.filter((r) => !r.deletedAt && r.targetMonth === targetMonth)
  }, [rows, targetMonth])

  const hasDuplicate = useMemo(() => {
    if (!targetMonth) return false
    if (!employee || employee === employeeOptions[0]) return false
    return visibleRows.some((r) => r.employee === employee)
  }, [employee, employeeOptions, targetMonth, visibleRows])

  const resetInputsAfterSave = () => {
    setEmployee(employeeOptions[0])
    setAmount('')
    setPayDate('')
  }

  const doSave = async (force: boolean) => {
    if (!targetMonth.trim()) return
    if (!employee || employee === employeeOptions[0]) return
    if (!amount.trim()) return

    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) return

    // UI-only: 서버 저장 시뮬레이션
    setIsSaving(true)
    setPendingForce(false)

    await new Promise((res) => setTimeout(res, 650))

    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const next: PayrollRow = {
      id,
      targetMonth: targetMonth.trim(),
      employee,
      amount: n,
      payDate: payDate.trim() || `${targetMonth.trim()}-25`,
      createdAt: new Date().toISOString(),
    }

    setRows((prev) => [next, ...prev])
    setIsSaving(false)

    // 입력 편의: 대상월은 유지하고 나머지 초기화
    resetInputsAfterSave()
  }

  const handleRegisterClick = async () => {
    if (isSaving) return

    // 중복 경고(대상월 + 직원)
    if (hasDuplicate) {
      setDupOpen(true)
      return
    }

    await doSave(false)
  }

  const handleConfirmDuplicate = async () => {
    if (isSaving) return
    setDupOpen(false)
    setPendingForce(true)
    await doSave(true)
  }

  const handleDelete = async (id: string) => {
    if (isSaving) return

    // UI-only: 소프트 삭제 (화면/내부직원에게 비노출)
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, deletedAt: new Date().toISOString() } : r,
      ),
    )
  }

  return (
    <main className="min-h-[calc(100vh-80px)] w-full">
      <div className="mb-6">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">고객사 전용</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
              근로소득(임금) 신고 입력
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              월별 임금 자료를 입력합니다. (UI-only)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Payroll Section */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                  월별 임금 등록
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  대상 월을 선택하고 직원관리에서 등록한 근로자를 선택해 지급 내역을 입력합니다.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                월 단위
              </span>
            </div>

            {/* helper row */}
            <div className="mt-5 flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
              <p className="text-xs text-neutral-600">
                직원이 목록에 없다면 직원관리에서 먼저 등록하세요.
              </p>
              <Link
                href="/client/employees"
                className="text-xs font-medium text-neutral-800 hover:text-neutral-900"
              >
                직원관리로 이동 →
              </Link>
            </div>

            {/* One-row inputs (desktop-first) */}
            <div className="mt-4 rounded-xl border border-neutral-200 p-4">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3">
                  <TextField
                    label="대상 월"
                    value={targetMonth}
                    onChange={setTargetMonth}
                    placeholder="예) 2026-02"
                    helper="현재 선택된 대상월로 저장됩니다."
                  />
                </div>

                <div className="col-span-3">
                  <SelectField
                    label="직원 선택"
                    value={employee}
                    onChange={setEmployee}
                    helper="직원관리에서 등록한 근로자가 여기 나타납니다."
                    options={employeeOptions}
                  />
                </div>

                <div className="col-span-3">
                  <TextField
                    label="지급 금액"
                    value={amount}
                    onChange={setAmount}
                    placeholder="예) 3000000"
                    type="number"
                    helper="세전 기준 입력(예시)"
                  />
                </div>

                <div className="col-span-3">
                  <TextField
                    label="지급일"
                    value={payDate}
                    onChange={setPayDate}
                    placeholder="예) 2026-02-25"
                    helper="미입력 시 기본값(예: 25일)로 저장됩니다."
                  />
                </div>

                <div className="col-span-12 mt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={handleRegisterClick}
                    disabled={isSaving}
                    className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition active:bg-neutral-950 ${
                      isSaving
                        ? 'w-40 cursor-not-allowed bg-neutral-400 text-white'
                        : 'w-40 bg-neutral-900 text-white hover:bg-neutral-800'
                    }`}
                  >
                    {isSaving ? '저장중…' : '등록'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // 대상월은 유지, 입력만 초기화
                      resetInputsAfterSave()
                    }}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    초기화
                  </button>

                  <div className="flex flex-1 items-center justify-end">
                    <p className="text-xs text-neutral-500">
                      현재 대상월: <span className="font-medium text-neutral-800">{targetMonth || '-'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registered list (one-line per row) */}
            <div className="mt-5 rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between bg-neutral-50 px-4 py-3">
                <p className="text-sm font-medium text-neutral-900">
                  등록된 내역 ({visibleRows.length}건)
                </p>
                <p className="text-xs text-neutral-500">
                  * 삭제는 소프트 삭제로 처리되며 화면에는 노출되지 않습니다.
                </p>
              </div>

              <div className="divide-y divide-neutral-100 bg-white">
                {visibleRows.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-neutral-500">
                    현재 대상월에 등록된 내역이 없습니다.
                  </div>
                ) : (
                  visibleRows.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-neutral-900">
                          {r.employee}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {r.amount.toLocaleString('ko-KR')}원 · {r.payDate}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
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
        </div>

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
                  직원: <span className="font-medium text-neutral-900">{employee}</span>
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
            <li>이 페이지는 UI-only 입니다.</li>
            <li>직원 등록/삭제/신분증 업로드 등은 직원관리에서 진행합니다.</li>
            <li>중복 지급이 가능하며, 대상월에 동일 직원이 있으면 추가 등록 여부를 한 번 확인합니다.</li>
            <li>삭제는 소프트 삭제로 처리되며, 화면/내부직원에게는 노출하지 않는 방식을 기준으로 합니다.</li>
          </ul>
        </div>
      </div>
    </main>
  )
}