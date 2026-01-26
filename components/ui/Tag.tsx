import { cn } from "@/lib/utils/cn";

type TagProps = {
  children: string;
  className?: string;
};

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-brand-primary/10 px-2 py-0.5 text-[11px] text-brand-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}
