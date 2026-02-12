export type Review = {
  id: string;
  user: {
    nickname: string;
    avatarUrl: string;
  };
  images: string[]; // 리뷰 사진들
  content: string; // 리뷰 내용
  createdAt?: string; // 필요하면 표시용
};

export const reviewsMock: Review[] = [
  {
    id: "r1",
    user: {
      nickname: "주름마왕",
      avatarUrl: "/image/bread.png",
    },
    images: [
      "/image/sample-shop-1.jpg",
      "/image/sample-shop-2.jpg",
      "/image/sample-shop-3.jpg",
    ],
    content:
      "매장분위기가 너무 좋았고 소금빵 종류가 다양해서 좋았음! 다음에는 다른 소금빵 먹으러 한번 더 방문 할 예정",
    createdAt: "2025-09-12",
  },
  {
    id: "r2",
    user: {
      nickname: "소금빵헌터",
      avatarUrl: "/image/bread.png",
    },
    images: ["/image/sample-shop-1.jpg", "/image/sample-shop-2.jpg"],
    content:
      "대기 없이 바로 들어갔고 직원분들 친절했음. 소금빵은 정말 맛있어요",
    createdAt: "2025-10-01",
  },
];
