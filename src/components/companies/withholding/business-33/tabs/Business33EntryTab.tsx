"use client";

import React, { useEffect, useMemo, useState } from "react";
import ContractorSelect, { ContractorItem } from "../components/ContractorSelect";
import MonthPicker from "../components/MonthPicker";
import StatusBadge from "../components/StatusBadge";
import {
  fetchContractors,
  createContractor,
  createWithholding33,
} from "@/service/company/companyService";

type DraftRow = {
  rowId: string;
  contractorId?: number | null;
  name: string;
  rrn: string;
  rrnMasked?: string;
  grossPay: string;
  incomeTax: number;
  localTax: number;
  netPay: number;
  status: "draft" | "submitting" | "saved" | "error";
  errorMessage?: string | null;
};

type SavedRow = {
  id: number;
  contractorName: string;
  rrnMasked: string;
  grossPay: number;
  incomeTax: number;
  localTax: number;
  netPay: number;
  status: "draft" | "reviewed" | "filed" | "rejected";
};

function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

function newRowId() {
  return `row-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeRrn(input: string) {
  const digits = input.replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 6) return digits;
  return `${digits.slice(0, 6)}-${digits.slice(6)}`;
}

function rrnToBirthDate(rrnDigits: string): string | undefined {
  if (rrnDigits.length < 6) return undefined;

  const yy = rrnDigits.slice(0, 2);
  const mm = rrnDigits.slice(2, 4);
  const dd = rrnDigits.slice(4, 6);

  const yyNum = Number(yy);
  const mmNum = Number(mm);
  const ddNum = Number(dd);

  if (!Number.isFinite(yyNum) || !Number.isFinite(mmNum) || !Number.isFinite(ddNum)) return undefined;
  if (mmNum < 1 || mmNum > 12 || ddNum < 1 || ddNum > 31) return undefined;

  const now = new Date();
  const currentYY = now.getFullYear() % 100;
  const fullYear = yyNum > currentYY ? 1900 + yyNum : 2000 + yyNum;

  return `${String(fullYear)}-${String(mmNum).padStart(2, "0")}-${String(ddNum).padStart(2, "0")}`;
}

function calcFromGross(grossPay: string) {
  const grossPayNum = Number(String(grossPay).replaceAll(",", ""));
  const safeGrossPay = Number.isFinite(grossPayNum) ? grossPayNum : 0;
  const incomeTax = Math.floor(safeGrossPay * 0.03);
  const localTax = Math.floor(incomeTax * 0.1);
  const netPay = safeGrossPay - incomeTax - localTax;

  return {
    grossPayNum: safeGrossPay,
    incomeTax,
    localTax,
    netPay,
  };
}

function formatAmountInput(input: string) {
  const digits = input.replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("ko-KR");
}

function createEmptyDraftRow(): DraftRow {
  return {
    rowId: newRowId(),
    contractorId: null,
    name: "",
    rrn: "",
    rrnMasked: "",
    grossPay: "",
    incomeTax: 0,
    localTax: 0,
    netPay: 0,
    status: "draft",
    errorMessage: null,
  };
}

function isBlankRow(row: DraftRow) {
  return (
    !row.contractorId &&
    !row.name.trim() &&
    !row.rrn.trim() &&
    !row.grossPay.trim()
  );
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

  const [savedRows, setSavedRows] = useState<SavedRow[]>([]);
  const [draftRows, setDraftRows] = useState<DraftRow[]>([createEmptyDraftRow()]);

  const highlightedContractorIds = useMemo(
    () =>
      Array.from(
        new Set(
          draftRows
            .map((row) => row.contractorId)
            .filter((id): id is number => typeof id === "number" && id > 0)
        )
      ),
    [draftRows]
  );

  const draftSummary = useMemo(() => {
    const rows = draftRows.filter((row) => !isBlankRow(row));
    const contractorCount = rows.filter((row) => (row.contractorId ? true : row.name.trim().length > 0)).length;

    const totals = rows.reduce((acc, row) => {
      const gross = Number(String(row.grossPay).replaceAll(",", ""));
      const safeGross = Number.isFinite(gross) ? gross : 0;
      acc.gross += safeGross;
      acc.income += row.incomeTax;
      acc.local += row.localTax;
      acc.net += row.netPay;
      return acc;
    }, { gross: 0, income: 0, local: 0, net: 0 });

    return {
      contractorCount,
      totalGrossPay: totals.gross,
      totalIncomeTax: totals.income,
      totalLocalTax: totals.local,
      totalNetPay: totals.net,
    };
  }, [draftRows]);

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

  useEffect(() => {
    if (draftRows.length === 0) {
      setDraftRows([createEmptyDraftRow()]);
      return;
    }
    const last = draftRows[draftRows.length - 1];
    if (!isBlankRow(last)) {
      setDraftRows((prev) => [...prev, createEmptyDraftRow()]);
    }
  }, [draftRows]);

  const refetchContractors = async () => {
    try {
      const res = await fetchContractors();
      setContractors(res.items.map((c) => toContractorItem(c)));
    } catch {
      // ignore silently
    }
  };

  const updateDraftRow = (rowId: string, updater: (row: DraftRow) => DraftRow) => {
    setDraftRows((prev) => prev.map((row) => (row.rowId === rowId ? updater(row) : row)));
  };

  const addRowFromExisting = (contractor: ContractorItem) => {
    const row = createEmptyDraftRow();
    row.contractorId = contractor.id;
    row.name = contractor.name;
    row.rrnMasked = contractor.rrnMasked;

    setDraftRows((prev) => {
      const next = [...prev];
      const blankIndex = next.findIndex((r) => isBlankRow(r));
      if (blankIndex >= 0) {
        next.splice(blankIndex, 0, row);
        return next;
      }
      return [...next, row];
    });
  };

  const addEmptyRow = () => {
    setDraftRows((prev) => [...prev, createEmptyDraftRow()]);
  };

  const confirmRow = async (row: DraftRow) => {
    const { grossPayNum, incomeTax, localTax, netPay } = calcFromGross(row.grossPay);
    const rrnDigits = row.rrn.replace(/\D/g, "");

    const canSubmit =
      grossPayNum > 0 &&
      (row.contractorId ? true : row.name.trim().length > 0 && rrnDigits.length === 13);

    if (!canSubmit) {
      updateDraftRow(row.rowId, (prev) => ({
        ...prev,
        status: "error",
        errorMessage: "필수값을 확인해 주세요. (대상자/주민번호/총지급액)",
      }));
      return;
    }

    updateDraftRow(row.rowId, (prev) => ({
      ...prev,
      status: "submitting",
      errorMessage: null,
    }));

    try {
      let contractorId = row.contractorId ?? null;
      let contractorName = row.name;
      let contractorRrnMasked = row.rrnMasked || "";

      if (!contractorId) {
        const birthDate = rrnToBirthDate(rrnDigits);
        const createdContractor = await createContractor({
          name: row.name.trim(),
          rrn: normalizeRrn(row.rrn).trim(),
          birth_date: birthDate ?? undefined,
        });

        contractorId = createdContractor.id;
        contractorName = createdContractor.name;
        contractorRrnMasked = createdContractor.rrn_masked;

        setContractors((prev) => [toContractorItem(createdContractor), ...prev]);
      }

      const created = await createWithholding33({
        contractor_id: contractorId,
        target_month: targetMonth,
        gross_pay: grossPayNum,
      });

      setSavedRows((prev) => [
        {
          id: created.id,
          contractorName,
          rrnMasked: contractorRrnMasked,
          grossPay: created.gross_pay,
          incomeTax: created.income_tax ?? incomeTax,
          localTax: created.local_tax ?? localTax,
          netPay: created.net_pay ?? netPay,
          status: created.review_status,
        },
        ...prev,
      ]);

      setDraftRows((prev) => prev.map((r) => (r.rowId === row.rowId ? createEmptyDraftRow() : r)));
    } catch (e: any) {
      const message = e?.message ?? "행 저장 중 오류가 발생했습니다.";
      const duplicate = String(message).includes("이미 등록된 대상자입니다.");

      updateDraftRow(row.rowId, (prev) => ({
        ...prev,
        status: "error",
        errorMessage: duplicate
          ? "이미 등록된 대상자입니다. 상단 '기존 대상자 추가'에서 선택 후 확정하세요."
          : message,
      }));

      if (duplicate) {
        await refetchContractors();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-base font-semibold">사업소득(3.3%) 신고입력</div>
            <ul className="mt-2 space-y-1 text-sm text-zinc-600">
              <li>기존 대상자가 있는 경우, 상단 `기존 대상자 추가`에서 선택해 행에 추가하세요.</li>
              <li>신규 대상자는 입력행에서 이름/주민번호를 직접 입력한 뒤 확정하세요.</li>
            </ul>
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
        onAdd={addRowFromExisting}
        highlightedContractorIds={highlightedContractorIds}
      />

      <div className="rounded-lg border border-zinc-200 overflow-hidden">
        <div className="bg-zinc-50 px-4 py-3 flex items-center justify-between">
          <div className="text-sm font-semibold">입력 행</div>
          <button
            type="button"
            onClick={addEmptyRow}
            className="h-8 rounded-md border border-zinc-200 bg-white px-3 text-xs hover:bg-zinc-50"
          >
            행 추가
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="bg-white border-b border-zinc-200">
              <tr className="text-left text-xs text-zinc-500">
                <th className="px-4 py-3">대상자</th>
                <th className="px-4 py-3">주민번호</th>
                <th className="px-4 py-3 text-right">총지급액</th>
                <th className="px-4 py-3 text-right">소득세(3%)</th>
                <th className="px-4 py-3 text-right">지방세(10%)</th>
                <th className="px-4 py-3 text-right">실지급액</th>
                <th className="px-4 py-3 text-right">작업</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200">
              {draftRows.map((row) => {
                const { grossPayNum } = calcFromGross(row.grossPay);
                const canConfirm =
                  row.status !== "submitting" &&
                  grossPayNum > 0 &&
                  (row.contractorId
                    ? true
                    : row.name.trim().length > 0 && row.rrn.replace(/\D/g, "").length === 13);

                return (
                  <tr key={row.rowId} className="bg-white align-top">
                    <td className="px-4 py-3">
                      {row.contractorId ? (
                        <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2">
                          <div className="text-sm font-medium text-zinc-900">{row.name}</div>
                        </div>
                      ) : (
                        <div>
                          <input
                            value={row.name}
                            onChange={(e) => {
                              const nextName = e.target.value;
                              updateDraftRow(row.rowId, (prev) => ({
                                ...prev,
                                contractorId: null,
                                rrnMasked: "",
                                name: nextName,
                                status: "draft",
                                errorMessage: null,
                              }));
                            }}
                            placeholder="이름 직접 입력"
                            className="h-9 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                          />
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {row.contractorId ? (
                        <div className="h-9 rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm leading-9 text-zinc-700">
                          {row.rrnMasked || "-"}
                        </div>
                      ) : (
                        <input
                          value={row.rrn}
                          onChange={(e) => {
                            const nextRrn = normalizeRrn(e.target.value);
                            updateDraftRow(row.rowId, (prev) => ({
                              ...prev,
                              rrn: nextRrn,
                              status: "draft",
                              errorMessage: null,
                            }));
                          }}
                          placeholder="예: 900101-1234567"
                          className="h-9 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                        />
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <input
                        value={row.grossPay}
                        onChange={(e) => {
                          const nextGross = formatAmountInput(e.target.value);
                          const calc = calcFromGross(nextGross);
                          updateDraftRow(row.rowId, (prev) => ({
                            ...prev,
                            grossPay: nextGross,
                            incomeTax: calc.incomeTax,
                            localTax: calc.localTax,
                            netPay: calc.netPay,
                            status: "draft",
                            errorMessage: null,
                          }));
                        }}
                        inputMode="numeric"
                        placeholder="0"
                        className="h-9 w-full rounded-md border border-zinc-200 px-3 text-right text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                      />
                    </td>

                    <td className="px-4 py-3 text-right">{fmt(row.incomeTax)}</td>
                    <td className="px-4 py-3 text-right">{fmt(row.localTax)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{fmt(row.netPay)}</td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={!canConfirm}
                          onClick={() => confirmRow(row)}
                          className="h-8 rounded-md bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-800 disabled:bg-zinc-300"
                        >
                          {row.status === "submitting" ? "확정 중..." : "확정"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDraftRows((prev) => prev.filter((r) => r.rowId !== row.rowId))
                          }
                          className="h-8 rounded-md border border-zinc-200 px-3 text-xs hover:bg-zinc-50"
                        >
                          삭제
                        </button>
                      </div>
                      {row.errorMessage ? (
                        <div className="mt-2 rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-700">
                          {row.errorMessage}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t border-zinc-200 bg-zinc-50">
              <tr className="text-sm">
                <td className="px-4 py-3 font-semibold text-zinc-800">
                  합계 ({draftSummary.contractorCount}명)
                </td>
                <td className="px-4 py-3 text-zinc-500">-</td>
                <td className="px-4 py-3 text-right font-semibold text-zinc-800">
                  {fmt(draftSummary.totalGrossPay)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-zinc-800">
                  {fmt(draftSummary.totalIncomeTax)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-zinc-800">
                  {fmt(draftSummary.totalLocalTax)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-zinc-800">
                  {fmt(draftSummary.totalNetPay)}
                </td>
                <td className="px-4 py-3 text-right text-xs text-zinc-500">입력행 기준</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 overflow-hidden">
        <div className="bg-zinc-50 px-4 py-3">
          <div className="text-sm font-semibold">등록된 인원</div>
          <div className="mt-1 text-xs text-zinc-500">등록된 인원은 세무사에 전송된 내역입니다.</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-white border-b border-zinc-200">
              <tr className="text-left text-xs text-zinc-500">
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3">대상자</th>
                <th className="px-4 py-3">주민번호</th>
                <th className="px-4 py-3 text-right">총지급액</th>
                <th className="px-4 py-3 text-right">소득세</th>
                <th className="px-4 py-3 text-right">지방세</th>
                <th className="px-4 py-3 text-right">실지급액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {savedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-zinc-500">
                    확정된 지급내역이 없습니다.
                  </td>
                </tr>
              ) : (
                savedRows.map((row) => (
                  <tr key={row.id} className="bg-white">
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 font-medium">{row.contractorName}</td>
                    <td className="px-4 py-3 text-zinc-600">{row.rrnMasked}</td>
                    <td className="px-4 py-3 text-right">{fmt(row.grossPay)}</td>
                    <td className="px-4 py-3 text-right">{fmt(row.incomeTax)}</td>
                    <td className="px-4 py-3 text-right">{fmt(row.localTax)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{fmt(row.netPay)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
