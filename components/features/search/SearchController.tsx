"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchBarBase } from "./SearchBarBase";

type Props = {
  className?: string;
  placeholder?: string;

  /** 컨트롤드로 쓰고 싶을 때 */
  value?: string;
  onValueChangeAction?: (v: string) => void;

  /** 기존처럼 내부 state로 쓰고 싶을 때 */
  defaultValue?: string;

  /** submit 시 URL도 동기화할지(선택) */
  syncToUrl?: boolean;

  /** submit 콜백(선택) */
  onSubmitValueAction?: (q: string) => void;
};

export function SearchController({
  className,
  placeholder,
  value,
  onValueChangeAction,
  defaultValue = "",
  syncToUrl = false,
  onSubmitValueAction,
}: Props) {
  const router = useRouter();

  const isControlled = value != null && onValueChangeAction != null;
  const [inner, setInner] = React.useState(defaultValue);

  const currentValue = isControlled ? value : inner;

  const setValue = (v: string) => {
    if (isControlled) onValueChangeAction!(v);
    else setInner(v);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = currentValue.trim();

    onSubmitValueAction?.(q);

    if (syncToUrl) {
      router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
    }
  };

  return (
    <SearchBarBase
      value={currentValue}
      onChange={(e) => setValue(e.target.value)}
      onSubmit={handleSubmit}
      placeholder={placeholder}
      className={className}
    />
  );
}
