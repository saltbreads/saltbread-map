"use client";

import { SHOP_MENU_MOCK, ShopMenuItem } from "@/lib/data/shops.menu.mock";
import { MenuItem } from "./MenuItem";

type ShopMenuListProps = {
  items?: ShopMenuItem[];
  onItemClickAction?: (item: ShopMenuItem) => void;
};

export function MenuList({
  items = SHOP_MENU_MOCK,
  onItemClickAction,
}: ShopMenuListProps) {
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
