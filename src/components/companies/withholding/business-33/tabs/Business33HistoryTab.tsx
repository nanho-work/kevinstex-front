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

  const summaries: MonthSummary[] = [];
  const rows = useMemo<HistoryRow[]>(() => [], [selectedMonth]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-semibold">이전신고 내역</div>
            <div className="mt-1 text-sm text-zinc-600">
              백엔드 조회 API가 준비되면 월별 이력 데이터를 제공합니다.
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
