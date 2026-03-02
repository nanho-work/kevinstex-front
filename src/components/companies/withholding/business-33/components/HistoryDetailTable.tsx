// src/components/companies/withholding/business-33/components/HistoryDetailTable.tsx
import React from "react";
import StatusBadge, { ReviewStatus } from "./StatusBadge";

export type HistoryRow = {
  id: number;
  contractorName: string;
  rrnMasked: string;
  payDate: string; // YYYY-MM-DD
  grossPay: number;
  incomeTax: number;
  localTax: number;
  netPay: number;
  status: ReviewStatus;
};

function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

type Props = {
  month: string | null;
  rows: HistoryRow[];
};

export default function HistoryDetailTable({ month, rows }: Props) {
  return (
    <div className="rounded-lg border border-zinc-200 overflow-hidden">
      <div className="bg-zinc-50 px-4 py-3 flex items-center justify-between">
        <div className="text-sm font-semibold">상세 내역</div>
        <div className="text-xs text-zinc-500">{month ? `${month} 기준` : "월을 선택하세요"}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-white border-b border-zinc-200">
            <tr className="text-left text-xs text-zinc-500">
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">대상자</th>
              <th className="px-4 py-3">주민번호</th>
              <th className="px-4 py-3">지급일</th>
              <th className="px-4 py-3 text-right">총지급액</th>
              <th className="px-4 py-3 text-right">소득세</th>
              <th className="px-4 py-3 text-right">지방세</th>
              <th className="px-4 py-3 text-right">실지급액</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-500">
                  {month ? "해당 월의 내역이 없습니다." : "월을 선택하면 상세가 표시됩니다."}
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="bg-white">
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 font-medium">{r.contractorName}</td>
                  <td className="px-4 py-3 text-zinc-600">{r.rrnMasked}</td>
                  <td className="px-4 py-3 text-zinc-600">{r.payDate}</td>
                  <td className="px-4 py-3 text-right">{fmt(r.grossPay)}</td>
                  <td className="px-4 py-3 text-right">{fmt(r.incomeTax)}</td>
                  <td className="px-4 py-3 text-right">{fmt(r.localTax)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{fmt(r.netPay)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}