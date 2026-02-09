"use client";

import * as React from "react";
import { ShopListItem } from "@/components/features/shop/ShopListItem";
import { initialShops, type DummyShop } from "@/lib/data/shops.mock";
import { distanceKm } from "@/lib/utils/distance";
import { useMyLocation } from "@/lib/hooks/useMyLocation";

type ShopListProps = {
  onSelectAction?: (shop: DummyShop) => void;
};

export function ShopList({ onSelectAction }: ShopListProps) {
  /**
   * 가게 목록 상태
   * - 현재는 mock 데이터로 초기화
   * - 좋아요 토글 등 UI 상호작용 결과를 반영하기 위해 로컬 state로 관리
   */
  const [shops, setShops] = React.useState<DummyShop[]>(initialShops);

  /**
   * 내 위치 정보
   * - location: 현재 좌표(lat, lng)
   * - isLoading: 위치 권한 요청 / 조회 중 여부
   * - error: 권한 거부, 실패 등의 에러 정보
   */
  const { location: myLoc } = useMyLocation();

  /**
   * 좋아요 토글 처리
   * - 특정 shop의 isLiked 상태만 업데이트
   * - 실제 서비스에서는 API 호출로 대체될 예정
   */
  const toggleLike = (id: string, next: boolean) => {
    setShops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isLiked: next } : s))
    );
  };

  /**
   * 가게 선택 처리
   * - 클릭/키보드 이벤트 모두 이 함수로 수렴
   * - 선택 로직 자체는 부모 컴포넌트가 책임
   */
  const handleSelect = (shop: DummyShop) => {
    onSelectAction?.(shop);
  };

  /**
   * 키보드 접근성 처리
   * - div를 button처럼 사용하기 위해 Enter / Space 입력을 클릭으로 변환
   */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    shop: DummyShop
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(shop);
    }
  };

  /**
   * 내 위치가 있을 경우 각 가게까지의 거리(km)를 계산
   * - location이 없으면 distanceKm는 null
   * - 원본 shops 데이터는 변경하지 않고 파생 데이터로 생성
   */
  const shopsWithDistance = React.useMemo(() => {
    return shops.map((shop) => {
      if (!myLoc) return { ...shop, distanceKm: null };

      const km = distanceKm(
        { lat: myLoc.lat, lng: myLoc.lng },
        { lat: shop.latitude, lng: shop.longitude }
      );

      return { ...shop, distanceKm: km };
    });
  }, [shops, myLoc]);

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
            imageUrl={shop.imageUrl}
            name={shop.name}
            rating={shop.rating}
            reviewCount={shop.reviewCount}
            isLiked={shop.isLiked}
            distanceKm={shop.distanceKm ?? null}
            onToggleLikeAction={(next) => toggleLike(shop.id, next)}
            averagePrice={shop.averagePrice}
            topInfoItems={shop.topInfoItems}
          />
        </div>
      ))}
    </div>
  );
}
