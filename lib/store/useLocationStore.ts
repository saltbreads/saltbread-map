import { create } from "zustand";
import { DEFAULT_LOCATION } from "@/lib/constants/location";

/**
 * 사용자의 현재 위치(GPS)와 관련된 상태를 관리하는 store
 * - 실제 위치 좌표(myLocation)와 라벨(myLocationLabel) 저장
 * - 위치 권한 상태 및 정확도 정보 관리
 * - 위치가 없을 경우 DEFAULT_LOCATION으로 fallback 제공
 * - 지도 center나 선택 상태는 관리하지 않음 (MapStore 책임)
 */

export type LatLng = { lat: number; lng: number };

type LocationState = {
  myLocation: LatLng | null;
  myLocationLabel: string | null;
  permission: "prompt" | "granted" | "denied" | "unknown";
  accuracyM: number | null;
  updatedAt: number | null;

  setMyLocation: (loc: LatLng, meta?: { accuracyM?: number }) => void;
  setPermission: (p: LocationState["permission"]) => void;
  setMyLocationLabel: (label: string | null) => void;
  clearMyLocation: () => void;

  getSafeLocation: () => LatLng;
};

export const useLocationStore = create<LocationState>((set, get) => ({
  myLocation: null,
  myLocationLabel: null,
  permission: "unknown",
  accuracyM: null,
  updatedAt: null,

  setMyLocation: (loc, meta) =>
    set({
      myLocation: loc,
      accuracyM: meta?.accuracyM ?? null,
      updatedAt: Date.now(),
    }),

  setPermission: (p) => set({ permission: p }),
  setMyLocationLabel: (label) => set({ myLocationLabel: label }),

  clearMyLocation: () =>
    set({
      myLocation: null,
      myLocationLabel: null,
      accuracyM: null,
      updatedAt: null,
    }),

  getSafeLocation: () => {
    const loc = get().myLocation;
    if (loc) return loc;

    return {
      lat: DEFAULT_LOCATION.lat,
      lng: DEFAULT_LOCATION.lng,
    };
  },
}));
