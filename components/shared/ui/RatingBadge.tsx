import { cn } from "@/lib/utils/cn";

type RatingBadgeProps = {
  rating: number;
  reviewCount?: number;
  className?: string;
};

export function RatingBadge({
  rating,
  reviewCount,
  className,
}: RatingBadgeProps) {
  const label =
    reviewCount !== undefined
      ? `평점 ${rating}점, 리뷰 ${reviewCount}개`
      : `평점 ${rating}점`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs text-zinc-700",
        className
      )}
      aria-label={label}
    >
      <span aria-hidden="true">⭐</span>
      <span className="font-medium tabular-nums">{rating.toFixed(1)}</span>
      {typeof reviewCount === "number" ? (
        <span className="text-zinc-600 tabular-nums">({reviewCount})</span>
      ) : null}
    </span>
  );
}
