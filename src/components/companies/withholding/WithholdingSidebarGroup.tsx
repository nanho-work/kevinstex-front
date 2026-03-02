// src/components/companies/withholding/WithholdingSidebarGroup.tsx
import React from "react";

export type WithholdingMenuItem = {
  label: string;
  href: string;
  disabled?: boolean;
};

type Props = {
  title?: string;
  items: WithholdingMenuItem[];
  currentPath?: string;
  onNavigate?: (href: string) => void; // Sidebar에서 Link 대신 핸들러로 쓰고 싶을 때
};

export default function WithholdingSidebarGroup({
  title = "원천세",
  items,
  currentPath,
  onNavigate,
}: Props) {
  return (
    <div className="mt-4">
      <div className="px-3 text-xs font-semibold text-zinc-500">{title}</div>

      <div className="mt-2 space-y-1">
        {items.map((it) => {
          const active = currentPath ? currentPath.startsWith(it.href) : false;

          return (
            <button
              key={it.href}
              type="button"
              onClick={() => {
                if (it.disabled) return;
                onNavigate?.(it.href);
              }}
              className={[
                "w-full text-left px-3 py-2 rounded-md text-sm",
                "transition-colors",
                it.disabled
                  ? "text-zinc-400 cursor-not-allowed"
                  : "text-zinc-800 hover:bg-zinc-100",
                active ? "bg-zinc-100 font-semibold" : "",
              ].join(" ")}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}