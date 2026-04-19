import { create } from "zustand";

export type BottomSheetStage = 1 | 2 | 3;

type BottomSheetStageState = {
  stage: BottomSheetStage;
  setStage: (stage: BottomSheetStage) => void;
};

export const useBottomSheetStageStore = create<BottomSheetStageState>(
  (set) => ({
    // 기본은 최소 높이
    stage: 1,
    setStage: (stage) => set({ stage }),
  })
);
