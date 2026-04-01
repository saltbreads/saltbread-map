import { useEffect, useState } from "react";

/**
 * 브라우저 geolocation API를 사용해 현재 위치를 자동으로 가져오는 React 훅
 * - 컴포넌트 마운트 시 위치 요청이 1회 실행됨
 * - 위치 좌표, 로딩 상태, 에러 상태를 함께 관리
 * - UI에서 상태 기반 렌더링에 사용됨
 * - 수동 트리거(버튼 클릭)에는 적합하지 않음
 */

export enum LocationErrorType {
  UNSUPPORTED = "UNSUPPORTED",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  POSITION_UNAVAILABLE = "POSITION_UNAVAILABLE",
  TIMEOUT = "TIMEOUT",
  UNKNOWN = "UNKNOWN",
}

export type MyLocation = {
  lat: number;
  lng: number;
};

export type UseMyLocationResult = {
  location: MyLocation | null;
  isLoading: boolean;
  error: LocationErrorType | null;
};

export function useMyLocation(): UseMyLocationResult {
  const [location, setLocation] = useState<MyLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<LocationErrorType | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(LocationErrorType.UNSUPPORTED);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(LocationErrorType.PERMISSION_DENIED);
            break;
          case err.POSITION_UNAVAILABLE:
            setError(LocationErrorType.POSITION_UNAVAILABLE);
            break;
          case err.TIMEOUT:
            setError(LocationErrorType.TIMEOUT);
            break;
          default:
            setError(LocationErrorType.UNKNOWN);
        }
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60_000,
      }
    );
  }, []);

  return { location, isLoading, error };
}
