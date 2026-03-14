type Props = {
  emoji?: string;
  label: string;
  count: number;
};

export function ReviewTagItem({ emoji, label, count }: Props) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="shrink-0 text-[18px] leading-none">
          {emoji ?? "🏷️"}
        </span>

        <span className="truncate text-[15px] font-medium leading-none text-zinc-800">
          {label}
        </span>
      </div>

      <span className="ml-4 shrink-0 text-[15px] font-semibold leading-none text-zinc-500">
        {count}
      </span>
    </div>
  );
}
