"use client";

import * as React from "react";

import { SearchController } from "@/components/features/search/SearchController";
import { useShopSearchStore } from "@/lib/store/useShopSearchStore";
import { useBottomSheetStageStore } from "@/lib/store/useBottomSheetStageStore";
import { useSelectedShopStore } from "@/lib/store/useSelectedShopStore";

export function MobileSearchOverlay() {
  const search = useShopSearchStore((s) => s.search);
  const setSearch = useShopSearchStore((s) => s.setSearch);
  const resetPaging = useShopSearchStore((s) => s.resetPaging);

  const setStage = useBottomSheetStageStore((s) => s.setStage);

  const closeShopDetail = useSelectedShopStore((s) => s.closeShopDetail);

  return (
    <div className="absolute inset-x-4 top-[max(1rem,env(safe-area-inset-top))] z-30">
      <div className="relative">
        <SearchController
          value={search}
          onValueChangeAction={(v) => {
            setSearch(v);
            resetPaging();

            /**
             * 모바일 검색은 "상세 패널"이 아니라
             * "검색 결과 리스트"를 먼저 보여주는 흐름으로 처리
             *
             * - 검색어 입력이 시작되면 열려 있던 상세 패널은 닫음
             * - 바텀시트는 최대로 올려서 결과 리스트를 바로 보이게 함
             * - 실제 결과 데이터 반영은 MobileBottomSheet가
             *   search 상태를 읽어서 자동으로 처리
             */
            if (v.trim()) {
              closeShopDetail();
              setStage(3);
            }
          }}
          placeholder="빵집 이름이나 지역을 검색해보세요"
          className="w-full"
        />
      </div>
    </div>
  );
}
