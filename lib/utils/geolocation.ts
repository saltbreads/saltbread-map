import { MyLocation } from "../hooks/useMyLocation";
import { LocationErrorType } from "../hooks/useMyLocation";

/**
 * 브라우저 geolocation API를 Promise 형태로 감싼 위치 조회 함수
 * - 호출 시점에 현재 위치를 비동기로 가져옴
 * - 버튼 클릭 등 사용자 액션 기반 실행에 적합
 * - 성공 시 좌표(lat, lng)를 반환하고, 실패 시 에러를 throw
 * - React 상태에 의존하지 않는 순수 실행 함수
 */

export async function getMyLocation(): Promise<MyLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(LocationErrorType.UNSUPPORTED);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject(LocationErrorType.PERMISSION_DENIED);
            break;
          case err.POSITION_UNAVAILABLE:
            reject(LocationErrorType.POSITION_UNAVAILABLE);
            break;
          case err.TIMEOUT:
            reject(LocationErrorType.TIMEOUT);
            break;
          default:
            reject(LocationErrorType.UNKNOWN);
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60_000,
      }
    );
  });
}
