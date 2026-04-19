import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-xl border bg-white px-3 text-sm outline-none",
          "sm:h-11 sm:px-4",
          "text-zinc-900",
          "placeholder:text-zinc-400",
          "focus:border-zinc-400 focus:ring-2 focus:ring-black/10",
          "disabled:bg-zinc-50 disabled:text-zinc-400",
          hasError
            ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
            : "border-zinc-200",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
