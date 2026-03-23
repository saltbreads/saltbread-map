import { create } from "zustand";

type SelectedShopStore = {
  selectedShopId: string | null;
  isSidePanelOpen: boolean;
  openShopDetail: (shopId: string) => void;
  closeShopDetail: () => void;
};

export const useSelectedShopStore = create<SelectedShopStore>((set) => ({
  selectedShopId: null,
  isSidePanelOpen: false,

  openShopDetail: (shopId) =>
    set({
      selectedShopId: shopId,
      isSidePanelOpen: true,
    }),

  closeShopDetail: () =>
    set({
      selectedShopId: null,
      isSidePanelOpen: false,
    }),
}));
