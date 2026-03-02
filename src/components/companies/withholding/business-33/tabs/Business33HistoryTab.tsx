// src/components/companies/withholding/business-33/tabs/Business33HistoryTab.tsx
import React, { useMemo, useState } from "react";
import MonthPicker from "../components/MonthPicker";
import HistoryMonthList, { MonthSummary } from "../components/HistoryMonthList";
import HistoryDetailTable, { HistoryRow } from "../components/HistoryDetailTable";

export default function Business33HistoryTab() {
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${mm}`;
  });

  // UI-only 더미
  const summaries: MonthSummary[] = [
    { month: "2026-03", contractorCount: 4, totalGross: 5800000 },
    { month: "2026-02", contractorCount: 3, totalGross: 4200000 },
    { month: "2026-01", contractorCount: 2, totalGross: 3000000 },
  ];

  const allRows: Record<string, HistoryRow[]> = {
    "2026-03": [
      {
        id: 1,
        contractorName: "홍길동",
        rrnMasked: "900101-1******",
        payDate: "2026-03-10",
        grossPay: 1500000,
        incomeTax: 45000,
        localTax: 4500,
        netPay: 1450500,
        status: "reviewed",
      },
      {
        id: 2,
        contractorName: "김철수",
        rrnMasked: "880505-2******",
        payDate: "2026-03-20",
        grossPay: 2000000,
        incomeTax: 60000,
        localTax: 6000,
        netPay: 1934000,
        status: "filed",
      },
    ],
    "2026-02": [
      {
        id: 3,
        contractorName: "홍길동",
        rrnMasked: "900101-1******",
        payDate: "2026-02-11",
        grossPay: 1200000,
        incomeTax: 36000,
        localTax: 3600,
        netPay: 1160400,
        status: "rejected",
      },
    ],
    "2026-01": [],
  };

  const rows = useMemo(() => allRows[selectedMonth] ?? [], [selectedMonth]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-semibold">이전신고 내역</div>
            <div className="mt-1 text-sm text-zinc-600">
              월별 요약을 클릭하면 상세 내역이 표시됩니다(UI-only).
            </div>
          </div>

          <MonthPicker value={selectedMonth} onChange={setSelectedMonth} label="조회 월" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <HistoryMonthList
            items={summaries}
            selectedMonth={selectedMonth}
            onSelect={setSelectedMonth}
          />
        </div>

        <div className="lg:col-span-2">
          <HistoryDetailTable month={selectedMonth} rows={rows} />
        </div>
      </div>
    </div>
  );
}