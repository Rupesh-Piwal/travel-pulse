"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CalendarBlank,
  Sparkle,
  Clock,
  ArrowRight,
  MagnifyingGlass,
  Funnel,
  Globe,
  Airplane,
  Eye,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Itinerary {
  id: string;
  destination: string;
  days: number;
  budget: string;
  vibe: string;
  status: string;
  createdAt: Date;
  lastUsedAt: Date | null;
}

interface HistoryClientProps {
  initialItineraries: Itinerary[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DONE: { label: "Ready", color: "text-[#C4632C] border-[#C4632C]" },
  QUEUED: { label: "Queued", color: " text-amber-500 border-amber-500" },
  PROCESSING: { label: "Generating", color: "text-[#C4632C] border-[#C4632C] animate-pulse" },
  FAILED: { label: "Failed", color: "text-red-500 border-red-500" },
};

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export default function HistoryClient({ initialItineraries }: HistoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVibe, setFilterVibe] = useState<string | null>(null);

  const vibes = [...new Set(initialItineraries.map((i) => i.vibe))];

  const filtered = initialItineraries.filter((item) => {
    const matchesSearch = item.destination
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesVibe = !filterVibe || item.vibe === filterVibe;
    return matchesSearch && matchesVibe;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full max-w-[900px] mx-auto px-4 lg:px-0 overflow-hidden">

      {/* Static Top Section */}
      <div className="flex-none pt-2">
        {/* Header Section */}
        <header className="mb-6 text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 tracking-tight leading-tight">
            Trip History
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5 font-medium">
            Every adventure you've planned, all in one place.
          </p>
        </header>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {[
            { label: "Total Trips", value: initialItineraries.length },
            { label: "Destinations", value: new Set(initialItineraries.map((i) => i.destination)).size },
            { label: "Total Days", value: initialItineraries.reduce((sum, i) => sum + i.days, 0) },
            { label: "Vibes", value: vibes.length },
          ].map((stat, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-xl border border-zinc-200/60 rounded-[16px] p-4 shadow-sm">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold text-zinc-900 tracking-tight">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-[14px] bg-white border border-zinc-200/80 text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C4632C]/10 focus:border-[#C4632C]/30 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <Button
              variant="ghost"
              onClick={() => setFilterVibe(null)}
              className={cn(
                "h-11 px-4 rounded-[14px] text-xs font-bold uppercase tracking-widest transition-all",
                filterVibe === null
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-white border border-zinc-200/80 text-zinc-500 hover:bg-zinc-50"
              )}
            >
              All
            </Button>
            {vibes.map((vibe) => (
              <Button
                key={vibe}
                variant="ghost"
                onClick={() => setFilterVibe((prev) => (prev === vibe ? null : vibe))}
                className={cn(
                  "h-11 px-4 rounded-[14px] text-xs font-semibold uppercase tracking-widest transition-all",
                  filterVibe === vibe
                    ? "bg-gradient-to-r from-[#C4632C] to-[#D47037] text-white shadow-sm"
                    : "bg-white border border-zinc-200/80 text-zinc-500 hover:bg-zinc-50"
                )}
              >
                {vibe}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Itinerary List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-2xl border-2 border-dashed border-zinc-200 rounded-3xl p-16 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center mb-4">
                  <Globe className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-xl font-serif text-zinc-900 mb-1">No trips found</h3>
                <p className="text-zinc-500 text-sm max-w-[240px]">
                  {searchQuery || filterVibe ? "Try adjusting your filters." : "Plan your first adventure today."}
                </p>
                {!searchQuery && !filterVibe && (
                  <Link href="/dashboard/itinerary/new" className="mt-6">
                    <Button className="bg-gradient-to-r from-[#C4632C] to-[#D47037] text-white rounded-[14px] px-6 h-11 font-bold text-xs uppercase tracking-widest shadow-sm">
                      Plan New Trip
                    </Button>
                  </Link>
                )}
              </motion.div>
            ) : (
              filtered.map((item, idx) => {
                const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.DONE;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Link href={`/dashboard/itinerary/${item.id}`}>
                      <div className="group bg-white/80 backdrop-blur-2xl border border-zinc-200/60 rounded-[20px] p-5 hover:border-[#C4632C]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all cursor-pointer">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[14px] bg-zinc-50 flex items-center justify-center group-hover:bg-[#C4632C]/5 transition-colors">
                              <MapPin weight="fill" className="w-5 h-5 text-zinc-400 group-hover:text-[#C4632C] transition-colors" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2.5">
                                <h3 className="text-[15px] font-semibold text-zinc-900 tracking-tight">{item.destination}</h3>
                                <div className={cn("px-2 py-0.5 rounded-md border text-[9px] font-semibold uppercase tracking-widest shadow-sm", status.color)}>
                                  {status.label}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-semibold uppercase tracking-widest">
                                <span className="flex items-center gap-1">
                                  <CalendarBlank className="w-3 h-3" />
                                  {item.days} Days
                                </span>
                                <span className="text-zinc-200">•</span>
                                <span className="flex items-center gap-1 text-[#C4632C]">
                                  <Sparkle weight="fill" className="w-3 h-3" />
                                  {item.vibe}
                                </span>
                                <span className="text-zinc-200">•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatRelativeDate(new Date(item.createdAt))}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="hidden sm:flex items-center gap-2 text-[#C4632C] font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                            <span>View trip</span>
                            <ArrowRight weight="bold" className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}

