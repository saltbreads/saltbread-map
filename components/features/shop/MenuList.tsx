"use client";

import { useShopMenus } from "@/lib/queries/useShopMenus";
import { MenuItem } from "./MenuItem";

type ShopMenuItem = {
  id: string;
  name: string;
  price: string;
  imageUrl?: string;
};

type ShopMenuListProps = {
  shopId: string;
  enabled?: boolean;
  onItemClickAction?: (item: ShopMenuItem) => void;
};

function toMenuItem(menu: {
  id: string;
  name: string;
  price: number | null;
  priceText: string | null;
  displayPrice: number | string | null;
  imageUrl: string | null;
}): ShopMenuItem {
  let price = "가격 정보 없음";

  if (typeof menu.displayPrice === "number") {
    price = `${menu.displayPrice.toLocaleString()}원`;
  } else if (typeof menu.displayPrice === "string") {
    price = menu.displayPrice;
  } else if (typeof menu.priceText === "string") {
    price = menu.priceText;
  } else if (typeof menu.price === "number") {
    price = `${menu.price.toLocaleString()}원`;
  }

  return {
    id: menu.id,
    name: menu.name,
    price,
    imageUrl: menu.imageUrl ?? undefined,
  };
}

export function MenuList({
  shopId,
  enabled = true,
  onItemClickAction,
}: ShopMenuListProps) {
  const { data, isLoading, error } = useShopMenus(shopId, enabled);

  const items: ShopMenuItem[] = (data ?? []).map(toMenuItem);

  if (error) {
    return (
      <p className="text-sm text-red-500">메뉴 정보를 불러오지 못했어요.</p>
    );
  }

  if (items.length > 0) {
    return (
      <div className="flex flex-col gap-2">
        {items.map((menu) => (
          <MenuItem
            key={menu.id}
            name={menu.name}
            price={menu.price}
            imageUrl={menu.imageUrl}
            onClick={
              onItemClickAction ? () => onItemClickAction(menu) : undefined
            }
          />
        ))}
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-zinc-500">메뉴 정보를 불러오는 중...</p>;
  }

  return <p className="text-sm text-zinc-500">등록된 메뉴가 없어요.</p>;
}
