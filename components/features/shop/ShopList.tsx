"use client";

import * as React from "react";
import { ShopListItem } from "@/components/features/shop/ShopListItem";
import { distanceKm } from "@/lib/utils/distance";
import { useLocationStore } from "@/lib/store/useLocationStore";
import { DEFAULT_LOCATION } from "@/lib/constants/location";
import { mapLabelsToTopInfoItems } from "@/lib/constants/reviewTags";
import { SearchShopItem } from "@/lib/api/shops";

type ShopWithDistance = SearchShopItem & { distanceKm: number | null };

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
  // 내 위치 (null 가능)
  const myLoc = useLocationStore((s) => s.myLocation);

  // 내 위치가 없으면 동대구역으로 fallback
  const baseLoc = React.useMemo(
    () =>
      myLoc ?? {
        lat: DEFAULT_LOCATION.lat,
        lng: DEFAULT_LOCATION.lng,
      },
    [myLoc]
  );

  // 거리 계산 + 가까운 순 정렬
  const shopsWithDistance: ShopWithDistance[] = React.useMemo(() => {
    const withDist = shops.map((shop) => {
      // baseLoc은 항상 존재 (fallback 포함)
      const km = distanceKm(
        { lat: baseLoc.lat, lng: baseLoc.lng },
        { lat: shop.latitude, lng: shop.longitude }
      );

      // distanceKm 계산이 실패할 가능성은 거의 없지만 안전 처리
      const safeKm = Number.isFinite(km) ? km : null;

      return { ...shop, distanceKm: safeKm };
    });

    // 가까운 순 정렬 (null은 맨 뒤)
    withDist.sort(
      (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)
    );

    return withDist;
  }, [shops, baseLoc.lat, baseLoc.lng]);

  const handleSelect = (shop: SearchShopItem) => {
    onSelectAction?.(shop);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    shop: SearchShopItem
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(shop);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {shopsWithDistance.map((shop) => (
        <div
          key={shop.id}
          role="button"
          tabIndex={0}
          onClick={() => handleSelect(shop)}
          onKeyDown={(e) => handleKeyDown(e, shop)}
          className="text-left rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
        >
          <ShopListItem
            imageUrl={shop.heroImageUrl ?? undefined}
            name={shop.name}
            rating={shop.avgRating ?? 0}
            reviewCount={shop.reviewCount ?? 0}
            isLiked={!!shop.isLiked}
            distanceKm={shop.distanceKm}
            onToggleLikeAction={(next) => onToggleLikeAction?.(shop.id, next)}
            averagePrice={shop.avgPrice ?? undefined}
            topInfoItems={mapLabelsToTopInfoItems(shop.bestLabels)}
          />
        </div>
      ))}
    </div>
  );
}
