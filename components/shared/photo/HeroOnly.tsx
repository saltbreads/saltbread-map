import { SafeImage } from "./SafeImage";
/**
 * 단일 이미지를 크게 보여주는 히어로 이미지 컴포넌트
 *
 * 특징:
 * - 이미지가 1장만 있을 때 사용하는 전용 레이아웃
 * - 버튼으로 감싸 클릭 이벤트(onClick) 연결 가능
 * - priority 옵션으로 LCP 이미지에 적합
 * - SafeImage를 사용해 에러 상황에서도 UI 유지
 *
 * 사용 예:
 * - 대표 사진이 1장뿐인 상세 페이지
 * - 썸네일 → 전체 보기 트리거
 */
export function HeroOnly({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-full w-full bg-zinc-100"
    >
      <SafeImage
        src={src}
        alt={alt}
        priority
        onErrorFallback={
          <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
            📷 이미지를 불러올 수 없어요
          </div>
        }
      />
    </button>
  );
}
