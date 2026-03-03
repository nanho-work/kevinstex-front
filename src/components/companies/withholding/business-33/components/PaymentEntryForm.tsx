"use client";

// src/components/companies/withholding/business-33/components/PaymentEntryForm.tsx
import React, { useMemo, useState } from "react";

type Props = {
  disabled?: boolean;
  onSubmit: (payload: { grossPay: number }) => void;
};

function formatNumber(n: number) {
  return n.toLocaleString("ko-KR");
}

export default function PaymentEntryForm({ disabled, onSubmit }: Props) {
  const [grossPay, setGrossPay] = useState<string>("");

  const grossPayNum = useMemo(() => {
    const v = Number(String(grossPay).replaceAll(",", ""));
    return Number.isFinite(v) ? v : 0;
  }, [grossPay]);

  const incomeTax = useMemo(() => Math.floor(grossPayNum * 0.03), [grossPayNum]);
  const localTax = useMemo(() => Math.floor(incomeTax * 0.1), [incomeTax]);
  const netPay = useMemo(() => grossPayNum - incomeTax - localTax, [grossPayNum, incomeTax, localTax]);

  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <div className="text-sm font-semibold text-zinc-900">지급내역 입력</div>

      <div className="mt-3">
        <div className="text-sm text-zinc-700 mb-1">총지급액</div>
        <input
          value={grossPay}
          onChange={(e) => setGrossPay(e.target.value)}
          disabled={disabled}
          inputMode="numeric"
          placeholder="예: 1000000"
          className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200 disabled:bg-zinc-50"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
        <div className="rounded-md bg-zinc-50 p-3">
          <div className="text-xs text-zinc-600">소득세(3%)</div>
          <div className="mt-1 text-sm font-semibold">{formatNumber(incomeTax)}원</div>
        </div>
        <div className="rounded-md bg-zinc-50 p-3">
          <div className="text-xs text-zinc-600">지방소득세(소득세의 10%)</div>
          <div className="mt-1 text-sm font-semibold">{formatNumber(localTax)}원</div>
        </div>
        <div className="rounded-md bg-zinc-50 p-3">
          <div className="text-xs text-zinc-600">실지급액</div>
          <div className="mt-1 text-sm font-semibold">{formatNumber(netPay)}원</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          disabled={disabled || grossPayNum <= 0}
          onClick={() => {
            onSubmit({ grossPay: grossPayNum });
            setGrossPay("");
          }}
          className="h-10 rounded-md bg-zinc-900 px-4 text-sm text-white hover:bg-zinc-800 disabled:bg-zinc-300"
        >
          추가
        </button>
      </div>
    </div>
  );
}
