import { Review } from "@/lib/data/reviews.mock";
import { PhotoCarousel } from "@/components/shared/photo/PhotoCarousel";
import Image from "next/image";

type Props = {
  review: Review;
};

export function ReviewCard({ review }: Props) {
  console.log("review.images", review.id, review.images);
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm">
      {/* 상단: 프로필 */}
      <header className="flex items-center gap-3">
        <Image
          src={review.user.avatarUrl}
          alt={`${review.user.nickname} avatar`}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover border"
          loading="lazy"
        />
        <div className="min-w-0">
          <div className="truncate font-semibold">{review.user.nickname}</div>
          {review.createdAt && (
            <div className="text-xs text-zinc-500">{review.createdAt}</div>
          )}
        </div>
      </header>

      {/* 중단: 사진 */}
      <div className="mt-3 min-h-[16rem]">
        <PhotoCarousel images={review.images} />
      </div>

      {/* 하단: 리뷰 내용 */}
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-800">
        {review.content}
      </p>
    </article>
  );
}
