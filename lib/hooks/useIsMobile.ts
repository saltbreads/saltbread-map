"use client";

import * as React from "react";

/**
 * 현재 뷰포트가 모바일인지 판단
 * - Tailwind md 기준(768px)과 동일하게 맞춤
 * - CSS 숨김이 아니라 컴포넌트 자체를 렌더 분기하기 위해 사용
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const update = (matches: boolean) => {
      setIsMobile(matches);
    };

    // 최초 1회 현재 상태 반영
    update(mediaQuery.matches);

    // 브라우저 크기 변경 대응
    const handleChange = (event: MediaQueryListEvent) => {
      update(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [breakpoint]);

  return isMobile;
}
