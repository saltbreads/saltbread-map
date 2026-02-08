"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";

import { RatingBadge } from "@/components/shared/ui/RatingBadge";
import { LikeButton } from "@/components/shared/ui/LikeButton";
import { InfoRow, type InfoRowItem } from "@/components/shared/ui/InfoRow";
import { TopInfoRows } from "@/components/features/shop/TopInfoRows";
import { type InfoRowVariant } from "@/components/shared/ui/InfoRow";

type ShopListItemProps = {
  imageUrl?: string;
  name: string;
  rating: number;
  reviewCount?: number;
  isLiked?: boolean;

  /** 대략 거리(km). 예: 1.24 => 1.2km, 0.35 => 350m */
  distanceKm?: number | null;

  onToggleLikeAction?: (next: boolean) => void;
  priceRow?: InfoRowItem;
  topInfoItems?: InfoRowItem[]; // 태그로 3개까지
  className?: string;
  variant?: InfoRowVariant;
};

function formatDistance(km: number) {
  if (!Number.isFinite(km)) return null;

  if (km < 1) {
    const m = Math.round(km * 1000);
    return `${m}m`;
  }

  // 10km 미만은 소수 1자리, 그 이상은 정수로
  const label = km < 10 ? km.toFixed(1) : km.toFixed(0);
  return `${label}km`;
}

export function ShopListItem({
  imageUrl,
  name,
  rating,
  reviewCount,
  isLiked,
  distanceKm,
  onToggleLikeAction,
  priceRow,
  topInfoItems = [],
  className,
}: ShopListItemProps) {
  const distanceLabel =
    typeof distanceKm === "number" ? formatDistance(distanceKm) : null;

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

        {distanceLabel ? (
          <p className="mt-1 text-[12px] text-zinc-500">📍 {distanceLabel}</p>
        ) : null}

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
