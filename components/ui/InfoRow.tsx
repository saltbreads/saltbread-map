import * as React from "react";
import { cn } from "@/lib/utils/cn";

type InfoRowVariant = "plain" | "badge";

type InfoRowProps = {
  icon?: React.ReactNode; // 🥐, 🧈 같은 이모지 or SVG 아이콘
  label: string; // "소금빵", "버터향 강함"
  value?: React.ReactNode; // "3,000원대", 30 등
  variant?: InfoRowVariant;
  className?: string;
};

export function InfoRow({
  icon,
  label,
  value,
  variant = "plain",
  className,
}: InfoRowProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs",
        variant === "plain" && "text-zinc-700",
        variant === "badge" &&
          "w-fit self-start rounded-full bg-brand-primary/10 px-2 py-0.5 text-brand-secondary",
        className
      )}
    >
      {icon && (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}

      <span className="truncate">{label}</span>

      {value !== undefined && (
        <span className="shrink-0 tabular-nums text-zinc-600">{value}</span>
      )}
    </div>
  );
}
