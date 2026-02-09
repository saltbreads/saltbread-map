import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import * as React from "react";

/**
 * Next.js Image를 감싼 안전한 이미지 컴포넌트
 *
 * 목적:
 * - 이미지 로딩 실패 시 깨진 이미지 대신
 *   fallback UI를 보여주기 위함
 *
 * 동작 방식:
 * - onError 발생 시 내부 state(failed)를 true로 변경
 * - 실패 상태에서는 Image 대신 fallback 렌더링
 *
 * 특징:
 * - fill + object-cover 기본 적용
 * - priority / className 확장 가능
 * - 다양한 이미지 컴포넌트에서 재사용 가능
 *
 * 사용 예:
 * - 갤러리 이미지
 * - 썸네일
 * - 사용자 업로드 이미지
 */
export function SafeImage({
  src,
  alt,
  priority,
  className,
  onErrorFallback,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  onErrorFallback?: React.ReactNode;
}) {
  const [failed, setFailed] = React.useState(false);
  if (failed) return <>{onErrorFallback ?? null}</>;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
