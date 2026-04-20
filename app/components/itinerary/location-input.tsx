"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, MagnifyingGlass, CircleNotch, Sparkle, Globe, Compass, CaretRight } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LocationSuggestion {
  name: string;
  city?: string;
  country: string;
  lat: number;
  lng: number;
  image?: string;
  isFeatured?: boolean;
}

interface LocationInputProps {
  defaultValue?: string;
  onSelect?: (location: LocationSuggestion) => void;
  disabled?: boolean;
}

const FEATURED_DESTINATIONS: LocationSuggestion[] = [
  {
    name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, isFeatured: true,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "Beijing", country: "China", lat: 39.9042, lng: 116.4074, isFeatured: true,
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Bali", country: "Indonesia", lat: -8.3405, lng: 115.092, isFeatured: true,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "New York", country: "USA", lat: 40.7128, lng: -74.006, isFeatured: true,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, isFeatured: true,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "Santorini", country: "Greece", lat: 36.3932, lng: 25.4615, isFeatured: true,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=200&h=200&auto=format&fit=crop"
  },
];

export default function LocationInput({ defaultValue = "", onSelect, disabled }: LocationInputProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const skipSearch = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();

        const results = data.features.map((f: any) => ({
          name: f.properties.name || f.properties.city || f.properties.state,
          city: f.properties.city,
          country: f.properties.country,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
        })).filter((s: any) => s.name);

        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (s: LocationSuggestion) => {
    const fullName = s.isFeatured ? `${s.name}, ${s.country}` : `${s.name}${s.city ? `, ${s.city}` : ""}, ${s.country}`;
    skipSearch.current = true;
    setQuery(fullName);
    setSuggestions([]);
    setIsOpen(false);
    onSelect?.(s);
  };

  const showFeatured = isOpen && query.length === 0;
  const showResults = isOpen && suggestions.length > 0;

  return (
    <div className="relative group" ref={containerRef}>
      <div className="relative">
        <MapPin className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors z-10",
          isOpen ? "text-primary" : "text-muted-foreground group-focus-within:text-primary"
        )} />
        <Input
          id="destination"
          name="destination"
          placeholder="Explore a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
          className="pl-12 h-14 bg-accent/20 border-border/50 focus:bg-accent/40 focus:ring-1 focus:ring-primary/20 transition-all rounded-2xl placeholder:text-muted-foreground/50 shadow-sm"
          required
          disabled={disabled}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <CircleNotch className="w-4 h-4 text-primary animate-spin" />
          </div>
        )}
      </div>

      {(showFeatured || showResults) && (
        <div className="absolute top-full left-0 w-full mt-4 bg-background/60 border border-white/10 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] z-50 overflow-hidden backdrop-blur-3xl backdrop-saturate-[1.8] animate-in fade-in zoom-in-95 duration-500 origin-top">

          {showFeatured && (
            <div className="py-4">
              <div className="px-5 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Sparkle className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/80">
                    Hot Destinations
                  </span>
                </div>
                <div className="h-px bg-border/40 flex-1 ml-6" />
              </div>

              <div className="flex gap-3 overflow-x-auto px-5 pb-2 no-scrollbar scroll-smooth">
                {FEATURED_DESTINATIONS.map((s, i) => (
                  <button
                    key={`featured-${i}`}
                    type="button"
                    className="flex-shrink-0 md:w-[65px] group/card text-left outline-none"
                    onClick={() => handleSelect(s)}
                  >
                    <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden mb-2 shadow-md group-hover/card:shadow-xl transition-all duration-500 group-hover/card:-translate-y-1 border border-white/5">
                      <img
                        src={s.image}
                        alt={s.name}
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1488646016282-440158ce567d?q=80&w=400&auto=format&fit=crop";
                          e.currentTarget.className = e.currentTarget.className + " opacity-50";
                        }}
                        className="w-full h-full object-cover grayscale-[0.3] group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/card:opacity-60 transition-opacity" />
                      <div className="absolute bottom-2 left-2.5 right-2.5">
                        <p className="text-white font-bold text-[11px] tracking-tight leading-tight">{s.name}</p>
                        <p className="text-white/60 text-[8px] uppercase font-black tracking-widest mt-0.5">{s.country}</p>
                      </div>
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 shadow-sm">
                        <span className="text-xs">
                          {s.name === "Tokyo" ? "🗼" :
                            s.name === "Beijing" ? "🏯" :
                              s.name === "Bali" ? "🏝️" :
                                s.name === "New York" ? "🗽" :
                                  s.name === "Rome" ? "🏛️" : "⛪"}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                <div className="flex-shrink-0 w-1" />
              </div>
            </div>
          )}

          {showResults && (
            <div className="py-2">
              <div className="px-5 py-2 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs">🌏</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Search Results</span>
                </div>
                <div className="h-px bg-border/20 flex-1 ml-4" />
              </div>

              <div className="px-2 pb-2">
                {suggestions.map((s, i) => {
                  const isAirport = s.name.toLowerCase().includes("airport");
                  const isStation = s.name.toLowerCase().includes("station") || s.name.toLowerCase().includes("terminus");

                  return (
                    <button
                      key={`result-${i}`}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-primary/[0.04] rounded-2xl transition-all duration-200 flex items-center gap-4 group/row"
                      onClick={() => handleSelect(s)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/30 flex items-center justify-center shrink-0 group-hover/row:bg-primary/10 group-hover/row:scale-110 transition-all border border-border/10 shadow-sm text-lg">
                        {isAirport ? "🛫" : isStation ? "🚉" : "📍"}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-bold text-foreground leading-tight truncate group-hover/row:text-primary transition-colors">
                          {s.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">
                            {s.city ? `${s.city}` : s.country}
                          </span>
                          {s.city && (
                            <>
                              <div className="w-1 h-1 rounded-full bg-border" />
                              <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest font-medium">
                                {s.country}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <CaretRight className="w-4 h-4 text-muted-foreground/0 group-hover/row:text-muted-foreground/40 group-hover/row:translate-x-1 transition-all mr-2" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
