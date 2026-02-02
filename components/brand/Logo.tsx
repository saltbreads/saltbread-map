import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type LogoSize = "sm" | "md" | "lg";

type LogoProps = {
  size?: LogoSize;
  showText?: boolean;
  className?: string;
};

const sizeConfig: Record<
  LogoSize,
  {
    image: number;
    text: string;
    gap: string;
    weight: string;
  }
> = {
  sm: {
    image: 24,
    text: "text-sm",
    gap: "gap-1.5",
    weight: "font-semibold",
  },
  md: {
    image: 28,
    text: "text-base",
    gap: "gap-2",
    weight: "font-bold",
  },
  lg: {
    image: 32,
    text: "text-lg",
    gap: "gap-3",
    weight: "font-extrabold",
  },
};

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "inline-flex items-center  text-zinc-900",
        config.gap,
        className
      )}
    >
      {/* 로고 이미지 */}
      <Image
        src="/image/saltBreadPin.png"
        alt="소금빵지도 로고"
        width={config.image}
        height={config.image}
        priority
      />

      {/* 로고 텍스트 */}
      {showText && (
        <span
          className={cn(
            config.text,
            config.weight,
            "whitespace-nowrap text-brand-secondary"
          )}
        >
          소금빵지도
        </span>
      )}
    </div>
  );
}
