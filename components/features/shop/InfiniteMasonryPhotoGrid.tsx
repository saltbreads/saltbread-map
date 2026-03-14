"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { useShopPhotos } from "@/lib/queries/useShopPhotos";
import type { ShopPhotoItemDto } from "@/lib/api/shops";

type InfiniteMasonryPhotoGridItem = {
  id: string;
  src: string;
  alt?: string;
  reviewId?: string;
  createdAt?: string;
  isHero?: boolean;
  isVideo?: boolean;
};

type InfiniteMasonryPhotoGridProps = {
  shopId: string;
  className?: string;

  /** 2열 고정(원하면 3열도 가능하게 열어둠) */
  columns?: 2 | 3;

  /** 한 번에 로드할 개수 */
  pageSize?: number;

  /** 사진 클릭 시(갤러리 열기 등) */
  onOpenAction?: (startIndex: number) => void;

  /** 비디오 뱃지(▶) 클릭 시 별도 동작 */
  onPlayVideoAction?: (
    item: InfiniteMasonryPhotoGridItem,
    index: number
  ) => void;
};

export function InfiniteMasonryPhotoGrid({
  shopId,
  className,
  columns = 2,
  pageSize = 12,
  onOpenAction,
  onPlayVideoAction,
}: InfiniteMasonryPhotoGridProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useShopPhotos(shopId, { limit: pageSize });

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  const items = React.useMemo<InfiniteMasonryPhotoGridItem[]>(() => {
    if (!data?.pages?.length) return [];

    const firstPage = data.pages[0];

    const heroItems: InfiniteMasonryPhotoGridItem[] = firstPage.hero
      ? [
          {
            id: "hero-image",
            src: firstPage.hero.url,
            alt: "대표 사진",
            isHero: true,
          },
        ]
      : [];

    const photoItems = data.pages.flatMap((page) =>
      page.items.map(
        (photo: ShopPhotoItemDto): InfiniteMasonryPhotoGridItem => ({
          id: photo.id,
          src: photo.url,
          alt: "가게 사진",
          reviewId: photo.reviewId,
          createdAt: photo.createdAt,
        })
      )
    );

    return [...heroItems, ...photoItems];
  }, [data]);

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "700px",
        threshold: 0,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const colsClass = columns === 3 ? "columns-3" : "columns-2";

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
        사진 불러오는 중...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-red-500">
        사진을 불러오지 못했습니다.
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
        등록된 사진이 없습니다.
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(colsClass, "gap-2 [column-fill:_balance]")}>
        {items.map((p, idx) => (
          <button
            key={`${p.id}-${idx}`}
            type="button"
            onClick={() => onOpenAction?.(idx)}
            className={cn(
              "relative mb-2 inline-block w-full",
              "break-inside-avoid",
              "overflow-hidden rounded-xl bg-zinc-100",
              "focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            )}
            aria-label={`사진 보기 ${idx + 1}`}
          >
            <Image
              src={p.src}
              alt={p.alt ?? "shop photo"}
              width={900}
              height={900}
              sizes={columns === 3 ? "33vw" : "50vw"}
              className="h-auto w-full object-cover"
              priority={idx < 2}
            />

            {p.isVideo ? (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayVideoAction?.(p, idx);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onPlayVideoAction?.(p, idx);
                  }
                }}
                className="absolute right-2 top-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/65"
                aria-label="동영상 재생"
              >
                ▶
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div ref={sentinelRef} className="h-10" />

      <div className="py-3 text-center text-xs text-zinc-500">
        {isFetchingNextPage
          ? "로딩 중..."
          : hasNextPage
          ? ""
          : "마지막 사진이에요."}
      </div>
    </div>
  );
}
