"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Languages, Sun, ArrowRight, Download } from "lucide-react";

import MapWrapper from "@/app/components/itinerary/map-wrapper";
import ExportPdfButton from "@/app/components/itinerary/export-pdf-button";
import TripSummary from "@/app/components/itinerary/trip-summary";

// Mobile Components
import MobileHero from "./mobile/MobileHero";
import FloatingMapButton from "./mobile/FloatingMapButton";
import MapBottomSheet from "./mobile/MapBottomSheet";
import DayCard from "./mobile/DayCard";

// ─── Interfaces ────────────────────────────────────────────────

interface TravelFromPrevious {
  mode: string;
  duration: string;
  distance: string;
}

interface Activity {
  title: string;
  description: string;
  image: string | null;
  lat: number;
  lng: number;
  timeOfDay: "Morning" | "Lunchtime" | "Afternoon" | "Evening";
  category?: string;
  mealType?: string;
  cuisine?: string;
  rating?: number;
  priceLevel?: string;
  aiInsight?: string;
  address?: string;
  duration?: string;
  proTip?: string;
  travelFromPrevious?: TravelFromPrevious | null;
}

interface Day {
  day: number;
  title: string;
  summary?: string;
  estimatedCost?: string;
  activities: Activity[];
}

interface SuggestedStay {
  name: string;
  type: string;
  priceRange: string;
  neighborhood: string;
}

interface ItineraryData {
  destination: string;
  estimatedTotalExpense?: string;
  estimatedCostINR?: { min: number; max: number };
  placesCount?: number;
  totalDistanceKm?: number;
  difficulty?: string;
  days: Day[];
  travelTips?: string[];
  bestTimeToVisit?: string;
  localCurrency?: string;
  language?: string;
  suggestedStays?: SuggestedStay[];
}

interface ItineraryViewClientProps {
  itinerary: {
    id: string;
    destination: string;
    vibe: string;
    budget: string;
    days: number;
  };
  data: ItineraryData;
  heroImage: string;
}

// ─── Sticky Day Navigator (Minimal Side Dots) ──────────────────

