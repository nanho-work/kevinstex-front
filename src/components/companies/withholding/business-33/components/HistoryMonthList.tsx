// src/components/companies/withholding/business-33/components/HistoryMonthList.tsx
import React from "react";

export type MonthSummary = {
  month: string; // YYYY-MM
  contractorCount: number;
  totalGross: number;
};

function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

type Props = {
  items: MonthSummary[];
  selectedMonth: string | null;
  onSelect: (month: string) => void;
};

export default function HistoryMonthList({ items, selectedMonth, onSelect }: Props) {
  return (
    <div className="rounded-lg border border-zinc-200 overflow-hidden">
      <div className="bg-zinc-50 px-4 py-3 text-sm font-semibold">월별 요약</div>

      <div className="divide-y divide-zinc-200">
        {items.length === 0 ? (
          <div className="px-4 py-8 text-sm text-zinc-500">데이터가 없습니다.</div>
        ) : (
          items.map((m) => {
            const active = selectedMonth === m.month;
            return (
              <button
                key={m.month}
                type="button"
                onClick={() => onSelect(m.month)}
                className={[
                  "w-full text-left px-4 py-3",
                  "hover:bg-zinc-50 transition-colors",
                  active ? "bg-zinc-50" : "bg-white",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{m.month}</div>
                  <div className="text-xs text-zinc-500">
                    {m.contractorCount}명 · 총 {fmt(m.totalGross)}원
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}