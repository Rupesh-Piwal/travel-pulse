"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

interface Activity {
  title: string;
  description: string;
  image: string | null;
  lat: number;
  lng: number;
  timeOfDay: "Morning" | "Afternoon" | "Evening";
  rating?: number;
  priceLevel?: string;
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

const createCustomIcon = (activity: any, isActive: boolean) => {
  const dayNumber = activity.dayNumber || 1;
  const imageUrl = typeof activity.image === 'string' ? activity.image : activity.image?.url;

  const circle = `<div class="w-11 h-11 rounded-full ${isActive ? 'bg-[#C4632C] text-white ring-4 ring-[#C4632C]/30' : 'bg-white text-navy'} border-2 border-white shadow-lg flex items-center justify-center font-bold text-[14px] relative z-10 transition-all duration-300">
    ${dayNumber}
  </div>`;

  if (!isActive) {
    return L.divIcon({
      className: "custom-leaflet-marker",
      html: `<div class="relative transition-all duration-300 hover:scale-105 rounded-full flex justify-center items-center drop-shadow-md">
        ${circle}
      </div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });
  }

  // Active State Card
  const cardHtml = `
    <div class="absolute bottom-[54px] left-1/2 -translate-x-1/2 w-[340px] h-[110px] bg-white rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-20 flex flex-row border border-navy/10 animate-in fade-in zoom-in duration-300">
      ${imageUrl ? `<div class="w-[110px] h-full shrink-0 rounded-l-[11px] overflow-hidden bg-gray-100"><img src="${imageUrl}" class="w-full h-full object-cover" alt="" /></div>` : ''}
      <div class="p-3 flex flex-col justify-center flex-1 overflow-hidden">
        <h4 class="font-semibold text-navy text-[15px] leading-tight truncate mb-1">${activity.title}</h4>
        
        <div class="flex items-center text-[13px] text-navy/70 mb-1.5 font-medium">
          <span class="text-navy mr-1.5 text-[11px]">★</span> 
          <span>${activity.rating ? activity.rating.toFixed(1) : '4.8'} <span class="mx-1">·</span> ${activity.timeOfDay}</span>
        </div>
        
        <div class="text-[13px] text-navy/50 leading-tight line-clamp-2 font-medium">
          ${activity.description}
        </div>
      </div>
      <!-- Triangle pointer -->
      <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-navy/10 -z-10 shadow-[2px_2px_4px_rgba(0,0,0,0.05)]"></div>
    </div>
  `;

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div class="relative flex flex-col items-center justify-end z-[1000] drop-shadow-xl">
      ${cardHtml}
      ${circle}
    </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
};

function FlyToActivity({ flatActivities, activeActivityIndex }: { flatActivities: any[]; activeActivityIndex: number | null }) {
  const map = useMap();

  useEffect(() => {
    if (activeActivityIndex === null || !flatActivities || flatActivities.length === 0) return;

    const activity = flatActivities[activeActivityIndex];
    if (!activity || !isValidCoord(activity.lat) || !isValidCoord(activity.lng)) return;

    try {
      const lat = Number(activity.lat);
      const lng = Number(activity.lng);
      map.flyTo([lat, lng], 15, { duration: 1.5, easeLinearity: 0.25 });
    } catch (e) {
      // Intentionally silent
    }
  }, [activeActivityIndex, flatActivities, map]);

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
    } catch (e) { }
  }, [map, bounds]);

  return null;
}

export default function ItineraryMap({
  days,
  activeDay,
  flatActivities = [],
  activeActivityIndex = null,
}: {
  days: Day[];
  activeDay: number | null;
  flatActivities?: any[];
  activeActivityIndex?: number | null;
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

  // Memoize valid activities to prevent re-filtering on every render
  const validActivities = useMemo(() => {
    const list = (flatActivities.length > 0 ? flatActivities : days.flatMap((day) =>
      (day.activities || []).map((activity) => ({ ...activity, dayNumber: day.day }))
    ));
    return list.filter((a) => isValidCoord(a.lat) && isValidCoord(a.lng));
  }, [days, flatActivities]);

  // Memoize bounds and center to prevent map flickering
  const { bounds, defaultCenter } = useMemo(() => {
    const coords = validActivities.map((a) => [Number(a.lat), Number(a.lng)] as [number, number]);
    return {
      bounds: coords.length > 0 ? L.latLngBounds(coords) : null,
      defaultCenter: validActivities.length > 0
        ? [Number(validActivities[0].lat), Number(validActivities[0].lng)] as [number, number]
        : [48.8566, 2.3522] as [number, number]
    };
  }, [validActivities]);

  if (!mounted) return <div className="h-full w-full bg-accent/20 animate-pulse rounded-3xl" />;

  return (
    <div className="w-full h-full rounded-2xl lg:rounded-none overflow-hidden relative lg:border-none">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="w-full h-full z-10"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {bounds && (
          <BoundUpdater bounds={bounds} />
        )}

        <FlyToActivity flatActivities={validActivities} activeActivityIndex={activeActivityIndex} />

        {validActivities.map((activity, idx) => (
          <Marker
            key={idx}
            position={[Number(activity.lat), Number(activity.lng)]}
            icon={createCustomIcon(activity, activeActivityIndex === idx)}
          />
        ))}
      </MapContainer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .leaflet-popup-content-wrapper { background-color: #ffffff; color: #0F1923; border: 1px solid rgba(15, 25, 35, 0.05); border-radius: 16px; box-shadow: 0 20px 40px -10px rgba(15, 25, 35, 0.1); padding: 0; }
        .leaflet-popup-content { margin: 12px; }
        .leaflet-popup-tip { background-color: #ffffff; border: 1px solid rgba(15, 25, 35, 0.05); }
        .leaflet-popup-close-button { color: #0F1923 !important; opacity: 0.3; }
        .leaflet-popup-close-button:hover { opacity: 1; }
        .leaflet-container { font-family: inherit; cursor: crosshair !important; }
        .custom-leaflet-marker { background: transparent; border: none; }
      `}} />
    </div>
  );
}

