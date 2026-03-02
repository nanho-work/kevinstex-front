// src/components/companies/withholding/business-33/tabs/Business33ContractorsTab.tsx
import React, { useEffect, useMemo, useState } from "react";
import ContractorCreateModal from "../components/ContractorCreateModal";
import { ContractorItem } from "../components/ContractorSelect";
import {
  createContractor,
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
  const [modalOpen, setModalOpen] = useState(false);

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
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter((x) => x.name.toLowerCase().includes(query) || x.rrnMasked.toLowerCase().includes(query));
  }, [q, items]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-semibold">신고대상자 관리</div>
            <div className="mt-1 text-sm text-zinc-600">
              등록된 대상자 조회/등록/상태 변경을 수행합니다.
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="h-10 rounded-md bg-zinc-900 px-4 text-sm text-white hover:bg-zinc-800"
          >
            신규 대상자 등록
          </button>
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

        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-sm">
            <thead className="bg-white border-b border-zinc-200">
              <tr className="text-left text-xs text-zinc-500">
                <th className="px-4 py-3">이름</th>
                <th className="px-4 py-3">주민번호</th>
                <th className="px-4 py-3">생년월일</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3 text-right">작업</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-500">
                    대상자 목록을 불러오는 중입니다...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-500">
                    대상자가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((x) => (
                  <tr key={x.id} className="bg-white">
                    <td className="px-4 py-3 font-medium">{x.name}</td>
                    <td className="px-4 py-3 text-zinc-600">{x.rrnMasked}</td>
                    <td className="px-4 py-3 text-zinc-600">{x.birthDate ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "inline-flex items-center px-2 py-0.5 text-xs border rounded-full",
                          x.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-zinc-50 text-zinc-700 border-zinc-200",
                        ].join(" ")}
                      >
                        {x.status === "active" ? "active" : "inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={actionId === x.id}
                          className="h-8 rounded-md border border-zinc-200 px-3 text-xs hover:bg-zinc-50"
                          onClick={async () => {
                            try {
                              setActionId(x.id);
                              const nextStatus = x.status === "active" ? "inactive" : "active";
                              const updated = await updateContractor(x.id, { status: nextStatus });
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === x.id ? toContractorItem(updated) : p
                                )
                              );
                            } catch (e: any) {
                              alert(e?.message ?? "상태 변경에 실패했습니다.");
                            } finally {
                              setActionId(null);
                            }
                          }}
                        >
                          {actionId === x.id ? "처리중..." : "상태변경"}
                        </button>

                        <button
                          type="button"
                          disabled={actionId === x.id || x.status === "inactive"}
                          className="h-8 rounded-md border border-zinc-200 px-3 text-xs hover:bg-zinc-50"
                          onClick={async () => {
                            try {
                              setActionId(x.id);
                              const updated = await updateContractor(x.id, { status: "inactive" });
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === x.id ? toContractorItem(updated) : p
                                )
                              );
                            } catch (e: any) {
                              alert(e?.message ?? "비활성화에 실패했습니다.");
                            } finally {
                              setActionId(null);
                            }
                          }}
                        >
                          비활성
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ContractorCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={async ({ name, rrn, birthDate }) => {
          const created = await createContractor({
            name,
            rrn,
            birth_date: birthDate ?? undefined,
          });
          setItems((prev) => [toContractorItem(created), ...prev]);
          setErrorMessage(null);
        }}
      />
    </div>
  );
}
