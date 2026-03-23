import { create } from "zustand";

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
