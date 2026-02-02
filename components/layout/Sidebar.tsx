"use client";

import * as React from "react";
import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { SidePanelModal } from "@/components/ui/SidePanelModal";
import { cn } from "@/lib/utils/cn";

import { SearchController } from "../search/SearchController";
import { SidebarShopList } from "../shop/SidebarShopList";
import type { DummyShop } from "@/lib/data/shops.mock";

type SidebarProps = {
  className?: string;

  // ㅇㅇ시 ㅇㅇ동 이런 표시용 (나중에 geolocation 붙이면 됨)
  locationLabel?: string;

  // 필터 UI / 리스트 UI를 바깥에서 주입할 수 있게 슬롯으로 열어둠
  filterSlot?: React.ReactNode;
  listSlot?: React.ReactNode;
};

export function Sidebar({
  className,
  locationLabel = "ㅇㅇ시 ㅇㅇ동",
  filterSlot,
  listSlot,
}: SidebarProps) {
  //  선택된 가게 (선택되면 모달 오픈)
  const [selectedShopId, setSelectedShopId] = React.useState<string | null>(
    null
  );

  const closeModal = () => setSelectedShopId(null);

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
          <div className="text-xs font-semibold text-zinc-600">
            {locationLabel}
          </div>
        </div>

        {/* 4) 리스트 영역 (스크롤) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 pt-3 bg-zinc-50/40">
          {/* ✅ onSelect 추가 */}
          <SidebarShopList onSelect={(shop) => setSelectedShopId(shop.id)} />
        </div>
      </aside>

      {/* ✅ 오른쪽 패널 모달 */}
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
