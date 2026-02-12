// lib/data/shops.detail.mock.ts

export type AddressInfo = {
  display: string;
  road?: string;
  jibun?: string;
  zip?: string;
};

export type TransitInfo = {
  label: string;
};

export type BusinessStatus = "OPEN" | "CLOSED" | "BREAK" | "UNKNOWN";

export type WeeklyHoursItem = {
  dayLabel: string;
  hoursText: string;
  isClosed?: boolean;
};

export type ContactLinks = {
  instagram?: string;
  kakao?: string;
  website?: string;
};

export type ShopHomeData = {
  address: AddressInfo;
  transit?: TransitInfo;
  business: {
    status: BusinessStatus;
    statusText: string;
    todayText?: string;
    weekly?: WeeklyHoursItem[];
  };
  phone?: {
    label?: string;
    number?: string;
  };
  links?: ContactLinks;
};

export type ShopDetailMock = {
  id: string;
  name: string;
  images: string[];
  home: ShopHomeData;
};

export const SHOP_DETAIL_MOCK: Record<string, ShopDetailMock> = {
  "shop-1": {
    id: "shop-1",
    name: "샘플 소금빵집",
    images: [
      "/image/sample-shop-1.jpg",
      "/image/sample-shop-2.jpg",
      "/image/sample-shop-3.jpg",
      "/image/sample-shop-2.jpg",
      "/image/sample-shop-3.jpg",
    ],
    home: {
      address: {
        display: "대구 남구 계명길 12-4 1층",
        road: "대구광역시 남구 계명길 12-4",
        jibun: "대구 남구 대명동 123-4",
        zip: "42401",
      },
      transit: { label: "남산역 2번 출구에서 976m" },
      business: {
        status: "OPEN",
        statusText: "영업 중",
        todayText: "오늘 12:00 ~ 02:00",
        weekly: [
          { dayLabel: "월", hoursText: "12:00 - 02:00" },
          { dayLabel: "화", hoursText: "12:00 - 02:00" },
          { dayLabel: "수", hoursText: "12:00 - 02:00" },
          { dayLabel: "목", hoursText: "12:00 - 02:00" },
          { dayLabel: "금", hoursText: "12:00 - 03:00" },
          { dayLabel: "토", hoursText: "12:00 - 03:00" },
          { dayLabel: "일", hoursText: "휴무", isClosed: true },
        ],
      },
      phone: {
        label: "전화번호 보기",
        number: "0507-1376-3975",
      },
      links: {
        instagram: "https://instagram.com/test",
        kakao: "https://pf.kakao.com/_test",
        website: "https://example.com",
      },
    },
  },

  "shop-2": {
    id: "shop-2",
    name: "다른 샘플 가게",
    images: ["/image/sample-shop-2.jpg"],
    home: {
      address: { display: "대구 중구 동성로 12" },
      business: { status: "UNKNOWN", statusText: "영업 정보 없음" },
    },
  },
};

export function getShopDetailMock(shopId?: string) {
  if (!shopId) return SHOP_DETAIL_MOCK["shop-1"];
  return SHOP_DETAIL_MOCK[shopId] ?? SHOP_DETAIL_MOCK["shop-1"];
}
