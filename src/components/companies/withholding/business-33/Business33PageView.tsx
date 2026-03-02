// src/components/companies/withholding/business-33/Business33PageView.tsx
'use client'

import React, { useEffect, useState } from "react";
import Business33Tabs, { Business33TabKey } from "./Business33Tabs";
import Business33EntryTab from "./tabs/Business33EntryTab";
import Business33HistoryTab from "./tabs/Business33HistoryTab";
import Business33ContractorsTab from "./tabs/Business33ContractorsTab";

type Props = {
  initialTab?: Business33TabKey;
};

export default function Business33PageView({ initialTab = "entry" }: Props) {
  const [tab, setTab] = useState<Business33TabKey>(initialTab);

  // (선택) URL 쿼리 탭 동기화는 페이지 레벨에서 붙이는 것을 권장
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 bg-white">
        <div className="px-4 py-4">
          <div className="text-lg font-semibold">원천세 · 사업소득(3.3%)</div>
          <div className="mt-1 text-sm text-zinc-600">
            고객사 포털에서 사업소득 대상자/지급내역을 관리합니다(UI-only).
          </div>
        </div>

        <Business33Tabs value={tab} onChange={setTab} />
      </div>

      <div>
        {tab === "entry" && <Business33EntryTab />}
        {tab === "history" && <Business33HistoryTab />}
        {tab === "contractors" && <Business33ContractorsTab />}
      </div>
    </div>
  );
}