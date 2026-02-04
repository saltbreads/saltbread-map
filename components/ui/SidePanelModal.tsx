"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { ShopPhotoGrid } from "../shop/ShopPhotoGrid";

type SidePanelModalProps = {
  open: boolean;

  /** 뒤로가기(리스트로) */
  onBack?: () => void;

  /** 패널 닫기 */
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
  onBack,
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
      {/* overlay (필요하면 클릭 닫기 가능) */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* panel */}
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
        aria-label={`가게 상세 ${shopId}`}
      >
        {/*  Photo area (padding 없음: edge-to-edge) */}
        <div className="relative">
          <ShopPhotoGrid
            images={[
              "/image/sample-shop-1.jpg",
              "/image/sample-shop-2.jpg",
              "/image/sample-shop-3.jpg",
              "/image/sample-shop-2.jpg",
              "/image/sample-shop-3.jpg",
            ]}
            onOpen={(startIndex) => {
              console.log("open gallery at", startIndex);
            }}
          />

          {/* 사진 위 오버레이: 뒤로가기 / 닫기 */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                aria-label="뒤로가기"
              >
                <span className="text-lg leading-none">←</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={onClose}
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
        </div>

        {/* body (여기서부터 padding) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
