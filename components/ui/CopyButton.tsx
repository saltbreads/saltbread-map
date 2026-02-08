"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function CopyButton({
  text,
  className,
  label = "복사",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    const ok = await copyText(text);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 900);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={cn(
        "shrink-0 rounded-md border px-2 py-1 text-xs font-semibold",
        "text-zinc-600 hover:bg-zinc-50 active:translate-y-[0.5px]",
        className
      )}
      aria-label={`${label}: ${text}`}
      title={text}
    >
      {copied ? "복사됨" : label}
    </button>
  );
}
