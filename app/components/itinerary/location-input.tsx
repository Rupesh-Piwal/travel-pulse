"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LocationSuggestion {
  name: string;
  city?: string;
  country: string;
  lat: number;
  lng: number;
}

interface LocationInputProps {
  defaultValue?: string;
  onSelect?: (location: LocationSuggestion) => void;
  disabled?: boolean;
}

export default function LocationInput({ defaultValue = "", onSelect, disabled }: LocationInputProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const fullName = `${s.name}${s.city ? `, ${s.city}` : ""}, ${s.country}`;
    setQuery(fullName);
    setSuggestions([]);
    setIsOpen(false);
    onSelect?.(s);
  };

  return (
    <div className="relative group" ref={containerRef}>
      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
      <Input
        id="destination"
        name="destination"
        placeholder="Santorini, Greece"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 3 && setSuggestions.length > 0 && setIsOpen(true)}
        autoComplete="off"
        className="pl-12 h-14 bg-accent/20 border-border/50 focus:bg-accent/40 transition-all rounded-2xl"
        required
        disabled={disabled}
      />

      {isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-popover border border-border/50 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left px-5 py-4 hover:bg-accent/50 transition-colors flex items-center gap-3 border-b border-border/10 last:border-0"
              onClick={() => handleSelect(s)}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Search className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground leading-tight">{s.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-0.5">
                  {s.city ? `${s.city}, ` : ""}{s.country}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
