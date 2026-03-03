"use client";

import React, { useMemo, useState } from "react";

export type ContractorItem = {
  id: number;
  name: string;
  rrnMasked: string;
  birthDate?: string; // YYYY-MM-DD
  status: "active" | "inactive";
};

type Props = {
  contractors: ContractorItem[];
  onAdd: (contractor: ContractorItem) => void;
  highlightedContractorIds?: number[];
};

export default function ContractorSelect({
  contractors,
  onAdd,
  highlightedContractorIds = [],
}: Props) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const activeContractors = useMemo(() => {
    const collator = new Intl.Collator("ko-KR");
    return contractors
      .filter((c) => c.status === "active")
      .sort((a, b) => collator.compare(a.name, b.name));
  },
    [contractors]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return activeContractors;
    return activeContractors.filter((c) =>
      c.name.toLowerCase().includes(q) || c.rrnMasked.toLowerCase().includes(q)
    );
  }, [activeContractors, query]);

  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">기존 대상자 추가</div>
          <div className="mt-1 text-xs text-zinc-500">가나다순 정렬</div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="h-8 rounded-md border border-zinc-200 px-3 text-xs text-zinc-700 hover:bg-zinc-50"
        >
          {expanded ? "목록 접기" : "목록 펼치기"}
        </button>
      </div>

      <div className="mt-2">
        <div>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="이름/주민번호(마스킹) 검색"
            className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          />
          {(expanded || query.trim().length > 0) && (
            <div className="mt-2 max-h-56 overflow-auto rounded-md border border-zinc-200 p-2">
              {filtered.length === 0 ? (
                <div className="px-3 py-3 text-sm text-zinc-500">검색 결과가 없습니다.</div>
              ) : (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  {filtered.map((c) => {
                    const highlighted = highlightedContractorIds.includes(c.id);
                    return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onAdd(c);
                        setQuery("");
                      }}
                      className={`rounded-md border px-3 py-2 text-left ${
                        highlighted
                          ? "border-emerald-200 bg-emerald-50 hover:bg-emerald-100/70"
                          : "border-zinc-200 bg-white hover:bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium text-zinc-900">{c.name}</div>
                        {highlighted ? (
                          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-emerald-700">
                            추가됨
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">{c.rrnMasked}</div>
                    </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
