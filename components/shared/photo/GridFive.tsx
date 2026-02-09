import { SafeImage } from "./SafeImage";
import { cn } from "@/lib/utils/cn";

const MAX = 5;
/**
 * 최대 5장의 이미지를 그리드 형태로 보여주는 갤러리 컴포넌트
 *
 * 레이아웃:
 * - 왼쪽: 가장 대표 이미지 1장 (큰 사이즈)
 * - 오른쪽: 2x2 그리드로 나머지 최대 4장
 *
 * 특징:
 * - 이미지가 5장 초과일 경우
 *   → 마지막 셀에 "+N" 오버레이 표시
 * - 이미지 클릭 시 onOpen(index) 콜백으로
 *   → 외부 모달 / 라이트박스와 연결 가능
 * - SafeImage 사용으로 이미지 로딩 실패 대응
 *
 * 사용 예:
 * - 가게 / 리뷰 / 포토 카드 상세 상단 갤러리
 */
export function GridFive({
  images,
  alt,
  onOpen,
}: {
  images: string[];
  alt: string;
  onOpen?: (startIndex: number) => void;
}) {
  const total = images.length;
  const remaining = Math.max(0, total - MAX);
  const shown = images.slice(0, MAX);
  const handleClick = (index: number) => onOpen?.(index);

  return (
    <div className="grid h-full w-full grid-cols-2 gap-2">
      {/* Left big */}
      <button
        type="button"
        onClick={() => handleClick(0)}
        className="relative h-full w-full bg-zinc-100"
      >
        <SafeImage
          src={shown[0]}
          alt={`${alt} 1`}
          priority
          onErrorFallback={
            <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
              📷 이미지를 불러올 수 없어요
            </div>
          }
        />
      </button>

      {/* Right 2x2 */}
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-2">
        {shown.slice(1).map((url, i) => {
          const index = i + 1; // 1~4
          const isLastCell = index === 4;
          const showOverlay = isLastCell && remaining > 0;

          return (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => handleClick(index)}
              className="relative h-full w-full bg-zinc-100"
            >
              <SafeImage
                src={url}
                alt={`${alt} ${index + 1}`}
                className={cn(showOverlay && "brightness-75")}
                onErrorFallback={
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400">
                    📷 이미지를 불러올 수 없어요
                  </div>
                }
              />

              {showOverlay ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-black/60 px-4 py-2 text-sm font-semibold text-white">
                    +{remaining}
                  </div>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
