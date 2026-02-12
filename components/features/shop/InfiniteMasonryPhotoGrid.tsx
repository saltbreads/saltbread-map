"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import {
  makeMockPhotos,
  type ShopPhotoItem,
} from "@/lib/data/shops.photos.mock";

type InfiniteMasonryPhotoGridProps = {
  className?: string;

  /** 2열 고정(원하면 3열도 가능하게 열어둠) */
  columns?: 2 | 3;

  /** 한 번에 로드할 개수 */
  pageSize?: number;

  /** 사진 클릭 시(갤러리 열기 등) */
  onOpenAction?: (startIndex: number) => void;

  /** 비디오 뱃지(▶) 클릭 시 별도 동작 */
  onPlayVideoAction?: (item: ShopPhotoItem, index: number) => void;

  /** 실제 API로 교체할 때 쓰는 fetcher (없으면 mock 사용) */
  fetcher?: (
    page: number,
    pageSize: number
  ) => Promise<{
    items: ShopPhotoItem[];
    hasMore: boolean;
  }>;
};

export function InfiniteMasonryPhotoGrid({
  className,
  columns = 2,
  pageSize = 12,
  onOpenAction,
  onPlayVideoAction,
  fetcher,
}: InfiniteMasonryPhotoGridProps) {
  const [items, setItems] = React.useState<ShopPhotoItem[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  const loadMore = React.useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = fetcher
        ? await fetcher(page, pageSize)
        : await Promise.resolve(makeMockPhotos(page, pageSize));

      setItems((prev) => [...prev, ...res.items]);
      setHasMore(res.hasMore);
      setPage((p) => p + 1);
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, pageSize, loading, hasMore]);

  // 최초 로드
  React.useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 무한 스크롤 트리거
  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) loadMore();
      },
      {
        root: null,
        rootMargin: "700px",
        threshold: 0,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  // ✅ columns 기반 2열/3열 masonry
  const colsClass = columns === 3 ? "columns-3" : "columns-2";

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(colsClass, "gap-2 [column-fill:_balance]")}>
        {items.map((p, idx) => (
          <button
            key={`${p.id}-${idx}`}
            type="button"
            onClick={() => onOpenAction?.(idx)}
            className={cn(
              "relative mb-2 inline-block w-full", // ✅ 컬럼에서 안정적으로
              "break-inside-avoid",
              "overflow-hidden rounded-xl bg-zinc-100",
              "focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            )}
            aria-label={`사진 보기 ${idx + 1}`}
          >
            {/* ✅ 비율 기반: 이미지가 스스로 높이를 결정 */}
            <Image
              src={p.src}
              alt={p.alt ?? "shop photo"}
              width={900}
              height={900}
              sizes={columns === 3 ? "33vw" : "50vw"}
              className="h-auto w-full object-cover"
              priority={idx < 2}
            />

            {/* ✅ 비디오일 때만 뱃지 / (원하면 클릭 액션 분리) */}
            {p.isVideo ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayVideoAction?.(p, idx);
                }}
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/65"
                aria-label="동영상 재생"
              >
                ▶
              </button>
            ) : null}
          </button>
        ))}
      </div>

      {/* sentinel */}
      <div ref={sentinelRef} className="h-10" />

      {/* loading / end */}
      <div className="py-3 text-center text-xs text-zinc-500">
        {loading ? "로딩 중..." : hasMore ? "" : "마지막 사진이에요."}
      </div>
    </div>
  );
}
