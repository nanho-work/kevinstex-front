"use client";

// src/components/companies/withholding/business-33/tabs/Business33EntryTab.tsx
import React, { useEffect, useMemo, useState } from "react";
import ContractorSelect, { ContractorItem } from "../components/ContractorSelect";
import ContractorCreateModal from "../components/ContractorCreateModal";
import PaymentEntryForm from "../components/PaymentEntryForm";
import MonthPicker from "../components/MonthPicker";
import StatusBadge from "../components/StatusBadge";
import {
  fetchContractors,
  createContractor,
  createWithholding33,
} from "@/service/company/companyService";

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

function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

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

export default function Business33EntryTab() {
  const [targetMonth, setTargetMonth] = useState<string>(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${mm}`;
  });

  const [contractors, setContractors] = useState<ContractorItem[]>([]);
  const [loadingContractors, setLoadingContractors] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingContractors(true);
        setLoadError(null);
        const res = await fetchContractors();
        setContractors(res.items.map((c) => toContractorItem(c)));
      } catch (e: any) {
        setLoadError(e?.message ?? "대상자 목록 조회에 실패했습니다.");
      } finally {
        setLoadingContractors(false);
      }
    };

    load();
  }, []);

  const [selectedContractorId, setSelectedContractorId] = useState<number | null>(null);
  const selectedContractor = useMemo(
    () => contractors.find((c) => c.id === selectedContractorId) ?? null,
    [contractors, selectedContractorId]
  );

  const [rows, setRows] = useState<EntryRow[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreateContractor = async (payload: {
    name: string;
    rrn: string;
    birthDate?: string;
  }) => {
    const created = await createContractor({
      name: payload.name,
      rrn: payload.rrn,
      birth_date: payload.birthDate ?? undefined,
    });

    const newItem = toContractorItem(created);
    setContractors((prev) => [newItem, ...prev]);
    setSelectedContractorId(created.id);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-semibold">사업소득(3.3%) 신고입력</div>
            <div className="mt-1 text-sm text-zinc-600">
              대상자 선택 후 지급내역을 입력해 저장합니다.
            </div>
          </div>

          <MonthPicker value={targetMonth} onChange={setTargetMonth} label="신고 월" />
        </div>
      </div>

      {loadingContractors ? (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
          대상자 목록을 불러오는 중입니다...
        </div>
      ) : null}

      {loadError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </div>
      ) : null}

      <ContractorSelect
        contractors={contractors}
        value={selectedContractorId}
        onChange={setSelectedContractorId}
        onCreateClick={() => setCreateModalOpen(true)}
        onQuickCreate={async ({ name, rrn, birthDate }) => {
          try {
            await handleCreateContractor({ name, rrn, birthDate });
          } catch (e: any) {
            alert(e.message);
          }
        }}
      />

      <PaymentEntryForm
        disabled={!selectedContractor}
        onSubmit={async ({ payDate, grossPay }) => {
          if (!selectedContractor) return;

          try {
            setSubmittingPayment(true);
            const created = await createWithholding33({
              contractor_id: selectedContractor.id,
              target_month: targetMonth,
              pay_date: payDate,
              gross_pay: grossPay,
            });

            setRows((prev) => [
              {
                id: created.id,
                contractorId: created.contractor_id,
                contractorName: selectedContractor.name,
                rrnMasked: selectedContractor.rrnMasked,
                payDate: created.pay_date,
                grossPay: created.gross_pay,
                incomeTax: created.income_tax,
                localTax: created.local_tax,
                netPay: created.net_pay,
                status: created.review_status as
                  | "draft"
                  | "reviewed"
                  | "filed"
                  | "rejected",
              },
              ...prev,
            ]);
          } catch (e: any) {
            alert(e.message);
          } finally {
            setSubmittingPayment(false);
          }
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
                          disabled={submittingPayment}
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
                          disabled={submittingPayment}
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
        onSubmit={async ({ name, rrn, birthDate }) => {
          await handleCreateContractor({ name, rrn, birthDate });
        }}
      />
    </div>
  );
}
