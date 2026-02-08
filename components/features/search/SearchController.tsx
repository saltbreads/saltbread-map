"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchBarBase } from "./SearchBarBase";

type Props = {
  className?: string;
  placeholder?: string;
  defaultValue?: string; // 필요하면 여기서만
};

export function SearchController({
  className,
  placeholder,
  defaultValue = "",
}: Props) {
  const router = useRouter();
  const [value, setValue] = React.useState(defaultValue);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
  };

  return (
    <SearchBarBase
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onSubmit={handleSubmit}
      placeholder={placeholder}
      className={className}
    />
  );
}
