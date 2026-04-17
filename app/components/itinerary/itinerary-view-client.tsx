"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  MapPin,
  Calendar,
  Sparkles,
  ArrowLeft,
  Share2,
  X,
  Languages,
  Sun,
  Lightbulb,
  Hotel,
  ExternalLink,
  DollarSign,
  ChevronDown,
  Compass,
  Route,
  Camera,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MapWrapper from "@/app/components/itinerary/map-wrapper";
import ExportPdfButton from "@/app/components/itinerary/export-pdf-button";
import AnimatedActivityCard from "@/app/components/itinerary/animated-activity-card";
import HeroActivityCard from "@/app/components/itinerary/hero-activity-card";
import TravelTransition from "@/app/components/itinerary/travel-transition";

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
  timeOfDay: "Morning" | "Afternoon" | "Evening";
  category?: string;
  mealType?: string;
  rating?: number;
  priceLevel?: string;
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

// ─── Animated Counter ──────────────────────────────────────────

function AnimatedCounter({ to, duration = 1.5 }: { to: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = (Date.now() - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * to));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(to);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{count}</span>;
}

// ─── Sticky Day Navigator ──────────────────────────────────────

function StickyDayNav({ days, activeScrollDay }: { days: Day[]; activeScrollDay: number | null }) {
  return (
    <AnimatePresence>
      {activeScrollDay !== null && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-[60px] left-1/2 -translate-x-1/2 z-[55] hidden lg:flex"
        >
          <div className="flex items-center gap-1 p-1 bg-white/80 backdrop-blur-2xl backdrop-saturate-[1.8] rounded-2xl border border-zinc-200/60 shadow-xl shadow-black/5">
            {days.map((day) => {
              const isActive = activeScrollDay === day.day;
              return (
                <button
                  key={day.day}
                  onClick={() => document.getElementById(`day-${day.day}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className={`relative px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                    isActive
                      ? "bg-zinc-950 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100/60"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-zinc-950 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">Day {String(day.day).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Know Before You Go ────────────────────────────────────────

function KnowBeforeYouGo({ data }: { data: ItineraryData }) {
  const hasIntel = data.language || data.bestTimeToVisit || (data.travelTips && data.travelTips.length > 0);
  if (!hasIntel) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="mb-24"
    >
      <div className="flex items-center gap-6 mb-12">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">Essential Intel</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
      </div>

      {(data.language || data.bestTimeToVisit) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12 mb-12">
          {data.language && (
            <div className="flex items-center gap-3">
              <Languages className="w-4 h-4 text-zinc-300" />
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 block">Language</span>
                <span className="text-[15px] font-semibold text-zinc-800 mt-0.5 block">{data.language}</span>
              </div>
            </div>
          )}
          {data.bestTimeToVisit && (
            <div className="flex items-center gap-3">
              <Sun className="w-4 h-4 text-zinc-300" />
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 block">Best Time to Visit</span>
                <span className="text-[15px] font-semibold text-zinc-800 mt-0.5 block">{data.bestTimeToVisit}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {data.travelTips && data.travelTips.length > 0 && (
        <div className="space-y-6 pl-1">
          {data.travelTips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="flex items-start gap-5 group/tip"
            >
              <span className="text-[2rem] font-serif text-zinc-200 leading-none mt-[-4px] group-hover/tip:text-orange-300 transition-colors duration-500 select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[14px] text-zinc-600 leading-relaxed pt-1 border-l border-zinc-100 pl-5 group-hover/tip:border-orange-200 transition-colors duration-500">
                {tip}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

// ─── Where to Stay ─────────────────────────────────────────────

function WhereToStay({ stays, destination }: { stays?: SuggestedStay[]; destination: string }) {
  if (!stays || stays.length === 0) return null;
  const stayEmoji: Record<string, string> = {
    Hotel: "🏨", Hostel: "🏠", Boutique: "✨", Resort: "🌴", Airbnb: "🏡",
  };
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="mb-20"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 flex items-center justify-center border border-purple-500/10">
          <Hotel className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">Where to Stay</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stays.map((stay, i) => {
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(stay.name + " " + destination)}`;
          return (
            <motion.a
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden flex items-center gap-5 p-6 rounded-[1.25rem] bg-white/80 border border-zinc-100 hover:border-purple-200 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50/0 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center shrink-0 text-2xl relative z-10 border border-purple-100/50 group-hover:scale-110 transition-transform duration-500">
                {stayEmoji[stay.type] || "🏨"}
              </div>
              <div className="flex-1 min-w-0 relative z-10">
                <p className="text-[15px] font-bold text-zinc-900 truncate group-hover:text-purple-700 transition-colors">{stay.name}</p>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-500 bg-purple-50 px-2 py-0.5 rounded-md">{stay.type}</span>
                  <span className="text-[11px] text-zinc-400">{stay.neighborhood}</span>
                </div>
                <p className="text-[13px] font-bold text-emerald-600 mt-2">{stay.priceRange}<span className="text-zinc-400 font-normal text-[11px]"> / night</span></p>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-300 group-hover:text-purple-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 relative z-10" />
            </motion.a>
          );
        })}
      </div>
    </motion.section>
  );
}

// ─── Parallax Day Card ─────────────────────────────────────────

function ParallaxDayCard({
  day, children, isLast, onPinDay, isActive,
}: {
  day: Day; children: React.ReactNode; isLast: boolean; onPinDay: () => void; isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -30]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.96, 1, 1, 0.98]);

  return (
    <motion.section ref={ref} style={{ y, scale }} id={`day-${day.day}`} className="scroll-mt-40 relative origin-top">
      {/* ──── Day Header ──── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[1.75rem] mb-8 border border-zinc-100/80 shadow-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-orange-50/30" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-500/[0.06] to-transparent rounded-bl-full" />
        <div className="relative p-8 md:p-10">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-4 py-1.5 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg">
                  Day {day.day < 10 ? `0${day.day}` : day.day}
                </span>
                {day.estimatedCost && (
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/10 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-emerald-500/10">
                    <DollarSign className="w-3 h-3" />
                    {day.estimatedCost}
                  </span>
                )}
              </div>
              <h2 className="text-3xl md:text-[2.5rem] font-serif text-zinc-950 leading-[1.1] tracking-tight">{day.title}</h2>
              {day.summary && <p className="text-[14px] text-zinc-500 leading-relaxed max-w-lg font-light">{day.summary}</p>}
            </div>
            <button
              onClick={onPinDay}
              className={`shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 border shadow-sm ${
                isActive
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-orange-300 hover:text-orange-600 hover:shadow-md"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ──── Activities ──── */}
      <div className="space-y-0 pl-4 md:pl-6">{children}</div>

      {/* ──── End-of-trip CTA ──── */}
      {isLast && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-24 relative overflow-hidden rounded-[2rem] border border-zinc-800"
        >
          <div className="absolute inset-0 bg-zinc-950" />
          <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-gradient-to-bl from-orange-500/15 via-orange-500/5 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-tr-full" />
          <div className="relative z-10 p-12 md:p-20 space-y-8 max-w-lg">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/10 flex items-center justify-center border border-orange-500/20"
            >
              <Sparkles className="w-7 h-7 text-orange-400" />
            </motion.div>
            <h3 className="text-4xl md:text-5xl font-serif text-white leading-[1.1] tracking-tight">Your story<br />is ready to begin.</h3>
            <p className="text-zinc-500 text-[15px] leading-relaxed max-w-md">Download this curated experience for offline access. Every moment has been carefully crafted.</p>
            <div className="flex items-center gap-4 pt-2">
              <Button className="h-14 px-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-orange-500/25 transition-all duration-500 active:scale-[0.97]">
                Download Itinerary
              </Button>
              <div className="scale-90"><ExportPdfButton itineraryId="" /></div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}

// ─── Main Component ────────────────────────────────────────────

export default function ItineraryViewClient({ itinerary, data, heroImage }: ItineraryViewClientProps) {
  const [activeDay, setActiveDay] = useState<number | null>(null);         // for map
  const [activeScrollDay, setActiveScrollDay] = useState<number | null>(null); // for sticky nav
  const [scrolled, setScrolled] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── Compute trip stats ──
  const totalActivities = data.days.reduce((sum, d) => sum + d.activities.length, 0);
  const totalRestaurants = data.days.reduce((sum, d) => sum + d.activities.filter(a => a.category === "RESTAURANT").length, 0);
  const totalLandmarks = data.days.reduce((sum, d) => sum + d.activities.filter(a => a.category === "LANDMARK" || a.category === "ACTIVITY").length, 0);

  // ── Scroll spy — listens on the fixed container, NOT window ──
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      setScrolled(scrollTop > 80);
      setHeroVisible(scrollTop < window.innerHeight * 0.5);

      // Scroll-spy: detect which day section is in view
      let found: number | null = null;
      for (const day of data.days) {
        const el = document.getElementById(`day-${day.day}`);
        if (el) {
          const { top } = el.getBoundingClientRect();
          if (top <= 200) found = day.day;
        }
      }
      if (found !== activeScrollDay) setActiveScrollDay(found);

      // Map scroll-spy: auto-pan to first activity of visible day
      if (found && found !== activeDay) {
        setActiveDay(found);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeScrollDay, activeDay, data.days]);

  return (
    <div ref={scrollContainerRef} className="fixed inset-0 z-[100] flex flex-col bg-[#FAF8F5] overflow-y-auto overflow-x-hidden font-sans selection:bg-orange-200/40">

      {/* ══════════════════════════════ STICKY DAY NAVIGATOR */}
      <StickyDayNav days={data.days} activeScrollDay={activeScrollDay} />

      {/* ══════════════════════════════ FLOATING HEADER */}
      <header className={`fixed top-0 left-0 w-full z-[60] px-6 md:px-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled ? "py-3 bg-[#FAF8F5]/70 backdrop-blur-2xl backdrop-saturate-[1.8] shadow-[0_1px_0_rgba(0,0,0,0.05)]" : "py-6 bg-transparent"
      }`}>
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="rounded-2xl gap-2.5 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100/80 px-4 py-2 transition-all duration-300 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-bold text-[10px] uppercase tracking-[0.2em]">Dashboard</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-2xl text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100/80 font-bold text-[10px] uppercase tracking-[0.15em] px-4 py-2 transition-all duration-300">
              <Share2 className="w-3.5 h-3.5 mr-2" />Share
            </Button>
            <div className="scale-90 opacity-80 hover:opacity-100 transition-opacity">
              <ExportPdfButton itineraryId={itinerary.id} />
            </div>
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-2xl text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100/80 transition-all duration-300 w-9 h-9">
                <X className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════ CINEMATIC HERO */}
      <section className="relative h-[85vh] min-h-[700px] w-full overflow-hidden flex items-center justify-center shrink-0">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            src={heroImage}
            alt={itinerary.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAF8F5] to-transparent z-20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-30 px-6 md:px-12 w-full max-w-5xl mx-auto text-center flex flex-col items-center mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 md:space-y-8 w-full flex flex-col items-center"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-4 justify-center">
              <div className="h-[1px] w-8 md:w-16 bg-white/30" />
              <span className="text-white/80 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] drop-shadow-md">
                NomadGo Curated • {itinerary.vibe}
              </span>
              <div className="h-[1px] w-8 md:w-16 bg-white/30" />
            </div>

            {/* Title */}
            <h1 className="text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] font-serif text-white tracking-[-0.04em] leading-[0.85] drop-shadow-2xl">
              {itinerary.destination.split(",")[0]}
            </h1>
            {itinerary.destination.includes(",") && (
              <h2 className="text-xl md:text-3xl font-serif italic text-white/70 mt-[-1rem] drop-shadow-lg">
                {itinerary.destination.split(",").slice(1).join(",").trim()}
              </h2>
            )}

            {/* ── ANIMATED TRIP STATS ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center justify-center gap-6 md:gap-0 pt-6"
            >
              {/* Days */}
              <div className="flex flex-col items-center gap-1.5 px-8 md:px-10">
                <div className="text-3xl md:text-4xl font-serif text-white font-bold tabular-nums">
                  <AnimatedCounter to={itinerary.days} duration={1} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-white/40" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Days</span>
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-white/15" />

              {/* Activities */}
              <div className="flex flex-col items-center gap-1.5 px-8 md:px-10">
                <div className="text-3xl md:text-4xl font-serif text-white font-bold tabular-nums">
                  <AnimatedCounter to={totalActivities} duration={1.2} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Route className="w-3 h-3 text-white/40" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Stops</span>
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-white/15" />

              {/* Restaurants */}
              <div className="flex flex-col items-center gap-1.5 px-8 md:px-10">
                <div className="text-3xl md:text-4xl font-serif text-white font-bold tabular-nums">
                  <AnimatedCounter to={totalRestaurants} duration={1.4} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Utensils className="w-3 h-3 text-white/40" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Dinings</span>
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-white/15" />

              {/* Landmarks */}
              <div className="flex flex-col items-center gap-1.5 px-8 md:px-10">
                <div className="text-3xl md:text-4xl font-serif text-white font-bold tabular-nums">
                  <AnimatedCounter to={totalLandmarks} duration={1.6} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Camera className="w-3 h-3 text-white/40" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Experiences</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 opacity-40 hover:opacity-80 transition-opacity duration-500 cursor-pointer"
          onClick={() => document.getElementById("day-1")?.scrollIntoView({ behavior: "smooth" })}
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
            <ChevronDown className="w-5 h-5 text-zinc-300" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════ CONTENT AREA */}
      <div className="flex-1 max-w-[1800px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT: Scrollable Content */}
          <div className="w-full lg:w-[58%] px-6 md:px-12 lg:px-16 xl:px-20 pt-16 pb-32">
            <KnowBeforeYouGo data={data} />
            <WhereToStay stays={data.suggestedStays} destination={itinerary.destination} />

            {/* Day Cards */}
            <div className="space-y-24">
              {data.days.map((day, dayIndex) => (
                <ParallaxDayCard
                  key={day.day}
                  day={day}
                  isLast={dayIndex === data.days.length - 1}
                  isActive={activeDay === day.day}
                  onPinDay={() => setActiveDay((prev) => (prev === day.day ? null : day.day))}
                >
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} data-activity-lat={activity.lat} data-activity-lng={activity.lng}>
                      {activity.travelFromPrevious && (
                        <TravelTransition
                          mode={activity.travelFromPrevious.mode}
                          duration={activity.travelFromPrevious.duration}
                          distance={activity.travelFromPrevious.distance}
                        />
                      )}
                      {/* Hero card for first activity, regular for rest */}
                      {actIndex === 0 ? (
                        <HeroActivityCard activity={activity} />
                      ) : (
                        <AnimatedActivityCard activity={activity} index={actIndex} />
                      )}
                    </div>
                  ))}
                </ParallaxDayCard>
              ))}
            </div>
          </div>

          {/* RIGHT: Sticky Map */}
          <div className="hidden lg:block lg:w-[42%]">
            <div className="sticky top-0 h-screen">
              <div className="w-full h-full bg-zinc-950 overflow-hidden relative">
                <MapWrapper days={data.days} activeDay={activeDay} />
                <div className="absolute inset-0 pointer-events-none shadow-[inset_50px_0_120px_-30px_rgba(24,24,27,0.85)] z-20" />
                <div className="absolute top-6 right-6 z-30">
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800/80 rounded-xl text-white/50 text-[9px] font-black uppercase tracking-[0.25em]">
                    <Compass className="w-3 h-3" />
                    Interactive Map
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 z-30">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar p-1 bg-zinc-900/60 backdrop-blur-2xl rounded-2xl border border-zinc-800/50">
                    <button
                      onClick={() => setActiveDay(null)}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shrink-0 ${
                        activeDay === null ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "text-zinc-500 hover:text-white"
                      }`}
                    >All</button>
                    {data.days.map((day) => (
                      <button
                        key={day.day}
                        onClick={() => setActiveDay((prev) => (prev === day.day ? null : day.day))}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shrink-0 ${
                          activeDay === day.day ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "text-zinc-500 hover:text-white"
                        }`}
                      >Day {day.day}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MAP */}
      <section className="lg:hidden mx-6 h-[400px] rounded-[1.75rem] overflow-hidden shadow-2xl border border-zinc-200 mb-20 relative print:hidden">
        <MapWrapper days={data.days} activeDay={activeDay} />
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-zinc-900/80 backdrop-blur-xl rounded-xl text-white text-[9px] font-bold uppercase tracking-widest">
          Interactive Map
        </div>
      </section>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
