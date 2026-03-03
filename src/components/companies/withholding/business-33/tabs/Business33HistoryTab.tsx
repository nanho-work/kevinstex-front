"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import {
  fetchContractors,
  fetchWithholding33List,
} from "@/service/company/companyService";
import type { Contractor, Withholding33 } from "@/types/company";

function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

function toYearMonth(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}`;
}

function shiftYearMonth(ym: string, diffMonths: number) {
  const [yearText, monthText] = ym.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return ym;

  const d = new Date(year, month - 1, 1);
  d.setMonth(d.getMonth() + diffMonths);
  return toYearMonth(d);
}

function toDateText(isoLike?: string | null) {
  if (!isoLike) return "-";
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return isoLike;
  return d.toLocaleDateString("ko-KR");
}

export default function Business33HistoryTab() {
  const [selectedMonth, setSelectedMonth] = useState<string>(() => toYearMonth(new Date()));
  const [rows, setRows] = useState<Withholding33[]>([]);
  const [contractorMap, setContractorMap] = useState<Record<number, Contractor>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const monthInputRef = useRef<HTMLInputElement | null>(null);

  const targetMonth = useMemo(() => selectedMonth, [selectedMonth]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const [contractorRes, listRes] = await Promise.all([
          fetchContractors(),
          fetchWithholding33List({ target_month: targetMonth }),
        ]);

        const map = contractorRes.items.reduce<Record<number, Contractor>>((acc, c) => {
          acc[c.id] = c;
          return acc;
        }, {});

        setContractorMap(map);
        setRows(listRes.items);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "이전 신고내역 조회에 실패했습니다.";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [targetMonth]);

  const summary = useMemo(() => {
    const contractorIds = new Set<number>();
    const totals = rows.reduce(
      (acc, row) => {
        contractorIds.add(row.contractor_id);
        acc.gross += row.gross_pay;
        acc.income += row.income_tax;
        acc.local += row.local_tax;
        acc.net += row.net_pay;
        return acc;
      },
      { gross: 0, income: 0, local: 0, net: 0 }
    );
    return {
      ...totals,
      contractorCount: contractorIds.size,
      rowCount: rows.length,
    };
  }, [rows]);

  const sortedRows = useMemo(() => {
    const collator = new Intl.Collator("ko-KR");
    return [...rows].sort((a, b) => {
      const nameA = contractorMap[a.contractor_id]?.name ?? `대상자 #${a.contractor_id}`;
      const nameB = contractorMap[b.contractor_id]?.name ?? `대상자 #${b.contractor_id}`;
      const byName = collator.compare(nameA, nameB);
      if (byName !== 0) return byName;
      const byMonth = String(a.target_month).localeCompare(String(b.target_month));
      if (byMonth !== 0) return byMonth;
      return a.id - b.id;
    });
  }, [rows, contractorMap]);

  const rowCountByContractorId = useMemo(() => {
    return rows.reduce<Record<number, number>>((acc, row) => {
      acc[row.contractor_id] = (acc[row.contractor_id] ?? 0) + 1;
      return acc;
    }, {});
  }, [rows]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-base font-semibold">등록 내역 조회</div>
            <div className="mt-1 text-sm text-zinc-600">
              월별 지급 내역과 세무사 처리 상태를 확인할 수 있습니다.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedMonth((prev) => shiftYearMonth(prev, -1))}
              className="h-9 rounded-md border border-zinc-200 px-3 text-xs text-zinc-700 hover:bg-zinc-50"
            >
              &lt; 이전달
            </button>
            <div className="h-9 min-w-[92px] rounded-md border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-900 flex items-center justify-center">
              {selectedMonth}
            </div>
            <button
              type="button"
              onClick={() => setSelectedMonth((prev) => shiftYearMonth(prev, 1))}
              className="h-9 rounded-md border border-zinc-200 px-3 text-xs text-zinc-700 hover:bg-zinc-50"
            >
              다음달 &gt;
            </button>
            <button
              type="button"
              onClick={() => {
                const el = monthInputRef.current;
                if (!el) return;
                const pickerEl = el as HTMLInputElement & { showPicker?: () => void };
                if (pickerEl.showPicker) pickerEl.showPicker();
                else el.click();
              }}
              className="h-9 rounded-md border border-zinc-200 px-3 text-xs text-zinc-700 hover:bg-zinc-50"
            >
              월선택
            </button>
            <input
              ref={monthInputRef}
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="sr-only"
              aria-label="월선택"
            />
          </div>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-lg border border-zinc-200 overflow-hidden">
        <div className="bg-zinc-50 px-4 py-3 text-sm font-semibold">조회된 내역</div>

        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="bg-white border-b border-zinc-200">
              <tr className="text-center text-xs text-zinc-500">
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3">대상자</th>
                <th className="px-4 py-3">주민번호</th>
                <th className="px-4 py-3">신고월</th>
                <th className="px-4 py-3">총지급액</th>
                <th className="px-4 py-3">소득세</th>
                <th className="px-4 py-3">지방세</th>
                <th className="px-4 py-3">실지급액</th>
                <th className="px-4 py-3">메모</th>
                <th className="px-4 py-3">등록일</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-zinc-500">
                    내역을 불러오는 중입니다...
                  </td>
                </tr>
              ) : sortedRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-zinc-500">
                    조회된 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                sortedRows.map((row) => {
                  const contractor = contractorMap[row.contractor_id];
                  return (
                    <tr key={row.id} className="bg-white">
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={row.review_status} />
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-zinc-900">
                        <div className="flex items-center justify-center gap-2">
                          <span>{contractor?.name ?? `대상자 #${row.contractor_id}`}</span>
                          {(rowCountByContractorId[row.contractor_id] ?? 0) > 1 ? (
                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                              {rowCountByContractorId[row.contractor_id]}건
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-zinc-600">{contractor?.rrn_masked ?? "-"}</td>
                      <td className="px-4 py-3 text-center text-zinc-600">{row.target_month}</td>
                      <td className="px-4 py-3 text-right">{fmt(row.gross_pay)}</td>
                      <td className="px-4 py-3 text-right">{fmt(row.income_tax)}</td>
                      <td className="px-4 py-3 text-right">{fmt(row.local_tax)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{fmt(row.net_pay)}</td>
                      <td className="px-4 py-3 text-center text-xs text-zinc-600">{row.review_note || "-"}</td>
                      <td className="px-4 py-3 text-center text-xs text-zinc-500">{toDateText(row.created_at)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>

            <tfoot className="border-t border-zinc-200 bg-zinc-50">
              <tr className="text-sm">
                <td className="px-4 py-3 text-center font-semibold text-zinc-800" colSpan={4}>
                  <div className="flex items-center justify-center gap-2">
                    <span>합계 (고유 대상자 {summary.contractorCount}명, 등록건 {summary.rowCount}건)</span>
                    <span className="text-xs text-zinc-500">
                      안내(같은 대상자는 월별로 여러 건 등록될 수 있습니다.)
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-zinc-800">{fmt(summary.gross)}</td>
                <td className="px-4 py-3 text-right font-semibold text-zinc-800">{fmt(summary.income)}</td>
                <td className="px-4 py-3 text-right font-semibold text-zinc-800">{fmt(summary.local)}</td>
                <td className="px-4 py-3 text-right font-semibold text-zinc-800">{fmt(summary.net)}</td>
                <td className="px-4 py-3" colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
