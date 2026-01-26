"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";

import { RatingBadge } from "@/components/ui/RatingBadge";
import { LikeButton } from "@/components/ui/LikeButton";
import { InfoRow, type InfoRowItem } from "@/components/ui/InfoRow";
import { TopInfoRows } from "@/components/shop/TopInfoRows";
import { type InfoRowVariant } from "@/components/ui/InfoRow";

type ShopListItemProps = {
  imageUrl?: string;
  name: string;
  rating: number;
  reviewCount?: number;
  isLiked?: boolean;
  onToggleLikeAction?: (next: boolean) => void;
  priceRow?: InfoRowItem;
  topInfoItems?: InfoRowItem[]; // 태그로 3개까지
  className?: string;
  variant?: InfoRowVariant;
};

export function ShopListItem({
  imageUrl,
  name,
  rating,
  reviewCount,
  isLiked,
  onToggleLikeAction,
  priceRow,
  topInfoItems = [],
  className,
}: ShopListItemProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl bg-white", className)}>
      <div className="relative aspect-video w-full bg-zinc-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 560px"
          />
        ) : null}
      </div>
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-[16px] font-semibold text-zinc-900">
                {name}
              </p>
              <RatingBadge rating={rating} reviewCount={reviewCount} />
            </div>
          </div>

          <LikeButton isLiked={isLiked} onToggleAction={onToggleLikeAction} />
        </div>
        {priceRow ? (
          <div className="mt-2">
            <InfoRow {...priceRow} />
          </div>
        ) : null}
        {topInfoItems.length > 0 ? (
          <div className="mt-2">
            <TopInfoRows
              items={topInfoItems}
              limit={3}
              variant="badge"
              layout="row"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
