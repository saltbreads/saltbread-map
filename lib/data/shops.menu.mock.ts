export type ShopMenuItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export const SHOP_MENU_MOCK: ShopMenuItem[] = [
  {
    id: "menu-1",
    name: "초코소금빵",
    price: 11000,
    imageUrl: "/image/sample-shop-1.jpg",
  },
  {
    id: "menu-2",
    name: "소금빵",
    price: 3500,
    imageUrl: "/image/bread.png",
  },
  {
    id: "menu-3",
    name: "소금빵1",
    price: 9000,
    imageUrl: "/image/sample-shop-1.jpg",
  },
  {
    id: "menu-4",
    name: "소금빵2",
    price: 8000,
    imageUrl: "/image/sample-shop-1.jpg",
  },
  {
    id: "menu-5",
    name: "소금빵3",
    price: 10000,
    imageUrl: "/image/sample-shop-1.jpg",
  },
];
