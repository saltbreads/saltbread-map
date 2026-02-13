"use client";

import { useEffect, useRef, useState } from "react";

/**
 * reverseGeocode 응답 중 우리가 쓸 region 구조만 최소 타입 정의
 * - results[0].region.area1~area4.name 정도만 필요
 */
type ReverseGeocodeResult = {
  region?: {
    area1?: { name?: string };
    area2?: { name?: string };
    area3?: { name?: string };
    area4?: { name?: string };
  };
};

/**
 * JS SDK reverseGeocode 응답 구조(v2) 중 필요한 부분만 타입 정의
 */
type ReverseGeocodeResponse = {
  v2?: {
    results?: ReverseGeocodeResult[];
  };
};

/**
 * area 레벨(행정구역 깊이)
 * - 1: 시/도, 2: 구/군, 3: 동/읍/면, 4: 리/기타(상황에 따라)
 */
type AreaLevel = 1 | 2 | 3 | 4;

/**
 * useUserLocationLabel 옵션
 * - levels: 원하는 레벨만 선택해서 라벨 구성 (예: [2,3] → "수성구 범어동")
 * - maxLevel: 1~maxLevel 까지 자동 포함 (예: 2 → "대구광역시 수성구")
 * - separator: 구분자(기본 " ")
 * - orders: reverseGeocode 결과 타입(기본 ADDR + ROAD_ADDR)
 * - geoOptions: geolocation 옵션 커스텀
 */
type UseUserLocationLabelOptions = {
  levels?: AreaLevel[];
  maxLevel?: AreaLevel;
  separator?: string;
  orders?: Array<
    | typeof window.naver.maps.Service.OrderType.ADDR
    | typeof window.naver.maps.Service.OrderType.ROAD_ADDR
  >;
  geoOptions?: PositionOptions;
};

/**
 * 네이버 지도 SDK(window.naver)가 로드될 때까지 기다리는 유틸
 * - interval로 주기적으로 확인(polling)
 * - timeout 지나면 실패 처리
 */
function waitForNaverSdk(opts?: { intervalMs?: number; timeoutMs?: number }) {
  const intervalMs = opts?.intervalMs ?? 100;
  const timeoutMs = opts?.timeoutMs ?? 8000;

  return new Promise<void>((resolve, reject) => {
    // SSR/서버 평가 방어 (Next 환경에서 안전)
    if (typeof window === "undefined") {
      reject(new Error("WINDOW_UNDEFINED"));
      return;
    }

    // 이미 로드된 경우 즉시 resolve
    if (typeof window.naver?.maps?.Service?.reverseGeocode === "function") {
      resolve();
      return;
    }

    const startedAt = Date.now();

    const timer = window.setInterval(() => {
      // 로드 완료 조건
      if (typeof window.naver?.maps?.Service?.reverseGeocode === "function") {
        window.clearInterval(timer);
        resolve();
        return;
      }

      // 타임아웃 처리
      if (Date.now() - startedAt > timeoutMs) {
        window.clearInterval(timer);
        reject(new Error("NAVER_SDK_TIMEOUT"));
      }
    }, intervalMs);
  });
}

/**
 * reverseGeocode region(area1~area4)을 옵션에 맞춰 라벨 문자열로 변환
 *
 * 우선순위:
 * 1) options.levels 가 있으면 그 레벨만 사용
 * 2) 없으면 options.maxLevel(1~maxLevel) 사용
 * 3) 둘 다 없으면 기본 area1~area4 모두 사용
 */
function buildRegionLabel(
  region: ReverseGeocodeResult["region"],
  options?: UseUserLocationLabelOptions
) {
  const area = {
    1: region?.area1?.name,
    2: region?.area2?.name,
    3: region?.area3?.name,
    4: region?.area4?.name,
  } as const;

  const separator = options?.separator ?? " ";

  let pickedLevels: AreaLevel[] = [1, 2, 3, 4];

  // 포함할 레벨을 직접 지정하는 방식
  if (options?.levels?.length) {
    pickedLevels = options.levels;
  }
  // 1~maxLevel 까지 자동 포함
  else if (options?.maxLevel) {
    pickedLevels = [1, 2, 3, 4].filter(
      (lv) => lv <= options.maxLevel!
    ) as AreaLevel[];
  }

  // 지정한 레벨만 추출 후 합치기
  return pickedLevels
    .map((lv) => area[lv])
    .filter(Boolean)
    .join(separator);
}

/**
 * 현재 사용자 위치를 가져와
 * 네이버 JS SDK reverseGeocode로 "행정구역 라벨"을 만들어 반환하는 훅
 *
 * 반환:
 * - label: string | null
 *   (성공 시 예: "대구광역시 수성구 범어동", 실패/미지원 시 null)
 *
 * 사용 예시:
 * - const label = useUserLocationLabel(); // area1~4 전체
 * - const label = useUserLocationLabel({ maxLevel: 2 }); // "시/도 구/군"까지만
 * - const label = useUserLocationLabel({ levels: [2,3] }); // "구/군 동"만
 */
