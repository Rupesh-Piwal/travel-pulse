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
import { DashboardHeader } from "@/components/dashboard/page-header";

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

const VIBE_COLORS: Record<string, { bg: string; text: string }> = {
  ADVENTURE: { bg: "bg-red-500/10", text: "text-red-500" },
  CULTURAL: { bg: "bg-purple-500/10", text: "text-purple-500" },
  RELAXATION: { bg: "bg-teal-500/10", text: "text-teal-500" },
  ROMANTIC: { bg: "bg-pink-500/10", text: "text-pink-500" },
  PARTY: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
  FOODIE: { bg: "bg-orange-500/10", text: "text-orange-500" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DONE: { label: "Ready", color: "bg-emerald-500" },
  QUEUED: { label: "Queued", color: "bg-yellow-500" },
  PROCESSING: { label: "Generating", color: "bg-blue-500 animate-pulse" },
  FAILED: { label: "Failed", color: "bg-red-500" },
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
    <div className="max-w-5xl space-y-10">
      <DashboardHeader 
        title="Trip History" 
        subtitle="Every adventure you've planned, all in one place."
      >
        <Link href="/dashboard/itinerary/new">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-6 h-12 gap-2 shadow-lg shadow-orange-950/20 font-bold transition-transform active:scale-95">
            <Airplane className="w-4 h-4" />
            Plan New Trip
          </Button>
        </Link>
      </DashboardHeader>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <Card className="bg-card/40 backdrop-blur-sm border-border/50 p-5 rounded-[2rem]">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Total Trips
          </p>
          <p className="text-3xl font-black">{initialItineraries.length}</p>
        </Card>
        <Card className="bg-card/40 backdrop-blur-sm border-border/50 p-5 rounded-[2rem]">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Destinations
          </p>
          <p className="text-3xl font-black">
            {new Set(initialItineraries.map((i) => i.destination)).size}
          </p>
        </Card>
        <Card className="bg-card/40 backdrop-blur-sm border-border/50 p-5 rounded-[2rem]">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Total Days
          </p>
          <p className="text-3xl font-black">
            {initialItineraries.reduce((sum, i) => sum + i.days, 0)}
          </p>
        </Card>
        <Card className="bg-card/40 backdrop-blur-sm border-border/50 p-5 rounded-[2rem]">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Vibes Explored
          </p>
          <p className="text-3xl font-black">{vibes.length}</p>
        </Card>
      </motion.div>

      {/* Search + Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-accent/30 border border-border/50 text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filterVibe === null ? "default" : "outline"}
            onClick={() => setFilterVibe(null)}
            className={`rounded-2xl h-12 px-4 text-xs font-bold uppercase tracking-wider transition-all ${
              filterVibe === null
                ? "bg-foreground text-background"
                : "border-border/50"
            }`}
          >
            <Funnel className="w-3.5 h-3.5 mr-1.5" />
            All
          </Button>
          {vibes.map((vibe) => {
            const colors = VIBE_COLORS[vibe] || {
              bg: "bg-accent",
              text: "text-foreground",
            };
            return (
              <Button
                key={vibe}
                variant="outline"
                onClick={() =>
                  setFilterVibe((prev) => (prev === vibe ? null : vibe))
                }
                className={`rounded-2xl h-12 px-4 text-xs font-bold uppercase tracking-wider border-border/50 transition-all ${
                  filterVibe === vibe
                    ? `${colors.bg} ${colors.text} border-current`
                    : ""
                }`}
              >
                {vibe}
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* Itinerary List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-dashed border-2 border-border/50 bg-accent/5 p-16 flex flex-col items-center justify-center text-center gap-6 rounded-[2rem]">
            <div className="w-20 h-20 rounded-3xl bg-orange-600/10 flex items-center justify-center">
              <Globe className="w-10 h-10 text-orange-500" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-2xl font-bold tracking-tight">
                {searchQuery || filterVibe
                  ? "No matching trips"
                  : "No trips yet"}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {searchQuery || filterVibe
                  ? "Try adjusting your search or filters."
                  : "Plan your first adventure and it will appear here."}
              </p>
            </div>
            {!searchQuery && !filterVibe && (
              <Link href="/dashboard/itinerary/new">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-8 h-12 gap-2 shadow-lg shadow-orange-950/20 font-bold">
                  <Airplane className="w-4 h-4" />
                  Plan Your First Trip
                </Button>
              </Link>
            )}
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => {
              const status =
                STATUS_CONFIG[item.status] || STATUS_CONFIG.DONE;
              const vibeColors = VIBE_COLORS[item.vibe] || {
                bg: "bg-accent",
                text: "text-foreground",
              };

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{
                    delay: idx * 0.04,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  <Link href={`/dashboard/itinerary/${item.id}`}>
                    <Card className="group border-border/50 bg-card/40 backdrop-blur-sm rounded-[2rem] p-6 hover:border-orange-500/30 hover:shadow-[0_20px_50px_-15px_rgba(234,88,12,0.12)] transition-all duration-300 cursor-pointer">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-orange-600/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-6 h-6 text-orange-500" />
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-bold tracking-tight group-hover:text-orange-500 transition-colors">
                                {item.destination}
                              </h3>
                              <div className="flex items-center gap-1.5">
                                <div
                                  className={`w-2 h-2 rounded-full ${status.color}`}
                                />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                  {status.label}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                              <span className="flex items-center gap-1.5">
                                <CalendarBlank className="w-3 h-3" />
                                {item.days} days
                              </span>
                              <Badge
                                className={`${vibeColors.bg} ${vibeColors.text} border-none text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5`}
                              >
                                <Sparkle className="w-2.5 h-2.5 mr-1" />
                                {item.vibe}
                              </Badge>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3" />
                                {formatRelativeDate(new Date(item.createdAt))}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            className="rounded-2xl gap-2 text-muted-foreground group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-all px-5 h-10 font-bold text-xs uppercase tracking-wider"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
