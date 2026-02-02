"use client";

import * as React from "react";
import { ShopListItem } from "@/components/shop/ShopListItem";
import { initialShops, type DummyShop } from "@/lib/data/shops.mock";

type SidebarShopListProps = {
  shops: DummyShop;
};

export function SidebarShopList() {
  const [shops, setShops] = React.useState<DummyShop[]>(initialShops);

  const toggleLike = (id: string, next: boolean) => {
    setShops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isLiked: next } : s))
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {shops.map((shop) => (
        <ShopListItem
          key={shop.id}
          imageUrl={shop.imageUrl}
          name={shop.name}
          rating={shop.rating}
          reviewCount={shop.reviewCount}
          isLiked={shop.isLiked}
          onToggleLikeAction={(next) => toggleLike(shop.id, next)}
          priceRow={shop.priceRow}
          topInfoItems={shop.topInfoItems}
        />
      ))}
    </div>
  );
}
