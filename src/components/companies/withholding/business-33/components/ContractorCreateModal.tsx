// src/components/companies/withholding/business-33/components/ContractorCreateModal.tsx
import React, { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string; rrn: string; birthDate?: string }) => void;
};

export default function ContractorCreateModal({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [rrn, setRrn] = useState("");
  const [birthDate, setBirthDate] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4">
          <div className="text-base font-semibold">신규 대상자 등록</div>
          <button
            type="button"
            onClick={onClose}
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
              value={rrn}
              onChange={(e) => setRrn(e.target.value)}
              placeholder="예: 900101-1234567"
              className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div>
            <div className="text-sm text-zinc-700 mb-1">생년월일(선택)</div>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
            />
          </div>

          <div className="rounded-md bg-zinc-50 p-3 text-xs text-zinc-600">
            * UI 전용입니다. 실제 저장/중복검증/암호화는 서비스 연동 시 처리합니다.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-zinc-200 p-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-zinc-200 px-4 text-sm hover:bg-zinc-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => {
              onSubmit({
                name: name.trim(),
                rrn: rrn.trim(),
                birthDate: birthDate || undefined,
              });
              onClose();
              setName("");
              setRrn("");
              setBirthDate("");
            }}
            className="h-10 rounded-md bg-zinc-900 px-4 text-sm text-white hover:bg-zinc-800"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}