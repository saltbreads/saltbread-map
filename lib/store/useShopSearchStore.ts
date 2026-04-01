import { create } from "zustand";

/**
 * 가게 검색 조건과 페이지네이션 상태를 관리하는 store
 * - 검색어(search), 반경(radiusKm), 페이지(limit/offset) 상태 저장
 * - 검색어 및 조건 변경 시 목록 조회 기준으로 사용됨
 * - resetPaging으로 검색 변경 시 offset 초기화 처리
 * - 실제 데이터 조회나 지도 center 변경은 다른 store에서 처리
 */

type ShopSearchState = {
  search: string;
  radiusKm: number;
  limit: number;
  offset: number;

  setSearch: (v: string) => void;
  setRadiusKm: (v: number) => void;
  setLimit: (v: number) => void;
  setOffset: (v: number) => void;

  resetPaging: () => void;
};

export const useShopSearchStore = create<ShopSearchState>((set) => ({
  search: "",
  radiusKm: 50,
  limit: 10,
  offset: 0,

  setSearch: (v) => set({ search: v }),
  setRadiusKm: (v) => set({ radiusKm: v }),
  setLimit: (v) => set({ limit: v }),
  setOffset: (v) => set({ offset: v }),

  resetPaging: () => set({ offset: 0 }),
}));
