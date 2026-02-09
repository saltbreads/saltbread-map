"use client";

import { cn } from "@/lib/utils/cn";
import * as React from "react";
import { ShopDetailTabItem, ShopDetailTabKey } from "./types";

type ShopDetailTabsProps = {
  value: ShopDetailTabKey; // 현재 활성 탭
  onChangeAction: (next: ShopDetailTabKey) => void; // 탭 클릭 시 부모에게 알림
  items?: ShopDetailTabItem[]; // 탭 구성(미지정 시 DEFAULT_ITEMS 사용)
  className?: string;
  indicatorHeightPx?: number; // 밑줄(인디케이터) 두께
  heightPx?: number; // 탭 영역 높이
};

const DEFAULT_ITEMS: ShopDetailTabItem[] = [
  { key: "home", label: "홈" },
  { key: "menu", label: "메뉴" },
  { key: "review", label: "리뷰" },
  { key: "photo", label: "사진" },
];

export function ShopDetailTabs({
  value,
  onChangeAction,
  items = DEFAULT_ITEMS,
  className,
  indicatorHeightPx = 2,
  heightPx = 44,
}: ShopDetailTabsProps) {
  // 컨테이너 기준 좌표계를 얻기 위한 ref
  // 인디케이터(left) 계산의 기준이 된다
  const containerRef = React.useRef<HTMLDivElement>(null);

  // 각 탭 버튼의 DOM을 key로 저장
  // 현재 선택된 버튼의 위치/너비를 측정하기 위함
  const btnRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  // 인디케이터의 "현재 위치(left) & 길이(width)" 상태
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 });

  /**
   *  recalc: 현재 선택된 탭 버튼이 컨테이너 안에서 어디에 있는지 계산
   * - getBoundingClientRect()는 뷰포트 기준 좌표를 주므로
   * - (버튼 left - 컨테이너 left)로 "컨테이너 기준" 좌표로 변환해야 함
   */
  const recalc = React.useCallback(() => {
    const el = btnRefs.current[value]; // 현재 활성 버튼 DOM
    const root = containerRef.current; // 컨테이너 DOM(기준 좌표계)
    if (!el || !root) return;

    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    setIndicator({
      left: elRect.left - rootRect.left, // 컨테이너 기준 X좌표
      width: elRect.width, // 버튼 너비만큼 인디케이터 길이
    });
  }, [value]);

  /**
   *  탭 변경/초기 마운트 시 위치 재계산
   * - setTimeout(0)으로 한 번 더 recalc:
   *   폰트 로딩/레이아웃 확정 타이밍 때문에 버튼 너비가 바뀌는 경우 보정
   */
  React.useEffect(() => {
    recalc();
    const id = window.setTimeout(recalc, 0);
    return () => window.clearTimeout(id);
  }, [recalc]);

  /**
   *  반응형 대응: 화면 리사이즈 시 위치 재계산
   * - 창 크기 변하면 버튼 위치/너비도 변해서 인디케이터가 틀어질 수 있음
   */
  React.useEffect(() => {
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalc]);

  return (
    <div className={cn("w-full border-b bg-white", className)}>
      {/*  relative 컨테이너: 인디케이터(absolute)의 기준 */}
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
              // 버튼 DOM ref 저장: recalc에서 위치/너비를 측정하기 위함
              ref={(node) => {
                btnRefs.current[it.key] = node;
              }}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${it.key}`}
              disabled={it.disabled}
              // 클릭 시 "다음 탭 key"만 부모에게 전달(상태 변경은 부모가 담당)
              onClick={() => onChangeAction(it.key)}
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
