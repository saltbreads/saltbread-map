import { cn } from "@/lib/utils/cn";
import {
  InfoRow,
  type InfoRowItem,
  type InfoRowVariant,
} from "@/components/ui/InfoRow";

type TopInfoRowsProps = {
  items: InfoRowItem[];
  limit?: number;
  variant?: InfoRowVariant;
  layout?: "column" | "row";
  className?: string;
};

export function TopInfoRows({
  items,
  limit = 3,
  variant = "plain",
  layout = "column",
  className,
}: TopInfoRowsProps) {
  return (
    <div
      className={cn(
        layout === "column" ? "flex flex-col gap-1" : "flex flex-wrap gap-1",
        className
      )}
    >
      {items.slice(0, limit).map((item, index) => (
        <InfoRow
          key={`${item.label}-${index}`}
          icon={item.icon}
          label={item.label}
          value={layout === "row" ? undefined : item.value}
          variant={variant}
        />
      ))}
    </div>
  );
}
