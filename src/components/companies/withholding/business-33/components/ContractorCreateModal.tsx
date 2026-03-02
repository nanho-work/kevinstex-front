import React, { useMemo, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; rrn: string; birthDate?: string }) => Promise<void> | void;
};

function normalizeRrn(input: string) {
  // keep digits only, max 13 digits
  const digits = input.replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 6) return digits;
  return `${digits.slice(0, 6)}-${digits.slice(6)}`;
}

function rrnToBirthDate(rrnDigits: string): string | undefined {
  // rrnDigits: digits only, expects at least 6 digits: YYMMDD
  if (rrnDigits.length < 6) return undefined;

  const yy = rrnDigits.slice(0, 2);
  const mm = rrnDigits.slice(2, 4);
  const dd = rrnDigits.slice(4, 6);

  const yyNum = Number(yy);
  const mmNum = Number(mm);
  const ddNum = Number(dd);

  if (!Number.isFinite(yyNum) || !Number.isFinite(mmNum) || !Number.isFinite(ddNum)) return undefined;
  if (mmNum < 1 || mmNum > 12) return undefined;
  if (ddNum < 1 || ddNum > 31) return undefined;

  // Century heuristic: if YY is greater than current year(2-digit), treat as 1900s, else 2000s
  const now = new Date();
  const currentYY = now.getFullYear() % 100;
  const fullYear = yyNum > currentYY ? 1900 + yyNum : 2000 + yyNum;

  const yyyy = String(fullYear);
  const mm2 = String(mmNum).padStart(2, "0");
  const dd2 = String(ddNum).padStart(2, "0");

  return `${yyyy}-${mm2}-${dd2}`;
}

export default function ContractorCreateModal({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [rrn, setRrn] = useState("");
  const rrnNormalized = useMemo(() => normalizeRrn(rrn), [rrn]);
  const rrnDigits = useMemo(() => rrnNormalized.replace(/\D/g, ""), [rrnNormalized]);
  const derivedBirthDate = useMemo(() => rrnToBirthDate(rrnDigits), [rrnDigits]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4">
          <div className="text-base font-semibold">신규 대상자 등록</div>
          <button
            type="button"
            onClick={() => {
              if (submitting) return;
              onClose();
            }}
            disabled={submitting}
            className="rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100"
          >
            닫기
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <div className="text-sm text-zinc-700 mb-1">이름</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div>
            <div className="text-sm text-zinc-700 mb-1">주민등록번호(또는 외국인등록번호)</div>
            <input
              value={rrnNormalized}
              onChange={(e) => setRrn(e.target.value)}
              inputMode="numeric"
              placeholder="예: 9001011234567"
              className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            />
            <div className="mt-1 text-xs text-zinc-500">
              * 생년월일은 주민번호 앞 6자리(YYMMDD) 기준으로 자동 인식됩니다.
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-zinc-200 p-4">
          <button
            type="button"
            onClick={() => {
              if (submitting) return;
              onClose();
            }}
            disabled={submitting}
            className="h-10 rounded-md border border-zinc-200 px-4 text-sm hover:bg-zinc-50"
          >
            취소
          </button>
          <button
            type="button"
            disabled={submitting || !name.trim() || rrnDigits.length < 13}
            onClick={async () => {
              setErrorMessage(null);
              try {
                setSubmitting(true);
                await onSubmit({
                  name: name.trim(),
                  rrn: rrnNormalized.trim(),
                  birthDate: derivedBirthDate,
                });
                onClose();
                setName("");
                setRrn("");
              } catch (e: any) {
                setErrorMessage(e?.message ?? "등록 처리 중 오류가 발생했습니다.");
              } finally {
                setSubmitting(false);
              }
            }}
            className="h-10 rounded-md bg-zinc-900 px-4 text-sm text-white hover:bg-zinc-800 disabled:bg-zinc-300"
          >
            {submitting ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
