import { create } from "zustand";

/**
 * 클러스터 클릭으로 선택된 가게 목록을 관리하는 store
 * - 클러스터 내부에 포함된 가게 목록(clusterShops) 저장
 * - 클러스터 리스트 열림/닫힘 상태를 함께 관리
 * - 클러스터 클릭 시 리스트를 열고, 해제 시 리스트를 비움
 * - 선택된 가게 상세 상태는 관리하지 않음 (SelectedShopStore 책임)
 */

export type ClusterShop = {
  id: string;
  lat: number;
  lng: number;
  name: string;
};

type ClusterShopStore = {
  clusterShops: ClusterShop[];
  isClusterListOpen: boolean;
  openClusterList: (shops: ClusterShop[]) => void;
  clearClusterList: () => void;
};

export const useClusterShopStore = create<ClusterShopStore>((set) => ({
  clusterShops: [],
  isClusterListOpen: false,

  openClusterList: (shops) =>
    set({
      clusterShops: shops,
      isClusterListOpen: true,
    }),

  clearClusterList: () =>
    set({
      clusterShops: [],
      isClusterListOpen: false,
    }),
}));
