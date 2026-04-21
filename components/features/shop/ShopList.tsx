"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import { ShopListItem } from "@/components/features/shop/ShopListItem";
import { mapLabelsToTopInfoItems } from "@/lib/mappers/reviewTagEmoji.mapper";

import {
  SearchShopItem,
  getShopHome,
  getPhotoHighlights,
} from "@/lib/api/shops";

type ShopListProps = {
  shops: SearchShopItem[];
  onSelectAction?: (shop: SearchShopItem) => void;
  onToggleLikeAction?: (shopId: string, next: boolean) => void; // 옵션
};

export function ShopList({
  shops,
  onSelectAction,
  onToggleLikeAction,
}: ShopListProps) {
  /**
   * React Query 캐시 접근
   * - 상세 데이터를 미리 받아 캐시에 저장하기 위해 사용
   */
  const queryClient = useQueryClient();

  /**
   * 가게 상세 prefetch
   *
   * 목적
   * - 사용자가 가게 카드에 마우스를 올리거나 터치했을 때
   * - 상세 데이터를 미리 받아 React Query 캐시에 저장
   * - 실제 클릭 시 모달이 훨씬 빠르게 열리도록 함
   */
  const prefetchShopDetail = React.useCallback(
    (shopId: string) => {
      /**
       * 가게 홈 정보 prefetch
       * (주소 / 전화번호 / 링크 / 영업시간 등)
       */
      queryClient.prefetchQuery({
        queryKey: ["shopHome", shopId],
        queryFn: () => getShopHome(shopId),
        staleTime: 1000 * 60 * 5,
      });

      /**
       * 가게 사진 highlight prefetch
       * (모달 상단 사진 그리드)
       */
      queryClient.prefetchQuery({
        queryKey: ["photoHighlights", shopId],
        queryFn: () => getPhotoHighlights(shopId),
        staleTime: 1000 * 60 * 5,
      });
    },
    [queryClient]
  );

  const handleSelect = (shop: SearchShopItem) => {
    onSelectAction?.(shop);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    shop: SearchShopItem
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      /**
       * 키보드 접근성 대응
       * - Enter / Space로 선택할 때도 prefetch 수행
       */
      prefetchShopDetail(shop.id);

      handleSelect(shop);
    }
  };

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      {shops.map((shop) => (
        <div
          key={shop.id}
          role="button"
          tabIndex={0}
          // hover 시 상세 데이터 prefetch
          // - 사용자가 관심을 보인 카드만 미리 데이터 요청
          onMouseEnter={() => {
            prefetchShopDetail(shop.id);
          }}
          onPointerEnter={() => {}}
          // 키보드 포커스 접근성 대응
          onFocus={() => prefetchShopDetail(shop.id)}
          // 모바일 대응
          // - hover가 없기 때문에 touch 시작 시 prefetch
          onTouchStart={() => {
            prefetchShopDetail(shop.id);
          }}
          onClick={() => {
            handleSelect(shop);
          }}
          onKeyDown={(e) => handleKeyDown(e, shop)}
          className="rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
        >
          <ShopListItem
            imageUrl={shop.heroImageUrl ?? undefined}
            name={shop.name}
            rating={shop.avgRating ?? 0}
            reviewCount={shop.reviewCount ?? 0}
            isLiked={!!shop.isLiked}
            distanceMeters={shop.distanceMeters}
            onToggleLikeAction={(next) => onToggleLikeAction?.(shop.id, next)}
            averagePrice={shop.avgPrice ?? undefined}
            topInfoItems={mapLabelsToTopInfoItems(shop.bestLabels)}
          />
        </div>
      ))}
    </div>
  );
}
