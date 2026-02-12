// lib/data/shops.photos.mock.ts
export type ShopPhotoItem = {
  id: string;
  src: string;
  alt?: string;
  // masonry 느낌을 위해 대충 높이 비율만 부여(실제 이미지 비율과 달라도 OK)
  aspect: "tall" | "square" | "wide";
  isVideo?: boolean; // 우측 상단 ▶ 표시용
};

const POOL = [
  "/image/sample-shop-1.jpg",
  "/image/sample-shop-2.jpg",
  "/image/sample-shop-3.jpg",
  "/image/sample-shop-4.jpg",
] as const;

const ASPECTS: ShopPhotoItem["aspect"][] = ["tall", "square", "wide"];

function pick<T>(arr: readonly T[], i: number) {
  return arr[i % arr.length];
}

export function makeMockPhotos(page: number, pageSize: number) {
  // page=1부터
  const items: ShopPhotoItem[] = Array.from({ length: pageSize }).map(
    (_, idx) => {
      const n = (page - 1) * pageSize + idx;
      return {
        id: `photo-${page}-${idx}`,
        src: pick(POOL, n),
        alt: `shop photo ${n + 1}`,
        aspect: pick(ASPECTS, n),
        isVideo: n % 5 === 0, // 5개 중 1개는 영상처럼 표시
      };
    }
  );

  const hasMore = page < 8; // mock: 8페이지까지만 있다고 가정
  return { items, hasMore };
}
