import React, { useEffect, useMemo, useState } from "react";
import { ContractorItem } from "../components/ContractorSelect";
import StatusBadge from "../components/StatusBadge";
import {
  fetchContractors,
  fetchWithholding33List,
  updateContractor,
} from "@/service/company/companyService";
import type { Withholding33 } from "@/types/company";

function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

function toDateText(isoLike?: string | null) {
  if (!isoLike) return "-";
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return isoLike;
  return d.toLocaleDateString("ko-KR");
}

function toYearMonth(d: Date) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}`;
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

export default function Business33ContractorsTab() {
  const [items, setItems] = useState<ContractorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const [selectedContractorId, setSelectedContractorId] = useState<number | null>(null);
  const [selectedTargetMonth, setSelectedTargetMonth] = useState<string | null>(null);
  const [payments, setPayments] = useState<Withholding33[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const res = await fetchContractors();
        setItems(res.items.map((c) => toContractorItem(c)));
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "대상자 목록 조회에 실패했습니다.";
        setErrorMessage(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const activeItems = useMemo(() => {
    const collator = new Intl.Collator("ko-KR");
    return items
      .filter((x) => x.status === "active")
      .sort((a, b) => collator.compare(a.name, b.name));
  }, [items]);

  useEffect(() => {
    if (activeItems.length === 0) {
      setSelectedContractorId(null);
      return;
    }
    if (
      selectedContractorId === null ||
      !activeItems.some((item) => item.id === selectedContractorId)
    ) {
      setSelectedContractorId(activeItems[0].id);
    }
  }, [activeItems, selectedContractorId]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return activeItems;
    return activeItems.filter(
      (x) =>
        x.name.toLowerCase().includes(query) ||
        x.rrnMasked.toLowerCase().includes(query)
    );
  }, [q, activeItems]);

  const selectedContractor = useMemo(
    () => activeItems.find((item) => item.id === selectedContractorId) ?? null,
    [activeItems, selectedContractorId]
  );

  useEffect(() => {
    if (!selectedContractorId) {
      setPayments([]);
      setPaymentsError(null);
      return;
    }

    const load = async () => {
      try {
        setLoadingPayments(true);
        setPaymentsError(null);
        const res = await fetchWithholding33List({
          contractor_id: selectedContractorId,
          target_month: selectedTargetMonth ?? undefined,
        });
        setPayments(
          res.items.filter((item) => item.contractor_id === selectedContractorId)
        );
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "지급내역 조회에 실패했습니다.";
        setPaymentsError(message);
      } finally {
        setLoadingPayments(false);
      }
    };

    load();
  }, [selectedContractorId, selectedTargetMonth]);

  const paymentSummary = useMemo(() => {
    return payments.reduce(
      (acc, row) => {
        acc.gross += row.gross_pay;
        acc.income += row.income_tax;
        acc.local += row.local_tax;
        acc.net += row.net_pay;
        return acc;
      },
      { gross: 0, income: 0, local: 0, net: 0 }
    );
  }, [payments]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 p-4">
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-base font-semibold">대상자 관리</div>
            <div className="mt-1 text-sm text-zinc-600">
              지급 등록에 사용할 대상자 목록입니다. 계약 종료 또는 대상 제외가 필요하면 삭제해 주세요.
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              대상자를 클릭하면 우측에서 대상자별 등록 내역을 바로 확인할 수 있습니다.
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

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-lg border border-zinc-200 overflow-hidden lg:col-span-5">
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
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filtered.map((x) => {
                  const selected = selectedContractorId === x.id;
                  return (
                    <div
                      key={x.id}
                      onClick={() => {
                        setSelectedContractorId(x.id);
                        setSelectedTargetMonth(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedContractorId(x.id);
                          setSelectedTargetMonth(null);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className={[
                        "rounded-lg border p-3 text-left transition-colors cursor-pointer",
                        selected
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-200 bg-white hover:bg-zinc-50",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex items-center gap-2 text-sm">
                          <span className="truncate font-semibold text-zinc-900">{x.name}</span>
                          <span className="shrink-0 text-zinc-400">·</span>
                          <span className="truncate text-zinc-600">{x.rrnMasked}</span>
                        </div>
                        <span
                          className={[
                            "rounded-full px-2 py-0.5 text-[11px]",
                            selected
                              ? "bg-zinc-900 text-white"
                              : "bg-zinc-100 text-zinc-600",
                          ].join(" ")}
                        >
                          조회
                        </span>
                      </div>
                      <div className="mt-3 border-t border-zinc-200 pt-3">
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              setActionId(x.id);
                              const updated = await updateContractor(x.id, { status: "inactive" });
                              setItems((prev) =>
                                prev.map((p) => (p.id === x.id ? toContractorItem(updated) : p))
                              );
                            } catch (err: unknown) {
                              const message =
                                err instanceof Error ? err.message : "삭제 처리에 실패했습니다.";
                              alert(message);
                            } finally {
                              setActionId(null);
                            }
                          }}
                          className="inline-flex h-7 items-center rounded-md border border-zinc-200 px-3 text-xs hover:bg-zinc-50"
                          disabled={actionId === x.id}
                        >
                          {actionId === x.id ? "처리 중..." : "삭제"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 overflow-hidden lg:col-span-7">
          <div className="bg-zinc-50 px-4 py-3">
            <div className="text-sm font-semibold">대상자별 지급내역 조회</div>
            {selectedContractor ? (
              <div className="mt-1 text-xs text-zinc-600">
                {selectedContractor.name} · {selectedContractor.rrnMasked}
              </div>
            ) : (
              <div className="mt-1 text-xs text-zinc-500">조회할 대상자를 선택해 주세요.</div>
            )}
          </div>

          <div className="border-b border-zinc-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedTargetMonth(null)}
                className={[
                  "h-8 rounded-md border px-3 text-xs",
                  selectedTargetMonth === null
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 text-zinc-700 hover:bg-zinc-50",
                ].join(" ")}
              >
                전체 월
              </button>
              <input
                type="month"
                value={selectedTargetMonth ?? ""}
                onChange={(e) => setSelectedTargetMonth(e.target.value || null)}
                className="h-8 rounded-md border border-zinc-200 px-2 text-xs outline-none focus:ring-2 focus:ring-zinc-200"
              />
            </div>
          </div>

          {paymentsError ? (
            <div className="border-b border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {paymentsError}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full text-sm">
              <thead className="border-b border-zinc-200 bg-white">
                <tr className="text-center text-xs text-zinc-500">
                  <th className="px-4 py-3">신고월</th>
                  <th className="px-4 py-3">총지급액</th>
                  <th className="px-4 py-3">소득세</th>
                  <th className="px-4 py-3">지방세</th>
                  <th className="px-4 py-3">실지급액</th>
                  <th className="px-4 py-3">상태</th>
                  <th className="px-4 py-3">비고</th>
                  <th className="px-4 py-3">등록일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {!selectedContractorId ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-500">
                      대상자를 선택하면 지급내역이 표시됩니다.
                    </td>
                  </tr>
                ) : loadingPayments ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-500">
                      지급내역을 불러오는 중입니다...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-500">
                      조회된 지급내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  payments.map((row) => (
                    <tr key={row.id} className="bg-white">
                      <td className="px-4 py-3 text-center text-zinc-700">{row.target_month}</td>
                      <td className="px-4 py-3 text-right">{fmt(row.gross_pay)}</td>
                      <td className="px-4 py-3 text-right">{fmt(row.income_tax)}</td>
                      <td className="px-4 py-3 text-right">{fmt(row.local_tax)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{fmt(row.net_pay)}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={row.review_status} />
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-zinc-600">
                        {row.review_note || "-"}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-zinc-500">
                        {toDateText(row.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="border-t border-zinc-200 bg-zinc-50">
                <tr className="text-sm">
                  <td className="px-4 py-3 text-center font-semibold text-zinc-800">합계</td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-800">
                    {fmt(paymentSummary.gross)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-800">
                    {fmt(paymentSummary.income)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-800">
                    {fmt(paymentSummary.local)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-800">
                    {fmt(paymentSummary.net)}
                  </td>
                  <td className="px-4 py-3" colSpan={3} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
