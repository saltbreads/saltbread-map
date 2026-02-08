"use client";

import { cn } from "@/lib/utils/cn";
import { HeartFilledIcon } from "@/components/shared/icons/HeartFilledIcon";
import { HeartOutlineIcon } from "@/components/shared/icons/HeartOutlineIcon";

type LikeButtonProps = {
  isLiked?: boolean;
  onToggleAction?: (next: boolean) => void;
  className?: string;
};

export function LikeButton({
  isLiked = false,
  onToggleAction = () => {},
  className,
}: LikeButtonProps) {
  const next = !isLiked;

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center p-1",
        "transition active:scale-[0.96]",
        "hover:opacity-90",
        "cursor-pointer",
        className
      )}
      aria-pressed={isLiked}
      aria-label={isLiked ? "좋아요 취소" : "좋아요"}
      onClick={() => onToggleAction(next)}
    >
      <span aria-hidden="true" className="inline-flex">
        {isLiked ? (
          <HeartFilledIcon className="h-5 w-5 text-brand-secondary" />
        ) : (
          <HeartOutlineIcon className="h-5 w-5 text-brand-secondary/70" />
        )}
      </span>
    </button>
  );
}
