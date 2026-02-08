import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type InfoRowVariant = "plain" | "badge";

export type InfoRowItem = {
  icon?: React.ReactNode;
  label: string;
  value?: React.ReactNode;
};

export type InfoRowProps = InfoRowItem & {
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
