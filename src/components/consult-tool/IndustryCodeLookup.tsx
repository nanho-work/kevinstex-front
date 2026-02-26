'use client'

import { useMemo, useState } from 'react'

// ✅ 연도별 JSON 중 “검수할 파일” 1개를 선택해서 import
// - 실제 생성된 파일명에 맞춰 아래 import만 바꾸면 됩니다.
import rates2024 from '@/data/normalized/industryRates_2024.json'

import type { IndustryRatesMap } from '@/service/taxCalculator'
import {
  describeIndustryRate,
  findIndustryRateByCode,
  formatRatePercent,
  normalizeIndustryCode,
} from '@/service/taxCalculator'

export default function IndustryCodeLookup() {
  const rates = rates2024 as unknown as IndustryRatesMap

  const [code, setCode] = useState('')
  const [submittedCode, setSubmittedCode] = useState<string>('')
  const [open, setOpen] = useState(false)

  const normalized = useMemo(() => normalizeIndustryCode(code), [code])

  const found = useMemo(() => {
    if (!submittedCode) return null
    return findIndustryRateByCode(rates, submittedCode)
  }, [rates, submittedCode])

  const summary = useMemo(() => {
    if (!found) return null
    return describeIndustryRate(found)
  }, [found])

  const onSearch = () => {
    const c = normalizeIndustryCode(code)
    setSubmittedCode(c)
    // 조회 시 결과 영역을 펼침(있으면 펼쳐서 보여주고, 없으면 아래 안내 문구만 보이도록)
    setOpen(true)
  }

  const onReset = () => {
    setCode('')
    setSubmittedCode('')
    setOpen(false)
  }

  const ui = {
    panel: { border: '1px solid #d1d5db', borderRadius: 12, padding: 14, background: '#fff' } as const,
    title: { fontSize: 14, fontWeight: 900, marginBottom: 10 } as const,
    row: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' } as const,
    input: { padding: 10, border: '1px solid #d1d5db', borderRadius: 10, width: 240 } as const,
    btn: { padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 10, background: '#fff', cursor: 'pointer', fontWeight: 800 } as const,
    hint: { fontSize: 12, color: '#6b7280', marginTop: 8, lineHeight: 1.5 } as const,
    table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: 12 } as const,
    th: { textAlign: 'left' as const, fontSize: 12, color: '#6b7280', padding: '8px 6px', borderBottom: '1px solid #d1d5db' } as const,
    tdK: { fontSize: 13, fontWeight: 800, padding: '8px 6px', borderBottom: '1px solid #e5e7eb', width: 160 } as const,
    tdV: { fontSize: 13, padding: '8px 6px', borderBottom: '1px solid #e5e7eb' } as const,
    badge: { display: 'inline-block', padding: '4px 8px', borderRadius: 999, background: '#e5e7eb', fontSize: 12, fontWeight: 900 } as const,
    ok: { color: '#065f46', fontWeight: 900 } as const,
    no: { color: '#991b1b', fontWeight: 900 } as const,
  }

  return (
    <div style={ui.panel}>
      <div style={ui.title}>업종코드 조회(검수용)</div>

      <div style={ui.row}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch()
          }}
          placeholder="업종코드 입력 (예: 701101)"
          style={ui.input}
          inputMode="numeric"
          onFocus={() => {
            // 입력할 때 결과 영역이 펼쳐져 있으면 불편하니 자동 접기
            if (submittedCode) setOpen(false)
          }}
        />
        <button onClick={onSearch} style={ui.btn}>조회</button>

        {submittedCode ? (
          <button
            onClick={() => setOpen((v) => !v)}
            style={ui.btn}
            title="조회 결과 접기/펼치기"
          >
            {open ? '접기' : '펼치기'}
          </button>
        ) : null}

        <button onClick={onReset} style={ui.btn} title="입력/조회 초기화">초기화</button>

        <span style={ui.badge}>정규화: {normalized || '-'}</span>

        {submittedCode ? (
          found ? <span style={ui.ok}>조회됨</span> : <span style={ui.no}>없음</span>
        ) : null}
      </div>

      <div style={ui.hint}>
        - 데이터 소스: <b>industryRates_2024.json</b> (필요 시 import만 교체)<br />
        - 경비율은 JSON에서 <b>0~1 비율</b>로 저장됨 (예: 0.935 → 93.5%)
      </div>

      {open && submittedCode && !found && (
        <div style={{ ...ui.hint, marginTop: 12 }}>
          입력한 업종코드(<b>{submittedCode}</b>)에 해당하는 항목을 찾지 못했습니다.
        </div>
      )}

      {open && found && summary && (
        <table style={ui.table}>
          <thead>
            <tr>
              <th style={ui.th}>항목</th>
              <th style={ui.th}>값</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={ui.tdK}>업종코드</td>
              <td style={ui.tdV}>{submittedCode}</td>
            </tr>
            <tr>
              <td style={ui.tdK}>업태명</td>
              <td style={ui.tdV}>{summary.업태명}</td>
            </tr>

            <tr>
              <td style={ui.tdK}>단순경비율(일반율)</td>
              <td style={ui.tdV}>
                {summary.단순경비율_일반율} <span style={{ color: '#6b7280' }}>({formatRatePercent(found.simpleRateGeneral)})</span>
              </td>
            </tr>
            <tr>
              <td style={ui.tdK}>단순경비율(초과율)</td>
              <td style={ui.tdV}>
                {summary.단순경비율_초과율} <span style={{ color: '#6b7280' }}>({formatRatePercent(found.simpleRateExcess)})</span>
              </td>
            </tr>
            <tr>
              <td style={ui.tdK}>기준경비율(일반율)</td>
              <td style={ui.tdV}>
                {summary.기준경비율_일반율} <span style={{ color: '#6b7280' }}>({formatRatePercent(found.standardRateGeneral)})</span>
              </td>
            </tr>

            <tr>
              <td style={ui.tdK}>중분류</td>
              <td style={ui.tdV}>{summary.중분류}</td>
            </tr>
            <tr>
              <td style={ui.tdK}>세분류</td>
              <td style={ui.tdV}>{summary.세분류}</td>
            </tr>
            <tr>
              <td style={ui.tdK}>세세분류</td>
              <td style={ui.tdV}>{summary.세세분류}</td>
            </tr>

            <tr>
              <td style={ui.tdK}>적용기준내용</td>
              <td style={ui.tdV}>{summary.적용기준내용}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}