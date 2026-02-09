"use client";

import { EmptyGallery } from "@/components/shared/photo/EmptyGallery";
import { HeroOnly } from "@/components/shared/photo/HeroOnly";
import { PhotoFrame } from "@/components/shared/photo/PhotoFrame";
import { GridFive } from "@/components/shared/photo/GridFive";

type ShopPhotoGridProps = {
  images: string[];
  alt?: string;
  className?: string;
  onOpenAction?: (startIndex: number) => void;
  emptyText?: string;
};

export function ShopPhotoGrid({
  images,
  alt = "shop photo",
  className,
  onOpenAction,
  emptyText = "등록된 사진이 없습니다",
}: ShopPhotoGridProps) {
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
          onClick={() => onOpenAction?.(0)}
        />
      </PhotoFrame>
    );
  }

  // 5장 이상: 그리드
  return (
    <PhotoFrame className={className}>
      <GridFive images={images} alt={alt} onOpen={onOpenAction} />
    </PhotoFrame>
  );
}
