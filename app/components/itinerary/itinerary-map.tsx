"use client";

import { useEffect, useState } from "react";
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

const createCustomIcon = (dayNumber: number) => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 border-[3px] border-background text-white font-bold text-sm shadow-xl hover:scale-110 transition-transform origin-bottom">${dayNumber}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

function BoundUpdater({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);
  return null;
}

export default function ItineraryMap({ days }: { days: Day[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Leaflet's L icon path fix gets messy when SSR happens, so we fix the default icon issue just in case
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
    day.activities.map((activity) => ({ ...activity, dayNumber: day.day }))
  );

  // Filter out any activities without valid lat/lng before creating bounds
  const validActivities = activitiesWithDays.filter(a => typeof a.lat === 'number' && typeof a.lng === 'number');
  
  const bounds = L.latLngBounds(validActivities.map((a) => [a.lat, a.lng] as [number, number]));

  const defaultCenter: [number, number] = validActivities.length > 0 
    ? [validActivities[0].lat, validActivities[0].lng] 
    : [48.8566, 2.3522]; // fallback to Paris

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
        {validActivities.length > 0 && bounds.isValid() && <BoundUpdater bounds={bounds} />}
        
        {validActivities.map((activity, idx) => (
          <Marker
            key={idx}
            position={[activity.lat, activity.lng]}
            icon={createCustomIcon(activity.dayNumber)}
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
      
      {/* Global styles for Leaflet popups inside Next.js */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper {
          background-color: hsl(var(--card));
          color: hsl(var(--card-foreground));
          border: 1px solid hsl(var(--border) / 0.5);
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        }
        .leaflet-popup-tip {
          background-color: hsl(var(--card));
          border: 1px solid hsl(var(--border) / 0.5);
        }
        .leaflet-popup-close-button {
          color: hsl(var(--muted-foreground)) !important;
        }
        .leaflet-container {
          font-family: inherit;
        }
        .custom-leaflet-marker {
          background: transparent;
          border: none;
        }
      `}} />
    </div>
  );
}
