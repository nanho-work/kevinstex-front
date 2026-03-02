// src/components/companies/withholding/business-33/components/MonthPicker.tsx
import React from "react";

type Props = {
  value: string; // YYYY-MM
  onChange: (next: string) => void;
  label?: string;
};

export default function MonthPicker({ value, onChange, label = "대상 월" }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-zinc-700">{label}</div>
      <input
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-md border border-zinc-200 px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
      />
    </div>
  );
}