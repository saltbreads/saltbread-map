"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type ShopDetailTabKey = "home" | "menu" | "review" | "photo";

export type ShopDetailTabItem = {
  key: ShopDetailTabKey;
  label: string;
  /** 필요하면 뱃지/카운트 */
  count?: number;
  disabled?: boolean;
};

type Props = {
  value: ShopDetailTabKey;
  onChange: (next: ShopDetailTabKey) => void;
  items?: ShopDetailTabItem[];
  className?: string;

  /** 네이버처럼 밑줄 굵기 */
  indicatorHeightPx?: number;

  /** 탭 높이 */
  heightPx?: number;
};

const DEFAULT_ITEMS: ShopDetailTabItem[] = [
  { key: "home", label: "홈" },
  { key: "menu", label: "메뉴" },
  { key: "review", label: "리뷰" },
  { key: "photo", label: "사진" },
];

export function ShopDetailTabs({
  value,
  onChange,
  items = DEFAULT_ITEMS,
  className,
  indicatorHeightPx = 2,
  heightPx = 44,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const btnRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 });

  const recalc = React.useCallback(() => {
    const el = btnRefs.current[value];
    const root = containerRef.current;
    if (!el || !root) return;

    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    setIndicator({
      left: elRect.left - rootRect.left,
      width: elRect.width,
    });
  }, [value]);

  React.useEffect(() => {
    recalc();
    // 폰트 로딩/레이아웃 변동 대응
    const id = window.setTimeout(recalc, 0);
    return () => window.clearTimeout(id);
  }, [recalc]);

  React.useEffect(() => {
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalc]);

  return (
    <div className={cn("w-full border-b bg-white", className)}>
      <div
        ref={containerRef}
        className="relative flex w-full items-stretch"
        style={{ height: heightPx }}
        role="tablist"
        aria-label="가게 상세 탭"
      >
        {items.map((it) => {
          const active = it.key === value;

          return (
            <button
              key={it.key}
              ref={(node) => {
                btnRefs.current[it.key] = node;
              }}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${it.key}`}
              disabled={it.disabled}
              onClick={() => onChange(it.key)}
              className={cn(
                "relative flex-1 select-none",
                "inline-flex items-center justify-center gap-1",
                "text-[14px] font-semibold",
                "transition-colors",
                active ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-700",
                it.disabled &&
                  "opacity-40 cursor-not-allowed hover:text-zinc-400"
              )}
            >
              <span>{it.label}</span>
              {typeof it.count === "number" ? (
                <span
                  className={cn(
                    "text-[12px] font-semibold",
                    active ? "text-zinc-700" : "text-zinc-400"
                  )}
                >
                  {it.count}
                </span>
              ) : null}
            </button>
          );
        })}

        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          {/* 인디케이터 색상 변경 필요시 bg-zinc-900 대신 변경하고 싶은 색상 (ex bg-brand-primary) */}
          <div
            className="absolute bottom-0 bg-zinc-900 transition-[left,width] duration-200 ease-out"
            style={{
              left: indicator.left,
              width: indicator.width,
              height: indicatorHeightPx,
            }}
          />
        </div>
      </div>
    </div>
  );
}
