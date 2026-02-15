import { create } from "zustand";

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
  radiusKm: 3,
  limit: 10,
  offset: 0,

  setSearch: (v) => set({ search: v }),
  setRadiusKm: (v) => set({ radiusKm: v }),
  setLimit: (v) => set({ limit: v }),
  setOffset: (v) => set({ offset: v }),

  resetPaging: () => set({ offset: 0 }),
}));
