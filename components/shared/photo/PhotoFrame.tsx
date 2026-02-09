import { cn } from "@/lib/utils/cn";

/**
 * 사진 영역의 공통 프레임(컨테이너) 역할을 하는 컴포넌트
 *
 * 역할:
 * - 사진 영역의 최대 높이를 제한해
 *   → 상세 페이지 레이아웃이 과도하게 길어지는 것을 방지
 * - 상단 라운드 처리 (카드형 UI에 적합)
 * - 내부 children에 Grid / Hero / EmptyGallery 등을 자유롭게 삽입
 *
 * 디자인 포인트:
 * - h-[min(280px,27vh)] 로
 *   모바일 / 데스크톱 모두 안정적인 비율 유지
 *
 * 사용 예:
 * - 상세 페이지 상단 사진 영역 래퍼
 */
export function PhotoFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        // 높이 제한이 핵심 (너무 길어지지 않게)
        "w-full overflow-hidden rounded-t-2xl rounded-b-none",
        "h-[min(280px,27vh)]",
        className
      )}
    >
      {children}
    </div>
  );
}
