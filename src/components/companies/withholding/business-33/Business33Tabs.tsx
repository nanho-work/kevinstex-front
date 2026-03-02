// src/components/companies/withholding/business-33/Business33Tabs.tsx
import React from "react";

export type Business33TabKey = "entry" | "history" | "contractors";

type Tab = {
  key: Business33TabKey;
  label: string;
};

const TABS: Tab[] = [
  { key: "entry", label: "신고입력" },
  { key: "history", label: "이전신고 내역" },
  { key: "contractors", label: "신고대상자 관리" },
];

type Props = {
  value: Business33TabKey;
  onChange: (next: Business33TabKey) => void;
};

export default function Business33Tabs({ value, onChange }: Props) {
  return (
    <div className="border-b border-zinc-200">
      <div className="flex gap-2">
        {TABS.map((t) => {
          const active = value === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={[
                "px-4 py-2 text-sm rounded-t-md",
                active
                  ? "bg-white border border-zinc-200 border-b-white font-semibold"
                  : "text-zinc-600 hover:text-zinc-900",
              ].join(" ")}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}