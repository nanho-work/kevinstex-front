// src/components/companies/withholding/business-33/tabs/Business33ContractorsTab.tsx
import React, { useMemo, useState } from "react";
import ContractorCreateModal from "../components/ContractorCreateModal";
import { ContractorItem } from "../components/ContractorSelect";

export default function Business33ContractorsTab() {
  const [items, setItems] = useState<ContractorItem[]>([
    { id: 1, name: "홍길동", rrnMasked: "900101-1******", birthDate: "1990-01-01", status: "active" },
    { id: 2, name: "김철수", rrnMasked: "880505-2******", birthDate: "1988-05-05", status: "active" },
    { id: 3, name: "이영희", rrnMasked: "920707-2******", birthDate: "1992-07-07", status: "inactive" },
  ]);

  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

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
              중복 없는 대상자 마스터 목록(UI-only). 실제 유니크/암호화/정정 로직은 서버 연동 시 적용.
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
              {filtered.length === 0 ? (
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
                          className="h-8 rounded-md border border-zinc-200 px-3 text-xs hover:bg-zinc-50"
                          onClick={() => {
                            setItems((prev) =>
                              prev.map((p) => (p.id === x.id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p))
                            );
                          }}
                        >
                          상태변경
                        </button>

                        <button
                          type="button"
                          className="h-8 rounded-md border border-zinc-200 px-3 text-xs hover:bg-zinc-50"
                          onClick={() => {
                            // UI-only: 삭제
                            setItems((prev) => prev.filter((p) => p.id !== x.id));
                          }}
                        >
                          삭제
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
        onSubmit={({ name, rrn, birthDate }) => {
          const newId = Math.max(0, ...items.map((c) => c.id)) + 1;
          const masked = rrn ? `${rrn.slice(0, 6)}-${rrn.slice(7, 8)}******` : "******-*******";
          setItems((prev) => [{ id: newId, name, rrnMasked: masked, birthDate, status: "active" }, ...prev]);
        }}
      />
    </div>
  );
}