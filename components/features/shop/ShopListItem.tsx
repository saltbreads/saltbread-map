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
  distanceMeters?: number | null;
  onToggleLikeAction?: (next: boolean) => void;
  averagePrice?: number;
  topInfoItems?: InfoRowItem[]; // 태그로 3개까지
  className?: string;
  variant?: InfoRowVariant;
};

function formatDistanceMeters(meters: number) {
  if (!Number.isFinite(meters)) return null;

  if (meters < 1000) {
    return `${meters}m`;
  }

  const km = meters / 1000;

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
  distanceMeters,
  onToggleLikeAction,
  averagePrice,
  topInfoItems = [],
  className,
}: ShopListItemProps) {
  const distanceLabel =
    typeof distanceMeters === "number"
      ? formatDistanceMeters(distanceMeters)
      : null;

  const priceText =
    averagePrice == null ? null : Math.round(averagePrice).toLocaleString();

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5",
        className
      )}
    >
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

      <div className="p-3 sm:p-3.5">
        <div className="flex items-start gap-2 sm:gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-zinc-900 sm:text-[16px]">
                  {name}
                </p>
              </div>

              <div className="shrink-0">
                <RatingBadge rating={rating} reviewCount={reviewCount} />
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <LikeButton isLiked={isLiked} onToggleAction={onToggleLikeAction} />
          </div>
        </div>

        {distanceLabel ? (
          <p className="mt-1.5 text-[12px] text-zinc-500 sm:mt-1">
            📍 {distanceLabel}
          </p>
        ) : null}

        {averagePrice ? (
          <div className="mt-2">
            <InfoRow icon="💸" label="평균" value={`${priceText}원`} />
          </div>
        ) : null}

        {topInfoItems.length > 0 ? (
          <div className="mt-2.5 sm:mt-2">
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
