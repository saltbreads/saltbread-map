import { ReviewTagItem } from "./ReviewTagItem";

export type ReviewTag = {
  id: string;
  label: string;
  count: number;
  emoji?: string;
};

type Props = {
  tags: ReviewTag[];
};

export function ReviewTagList({ tags }: Props) {
  if (!tags.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-500">
        아직 리뷰 태그가 없어.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tags.map((tag) => (
        <ReviewTagItem
          key={tag.id}
          emoji={tag.emoji}
          label={tag.label}
          count={tag.count}
        />
      ))}
    </div>
  );
}
