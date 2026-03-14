import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type MenuItemCardProps = {
  className?: string;
  name: string;
  price: string;
  imageUrl?: string;
  imageAlt?: string;
  currencySuffix?: string;
  onClick?: () => void;
};

function formatPriceKRW(price: number | string) {
  if (typeof price === "number") return price.toLocaleString("ko-KR");
  const n = Number(String(price).replaceAll(",", ""));
  if (Number.isFinite(n)) return n.toLocaleString("ko-KR");
  return String(price);
}

export function MenuItem({
  className,
  name,
  price,
  imageUrl,
  imageAlt,
  currencySuffix = "원",
  onClick,
}: MenuItemCardProps) {
  const priceText = `${formatPriceKRW(price)}${currencySuffix}`;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between gap-4",
        "rounded-2xl bg-white py-3",
        onClick && "cursor-pointer hover:bg-zinc-50",
        className
      )}
    >
      {/* text */}
      <div className="min-w-0">
        <p className="truncate text-[15px] font-extrabold text-zinc-900">
          {name}
        </p>
        <p className="mt-1 text-[14px] font-semibold text-zinc-900">
          {priceText}
        </p>
      </div>

      {/* image */}
      <div className="relative flex h-14 w-18 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            width={72}
            height={56}
            sizes="72px"
            className="h-14 w-18 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <span className="text-[11px] font-semibold text-zinc-400">
            이미지 없음
          </span>
        )}
      </div>
    </div>
  );
}
