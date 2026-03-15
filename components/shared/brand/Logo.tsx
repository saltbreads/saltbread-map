import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type LogoSize = "sm" | "md" | "lg" | "xl";

type LogoProps = {
  size?: LogoSize;
  showText?: boolean;
  className?: string;
};

const sizeConfig: Record<
  LogoSize,
  {
    imageClass: string;
    textClass: string;
    gap: string;
    weight: string;
  }
> = {
  sm: {
    imageClass: "w-6 h-6",
    textClass: "text-sm",
    gap: "gap-1.5",
    weight: "font-semibold",
  },
  md: {
    imageClass: "w-7 h-7",
    textClass: "text-base",
    gap: "gap-2",
    weight: "font-bold",
  },
  lg: {
    imageClass: "w-8 h-8",
    textClass: "text-lg",
    gap: "gap-3",
    weight: "font-extrabold",
  },
  xl: {
    imageClass: "w-12 h-12 md:w-14 md:h-14",
    textClass: "text-2xl md:text-3xl",
    gap: "gap-3.5",
    weight: "font-extrabold",
  },
};

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "inline-flex items-center text-zinc-900",
        config.gap,
        className
      )}
    >
      <Image
        src="/image/logo.png"
        alt="소금빵지도 로고"
        width={56}
        height={56}
        priority
        className={config.imageClass}
      />

      {showText && (
        <span
          className={cn(
            config.textClass,
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
