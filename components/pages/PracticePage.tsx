import NaverMapView2 from "@/components/map/NaverMapView2";
import { Sidebar } from "../layout/Sidebar";

export default function PracticePage() {
  return (
    <main className="h-dvh w-dvw flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <NaverMapView2 />
      </div>
    </main>
  );
}