export function useUserLocationLabel(options?: UseUserLocationLabelOptions) {
  const [label, setLabel] = useState<string | null>(null);

  /**
   * 언마운트 후 setState 방지 플래그
   * - 비동기 콜백(geolocation / reverseGeocode)에서 setState 호출 방지
   */
  const canceledRef = useRef(false);

  /**
   * options 객체는 매 렌더마다 새로 만들어질 수 있어서(effect deps에 넣으면 재실행 위험)
   * - 라벨 옵션을 동적으로 바꿀 게 아니라면 deps에서 제외해도 OK
   * - 옵션을 동적으로 바꿔야 한다면: 호출부에서 useMemo로 options를 고정해주거나,
   *   아래 deps에 필요한 값만 따로 분해해서 넣는 방식 추천
   */

  useEffect(() => {
    canceledRef.current = false;

    console.log("[LocationHook] 훅 시작");

    /**
     * 메인 실행 함수
     */
    const run = async () => {
      /**
       * 1) 네이버 지도 SDK 로드 대기
       * - RootLayout에서 Script를 넣어도
       *   실제 window.naver 생성은 약간 늦을 수 있어서 여기서 기다림
       */
      try {
        console.log("[LocationHook] 네이버 SDK 로드 대기...");
        await waitForNaverSdk({ intervalMs: 100, timeoutMs: 8000 });
        console.log("[LocationHook] 네이버 SDK 로드 완료");
      } catch (e) {
        console.error("[LocationHook] 네이버 SDK 로드 실패/타임아웃", e);
        return;
      }

      /**
       * 2) 위치 API 지원 여부 확인
       */
      if (!navigator.geolocation) {
        console.warn("[LocationHook] geolocation 미지원");
        return;
      }

      /**
       * 3) 현재 위치 요청
       * - 성공 시 coords(latitude, longitude) 획득
       */
      console.log("[LocationHook] 현재 위치 요청 시작...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (canceledRef.current) {
            console.log("[LocationHook] 언마운트됨 → 위치 콜백 무시");
            return;
          }

          const { latitude, longitude } = pos.coords;
          console.log("[LocationHook] 현재 위치 좌표:", {
            latitude,
            longitude,
          });

          /**
           * JS SDK는 LatLng 객체로 coords를 전달
           */
          const latlng = new window.naver.maps.LatLng(latitude, longitude);

          /**
           * 4) reverseGeocode 호출
           * - orders를 옵션으로 받되, 기본은 ADDR + ROAD_ADDR
           */
          const orders = options?.orders ?? [
            window.naver.maps.Service.OrderType.ADDR,
            window.naver.maps.Service.OrderType.ROAD_ADDR,
          ];

          console.log("[LocationHook] reverseGeocode 호출 시작...");
          window.naver.maps.Service.reverseGeocode(
            {
              coords: latlng,
              orders: orders.join(","),
            },
            (
              status: naver.maps.Service.Status,
              response: ReverseGeocodeResponse
            ) => {
              if (canceledRef.current) {
                console.log(
                  "[LocationHook] 언마운트됨 → reverseGeocode 콜백 무시"
                );
                return;
              }

              /**
               * 5) 성공/실패 판단
               */
              if (status !== window.naver.maps.Service.Status.OK) {
                console.error("[LocationHook] reverseGeocode 실패:", status);
                return;
              }

              console.log(
                "[LocationHook] reverseGeocode raw response:",
                response
              );

              /**
               * 6) 결과 파싱
               * - v2.results[0].region 에서 area1~4 추출
               */
              const region = response.v2?.results?.[0]?.region;
              if (!region) {
                console.warn("[LocationHook] region 없음");
                return;
              }

              /**
               * 옵션에 따라 필요한 구역만 라벨로 구성
               * - levels/maxLevel/기본 전체
               */
              const regionLabel = buildRegionLabel(region, options);

              console.log("[LocationHook] 파싱된 지역 라벨:", regionLabel);

              /**
               * 7) 상태 업데이트
               */
              if (regionLabel) {
                setLabel(regionLabel);
              } else {
                console.warn("[LocationHook] 라벨 파싱 실패(빈 문자열)");
              }
            }
          );
        },
        (error) => {
          console.error("[LocationHook] 위치 요청 실패:", error);
        },
        options?.geoOptions ?? {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 60_000,
        }
      );
    };

    run();

    /**
     * cleanup: 언마운트 시 콜백에서 setState 방지
     */
    return () => {
      canceledRef.current = true;
      console.log("[LocationHook] cleanup 실행");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 한 번만 실행(초기 위치 라벨 용도)

  return label;
}
