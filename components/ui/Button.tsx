import * as React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium " +
  "transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20";

const variants: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-black/90 shadow-sm",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
  outline: "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50",
  ghost: "bg-transparent text-zinc-900 hover:bg-zinc-100",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-10 w-10",
};

function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent",
        className
      )}
      aria-hidden="true"
    />
  );
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading,
    leftIcon,
    rightIcon,
    className,
    children,
    ...props
  },
  ref
) {
  const classes = cx(base, variants[variant], sizes[size], className);

  // Link 버전
  if ("href" in props && typeof props.href === "string") {
    const { href, ...rest } = props;
    return (
      <Link
        href={href}
        className={classes}
        aria-busy={isLoading ? "true" : undefined}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...rest}
      >
        {isLoading ? <Spinner /> : leftIcon}
        <span>{children}</span>
        {rightIcon}
      </Link>
    );
  }

  // Button 버전
  const { disabled, type, ...rest } = props as ButtonAsButton;
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={isDisabled}
      type={type ?? "button"}
      aria-busy={isLoading ? "true" : undefined}
      {...rest}
    >
      {isLoading ? <Spinner /> : leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
});

Button.displayName = "Button";
