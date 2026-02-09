import type { InfoRowItem } from "@/components/shared/ui/InfoRow";

export type DummyShop = {
  id: string;
  imageUrl?: string;
  name: string;
  rating: number;
  reviewCount: number;
  isLiked: boolean;

  latitude: number;
  longitude: number;

  averagePrice?: number;
  topInfoItems: InfoRowItem[];
};

export const initialShops: DummyShop[] = [
  {
    id: "s1",
    imageUrl: "/image/sample-shop-1.jpg",
    name: "소금빵집 동대구점",
    rating: 4.6,
    reviewCount: 128,
    isLiked: false,
    latitude: 35.8794,
    longitude: 128.6286,
    averagePrice: 3000,
    topInfoItems: [
      { icon: "🧈", label: "버터향 강함", value: 30 },
      { icon: "🔥", label: "재방문", value: 18 },
      { icon: "🥖", label: "겉바속촉", value: 12 },
    ],
  },
  {
    id: "s2",
    imageUrl: "/image/sample-shop-2.jpg",
    name: "빵굽는 골목",
    rating: 4.2,
    reviewCount: 52,
    isLiked: true,
    latitude: 35.8762,
    longitude: 128.6321,
    averagePrice: 2500,
    topInfoItems: [
      { icon: "😋", label: "맛있어요", value: 22 },
      { icon: "🧂", label: "짭짤함 딱", value: 15 },
      { icon: "☕", label: "커피랑 찰떡", value: 9 },
    ],
  },
  {
    id: "s3",
    name: "경주 소금빵 연구소",
    rating: 4.9,
    reviewCount: 301,
    isLiked: false,
    latitude: 35.8562,
    longitude: 129.2247,
    averagePrice: 3500,
    topInfoItems: [
      { icon: "✨", label: "가게가 예뻐요", value: 64 },
      { icon: "🧈", label: "버터향 강함", value: 51 },
      { icon: "📸", label: "사진 맛집", value: 29 },
    ],
  },
  {
    id: "s4",
    imageUrl: "/image/sample-shop-3.jpg",
    name: "오전의 소금빵",
    rating: 4.4,
    reviewCount: 87,
    isLiked: false,
    latitude: 35.8721,
    longitude: 128.6014,
    averagePrice: 2800,
    topInfoItems: [
      { icon: "🌅", label: "아침에 좋아요", value: 19 },
      { icon: "🧈", label: "고소해요", value: 17 },
      { icon: "😌", label: "부담없음", value: 11 },
    ],
  },
  {
    id: "s5",
    imageUrl: "/image/sample-shop-4.jpg",
    name: "버터앤솔트",
    rating: 4.7,
    reviewCount: 214,
    isLiked: true,
    latitude: 35.8689,
    longitude: 128.5931,
    averagePrice: 3200,
    topInfoItems: [
      { icon: "🧈", label: "버터 풍미", value: 46 },
      { icon: "🔥", label: "인기 많아요", value: 33 },
      { icon: "🎁", label: "선물용", value: 18 },
    ],
  },
  {
    id: "s6",
    name: "동네 작은 빵집",
    rating: 4.0,
    reviewCount: 41,
    isLiked: false,
    latitude: 35.8705,
    longitude: 128.6129,
    averagePrice: 2300,
    topInfoItems: [
      { icon: "🙂", label: "무난해요", value: 12 },
      { icon: "🧂", label: "짜지 않아요", value: 9 },
      { icon: "🏠", label: "동네빵집", value: 8 },
    ],
  },
  {
    id: "s7",
    imageUrl: "/image/sample-shop-1.jpg",
    name: "소금빵 작업실",
    rating: 4.8,
    reviewCount: 167,
    isLiked: false,
    latitude: 35.8743,
    longitude: 128.6217,
    averagePrice: 3800,
    topInfoItems: [
      { icon: "🧑‍🍳", label: "장인 느낌", value: 39 },
      { icon: "🧈", label: "버터 듬뿍", value: 35 },
      { icon: "✨", label: "퀄리티 높음", value: 21 },
    ],
  },
  {
    id: "s8",
    name: "역앞 베이커리",
    rating: 4.1,
    reviewCount: 63,
    isLiked: true,
    latitude: 35.8798,
    longitude: 128.6271,
    averagePrice: 2700,
    topInfoItems: [
      { icon: "🚉", label: "접근성 좋아요", value: 20 },
      { icon: "☕", label: "커피랑 좋아요", value: 14 },
      { icon: "🙂", label: "편해요", value: 10 },
    ],
  },
  {
    id: "s9",
    imageUrl: "/image/sample-shop-2.jpg",
    name: "주말에만 여는 빵집",
    rating: 4.5,
    reviewCount: 92,
    isLiked: false,
    latitude: 35.8624,
    longitude: 128.5897,
    averagePrice: 3300,
    topInfoItems: [
      { icon: "📅", label: "주말 한정", value: 27 },
      { icon: "🔥", label: "줄 서요", value: 22 },
      { icon: "🥖", label: "겉바속촉", value: 15 },
    ],
  },
  {
    id: "s10",
    name: "소금빵 실험실",
    rating: 4.3,
    reviewCount: 58,
    isLiked: false,
    latitude: 35.8651,
    longitude: 128.6063,
    averagePrice: 3000,
    topInfoItems: [
      { icon: "🧪", label: "신기해요", value: 16 },
      { icon: "🧈", label: "풍미 좋아요", value: 13 },
      { icon: "📸", label: "사진 찍기 좋아요", value: 9 },
    ],
  },
];
