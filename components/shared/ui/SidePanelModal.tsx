"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { ShopPhotoGrid } from "../../features/shop/ShopPhotoGrid";
import { ShopDetailTabs } from "../../features/shop/ShopDetailTabs";
import { ShopDetailTabKey } from "@/components/features/shop/types";
import { ShopHomeSection } from "../../features/shop/ShopHomeSection";
import { getShopDetailMock } from "@/lib/data/shops.detail.mock";
import { MenuList } from "@/components/features/shop/MenuList";
import { InfiniteMasonryPhotoGrid } from "@/components/features/shop/InfiniteMasonryPhotoGrid";
import { ReviewList } from "@/components/features/review/ReviewList";
import { reviewsMock } from "@/lib/data/reviews.mock";

type SidePanelModalProps = {
  open: boolean;

  /** 뒤로가기(리스트로) */
  onBack?: () => void;

  /** 패널 닫기 */
  onClose: () => void;

  /** 가게 id (목데이터 조회용) */
  shopId?: string;

  /** 홈 탭 하단 등에 추가로 보여줄 내용(옵션) */
  children?: React.ReactNode;

  /** 사이드바 너비(px). 기본 360 */
  sidebarWidthPx?: number;

  /** 사이드바와 패널 사이 간격(px). 기본 16 */
  gapPx?: number;

  /** 화면 위/아래 여백(px). 기본 16 */
  insetYPx?: number;

  /** 패널 폭(px). 기본 420 */
  panelWidthPx?: number;

  /** 열릴 때 기본 탭 */
  defaultTab?: ShopDetailTabKey;
};

export function SidePanelModal({
  open,
  onBack,
  onClose,
  shopId = "shop-1",
  children,

  sidebarWidthPx = 360,
  gapPx = 16,
  insetYPx = 16,
  panelWidthPx = 420,
  defaultTab = "home",
}: SidePanelModalProps) {
  const [tab, setTab] = React.useState<ShopDetailTabKey>(defaultTab);

  // 열릴 때마다 기본 탭으로 리셋(원치 않으면 제거)
  React.useEffect(() => {
    if (open) setTab(defaultTab);
  }, [open, defaultTab]);

  const detail = React.useMemo(() => getShopDetailMock(shopId), [shopId]);

  if (!open) return null;

  const left = sidebarWidthPx + gapPx;
  const top = insetYPx;
  const height = `calc(100dvh - ${insetYPx * 2}px)`;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* overlay: 지금은 클릭 막아둠. 밖 클릭으로 닫고싶으면 pointer-events-auto + onClick */}
      <div className="absolute inset-0 pointer-events-none" />

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
        aria-label={`가게 상세 ${detail.name}`}
      >
        {/* ===== Photo (고정) ===== */}
        <div className="relative shrink-0">
          <ShopPhotoGrid
            images={detail.images}
            onOpenAction={(startIndex) => {
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

          {/* (선택) 사진 아래 가게명 오버레이 필요하면 여기 */}
          {/* <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/55 to-transparent">
            <p className="text-white font-semibold">{detail.name}</p>
          </div> */}
        </div>

        {/* ===== Tabs (고정) ===== */}
        <div className="shrink-0 border-b bg-white">
          <ShopDetailTabs value={tab} onChangeAction={setTab} />
        </div>

        {/* ===== Tab Content (스크롤) ===== */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {tab === "home" && (
            <div id="panel-home" className="mx-auto max-w-105 p-4">
              <ShopHomeSection {...detail.home} />
              {children ? <div className="mt-4">{children}</div> : null}
            </div>
          )}

          {tab === "menu" && (
            <div id="panel-menu" className="p-4">
              <MenuList
                onItemClickAction={(menu) => {
                  console.log("선택한 메뉴:", menu);
                }}
              />
            </div>
          )}

          {tab === "review" && (
            <div id="panel-review" className="p-4">
              <ReviewList reviews={reviewsMock} />
            </div>
          )}

          {tab === "photo" && (
            <div id="panel-photo" className="p-4">
              <InfiniteMasonryPhotoGrid
                onOpenAction={(startIndex) => {
                  console.log("open gallery at", startIndex);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
