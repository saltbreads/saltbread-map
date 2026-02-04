"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type Props = {
  images: string[];
  alt?: string;
  className?: string;

  onOpen?: (startIndex: number) => void;
  emptyText?: string;
};

const MAX = 5;

function PhotoFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        // 높이 제한이 핵심 (너무 길어지지 않게)
        "w-full overflow-hidden rounded-t-2xl rounded-b-none",
        "h-[min(280px,27vh)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function EmptyGallery({ text }: { text: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-50 text-sm text-zinc-500">
      📷 {text}
    </div>
  );
}

function SafeImage({
  src,
  alt,
  priority,
  className,
  onErrorFallback,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  onErrorFallback?: React.ReactNode;
}) {
  const [failed, setFailed] = React.useState(false);
  if (failed) return <>{onErrorFallback ?? null}</>;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}

function HeroOnly({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-full w-full bg-zinc-100"
    >
      <SafeImage
        src={src}
        alt={alt}
        priority
        onErrorFallback={
          <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
            📷 이미지를 불러올 수 없어요
          </div>
        }
      />
    </button>
  );
}

function GridFive({
  images,
  alt,
  onOpen,
}: {
  images: string[];
  alt: string;
  onOpen?: (startIndex: number) => void;
}) {
  const total = images.length;
  const remaining = Math.max(0, total - MAX);
  const shown = images.slice(0, MAX);
  const handleClick = (index: number) => onOpen?.(index);

  return (
    <div className="grid h-full w-full grid-cols-2 gap-2">
      {/* Left big */}
      <button
        type="button"
        onClick={() => handleClick(0)}
        className="relative h-full w-full bg-zinc-100"
      >
        <SafeImage
          src={shown[0]}
          alt={`${alt} 1`}
          priority
          onErrorFallback={
            <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
              📷 이미지를 불러올 수 없어요
            </div>
          }
        />
      </button>

      {/* Right 2x2 */}
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-2">
        {shown.slice(1).map((url, i) => {
          const index = i + 1; // 1~4
          const isLastCell = index === 4;
          const showOverlay = isLastCell && remaining > 0;

          return (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => handleClick(index)}
              className="relative h-full w-full bg-zinc-100"
            >
              <SafeImage
                src={url}
                alt={`${alt} ${index + 1}`}
                className={cn(showOverlay && "brightness-75")}
                onErrorFallback={
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400">
                    📷 이미지를 불러올 수 없어요
                  </div>
                }
              />

              {showOverlay ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-black/60 px-4 py-2 text-sm font-semibold text-white">
                    +{remaining}
                  </div>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ShopPhotoGrid({
  images,
  alt = "shop photo",
  className,
  onOpen,
  emptyText = "등록된 사진이 없습니다",
}: Props) {
  const total = images.length;

  // 0장
  if (total === 0) {
    return (
      <PhotoFrame className={className}>
        <EmptyGallery text={emptyText} />
      </PhotoFrame>
    );
  }

  // 1~4장: 대표 1장
  if (total < 5) {
    return (
      <PhotoFrame className={className}>
        <HeroOnly
          src={images[0]}
          alt={`${alt} 1`}
          onClick={() => onOpen?.(0)}
        />
      </PhotoFrame>
    );
  }

  // 5장 이상: 그리드
  return (
    <PhotoFrame className={className}>
      <GridFive images={images} alt={alt} onOpen={onOpen} />
    </PhotoFrame>
  );
}
