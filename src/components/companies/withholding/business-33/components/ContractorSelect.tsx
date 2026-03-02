"use client";

// src/components/companies/withholding/business-33/components/ContractorSelect.tsx
import React, { useMemo, useRef, useState } from "react";

export type ContractorItem = {
  id: number;
  name: string;
  rrnMasked: string;
  birthDate?: string; // YYYY-MM-DD
  status: "active" | "inactive";
};

type Props = {
  contractors: ContractorItem[];
  value: number | null;
  onChange: (id: number | null) => void;

  // 기존 모달 방식 유지
  onCreateClick?: () => void;

  // ✅ 빠른 등록(이름/주민번호 입력 → 즉시 생성)
  onQuickCreate?: (payload: { name: string; rrn: string; birthDate?: string }) => void;
};

export default function ContractorSelect({
  contractors,
  value,
  onChange,
  onCreateClick,
  onQuickCreate,
}: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  // 빠른 등록 폼
  const [quickName, setQuickName] = useState("");
  const [quickRrn, setQuickRrn] = useState("");
  const [quickBirth, setQuickBirth] = useState<string>("");

  const rootRef = useRef<HTMLDivElement | null>(null);

  const activeContractors = useMemo(
    () => contractors.filter((c) => c.status === "active"),
    [contractors]
  );

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return activeContractors;
    return activeContractors.filter((c) => {
      return (
        c.name.toLowerCase().includes(query) ||
        c.rrnMasked.toLowerCase().includes(query)
      );
    });
  }, [q, activeContractors]);

  const selected = useMemo(
    () => (value ? contractors.find((c) => c.id === value) ?? null : null),
    [value, contractors]
  );

  return (
    <div
      ref={rootRef}
      className="rounded-lg border border-zinc-200 p-4"
      onBlur={(e) => {
        if (!rootRef.current) return;
        if (!rootRef.current.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-zinc-900">대상자 선택</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCreateClick}
            className="h-9 rounded-md border border-zinc-200 px-3 text-sm hover:bg-zinc-50"
          >
            신규 대상자 등록
          </button>
        </div>
      </div>

      {/* ✅ 검색 입력만으로 바로 선택되는 Autocomplete */}
      <div className="mt-3">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="이름/주민번호(마스킹) 검색"
            className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          />

          {open && filtered.length > 0 && (
            <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-md border border-zinc-200 bg-white shadow-sm">
              <div className="max-h-56 overflow-auto">
                {filtered.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onChange(c.id);
                      setQ("");
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-zinc-50"
                  >
                    <div className="font-medium text-zinc-900">
                      {c.name} <span className="text-zinc-500">· {c.rrnMasked}</span>
                      {c.birthDate ? <span className="text-zinc-400"> · {c.birthDate}</span> : null}
                    </div>
                    {value === c.id ? <span className="text-xs text-zinc-500">선택됨</span> : null}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {selected ? (
          <div className="mt-2 rounded-md bg-zinc-50 px-3 py-2 text-sm">
            <span className="font-semibold text-zinc-900">선택:</span>{" "}
            <span className="text-zinc-900">{selected.name}</span>
            <span className="text-zinc-600"> · {selected.rrnMasked}</span>
            {selected.birthDate ? <span className="text-zinc-500"> · {selected.birthDate}</span> : null}
            <button
              type="button"
              className="ml-3 text-xs text-zinc-600 underline underline-offset-2 hover:text-zinc-900"
              onClick={() => onChange(null)}
            >
              선택 해제
            </button>
          </div>
        ) : null}
      </div>

      {/* ✅ 빠른 등록: 인원이 많을 때 모달 없이 바로 추가 */}
      <div className="mt-4 rounded-md border border-zinc-200 p-3">
        <div className="text-sm font-semibold text-zinc-900">빠른 등록</div>
        <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <div className="mb-1 text-xs text-zinc-600">이름</div>
            <input
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              placeholder="예: 홍길동"
              className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            />
          </div>
          <div>
            <div className="mb-1 text-xs text-zinc-600">주민번호</div>
            <input
              value={quickRrn}
              onChange={(e) => setQuickRrn(e.target.value)}
              placeholder="예: 900101-1234567"
              className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            />
          </div>
          <div>
            <div className="mb-1 text-xs text-zinc-600">생년월일(선택)</div>
            <input
              type="date"
              value={quickBirth}
              onChange={(e) => setQuickBirth(e.target.value)}
              className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            className="h-9 rounded-md border border-zinc-200 px-3 text-sm hover:bg-zinc-50"
            onClick={() => {
              setQuickName("");
              setQuickRrn("");
              setQuickBirth("");
            }}
          >
            초기화
          </button>

          <button
            type="button"
            disabled={!onQuickCreate || !quickName.trim() || !quickRrn.trim()}
            className="h-9 rounded-md bg-zinc-900 px-3 text-sm text-white hover:bg-zinc-800 disabled:bg-zinc-300"
            onClick={() => {
              if (!onQuickCreate) return;
              onQuickCreate({
                name: quickName.trim(),
                rrn: quickRrn.trim(),
                birthDate: quickBirth ? quickBirth : undefined,
              });
              setQuickName("");
              setQuickRrn("");
              setQuickBirth("");
            }}
          >
            빠른 등록
          </button>
        </div>

        <div className="mt-2 text-xs text-zinc-500">
          * 빠른 등록은 UI-only 입니다. 서버 연동 시 주민번호 처리(암호화/마스킹)는 서버에서 처리하세요.
        </div>
      </div>

      <div className="mt-2 text-xs text-zinc-500">
        * 여기에는 “중복 없는 대상자 리스트”만 보여주는 UI로 구성했습니다.
      </div>
    </div>
  );
}