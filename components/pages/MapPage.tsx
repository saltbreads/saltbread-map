"use client";

import NaverMapView from "@/components/features/map/NaverMapView";
import { Sidebar } from "../shared/layout/Sidebar";
import { useUserLocationLabel } from "@/lib/hooks/useUserLocationLabel";

export default function MapPage() {
  const locationLabel = useUserLocationLabel();

  return (
    <main className="h-dvh w-dvw flex">
      <Sidebar locationLabel={locationLabel} />
      <div className="flex-1 min-w-0">
        <NaverMapView />
      </div>
    </main>
  );
}
