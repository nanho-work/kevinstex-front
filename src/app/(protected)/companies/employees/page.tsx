'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

type EmployeeStatus = 'active' | 'inactive'

type Employee = {
  id: string
  name: string
  rrnMasked: string
  joinDate: string // YYYY-MM-DD (취득일/입사일)
  monthlySalary: number // 소득월액
  weeklyHours: number // 주 근로시간
  jobTitle: string // 직종/업무
  status: EmployeeStatus
  idCardFileName?: string
  updatedAt: string
}

function formatDateTimeKR(iso: string) {
  try {
    return new Date(iso).toLocaleString('ko-KR')
  } catch {
    return iso
  }
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

function SelectField({
  label,
  value,
  onChange,
  options,
  helper,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  helper?: string
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
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {helper ? <p className="mt-1 text-xs text-neutral-500">{helper}</p> : null}
    </div>
  )
}

function Badge({ status }: { status: EmployeeStatus }) {
  const label = status === 'active' ? '재직' : '퇴사'
  const cls =
    status === 'active'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-neutral-100 text-neutral-700 border-neutral-200'
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}
    >
      {label}
    </span>
  )
}

export default function ClientEmployeesPage() {
  // UI-only mock data
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'e1',
      name: '홍길동',
      rrnMasked: '900101-1******',
      joinDate: '2024-01-10',
      status: 'active',
      idCardFileName: 'hong_idcard.jpg',
      updatedAt: new Date().toISOString(),
      monthlySalary: 2800000,
      weeklyHours: 40,
      jobTitle: '사무/관리',
    },
    {
      id: 'e2',
      name: '김철수',
      rrnMasked: '910203-1******',
      joinDate: '2023-11-01',
      status: 'inactive',
      idCardFileName: 'kim_idcard.png',
      updatedAt: new Date().toISOString(),
      monthlySalary: 2200000,
      weeklyHours: 20,
      jobTitle: '조리 보조',
    },
  ])

  // Form (UI-only)
  const [name, setName] = useState('')
  const [rrn, setRrn] = useState('')
  const [joinDate, setJoinDate] = useState('')
  const [status, setStatus] = useState<EmployeeStatus>('active')
  const [idCardFileName, setIdCardFileName] = useState<string>('')
  const [monthlySalary, setMonthlySalary] = useState('')
  const [weeklyHours, setWeeklyHours] = useState('')
  const [jobTitle, setJobTitle] = useState('')

  // Search/filter
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | EmployeeStatus>('all')

  const filtered = useMemo(() => {
    const keyword = q.trim()
    return employees.filter((e) => {
      const okStatus = statusFilter === 'all' ? true : e.status === statusFilter
      const okQ = keyword
        ? e.name.includes(keyword) || e.rrnMasked.includes(keyword)
        : true
      return okStatus && okQ
    })
  }, [employees, q, statusFilter])

  const handleAdd = () => {
    // UI-only: 간단히 추가
    if (!name.trim()) return
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const masked =
      rrn.trim().length >= 8
        ? `${rrn.trim().slice(0, 6)}-${rrn.trim().slice(7, 8)}******`
        : '******-*******'
    const monthlySalaryNumber = Number(
      String(monthlySalary).replaceAll(',', '').trim(),
    )
    const weeklyHoursNumber = Number(
      String(weeklyHours).replaceAll(',', '').trim(),
    )
        

    const next: Employee = {
      id,
      name: name.trim(),
      rrnMasked: masked,
      joinDate: joinDate || '2026-02-27',
      monthlySalary: Number.isFinite(monthlySalaryNumber)
        ? monthlySalaryNumber
        : 0,
      weeklyHours: Number.isFinite(weeklyHoursNumber) ? weeklyHoursNumber : 0,
      jobTitle: jobTitle.trim(),
      status,
      idCardFileName: idCardFileName || undefined,
      updatedAt: new Date().toISOString(),
    }

    setEmployees((prev) => [next, ...prev])

    // reset (UI-only)
    setName('')
    setRrn('')
    setJoinDate('')
    setStatus('active')
    setIdCardFileName('')
    setMonthlySalary('')
    setWeeklyHours('')
    setJobTitle('')
  }

  const handleDelete = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: e.status === 'active' ? 'inactive' : 'active',
              updatedAt: new Date().toISOString(),
            }
          : e,
      ),
    )
  }

  return (
    <main className="min-h-[calc(100vh-80px)] w-full">
      {/* Page Header */}
      <div className="mb-6">
        <p className="text-sm text-neutral-500">고객사 전용</p>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              직원관리
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              직원 정보를 등록/조회/삭제합니다. (UI-only)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left: Form */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                직원 등록
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                입사일/신분증 정보를 포함해 등록합니다.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
              마스터
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <TextField
              label="이름"
              value={name}
              onChange={setName}
              placeholder="예) 홍길동"
            />
            <TextField
              label="주민등록번호"
              value={rrn}
              onChange={setRrn}
              placeholder="예) 900101-1234567"
              helper="UI-only: 저장 시 화면에서는 마스킹 처리됩니다."
            />
            <TextField
              label="취득일(입사일)"
              value={joinDate}
              onChange={setJoinDate}
              placeholder="예) 2026-02-01"
              helper="YYYY-MM-DD 형식"
            />

            <TextField
              label="월 보수액(소득월액)"
              value={monthlySalary}
              onChange={setMonthlySalary}
              placeholder="예) 2800000"
              helper="숫자만 입력 (UI-only)"
            />

            <TextField
              label="주 근로시간"
              value={weeklyHours}
              onChange={setWeeklyHours}
              placeholder="예) 40"
              helper="숫자만 입력 (UI-only)"
            />

            <TextField
              label="직종/업무"
              value={jobTitle}
              onChange={setJobTitle}
              placeholder="예) 사무/관리"
            />

            <SelectField
              label="상태"
              value={status}
              onChange={(v) => setStatus(v as EmployeeStatus)}
              options={[
                { value: 'active', label: '재직' },
                { value: 'inactive', label: '퇴사' },
              ]}
              helper="퇴사자는 신고 화면에서 기본 숨김 처리 가능"
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-800">
                신분증 사본 업로드(선택)
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setIdCardFileName(e.target.files?.[0]?.name ?? '')
                }
                className="block w-full text-sm text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-800"
              />
              <p className="mt-1 text-xs text-neutral-500">
                UI-only: 실제 업로드는 추후 S3 연동
              </p>
              {idCardFileName ? (
                <p className="mt-1 text-xs text-neutral-600">
                  선택됨: <span className="font-medium">{idCardFileName}</span>
                </p>
              ) : null}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 active:bg-neutral-950"
              >
                등록(예시)
              </button>
              <button
                type="button"
                onClick={() => {
                  setName('')
                  setRrn('')
                  setJoinDate('')
                  setStatus('active')
                  setIdCardFileName('')
                  setMonthlySalary('')
                  setWeeklyHours('')
                  setJobTitle('')
                }}
                className="inline-flex w-full items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                초기화
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-sm font-medium text-neutral-900">안내</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-600">
              <li>주민번호/신분증은 민감정보로 추후 암호화/권한 설정 예정</li>
              <li>기본 흐름은 “삭제 후 재등록” 중심으로 운영 가능</li>
            </ul>
          </div>
        </section>

        {/* Right: List */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                직원 목록
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                총 <span className="font-medium">{filtered.length}</span>명
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="이름/마스킹 주민번호 검색"
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              >
                <option value="all">전체</option>
                <option value="active">재직</option>
                <option value="inactive">퇴사</option>
              </select>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-200">
            <table className="min-w-[1200px] w-full border-collapse bg-white">
              <thead className="bg-neutral-50">
                <tr className="text-left text-xs font-medium text-neutral-600">
                    <th className="px-3 py-2">이름</th>
                    <th className="px-3 py-2">주민번호(마스킹)</th>
                    <th className="px-3 py-2">취득일(입사일)</th>
                    <th className="px-3 py-2">소득월액</th>
                    <th className="px-3 py-2">주 근로시간</th>
                    <th className="px-3 py-2">직종</th>
                    <th className="px-3 py-2">상태</th>
                    <th className="px-3 py-2">신분증</th>
                    <th className="px-3 py-2">업데이트</th>
                    <th className="px-3 py-2">액션</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-3 py-10 text-center text-sm text-neutral-500"
                    >
                      등록된 직원이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((e) => (
                    <tr key={e.id} className="border-t border-neutral-100 text-sm">
                      <td className="px-3 py-2 font-medium text-neutral-900">
                        {e.name}
                      </td>
                      <td className="px-3 py-2 text-neutral-700">{e.rrnMasked}</td>
                      <td className="px-3 py-2 text-neutral-700">{e.joinDate}</td>
                      <td className="px-3 py-2 text-neutral-700">
                        {Number(e.monthlySalary || 0).toLocaleString('ko-KR')}원
                        </td>
                        <td className="px-3 py-2 text-neutral-700">
                        {Number(e.weeklyHours || 0)}시간
                        </td>
                        <td className="px-3 py-2 text-neutral-700">
                        {e.jobTitle || '-'}
                        </td>
                      <td className="px-3 py-2">
                        <Badge status={e.status} />
                      </td>
                      <td className="px-3 py-2 text-neutral-700">
                        {e.idCardFileName ? (
                          <span className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs">
                            {e.idCardFileName}
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400">없음</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-neutral-500">
                        {formatDateTimeKR(e.updatedAt)}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(e.id)}
                            className="text-sm text-neutral-600 hover:text-neutral-900"
                          >
                            상태변경(예시)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(e.id)}
                            className="text-sm text-neutral-600 hover:text-neutral-900"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-sm font-medium text-neutral-900">메모</p>
            <p className="mt-1 text-sm text-neutral-600">
              근로소득(4대보험) 신고 화면에서는 기본적으로{' '}
              <span className="font-medium">재직(Active)</span> 직원만 노출하고,
              필요 시 퇴사 직원도 필터로 조회하는 방식이 자연스럽습니다.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}