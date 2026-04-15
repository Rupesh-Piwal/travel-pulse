"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { Clock } from "lucide-react";

interface Activity {
  title: string;
  description: string;
  image: string | null;
  lat: number;
  lng: number;
  timeOfDay: "Morning" | "Afternoon" | "Evening";
}

interface Day {
  day: number;
  title: string;
  activities: Activity[];
}

/**
 * Robustly validates if a coordinate is a valid, non-zero finite number.
 */
const isValidCoord = (val: any): boolean => {
  if (val === null || val === undefined || val === "") return false;
  const n = Number(val);
  return Number.isFinite(n) && n !== 0;
};

const createCustomIcon = (dayNumber: number, isActive: boolean) => {
  const size = isActive ? 40 : 32;
  const bg = isActive ? "bg-orange-500" : "bg-orange-600";
  const ring = isActive ? "ring-4 ring-orange-400/40" : "";
  const scale = isActive ? "scale-110" : "";

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div class="flex items-center justify-center w-[${size}px] h-[${size}px] rounded-full ${bg} ${ring} ${scale} border-[3px] border-background text-white font-bold text-sm shadow-xl transition-all duration-500 origin-bottom">${dayNumber}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

function FlyToDay({ days, activeDay }: { days: Day[]; activeDay: number | null }) {
  const map = useMap();

  useEffect(() => {
    if (activeDay === null) return;

    const day = days.find((d) => d.day === activeDay);
    if (!day || !day.activities) return;

    const validActivities = day.activities.filter(
      (a) => isValidCoord(a.lat) && isValidCoord(a.lng)
    );

    if (validActivities.length === 0) return;

    try {
      if (validActivities.length === 1) {
        const lat = Number(validActivities[0].lat);
        const lng = Number(validActivities[0].lng);
        map.flyTo([lat, lng], 14, { duration: 1.2 });
      } else {
        const coords = validActivities.map((a) => [Number(a.lat), Number(a.lng)] as [number, number]);
        const bounds = L.latLngBounds(coords);
        if (bounds.isValid()) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          if (isValidCoord(ne.lat) && isValidCoord(ne.lng) && isValidCoord(sw.lat) && isValidCoord(sw.lng)) {
            map.flyToBounds(bounds, { padding: [60, 60], duration: 1.2 });
          }
        }
      }
    } catch (e) {
      // Intentionally silent or minimal log
    }
  }, [activeDay, days, map]);

  return null;
}

function BoundUpdater({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  const hasInitialized = useRef(false);

  useEffect(() => {
    try {
      if (!hasInitialized.current && bounds && bounds.isValid()) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        if (isValidCoord(ne.lat) && isValidCoord(ne.lng) && isValidCoord(sw.lat) && isValidCoord(sw.lng)) {
          map.fitBounds(bounds, { padding: [50, 50] });
          hasInitialized.current = true;
        }
      }
    } catch (e) {}
  }, [map, bounds]);

  return null;
}

export default function ItineraryMap({
  days,
  activeDay,
}: {
  days: Day[];
  activeDay: number | null;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-accent/20 animate-pulse rounded-3xl" />;

  const activitiesWithDays = days.flatMap((day) =>
    (day.activities || []).map((activity) => ({ ...activity, dayNumber: day.day }))
  );

  const validActivities = activitiesWithDays.filter(
    (a) => isValidCoord(a.lat) && isValidCoord(a.lng)
  );

  const coords = validActivities.map((a) => [Number(a.lat), Number(a.lng)] as [number, number]);
  const bounds = coords.length > 0 ? L.latLngBounds(coords) : null;

  const defaultCenter: [number, number] =
    validActivities.length > 0 && isValidCoord(validActivities[0].lat) && isValidCoord(validActivities[0].lng)
      ? [Number(validActivities[0].lat), Number(validActivities[0].lng)]
      : [48.8566, 2.3522];

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden relative border border-border/50">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="w-full h-full z-10"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {bounds && (
          <BoundUpdater bounds={bounds} />
        )}

        <FlyToDay days={days} activeDay={activeDay} />

        {validActivities.map((activity, idx) => (
          <Marker
            key={idx}
            position={[Number(activity.lat), Number(activity.lng)]}
            icon={createCustomIcon(activity.dayNumber, activeDay === activity.dayNumber)}
          >
            <Popup className="premium-popup">
              <div className="p-1 min-w-[200px]">
                {activity.image && (
                  <div className="w-full h-24 rounded-lg overflow-hidden mb-3">
                    <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h4 className="font-semibold text-sm mb-1">{activity.title}</h4>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {activity.timeOfDay} (Day {activity.dayNumber})
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-popup-content-wrapper { background-color: hsl(var(--card)); color: hsl(var(--card-foreground)); border: 1px solid hsl(var(--border) / 0.5); border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); }
        .leaflet-popup-tip { background-color: hsl(var(--card)); border: 1px solid hsl(var(--border) / 0.5); }
        .leaflet-popup-close-button { color: hsl(var(--muted-foreground)) !important; }
        .leaflet-container { font-family: inherit; }
        .custom-leaflet-marker { background: transparent; border: none; }
      `}} />
    </div>
  );
}

