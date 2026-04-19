"use client";

import * as React from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";

import { ReviewList } from "@/components/features/review/ReviewList";
import { InfiniteMasonryPhotoGrid } from "@/components/features/shop/InfiniteMasonryPhotoGrid";
import { MenuList } from "@/components/features/shop/MenuList";
import { ShopDetailTabs } from "@/components/features/shop/ShopDetailTabs";
import { ShopHomeSection } from "@/components/features/shop/ShopHomeSection";
import { ShopPhotoGrid } from "@/components/features/shop/ShopPhotoGrid";
import { ShopDetailTabKey } from "@/components/features/shop/types";

import { getShopDetailMock } from "@/lib/data/shops.detail.mock";
import { mapShopHomeToSectionProps } from "@/lib/mappers/shopHome.mapper";
import { usePhotoHighlights } from "@/lib/queries/usePhotoHighlights";
import { useShopHome } from "@/lib/queries/useShopHome";
import { useBottomSheetStageStore } from "@/lib/store/useBottomSheetStageStore";
import { cn } from "@/lib/utils/cn";

type MobileShopDetailPanelProps = {
  open: boolean;
  onBackAction?: () => void;
  onCloseAction: () => void;
  shopId?: string;
  children?: React.ReactNode;
  defaultTab?: ShopDetailTabKey;
  className?: string;
};

export function MobileShopDetailPanel({
  open,
  onBackAction,
  onCloseAction,
  shopId = "shop-1",
  children,
  defaultTab = "home",
  className,
}: MobileShopDetailPanelProps) {
  /**
   * hydration mismatch 방지
   * - 바텀시트는 클라이언트 의존성이 커서 마운트 이후 렌더
   */
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const sheetRef = React.useRef<SheetRef>(null);
  const [tab, setTab] = React.useState<ShopDetailTabKey>(defaultTab);

  /**
   * 바텀시트 높이 단계(store)
   * - 리스트 바텀시트에서 마지막으로 사용하던 높이를 공유받아
   *   상세 패널도 같은 높이 단계로 열릴 수 있게 함
   */
  const stage = useBottomSheetStageStore((s) => s.stage);
  const setStage = useBottomSheetStageStore((s) => s.setStage);

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

  // 가게 변경 시 상세 탭은 항상 home으로 초기화
  React.useEffect(() => {
    if (open) {
      setTab("home");
    }
  }, [open, shopId]);

  /**
   * 공식 규칙:
   * - 첫 값은 0(완전 닫힘)
   * - 마지막 값은 1(완전 열림)
   * - 실제 UX 단계는 1(최소) / 2(중간) / 3(최대)
   * - 리스트 바텀시트와 동일한 snap 구조를 사용해 높이 단계를 공유
   */
  const snapPoints = React.useMemo(() => [0, 0.14, 0.45, 1], []);

  // 열릴 때 현재 저장된 높이 단계로 스냅
  React.useEffect(() => {
    if (!mounted || !open) return;

    const t = window.setTimeout(() => {
      sheetRef.current?.snapTo(stage);
    }, 0);

    return () => window.clearTimeout(t);
  }, [mounted, open, stage]);

  const detail = React.useMemo(() => getShopDetailMock(shopId), [shopId]);

  if (!mounted || !open) return null;

  return (
    <div className={cn(className)}>
      <Sheet
        ref={sheetRef}
        isOpen={open}
        onClose={onCloseAction}
        snapPoints={snapPoints}
        initialSnap={stage}
        onSnap={(index) => {
          /**
           * 상세 패널은 1단계를 전역 높이로 저장하지 않음
           * - 1은 닫히기 직전에 잠깐 스치는 상태로 취급
           * - 실제 공유할 의미가 있는 높이는 2 / 3만 반영
           */
          if (index === 2 || index === 3) {
            setStage(index);
          }
        }}
      >
        <Sheet.Container className="rounded-t-3xl! shadow-2xl!">
          <Sheet.Header />

          <Sheet.Content disableDrag={false}>
            <div
              className="flex h-[92dvh] flex-col overflow-hidden bg-white"
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
                      <p className="text-sm text-zinc-500">
                        가게 정보가 없어요.
                      </p>
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
          </Sheet.Content>
        </Sheet.Container>

        <Sheet.Backdrop className="bg-black/20!" />
      </Sheet>
    </div>
  );
}