function StickyDayNav({ days, activeScrollDay }: { days: Day[]; activeScrollDay: number | null }) {
  return (
    <AnimatePresence>
      {activeScrollDay !== null && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-1/2 left-6 -translate-y-1/2 z-[150] hidden lg:flex flex-col items-center py-8"
        >
          <div className="absolute top-0 bottom-0 w-px bg-zinc-200 left-1/2 -translate-x-1/2" />

          {days.map((day) => {
            const isActive = activeScrollDay === day.day;
            return (
              <button
                key={day.day}
                onClick={() => document.getElementById(`day-${day.day}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="relative py-5 flex items-center justify-center group outline-none"
                aria-label={`Scroll to Day ${day.day}`}
              >
                {isActive ? (
                  <motion.div
                    layoutId="active-dot"
                    className="relative z-10 w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center shadow-lg"
                  >
                    <span className="text-[12px] font-black text-white">{day.day}</span>
                  </motion.div>
                ) : (
                  <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-zinc-300 group-hover:bg-zinc-900 transition-all duration-300 group-hover:scale-125" />
                )}

                <div className="absolute left-12 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                  <span className="bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-xl block">
                    Day {day.day}
                  </span>
                </div>
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Essential Intel ───────────────────────────────────────────

function EssentialIntel({ data }: { data: ItineraryData }) {
  const hasIntel = data.language || data.bestTimeToVisit || (data.travelTips && data.travelTips.length > 0);
  if (!hasIntel) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-[16px] font-semibold uppercase tracking-[0.3em] text-[#C4632C]">Essential Intel</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      {(data.language || data.bestTimeToVisit) && (
        <div className="flex flex-wrap items-center gap-4 mb-10">
          {data.language && (
            <div className="flex items-center gap-3 bg-white rounded-[16px] px-5 py-3 border border-zinc-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#C4632C]/10 flex items-center justify-center">
                <Languages className="w-4 h-4 text-[#C4632C]" />
              </div>
              <div>
                <span className="text-[9px]  font-semibold uppercase tracking-wider text-zinc-400 block">Language</span>
                <span className="text-[11px] md:text-sm font-semibold text-zinc-900">{data.language}</span>
              </div>
            </div>
          )}
          {data.bestTimeToVisit && (
            <div className="flex items-center gap-3 bg-white rounded-[16px] px-5 py-3 border border-zinc-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-[#C4632C]/10 flex items-center justify-center">
                <Sun className="w-4 h-4 text-[#C4632C]" />
              </div>
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 block">Best Time to Visit</span>
                <span className="text-[11px] text-sm font-semibold text-zinc-900">{data.bestTimeToVisit}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {data.travelTips && data.travelTips.length > 0 && (
        <div className="space-y-4 pl-1">
          {data.travelTips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="flex items-start gap-4 group/tip"
            >
              <span className="text-2xl font-serif italic text-zinc-300 leading-none mt-0.5 group-hover/tip:text-[#C4632C] transition-colors select-none min-w-[2rem]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[14px] text-zinc-600 leading-relaxed pt-0.5 border-l-2 border-zinc-100 pl-4 group-hover/tip:border-[#C4632C] transition-colors">
                {tip}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Day Editorial Section ─────────────────────────────────────

function DaySection({ day, onActivityInView }: { day: Day; onActivityInView: (activity: Activity) => void }) {
  // Group activities by timeOfDay with explicit order
  const groups = useMemo(() => {
    const order = ["Morning", "Lunchtime", "Afternoon", "Evening"];
    const map: Record<string, Activity[]> = {};
    day.activities.forEach((a) => {
      const key = a.timeOfDay;
      if (!map[key]) map[key] = [];
      map[key].push(a);
    });
    // Sort keys based on the desired order
    const sortedEntries = Object.entries(map).sort(([a], [b]) => order.indexOf(a) - order.indexOf(b));
    return sortedEntries;
  }, [day.activities]);

  // Get images (up to 2 for the grid)
  const activityImages = day.activities.filter((a) => a.image);

  return (
    <motion.section
      id={`day-${day.day}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mb-20 scroll-mt-8"
    >
      {/* Day Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-10 bg-[#C4632C] rounded-full" />
        <h2 className="text-2xl font-sans text-zinc-900 tracking-tight">Day {day.day}</h2>
      </div>

      {/* Activity Image Grid (top 2 images) */}
      {activityImages.length > 0 && (
        <div className={`grid ${activityImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-4 mb-6`}>
          {activityImages.slice(0, 2).map((activity, idx) => (
            <div key={idx} className="group">
              <div className="aspect-video rounded-[16px] overflow-hidden bg-zinc-100 relative">
                <img
                  src={activity.image!}
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              {/* Caption */}
              <div className="mt-2.5 px-1">
                <h4 className="text-sm font-semibold text-zinc-900 truncate">{activity.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  {activity.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#C4632C] fill-orange-700/30" />
                      <span className="text-xs font-semibold text-zinc-700">{activity.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {activity.category && (
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{activity.category}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Day Summary */}
      {day.title && (
        <p className="text-lg font-semibold text-zinc-800 mb-2 mt-6">{day.title}</p>
      )}
      {day.summary && (
        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">{day.summary}</p>
      )}

      {/* Time-of-Day Sections */}
      {groups.map(([timeOfDay, activities]) => (
        <div key={timeOfDay} className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C4632C] mb-4">
            {timeOfDay}
          </h3>
          <ul className="space-y-4 pl-1">
            {activities.map((activity, idx) => (
              <ActivityBullet key={idx} activity={activity} onInView={onActivityInView} />
            ))}
          </ul>
        </div>
      ))}

      {/* Must-Trys Tags */}
      {day.activities.some((a) => a.proTip) && (
        <div className="mt-6 pt-4 border-t border-zinc-100">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C4632C] block mb-3">Must-Trys</span>
          <div className="flex flex-wrap gap-2">
            {day.activities
              .filter((a) => a.proTip)
              .map((a, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#C4632C]/30 rounded-full text-[11px] font-medium text-zinc-700 hover:border-orange-300 hover:text-orange-600 transition-colors cursor-default"
                >
                  <span className="text-[#C4632C]">✦</span>
                  {a.proTip!.length > 50 ? a.proTip!.slice(0, 50) + "…" : a.proTip}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Estimated Cost */}
      {day.estimatedCost && (
        <div className="mt-4 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          Est. daily spend: <span className="text-zinc-700">{day.estimatedCost}</span>
        </div>
      )}
    </motion.section>
  );
}

// ─── Activity Bullet Point ─────────────────────────────────────

function ActivityBullet({ activity, onInView }: { activity: Activity; onInView: (a: Activity) => void }) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onInView(activity); },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [activity, onInView]);

  return (
    <li ref={ref} className="relative pl-5 border-l-2 border-zinc-100 hover:border-orange-300 transition-colors group/item">
      <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-zinc-200 group-hover/item:bg-orange-400 transition-colors" />

      <p className="text-[13px] md:text-[14px] text-zinc-700 leading-relaxed">
        <span className="font-bold text-zinc-900">{activity.title}</span>
        {activity.address && (
          <span className="text-zinc-400"> — {activity.address}</span>
        )}
      </p>
      <p className="text-[12px] md:text-[13px] text-zinc-500 leading-relaxed mt-1">{activity.description}</p>

      {activity.aiInsight && (
        <p className="text-[10px] md:text-[12px] text-[#C4632C] font-sans mt-2 bg-[#C4632C]/10 rounded-[16px] px-3 py-1.5 inline-block">
          💡 {activity.aiInsight}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-zinc-400">
        {activity.duration && <span>⏱ {activity.duration}</span>}
        {activity.rating && (
          <span className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-[#C4632C] fill-orange-700/30" />
            {activity.rating.toFixed(1)}
          </span>
        )}
        {activity.cuisine && <span>🍽 {activity.cuisine}</span>}
        {activity.travelFromPrevious && (
          <span className="text-zinc-500 border border-zinc-300 border-dotted p-[0.5px] rounded-[5px]">
            → {activity.travelFromPrevious.mode} · {activity.travelFromPrevious.duration}
          </span>
        )}
      </div>
    </li>
  );
}

// ─── Where to Stay ─────────────────────────────────────────────

function WhereToStay({ stays, destination }: { stays?: SuggestedStay[]; destination: string }) {
  if (!stays || stays.length === 0) return null;

  const stayEmoji: Record<string, string> = {
    Hotel: "🏨", Hostel: "🏠", Boutique: "✨", Resort: "🌴", Airbnb: "🏡",
  };

  return (
    <section className="mb-16">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-[16px] font-semibold uppercase tracking-[0.3em] text-[#C4632C]">Where to Stay</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stays.map((stay, i) => {
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(stay.name + " " + destination)}`;
          return (
            <a
              key={i}
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-[16px] bg-white border border-zinc-200 p-4 hover:border-[#C4632C] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stayEmoji[stay.type] || "🏨"}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C4632C] bg-[#C4632C]/10 px-2 py-0.5 rounded-full">
                    {stay.type}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-[#C4632C] transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-[#C4632C] transition-colors truncate">{stay.name}</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{stay.neighborhood}</p>
              <div className="mt-3 pt-2 border-t border-zinc-100 flex items-baseline justify-between">
                <span className="text-sm font-bold text-zinc-900">{stay.priceRange}</span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-wider">/ night</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

// ─── Main Component ────────────────────────────────────────────

export default function ItineraryViewClient({ itinerary, data, heroImage }: ItineraryViewClientProps) {
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [activeActivityIndex, setActiveActivityIndex] = useState<number | null>(null);
  const [activeScrollDay, setActiveScrollDay] = useState<number | null>(null);
  const [isMobileMapOpen, setIsMobileMapOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const flatActivities = useMemo(() => {
    const arr: (Activity & { dayNumber: number })[] = [];
    data.days.forEach(day => {
      day.activities.forEach(act => {
        arr.push({ ...act, dayNumber: day.day });
      });
    });
    return arr;
  }, [data.days]);

  // When an activity comes into view, sync with map
  const handleActivityInView = (activity: Activity) => {
    const idx = flatActivities.findIndex(
      (a) => a.lat === activity.lat && a.lng === activity.lng && a.title === activity.title
    );
    if (idx !== -1) setActiveActivityIndex(idx);
    setActiveActivity(activity);
  };

  // Scroll spy for day navigation
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      let found: number | null = null;
      for (const day of data.days) {
        const el = document.getElementById(`day-${day.day}`);
        if (el) {
          const { top } = el.getBoundingClientRect();
          if (top <= 300) found = day.day;
        }
      }
      if (found !== activeScrollDay) setActiveScrollDay(found);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeScrollDay, data.days]);

  return (
    <div
      ref={scrollContainerRef}
      className="fixed inset-0 z-[100] flex flex-col bg-[#F6F6F7] overflow-y-auto overflow-x-hidden font-sans selection:bg-orange-100 scrollbar-hide"
    >
      {/* ─── Sticky Day Nav ─── */}
      <StickyDayNav days={data.days} activeScrollDay={activeScrollDay} />

      {/* ══════════════ HERO SECTION — DESKTOP ══════════════ */}
      <section className="hidden lg:block w-full bg-white border-b border-zinc-100">
        <div className="flex flex-col lg:flex-row min-h-[100vh]">
          {/* LEFT: Text Content */}
          <div className="relative w-full lg:w-[35%] flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16">
            {/* Branding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="absolute top-[20px] left-[30px] md:text-[30px] font-semibold uppercase tracking-[0.1em] text-navy/90 mb-8 block">Nomad<span className="text-[#C4632C]">Go</span></span>
            </motion.div>

            {/* Destination */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif text-zinc-900 leading-[0.9] tracking-tight mb-4"
            >
              {itinerary.destination.split(",")[0]}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl md:text-2xl font-light text-zinc-500 mb-2"
            >
              {itinerary.days} Days Itinerary
            </motion.p>

            {/* Trip Summary Row */}
            {data.estimatedCostINR && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="mb-8"
              >
                <TripSummary
                  costINR={data.estimatedCostINR}
                  places={data.placesCount || 0}
                  distanceKm={data.totalDistanceKm || 0}
                  difficulty={data.difficulty || "Moderate"}
                />
              </motion.div>
            )}

            {/* Estimated Expense (Keep for compatibility or remove if redundant) */}
            {!data.estimatedCostINR && data.estimatedTotalExpense && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-full mb-8 w-fit"
              >
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Estimated Expense:</span>
                <span className="text-sm font-bold text-zinc-900">{data.estimatedTotalExpense}</span>
              </motion.div>
            )}

            {/* Download PDF */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <ExportPdfButton itineraryId={itinerary.id} />
            </motion.div>
          </div>

          {/* RIGHT: Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[65%] min-h-[400px] lg:min-h-0 relative overflow-hidden"
          >
            <img
              src={heroImage}
              alt={itinerary.destination}
              className="w-full h-full object-cover"
            />

          </motion.div>
        </div>
      </section>

      {/* ══════════════ HERO SECTION — MOBILE ══════════════ */}
      <div className="block lg:hidden">
        <MobileHero
          destination={itinerary.destination}
          days={itinerary.days}
          heroImage={heroImage}
          data={data}
        />
      </div>

      {/* ══════════════ CONTENT + MAP SPLIT ══════════════ */}
      <div className="flex-1 w-full relative">
        <div className="flex flex-col lg:flex-row w-full">

          {/* LEFT: Scrollable Content */}
          <div className="w-full lg:w-[60%] xl:w-[65%] px-6 md:px-12 lg:pl-20 lg:pr-16 py-12 lg:py-16">

            <EssentialIntel data={data} />
            <WhereToStay stays={data.suggestedStays} destination={itinerary.destination} />

            {/* ── Day Sections (Desktop) ── */}
            <div className="hidden lg:block">
              {data.days.map((day) => (
                <DaySection key={day.day} day={day} onActivityInView={handleActivityInView} />
              ))}
            </div>

            {/* ── Day Sections (Mobile) ── */}
            <div className="block lg:hidden mt-8">
              {data.days.map((day) => (
                <DayCard key={day.day} day={day} />
              ))}
            </div>

            {/* ── Epilogue ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-16 pt-16 pb-16 flex flex-col items-center text-center border-t border-zinc-200"
            >
              <span className="text-[11px] md:text-[18px] font-semibold uppercase tracking-[0.4em] text-[#C4632C] mb-4">
                Your Journey Awaits
              </span>
              <h3 className="text-4xl md:text-5xl font-serif text-zinc-900 leading-tight mb-4">
                Your story is<br />ready to begin.
              </h3>
              <p className="text-zinc-500 text-base leading-relaxed max-w-md mx-auto mb-8">
                Download this curated experience for offline access. Every moment has been carefully crafted.
              </p>
              <ExportPdfButton itineraryId={itinerary.id} />
            </motion.div>
          </div>

          {/* RIGHT: Sticky Map */}
          <div className="hidden lg:block lg:w-[40%] xl:w-[35%] border-l border-zinc-200">
            <div className="sticky top-0 h-screen">
              <div className="w-full h-full bg-[#F6F6F7] overflow-hidden relative">
                <MapWrapper days={data.days} activeActivityIndex={activeActivityIndex} flatActivities={flatActivities} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Map Bottom Sheet */}
      <div className="block lg:hidden">
        <FloatingMapButton
          isVisible={!isMobileMapOpen}
          onClick={() => setIsMobileMapOpen(true)}
        />
        <MapBottomSheet
          isOpen={isMobileMapOpen}
          onClose={() => setIsMobileMapOpen(false)}
          days={data.days}
          flatActivities={flatActivities}
          activeActivityIndex={activeActivityIndex}
        />
      </div>
    </div>
  );
}
