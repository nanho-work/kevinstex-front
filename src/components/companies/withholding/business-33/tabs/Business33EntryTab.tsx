"use client";

// src/components/companies/withholding/business-33/tabs/Business33EntryTab.tsx
import React, { useMemo, useState } from "react";
import ContractorSelect, { ContractorItem } from "../components/ContractorSelect";
import ContractorCreateModal from "../components/ContractorCreateModal";
import PaymentEntryForm from "../components/PaymentEntryForm";
import MonthPicker from "../components/MonthPicker";
import StatusBadge from "../components/StatusBadge";

type EntryRow = {
  id: number;
  contractorId: number;
  contractorName: string;
  rrnMasked: string;
  payDate: string;
  grossPay: number;
  incomeTax: number;
  localTax: number;
  netPay: number;
  status: "draft" | "reviewed" | "filed" | "rejected";
};

function calcIncomeTax(gross: number) {
  return Math.floor(gross * 0.03);
}
function calcLocalTax(incomeTax: number) {
  return Math.floor(incomeTax * 0.1);
}
function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

export default function Business33EntryTab() {
  const [targetMonth, setTargetMonth] = useState<string>(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${mm}`;
  });

  const [contractors, setContractors] = useState<ContractorItem[]>([
    { id: 1, name: "홍길동", rrnMasked: "900101-1******", birthDate: "1990-01-01", status: "active" },
    { id: 2, name: "김철수", rrnMasked: "880505-2******", birthDate: "1988-05-05", status: "active" },
    { id: 3, name: "이영희", rrnMasked: "920707-2******", birthDate: "1992-07-07", status: "inactive" },
  ]);

  const [selectedContractorId, setSelectedContractorId] = useState<number | null>(null);
  const selectedContractor = useMemo(
    () => contractors.find((c) => c.id === selectedContractorId) ?? null,
    [contractors, selectedContractorId]
  );

  const [rows, setRows] = useState<EntryRow[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-semibold">사업소득(3.3%) 신고입력</div>
            <div className="mt-1 text-sm text-zinc-600">
              대상자 선택 후 지급내역을 추가하고, 월별로 누적되는 구조입니다(UI-only).
            </div>
          </div>

          <MonthPicker value={targetMonth} onChange={setTargetMonth} label="신고 월" />
        </div>
      </div>

      <ContractorSelect
        contractors={contractors}
        value={selectedContractorId}
        onChange={setSelectedContractorId}
        onCreateClick={() => setCreateModalOpen(true)}
        onQuickCreate={({ name, rrn, birthDate }) => {
          // UI-only: 실제 rrn mask/암호화는 서버 연동 시 처리
          const newId = Math.max(0, ...contractors.map((c) => c.id)) + 1;
          const masked =
            rrn && rrn.includes("-")
              ? `${rrn.slice(0, 6)}-${rrn.slice(7, 8)}******`
              : rrn
              ? `${rrn.slice(0, 6)}-${rrn.slice(6, 7)}******`
              : "******-*******";

          setContractors((prev) => [
            { id: newId, name, rrnMasked: masked, birthDate, status: "active" },
            ...prev,
          ]);

          // ✅ 바로 선택 상태로 만들어서 곧바로 금액 입력 가능
          setSelectedContractorId(newId);
        }}
      />

      <PaymentEntryForm
        disabled={!selectedContractor}
        onSubmit={({ payDate, grossPay }) => {
          if (!selectedContractor) return;

          const incomeTax = calcIncomeTax(grossPay);
          const localTax = calcLocalTax(incomeTax);
          const netPay = grossPay - incomeTax - localTax;

          setRows((prev) => [
            {
              id: Date.now(),
              contractorId: selectedContractor.id,
              contractorName: selectedContractor.name,
              rrnMasked: selectedContractor.rrnMasked,
              payDate,
              grossPay,
              incomeTax,
              localTax,
              netPay,
              status: "draft",
            },
            ...prev,
          ]);
        }}
      />

      <div className="rounded-lg border border-zinc-200 overflow-hidden">
        <div className="bg-zinc-50 px-4 py-3 flex items-center justify-between">
          <div className="text-sm font-semibold">이번 달 입력 목록</div>
          <div className="text-xs text-zinc-500">{targetMonth} 기준</div>
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
                <th className="px-4 py-3 text-right">작업</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-zinc-500">
                    입력된 지급내역이 없습니다.
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
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="h-8 rounded-md border border-zinc-200 px-3 text-xs hover:bg-zinc-50"
                          onClick={() => {
                            setRows((prev) =>
                              prev.map((x) =>
                                x.id === r.id ? { ...x, status: x.status === "draft" ? "reviewed" : "draft" } : x
                              )
                            );
                          }}
                        >
                          상태토글
                        </button>
                        <button
                          type="button"
                          className="h-8 rounded-md border border-zinc-200 px-3 text-xs hover:bg-zinc-50"
                          onClick={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
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
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={({ name, rrn, birthDate }) => {
          const newId = Math.max(0, ...contractors.map((c) => c.id)) + 1;
          const masked = rrn ? `${rrn.slice(0, 6)}-${rrn.slice(7, 8)}******` : "******-*******";
          setContractors((prev) => [{ id: newId, name, rrnMasked: masked, birthDate, status: "active" }, ...prev]);
          setSelectedContractorId(newId);
        }}
      />
    </div>
  );
}