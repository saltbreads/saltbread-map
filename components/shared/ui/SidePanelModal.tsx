"use client";

import { ReviewList } from "@/components/features/review/ReviewList";
import { InfiniteMasonryPhotoGrid } from "@/components/features/shop/InfiniteMasonryPhotoGrid";
import { MenuList } from "@/components/features/shop/MenuList";
import { ShopDetailTabKey } from "@/components/features/shop/types";
import { getShopDetailMock } from "@/lib/data/shops.detail.mock";
import { mapShopHomeToSectionProps } from "@/lib/mappers/shopHome.mapper";
import { usePhotoHighlights } from "@/lib/queries/usePhotoHighlights";
import { useShopHome } from "@/lib/queries/useShopHome";
import { cn } from "@/lib/utils/cn";
import * as React from "react";
import { ShopDetailTabs } from "../../features/shop/ShopDetailTabs";
import { ShopHomeSection } from "../../features/shop/ShopHomeSection";
import { ShopPhotoGrid } from "../../features/shop/ShopPhotoGrid";

type SidePanelModalProps = {
  open: boolean;
  onBackAction?: () => void;
  onCloseAction: () => void;
  shopId?: string;
  children?: React.ReactNode;
  sidebarWidthPx?: number;
  gapPx?: number;
  insetYPx?: number;
  panelWidthPx?: number;
  defaultTab?: ShopDetailTabKey;
};

export function SidePanelModal({
  open,
  onBackAction,
  onCloseAction,
  shopId = "shop-1",
  children,
  sidebarWidthPx = 360,
  gapPx = 16,
  insetYPx = 16,
  panelWidthPx = 420,
  defaultTab = "home",
}: SidePanelModalProps) {
  const [tab, setTab] = React.useState<ShopDetailTabKey>(defaultTab);

  const {
    data: highlights,
    isLoading: isHighlightsLoading,
    error: highlightsError,
  } = usePhotoHighlights(shopId, open);

  const {
    data: shopHome,
    isLoading: isShopHomeLoading,
    error: shopHomeError,
  } = useShopHome(shopId, open);

  const images = React.useMemo(() => {
    if (!highlights) return [];

    const heroImage = highlights.hero ? [highlights.hero.url] : [];
    const reviewImages = highlights.items.map((item) => item.url);

    return [...heroImage, ...reviewImages];
  }, [highlights]);

  const homeSectionProps = React.useMemo(() => {
    if (!shopHome) return null;
    return mapShopHomeToSectionProps(shopHome);
  }, [shopHome]);

  React.useEffect(() => {
    if (open) setTab(defaultTab);
  }, [open, defaultTab]);

  const detail = React.useMemo(() => getShopDetailMock(shopId), [shopId]);

  const left = sidebarWidthPx + gapPx;
  const top = insetYPx;
  const height = `calc(100dvh - ${insetYPx * 2}px)`;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 pointer-events-none transition-opacity duration-200",
        open ? "opacity-100" : "opacity-0"
      )}
    >
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
        {/* ===== Photo ===== */}
        <div className="relative shrink-0">
          {images.length > 0 ? (
            <ShopPhotoGrid
              images={images}
              onOpenAction={(startIndex) => {
                console.log("open gallery at", startIndex);
              }}
            />
          ) : highlightsError ? (
            <div className="flex h-55 items-center justify-center bg-zinc-100 text-sm text-zinc-500">
              사진을 불러오지 못했어요
            </div>
          ) : isHighlightsLoading ? (
            <div className="h-55 animate-pulse bg-zinc-100" />
          ) : (
            <div className="flex h-55 items-center justify-center bg-zinc-100 text-sm text-zinc-400">
              사진이 없어요
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3">
            {onBackAction ? (
              <button
                type="button"
                onClick={onBackAction}
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
              onClick={onCloseAction}
              className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/65 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ===== Tabs ===== */}
        <div className="shrink-0 border-b bg-white">
          <ShopDetailTabs value={tab} onChangeAction={setTab} />
        </div>

        {/* ===== Content ===== */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {tab === "home" && (
            <div id="panel-home" className="mx-auto max-w-105 p-4">
              {shopHomeError ? (
                <p className="text-sm text-red-500">
                  가게 정보를 불러오지 못했어요.
                </p>
              ) : homeSectionProps ? (
                <ShopHomeSection {...homeSectionProps} />
              ) : isShopHomeLoading ? (
                <p className="text-sm text-zinc-500">
                  가게 정보를 불러오는 중...
                </p>
              ) : (
                <p className="text-sm text-zinc-500">가게 정보가 없어요.</p>
              )}

              {children ? <div className="mt-4">{children}</div> : null}
            </div>
          )}

          {tab === "menu" && (
            <div id="panel-menu" className="p-4">
              <MenuList
                shopId={shopId}
                enabled={open}
                onItemClickAction={(menu) => {
                  console.log("선택한 메뉴:", menu);
                }}
              />
            </div>
          )}

          {tab === "review" && (
            <div id="panel-review" className="p-4">
              <ReviewList shopId={shopId} />
            </div>
          )}

          {tab === "photo" && (
            <div id="panel-photo" className="p-4">
              <InfiniteMasonryPhotoGrid
                shopId={shopId}
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
