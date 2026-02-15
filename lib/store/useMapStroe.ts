import { create } from "zustand";
import { DEFAULT_LOCATION, type LatLng } from "@/lib/constants/location";
// center가 어디 액션으로 바뀌었는지(디버깅/UX에 도움)
export type CenterSource =
  | "default"
  | "myLocation"
  | "shopClick"
  | "mapDrag"
  | "searchHere";

// 기본 위치(동대구역) 상수
// - center / label 초기값에 함께 사용

type MapState = {
  // 현재 지도/리스트의 기준 좌표
  // - Sidebar(리스트)와 MapView(지도)는 항상 이 center를 기준으로 동작
  center: LatLng;

  // 현재 center가 어디서 왔는지
  // - 로그/디버깅/UX(예: "내 위치" 표시)에 사용 가능
  source: CenterSource;

  // 현재 center 좌표의 지역 라벨(예: "대구광역시 남구 ..." / "동대구역")
  // - reverseGeocode 성공 시 업데이트
  // - 실패/미수신 시에도 UX 안정 위해 기본값 유지 가능
  centerLabel: string;

  // 현재 선택된 가게 id (모달/하이라이트/스크롤싱크용)
  selectedShopId: string | null;

  // 지도 드래그 중 임시 중심 좌표(선택)
  // - "이 위치에서 검색" UX 만들 때 사용
  draftCenter: LatLng | null;

  // ---- actions ----

  /**
   * center만 변경(필요하면 source도 변경)
   * - label은 별도 액션으로 갱신(보통 reverseGeocode 결과로)
   */
  setCenter: (center: LatLng, source?: CenterSource) => void;

  /**
   * center + label을 한 번에 변경
   * - "내 위치로 이동" 같이 좌표와 라벨이 함께 확정되는 경우에 사용
   */
  setCenterWithLabel: (
    payload: { center: LatLng; label: string },
    source?: CenterSource
  ) => void;

  // 지역 라벨 세팅/갱신
  // - reverseGeocode 성공 시 사용
  setCenterLabel: (label: string) => void;

  // 지도 드래그 등으로 임시 center를 저장/해제
  setDraftCenter: (center: LatLng | null) => void;

  // 가게 선택/해제
  selectShop: (shopId: string | null) => void;

  // 기본 위치(동대구역)로 초기화
  resetToDefault: () => void;
};

export const useMapStore = create<MapState>((set) => ({
  // ---- state ----
  center: {
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
  },
  source: "default",
  centerLabel: DEFAULT_LOCATION.label,
  selectedShopId: null,
  draftCenter: null,

  // ---- actions ----
  setCenter: (center, source = "mapDrag") => {
    set({ center, source });
  },

  setCenterWithLabel: ({ center, label }, source = "mapDrag") => {
    set({
      center,
      centerLabel: label,
      source,
    });
  },

  setCenterLabel: (label) => {
    set({ centerLabel: label });
  },

  setDraftCenter: (center) => {
    set({ draftCenter: center });
  },

  selectShop: (shopId) => {
    set({ selectedShopId: shopId });
  },

  resetToDefault: () => {
    set({
      center: {
        lat: DEFAULT_LOCATION.lat,
        lng: DEFAULT_LOCATION.lng,
      },
      source: "default",
      centerLabel: DEFAULT_LOCATION.label,
      selectedShopId: null,
      draftCenter: null,
    });
  },
}));
