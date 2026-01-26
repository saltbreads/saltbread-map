"use client";

import * as React from "react";
import { ShopListItem } from "@/components/shop/ShopListItem";
import { initialShops, type DummyShop } from "@/lib/data/shops.mock";

export default function TestPage() {
  const [shops, setShops] = React.useState<DummyShop[]>(initialShops);

  const toggleLike = (id: string, next: boolean) => {
    setShops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isLiked: next } : s))
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto w-full max-w-140">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900">
              ShopListItem 테스트
            </h1>
            <p className="mt-1 text-xs text-zinc-600">
              더미데이터로 리스트 렌더링 + 좋아요 토글 확인
            </p>
          </div>

          <button
            type="button"
            className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
            onClick={() => setShops(initialShops)}
          >
            Reset
          </button>
        </div>

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

        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-3">
          <p className="text-xs font-medium text-zinc-900">현재 liked 상태</p>
          <pre className="mt-2 overflow-auto text-[11px] text-zinc-700">
            {JSON.stringify(
              shops.map(({ id, name, isLiked }) => ({ id, name, isLiked })),
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
