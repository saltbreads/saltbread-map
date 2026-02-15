import { create } from "zustand";
import { DEFAULT_LOCATION } from "@/lib/constants/location";

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
