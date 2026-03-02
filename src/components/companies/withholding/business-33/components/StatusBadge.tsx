// src/components/companies/withholding/business-33/components/StatusBadge.tsx
import React from "react";

export type ReviewStatus = "draft" | "reviewed" | "filed" | "rejected";

const labelMap: Record<ReviewStatus, string> = {
  draft: "작성중",
  reviewed: "검토중",
  filed: "신고완료",
  rejected: "확인요망",
};

export default function StatusBadge({ status }: { status: ReviewStatus }) {
  const cls =
    status === "filed"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "reviewed"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : status === "rejected"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-zinc-50 text-zinc-700 border-zinc-200";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs border rounded-full ${cls}`}>
      {labelMap[status]}
    </span>
  );
}