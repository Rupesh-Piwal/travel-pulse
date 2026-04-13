"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the map component with SSR disabled.
// Leaflet uses the window object which is undefined on the server.
const MapComponent = dynamic(() => import("./itinerary-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-accent/20 rounded-3xl border border-border/50">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-4" />
      <p className="text-muted-foreground text-sm font-medium">Loading interactive map...</p>
    </div>
  ),
});

export default function MapWrapper({ days }: { days: any[] }) {
  return <MapComponent days={days} />;
}
