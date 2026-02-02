"use client";

import * as React from "react";
import { ShopListItem } from "@/components/shop/ShopListItem";
import { initialShops, type DummyShop } from "@/lib/data/shops.mock";

type SidebarShopListProps = {
  onSelect?: (shop: DummyShop) => void;
};

export function SidebarShopList({ onSelect }: SidebarShopListProps) {
  const [shops, setShops] = React.useState<DummyShop[]>(initialShops);

  const toggleLike = (id: string, next: boolean) => {
    setShops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isLiked: next } : s))
    );
  };

  const handleSelect = (shop: DummyShop) => {
    onSelect?.(shop);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    shop: DummyShop
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(shop);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {shops.map((shop) => (
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
            onToggleLikeAction={(next) => toggleLike(shop.id, next)}
            priceRow={shop.priceRow}
            topInfoItems={shop.topInfoItems}
          />
        </div>
      ))}
    </div>
  );
}
