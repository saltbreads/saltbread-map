import { Review } from "@/lib/data/reviews.mock";
import { ReviewCard } from "./ReviewCard";

type Props = {
  reviews: Review[];
};

export function ReviewList({ reviews }: Props) {
  if (!reviews.length) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
        아직 리뷰가 없어.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </div>
  );
}
