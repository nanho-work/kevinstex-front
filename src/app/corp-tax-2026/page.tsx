import React from 'react'

export const metadata = {
  title: '2026년 법인세 신고 제출서류 안내',
  robots: 'noindex, nofollow',
}

type Row = { doc: string; issuer: string; note?: string }

function TableSection({
  index,
  title,
  rows,
}: {
  index: number
  title: string
  rows: Row[]
}) {
  return (
    <section className="scroll-mt-24">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded border border-gray-300 text-xs font-semibold text-gray-700">
          {index}
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-sky-200/70">
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">
                제출 서류
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">
                발급처
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">
                비고
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.doc}-${r.issuer}`} className="align-top">
                <td className="border border-gray-300 px-3 py-2 text-gray-900">{r.doc}</td>
                <td className="border border-gray-300 px-3 py-2 text-gray-900">{r.issuer}</td>
                <td className="border border-gray-300 px-3 py-2 text-gray-700">
                  {r.note ?? ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function CorpTax2026Page() {
  const schedule = {
    taxPeriod: '2026년 3월 1일 ~ 2026년 3월 31일(월)',
    collectBy: '~ 2026년 3월 3일(화)',
    closing: '2026년 3월 1일 ~ 2026년 3월 16일(월)',
    adjust: '3월 12일 ~ 3월 24일(화)',
    notice: '상기 일정은 업무 진행 상황에 따라 변동될 수 있습니다.',
  }

  const sec1: Row[] = [
    { doc: '법인등기부 등본', issuer: '인터넷등기소', note: '' },
    { doc: '주주명부', issuer: '사내관리', note: '' },
    {
      doc: '등기사항 변경에 따른 발생비용 영수증',
      issuer: '사내관리',
      note: '법무사 비용 정산 영수증, 등기 수수료 영수증 등',
    },
  ]

  const sec2: Row[] = [
    {
      doc: '계좌내역(엑셀)',
      issuer: '금융기관',
      note: '보통예금, 정기예금, 정기적금, 펀드계좌, 외화계좌 등\n법인명의 금융계좌 일체',
    },
    {
      doc: '이자소득원천징수영수증',
      issuer: '금융기관',
      note: '예금 등으로 법인에 이자소득 발생 시',
    },
    { doc: '부채증명원', issuer: '금융기관', note: '' },
    { doc: '대출 원금 및 이자 상환내역서', issuer: '금융기관', note: '이자 계산서 필수' },
    { doc: '퇴직연금(DC, DB) 납입내역서', issuer: '금융기관', note: '' },
    {
      doc: '보험증권 및 손비처리 내역서',
      issuer: '보험회사',
      note: '사업장 관련 화재보험 및 손해배상 보험 등',
    },
  ]

  const sec3: Row[] = [
    {
      doc: '채권 잔액 명세서',
      issuer: '사내관리',
      note: '외상매출금, 미수금, 선급금 등 12월 말 기준 잔액 확인',
    },
    { doc: '어음대장 및 어음 사본', issuer: '사내관리', note: '' },
    {
      doc: '채무 잔액 명세서',
      issuer: '사내관리',
      note: '외상매입금, 미지급금, 선수금 등 12월 말 기준 잔액 확인',
    },
    { doc: '재고자산 리스트', issuer: '사내관리', note: '12월 말 재고자산 금액 확인' },
    { doc: '건물 등 유형자산 취득 자료', issuer: '사내관리', note: '이미 제출한 경우 제출 불필요' },
  ]

  const sec4: Row[] = [
    {
      doc: '차량 구입 관련 영수증 일체',
      issuer: '사내관리',
      note: '차량 계약서, 취등록세 영수증, 운반비 포함',
    },
    {
      doc: '리스 및 렌트 차량 계약서, 청구(납부)내역서',
      issuer: '사내관리',
      note: '납입 스케줄이 아닌 실제 납부내역이 필요',
    },
    {
      doc: '업무용 승용차 차량일지, 차량 비용 현황',
      issuer: '사내관리',
      note: '',
    },
  ]

  const sec5: Row[] = [
    {
      doc: '법인카드 거래내역서',
      issuer: '금융기관',
      note: '1-12월까지 엑셀파일(카드사별)',
    },
    {
      doc: '법인카드 거래대금 납입내역서',
      issuer: '금융기관',
      note: '월별로 제출필요(12월 거래내역은 다음해 1월로 조회)',
    },
    { doc: '지출 결의서', issuer: '사내관리', note: '일계표 등 재정 관리 대장' },
    { doc: '공과금 지로 영수증', issuer: '사내관리', note: '' },
    { doc: '경조사비 내역', issuer: '사내관리', note: '청첩장, 부고장 등' },
    { doc: '간이영수증', issuer: '사내관리', note: '' },
    {
      doc: '지방세 세목별 과세 증명서',
      issuer: '주민센터, 위택스',
      note: '위택스 전국 지방세 납입내역',
    },
    {
      doc: '4대보험 월별 납부 상세 내역서개인별 산출 내역서',
      issuer: '공단 발급',
      note: '2026년 1월 납부분까지',
    },
    {
      doc: '벤처기업 확인서, 기업부설연구소 등 인정서',
      issuer: '사내관리',
      note: '연구전담요원 확인 요망',
    },
    { doc: '각종 지원금 수령 내역서', issuer: '각 지급처', note: '' },
    { doc: '기부금 명세서', issuer: '기부처', note: '법인 명의 기부금' },
  ]

  return (
    <section className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-10">
        {/* Title */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              2026년 귀속 법인세 신고 제출자료 안내
            </h1>

            <div className="mt-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <span className="inline-flex items-center justify-center rounded bg-red-600 text-white text-xs px-2 py-0.5">
                  31
                </span>
                <span>법인세 신고 및 납부 기한: {schedule.taxPeriod}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-orange-500 text-white text-xs">
                  ✦
                </span>
                <span>업무 일정</span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-800">
                <li>• 자료 수집 기한 : {schedule.collectBy}</li>
                <li>• 법인 결산 기간: {schedule.closing}</li>
                <li>• 법인 세무조정 및 신고서 작성 기간: {schedule.adjust}</li>
                <li className="text-red-600 font-medium">• {schedule.notice}</li>
              </ul>
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
              <p className="text-xs font-semibold text-gray-700">THE KEVIN&apos;S TAX LAB</p>
              <p className="mt-1 text-xs text-gray-500">제출자료 안내</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-10">
          <h2 className="text-xl font-extrabold text-gray-900">제출 서류 목록</h2>

          <div className="mt-6 space-y-10">
            <TableSection index={1} title="법인 기본서류" rows={sec1} />
            <TableSection index={2} title="금융 및 보험" rows={sec2} />
            <TableSection index={3} title="법인 채권/채무 및 재고자산 및 유형자산" rows={sec3} />
            <TableSection index={4} title="업무용 차량 관련" rows={sec4} />
            <TableSection index={5} title="기타 증빙" rows={sec5} />
          </div>

          <div className="mt-10 space-y-2 text-sm text-gray-800">
            <p>✦ 원활한 신고 진행을 위해 자료를 기한 내 제출하여 주시기 바랍니다.</p>
            <p>✦ 추가 문의 사항이 있으실 경우 별도 연락 주시기 바랍니다.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
