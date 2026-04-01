import { create } from "zustand";

/**
 * 사용자가 선택한 가게와 상세 패널 상태를 관리하는 store
 * - 선택된 가게 정보(selectedShop) 저장
 * - 상세 패널 열림/닫힘 상태 관리
 * - 가게 선택 시 상세 패널을 함께 열도록 처리
 * - 지도 center나 위치 정보는 관리하지 않음 (MapStore / LocationStore 책임)
 */

type SelectedShop = {
  id: string;
  lat: number;
  lng: number;
  name: string;
};

type SelectedShopStore = {
  selectedShop: SelectedShop | null;
  isSidePanelOpen: boolean;
  openShopDetail: (shop: SelectedShop) => void;
  closeShopDetail: () => void;
};

export const useSelectedShopStore = create<SelectedShopStore>((set) => ({
  selectedShop: null,
  isSidePanelOpen: false,

  openShopDetail: (shop) =>
    set({
      selectedShop: shop,
      isSidePanelOpen: true,
    }),

  closeShopDetail: () =>
    set({
      selectedShop: null,
      isSidePanelOpen: false,
    }),
}));
