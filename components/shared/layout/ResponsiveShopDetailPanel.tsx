"use client";

import * as React from "react";

import { ShopDetailPanel } from "./ShopDetailPanel";
import { MobileShopDetailPanel } from "./MobileShopDetailPanel";
import { ShopDetailTabKey } from "@/components/features/shop/types";

type ResponsiveShopDetailPanelProps = {
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

/**
 * 현재 뷰포트가 모바일인지 판단
 * - Tailwind md 기준(768px)과 동일하게 맞춤
 * - CSS 숨김이 아니라 컴포넌트 자체를 분기하기 위해 사용
 */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const update = (matches: boolean) => {
      setIsMobile(matches);
    };

    update(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      update(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [breakpoint]);

  return isMobile;
}

export function ResponsiveShopDetailPanel({
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
}: ResponsiveShopDetailPanelProps) {
  const isMobile = useIsMobile();

  /**
   * 초기 렌더에서는 화면 크기를 아직 모르므로 아무것도 그리지 않음
   * - hydration mismatch 방지
   * - open=false면 당연히 렌더하지 않음
   */
  if (!open || isMobile === null) return null;

  if (isMobile) {
    return (
      <MobileShopDetailPanel
        open={open}
        onBackAction={onBackAction}
        onCloseAction={onCloseAction}
        shopId={shopId}
        defaultTab={defaultTab}
      >
        {children}
      </MobileShopDetailPanel>
    );
  }

  return (
    <ShopDetailPanel
      open={open}
      onBackAction={onBackAction}
      onCloseAction={onCloseAction}
      shopId={shopId}
      sidebarWidthPx={sidebarWidthPx}
      gapPx={gapPx}
      insetYPx={insetYPx}
      panelWidthPx={panelWidthPx}
      defaultTab={defaultTab}
    >
      {children}
    </ShopDetailPanel>
  );
}
