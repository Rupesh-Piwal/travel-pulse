"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Languages, Sun, ArrowRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  image: any | null;
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
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-1/2 left-2 -translate-y-1/2 z-[150] hidden lg:flex flex-col items-center gap-1"
        >
          {/* Glassmorphic Container */}
          <div className="relative flex flex-col items-center py-2 px-1 bg-white/40 backdrop-blur-2xl rounded-full border border-white/40 shadow-[0_16px_48px_rgba(0,0,0,0.05)]">

            {/* Background Track */}
            <div className="absolute top-8 bottom-8 w-[2px] bg-[#111111]/5 left-1/2 -translate-x-1/2" />

            {/* Progress Line */}
            <motion.div
              className="absolute top-8 w-[2px] bg-[#B54A2A] left-1/2 -translate-x-1/2"
              initial={{ height: 0 }}
              animate={{
                height: `${((activeScrollDay - 1) / (days.length - 1)) * 100}%`
              }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              style={{ maxHeight: "calc(100% - 4rem)" }}
            />

            {days.map((day, idx) => {
              const isActive = activeScrollDay === day.day;
              const isPast = activeScrollDay > day.day;

              return (
                <button
                  key={day.day}
                  onClick={() => {
                    const el = document.getElementById(`day-${day.day}`);
                    if (el) {
                      const offset = 80;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = el.getBoundingClientRect().top;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                      });
                    }
                  }}
                  className="relative py-3 flex items-center justify-center group outline-none"
                  aria-label={`Scroll to Day ${day.day}`}
                >
                  {/* Dot */}
                  <div className="relative z-10">
                    {isActive ? (
                      <motion.div
                        layoutId="active-dot-outer"
                        className="w-10 h-10 rounded-full border border-[#B54A2A]/20 bg-[#B54A2A]/5 flex items-center justify-center"
                      >
                        <motion.div
                          layoutId="active-dot-inner"
                          className="w-7 h-7 rounded-full bg-[#B54A2A] flex items-center justify-center shadow-[0_4px_12px_rgba(181,74,42,0.4)]"
                        >
                          <span className="text-[11px] font-bold text-white">{day.day}</span>
                        </motion.div>

                        {/* Pulse Effect */}
                        <motion.div
                          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-[#B54A2A]/20"
                        />
                      </motion.div>
                    ) : (
                      <div className={cn(
                        "w-3 h-3 rounded-full transition-all duration-500",
                        isPast ? "bg-[#B54A2A]" : "bg-zinc-200 group-hover:bg-zinc-400 group-hover:scale-125"
                      )} />
                    )}
                  </div>

                  {/* Tooltip Label */}
                  <div className="absolute left-16 opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400 pointer-events-none">
                    <div className="bg-[#111111] text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-3 whitespace-nowrap">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Day {day.day}</span>
                      <div className="w-[1px] h-3 bg-white/10" />
                      <span className="text-[12px] font-semibold text-white truncate max-w-[150px]">{day.title}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
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

// ─── Desktop Image Carousel ───────────────────────────────────

function DesktopImageCarousel({ images }: { images: Activity[] }) {
  return (
    <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mx-1 px-1 mt-4">
      {images.map((activity, idx) => (
        <div key={idx} className="w-[300px] md:w-[400px] snap-start shrink-0 group cursor-pointer">
          <div className="aspect-[16/10] rounded-[24px] overflow-hidden bg-zinc-100 relative shadow-sm border border-zinc-200/50">
            <Image
              src={typeof activity.image === 'string' ? activity.image : (activity.image?.cachedPath || activity.image?.url)}
              alt={activity.title}
              fill
              sizes="(max-width: 768px) 300px, 400px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Glassmorphic Caption Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 transform translate-y-4 group-hover:translate-y-0">
              <div className="flex items-center gap-2 mb-2">
                {activity.rating && (
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                    <Star className="w-3 h-3 text-white fill-white" />
                    <span className="text-[10px] font-bold text-white">{activity.rating.toFixed(1)}</span>
                  </div>
                )}
                <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{activity.category || 'Spot'}</span>
              </div>
              <h4 className="text-white font-serif text-xl leading-tight truncate">{activity.title}</h4>
            </div>
          </div>
          {/* Subtle Label Below */}
          <div className="mt-4 group-hover:translate-x-1 transition-transform duration-300">
            <h4 className="text-sm font-semibold text-zinc-900 truncate">{activity.title}</h4>
            <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mt-1">{activity.timeOfDay}</p>
          </div>
        </div>
      ))}
      {/* Empty space at end for better scrolling feel */}
      <div className="w-20 shrink-0" />
    </div>
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

      {/* Activity Image Carousel (all images) */}
      {activityImages.length > 0 && (
        <DesktopImageCarousel images={activityImages} />
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
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-zinc-200" />
            {timeOfDay}
            <span className="flex-1 h-[1px] bg-zinc-200" />
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
    <li ref={ref} className="relative pl-6 border-l border-zinc-100 hover:border-[#B54A2A]/30 transition-colors group/item pb-8 last:pb-0">
      <div className="absolute left-[-4.5px] top-2 w-2 h-2 rounded-full border-2 border-white bg-zinc-200 group-hover/item:bg-[#B54A2A] group-hover/item:scale-125 transition-all duration-300" />

      <p className="text-[13px] md:text-[14px] text-zinc-700 leading-relaxed">
        <span className="font-bold text-zinc-900">{activity.title}</span>
        {activity.address && (
          <span className="text-zinc-400"> — {activity.address}</span>
        )}
      </p>
      <p className="text-[12px] md:text-[13px] text-zinc-500 leading-relaxed mt-1">{activity.description}</p>

      {activity.aiInsight && (
        <div className="flex items-center gap-2 mt-3 bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-2 w-fit">
          <span className="text-[10px]">💡</span>
          <p className="text-[11px] md:text-[12px] text-zinc-600 font-medium">
            {activity.aiInsight}
          </p>
        </div>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mt-4 text-[11px] text-zinc-400">
        {activity.duration && <span className="flex items-center gap-1.5 bg-zinc-100 px-2 py-1 rounded-md">⏱ {activity.duration}</span>}
        {activity.rating && (
          <span className="flex items-center gap-1 bg-zinc-100 px-2 py-1 rounded-md text-zinc-600 font-bold">
            <Star className="w-3 h-3 text-[#B54A2A] fill-[#B54A2A]" />
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
              <ExportPdfButton itineraryId={itinerary.id} destination={itinerary.destination} />
            </motion.div>
          </div>

          {/* RIGHT: Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-[65%] min-h-[400px] lg:min-h-0 relative overflow-hidden"
          >
            <Image
              src={heroImage}
              alt={itinerary.destination}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover"
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
              <ExportPdfButton itineraryId={itinerary.id} destination={itinerary.destination} />
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
