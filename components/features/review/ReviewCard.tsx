import type { ShopReviewDto } from "@/lib/api/reviews";
import { PhotoCarousel } from "@/components/shared/photo/PhotoCarousel";
import Image from "next/image";

type Props = {
  review: ShopReviewDto;
};

export function ReviewCard({ review }: Props) {
  const nickname = review.author?.nickname ?? "익명";
  const avatarUrl =
    review.author?.profileImageUrl ?? "/images/default-profile.png";

  const carouselImages = review.images.map((image) => image.url);

  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm">
      <header className="flex items-center gap-3">
        <Image
          src={avatarUrl}
          alt={`${nickname} avatar`}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full border object-cover"
          loading="lazy"
        />
        <div className="min-w-0">
          <div className="truncate font-semibold">{nickname}</div>
          {review.createdAt && (
            <div className="text-xs text-zinc-500">
              {new Date(review.createdAt).toLocaleDateString("ko-KR")}
            </div>
          )}
        </div>
      </header>

      <div className="mt-3 `min-h-64`">
        <PhotoCarousel images={carouselImages} />
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-800">
        {review.content}
      </p>
    </article>
  );
}
