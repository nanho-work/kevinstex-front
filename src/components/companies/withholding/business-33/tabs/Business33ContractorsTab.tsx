// src/components/companies/withholding/business-33/tabs/Business33ContractorsTab.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ContractorItem } from "../components/ContractorSelect";
import {
  fetchContractors,
  updateContractor,
} from "@/service/company/companyService";

function toContractorItem(c: {
  id: number;
  name: string;
  rrn_masked: string;
  birth_date?: string | null;
  status: "active" | "inactive";
}): ContractorItem {
  return {
    id: c.id,
    name: c.name,
    rrnMasked: c.rrn_masked,
    birthDate: c.birth_date ?? undefined,
    status: c.status,
  };
}

export default function Business33ContractorsTab() {
  const [items, setItems] = useState<ContractorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const res = await fetchContractors();
        setItems(res.items.map((c) => toContractorItem(c)));
      } catch (e: any) {
        setErrorMessage(e?.message ?? "대상자 목록 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const collator = new Intl.Collator("ko-KR");
    const sorted = items
      .filter((x) => x.status === "active")
      .sort((a, b) => collator.compare(a.name, b.name));
    const query = q.trim().toLowerCase();
    if (!query) return sorted;
    return sorted.filter((x) => x.name.toLowerCase().includes(query) || x.rrnMasked.toLowerCase().includes(query));
  }, [q, items]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 p-4">
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-base font-semibold">신고대상자 관리</div>
            <div className="mt-1 text-sm text-zinc-600">
              신고 이력이 있거나 현재 신고에 사용 중인 대상자 목록입니다. 계약 종료 또는 신고 대상 제외가 필요하면 삭제해 주세요.
            </div>
          </div>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-lg border border-zinc-200 p-4">
        <div className="flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="이름/주민번호(마스킹) 검색"
            className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          />
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 overflow-hidden">
        <div className="bg-zinc-50 px-4 py-3 text-sm font-semibold">대상자 목록</div>

        <div className="p-4">
          {loading ? (
            <div className="py-10 text-center text-sm text-zinc-500">
              대상자 목록을 불러오는 중입니다...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-zinc-500">
              노출할 활성 대상자가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {filtered.map((x) => (
                <div key={x.id} className="rounded-lg border border-zinc-200 bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex items-center gap-2 text-sm">
                      <span className="truncate font-semibold text-zinc-900">{x.name}</span>
                      <span className="shrink-0 text-zinc-400">·</span>
                      <span className="truncate text-zinc-600">{x.rrnMasked}</span>
                    </div>
                    <button
                      type="button"
                      disabled={actionId === x.id}
                      className="h-7 shrink-0 rounded-md border border-zinc-200 px-3 text-xs hover:bg-zinc-50"
                      onClick={async () => {
                        try {
                          setActionId(x.id);
                          const updated = await updateContractor(x.id, { status: "inactive" });
                          setItems((prev) =>
                            prev.map((p) => (p.id === x.id ? toContractorItem(updated) : p))
                          );
                        } catch (e: any) {
                          alert(e?.message ?? "비활성화에 실패했습니다.");
                        } finally {
                          setActionId(null);
                        }
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
