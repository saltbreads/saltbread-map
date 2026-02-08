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
        "flex items-center gap-2",
        "rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm",
        className
      )}
    >
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label="검색어 입력"
        className="border-0 focus:ring-0 h-10 px-3"
      />
      <Button
        type="submit"
        variant="primary"
        size="icon"
        aria-label="검색"
        className="h-10 w-10"
      >
        <SearchIcon className="h-5 w-5" />
      </Button>
    </form>
  );
}
