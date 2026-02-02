"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

type SidePanelModalProps = {
  open: boolean;
  onClose: () => void;
  shopId?: string;
  children?: React.ReactNode;

  /** 사이드바 너비(px). 기본 360 */
  sidebarWidthPx?: number;

  /** 사이드바와 패널 사이 간격(px). 기본 16 */
  gapPx?: number;

  /** 화면 위/아래 여백(px). 기본 16 */
  insetYPx?: number;

  /** 패널 폭(px). 기본 420 */
  panelWidthPx?: number;
};

export function SidePanelModal({
  open,
  onClose,
  shopId = "상세",
  children,

  sidebarWidthPx = 360,
  gapPx = 16,
  insetYPx = 16,
  panelWidthPx = 420,
}: SidePanelModalProps) {
  if (!open) return null;

  const left = sidebarWidthPx + gapPx;
  const top = insetYPx;
  const height = `calc(100dvh - ${insetYPx * 2}px)`;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* overlay */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* panel (floating card) */}
      <div
        className={cn(
          "absolute bg-white shadow-2xl border",
          "rounded-2xl overflow-hidden",
          "flex flex-col pointer-events-auto"
        )}
        style={{
          left,
          top,
          height,
          width: `min(${panelWidthPx}px, calc(100vw - ${left + 16}px))`,
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* header */}
        <div className="h-14 px-4 flex items-center justify-between border-b bg-white">
          <div className="text-sm font-bold text-zinc-900">{shopId}</div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-zinc-100"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
