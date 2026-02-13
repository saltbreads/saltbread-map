"use client";

import Link from "next/link";
import * as React from "react";

import { Logo } from "@/components/shared/brand/Logo";
import { Button } from "@/components/shared/ui/Button";
import { SidePanelModal } from "@/components/shared/ui/SidePanelModal";
import { cn } from "@/lib/utils/cn";

import { SearchController } from "../../features/search/SearchController";
import { ShopList } from "../../features/shop/ShopList";
import { useMapStore } from "@/lib/store/useMapStroe";

type SidebarProps = {
  className?: string;
  filterSlot?: React.ReactNode;
  listSlot?: React.ReactNode;
};

export function Sidebar({ className }: SidebarProps) {
  //  선택된 가게 (선택되면 모달 오픈)
  const centerLabel = useMapStore((s) => s.centerLabel);

  // 선택된 가게도 store로 통일 가능 (선택)
  const selectedShopId = useMapStore((s) => s.selectedShopId);
  const selectShop = useMapStore((s) => s.selectShop);

  const closeModal = () => selectShop(null);

  return (
    <>
      <aside
        className={cn(
          "h-dvh w-90 shrink-0 bg-white border-r",
          "flex flex-col",
          className
        )}
      >
        {/* 1) 헤더: 로고 + 로그인 */}
        <div className="h-14 px-4 flex items-center justify-between border-b">
          <Link href="/" className="inline-flex items-center">
            <Logo size="md" />
          </Link>

          <Button variant="primary" size="sm" href="/login">
            로그인
          </Button>
        </div>

        {/* 2) 검색 (서치바만) */}
        <div className="px-4 py-3">
          <SearchController
            placeholder="빵집 이름이나 지역을 검색해보세요"
            className="w-full"
          />
        </div>

        {/* 3) 내 주변 + 동네 */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-sm font-bold text-zinc-900">
            내 주변 소금빵집
          </div>

          {/* 위치라벨  */}
          <div className="text-xs font-semibold text-zinc-600">
            {centerLabel}
          </div>
        </div>

        {/* 4) 리스트 영역 (스크롤) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 pt-3 bg-zinc-50/40">
          {/*  onSelect 추가 */}
          <ShopList onSelectAction={(shop) => selectShop(shop.id)} />
        </div>
      </aside>

      {/*  오른쪽 패널 모달 */}
      <SidePanelModal
        open={!!selectedShopId}
        onClose={closeModal}
        shopId={selectedShopId ?? "가게 아이디"}
      >
        {/* 지금은 내용 비워둠 */}
      </SidePanelModal>
    </>
  );
}
