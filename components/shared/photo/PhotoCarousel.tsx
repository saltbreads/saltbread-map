"use client";

import Image from "next/image";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PhotoCarouselProps = {
  images: string[];
  altPrefix?: string;
  className?: string;
  heightPx?: number;
};

export function PhotoCarousel({
  images,
  altPrefix = "review-photo",
  className = "",
  heightPx = 256,
}: PhotoCarouselProps) {
  const [idx, setIdx] = React.useState(0);
  const [broken, setBroken] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    setIdx(0);
    setBroken(new Set());
  }, [images]);

  if (!images?.length) return null;

  const last = images.length - 1;
  const canPrev = idx > 0;
  const canNext = idx < last;

  const goPrev = () => setIdx((p) => Math.max(0, p - 1));
  const goNext = () => setIdx((p) => Math.min(last, p + 1));

  const handleImageError = () => {
    setBroken((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  };

  const isBroken = broken.has(idx);

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-2xl border bg-zinc-100">
        <div
          className="relative w-full overflow-hidden rounded-2xl"
          style={{ height: heightPx }}
        >
          {!isBroken ? (
            <Image
              src={images[idx]}
              alt={`${altPrefix}-${idx + 1}`}
              fill
              className="object-cover pointer-events-none"
              sizes="(max-width: 768px) 100vw, 600px"
              onError={handleImageError}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
              이미지를 불러올 수 없어요
            </div>
          )}

          {canPrev && (
            <button
              type="button"
              onClick={goPrev}
              className="
                absolute left-4 top-1/2 -translate-y-1/2 z-50
                h-12 w-12
                flex items-center justify-center
                text-white
                drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]
                hover:scale-105 active:scale-95
                transition
              "
              aria-label="이전 사진"
            >
              <ChevronLeft size={36} strokeWidth={2.8} />
            </button>
          )}

          {canNext && (
            <button
              type="button"
              onClick={goNext}
              className="
                absolute right-4 top-1/2 -translate-y-1/2 z-50
                h-12 w-12
                flex items-center justify-center
                text-white
                drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]
                hover:scale-105 active:scale-95
                transition
              "
              aria-label="다음 사진"
            >
              <ChevronRight size={36} strokeWidth={2.8} />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute left-3 top-3 z-50 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
              {idx + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
