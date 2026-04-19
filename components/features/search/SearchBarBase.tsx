import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/shared/ui/Input";
import { Button } from "@/components/shared/ui/Button";
import { SearchIcon } from "@/components/shared/icons/SearchIcon";

type Props = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  placeholder?: string;
  className?: string;
};

export function SearchBarBase({
  value,
  onChange,
  onSubmit,
  placeholder = "지역 또는 빵집 이름으로 검색",
  className,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="가게 검색"
      className={cn(
        "flex w-full min-w-0 items-center gap-2",
        "rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-sm",
        "sm:gap-2 sm:p-2",
        className
      )}
    >
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label="검색어 입력"
        className="h-9 min-w-0 flex-1 border-0 px-3 text-sm focus:ring-0 sm:h-10"
      />

      <Button
        type="submit"
        variant="primary"
        size="icon"
        aria-label="검색"
        className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
      >
        <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </form>
  );
}
