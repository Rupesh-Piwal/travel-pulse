"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { MapPin, ArrowRight, Share, X, Languages, Sun, Building2, DollarSign, CircleChevronUp, Sparkle, ArrowDownToDot, Compass } from 'lucide-react';

import MapWrapper from "@/app/components/itinerary/map-wrapper";
import ExportPdfButton from "@/app/components/itinerary/export-pdf-button";
import { DayOpener, EditorialActivityScene } from "@/app/components/itinerary/cinematic-scenes";

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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-1/2 left-6 md:left-10 -translate-y-1/2 z-[150] hidden lg:flex flex-col items-center py-10"
        >
          {/* Continuous Vertical Line */}
          <div className="absolute top-0 bottom-0 w-px bg-white/10 left-1/2 -translate-x-1/2" />

          {days.map((day) => {
            const isActive = activeScrollDay === day.day;
            return (
              <button
                key={day.day}
                onClick={() => document.getElementById(`day-${day.day}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="relative py-6 flex items-center justify-center group outline-none"
                aria-label={`Scroll to Day ${day.day}`}
              >
                {isActive ? (
                  <motion.div
                    layoutId="active-dot"
                    className="relative z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] border border-white/10"
                  >
                    <span className="text-[14px] font-black text-black">{day.day}</span>
                  </motion.div>
                ) : (
                  <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-white/40 group-hover:bg-white/80 transition-all duration-300 group-hover:scale-125" />
                )}

                {/* Tooltip on Hover */}
                <div className="absolute left-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap">
                  <span className="bg-zinc-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-xl border border-white/10 shadow-2xl block">
                    Day {day.day}
                  </span>
                </div>
              </button>
            )
          })}
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
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Essential Intel</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {(data.language || data.bestTimeToVisit) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12 mb-12">
          {data.language && (
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-zinc-900 rounded-xl border border-white/5">
                <Languages className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 block">Language</span>
                <span className="text-[15px] font-semibold text-white mt-0.5 block">{data.language}</span>
              </div>
            </div>
          )}
          {data.bestTimeToVisit && (
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-zinc-900 rounded-xl border border-white/5">
                <Sun className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 block">Best Time to Visit</span>
                <span className="text-[15px] font-semibold text-white mt-0.5 block">{data.bestTimeToVisit}</span>
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
              <span className="text-[2rem] font-sans italic text-zinc-800 leading-none mt-[-4px] group-hover/tip:text-orange-400/50 transition-colors duration-500 select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[14px] text-zinc-400 leading-relaxed pt-1 border-l border-white/5 pl-5 group-hover/tip:border-orange-400/30 transition-colors duration-500">
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mb-16"
    >
      {/* Minimal header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px w-6 bg-gradient-to-r from-transparent to-orange-500/40" />
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-400/80">✦</span>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">STAY</span>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-400/80">✦</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-orange-500/40 to-transparent" />
      </div>

      {/* Responsive grid – no scroll */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stays.map((stay, i) => {
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(stay.name + " " + destination)}`;
          return (
            <motion.a
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block rounded-xl bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 backdrop-blur-sm border border-white/10 hover:border-orange-500/30 transition-all duration-400 hover:shadow-xl hover:shadow-orange-500/5 overflow-hidden"
            >
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-orange-500/5 rounded-bl-2xl group-hover:bg-orange-500/10 transition-all duration-500" />

              <div className="p-4">
                {/* Top row: icon + type */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-white/5 flex items-center justify-center text-base group-hover:scale-110 transition-transform duration-300">
                      {stayEmoji[stay.type] || "🏨"}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-orange-400/80 bg-orange-400/5 px-2 py-0.5 rounded-full border border-orange-400/15">
                      {stay.type}
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500 transition-all duration-300">
                    <ArrowRight className="w-3 h-3 text-white group-hover:text-black transition-colors" />
                  </div>
                </div>

                {/* Name + neighborhood */}
                <div className="mb-3">
                  <h3 className="text-base font-bold text-white tracking-tight group-hover:text-orange-400 transition-colors truncate">
                    {stay.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-medium mt-0.5 truncate">
                    {stay.neighborhood}
                  </p>
                </div>

                {/* Price range - compact */}
                <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
                  <div>
                    <span className="text-sm font-bold text-white tracking-tight">{stay.priceRange}</span>
                    <span className="text-[9px] text-zinc-600 ml-1">/ night</span>
                  </div>
                  <div className="text-[9px] text-zinc-600 uppercase tracking-wider">
                    Book →
                  </div>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.section>
  );
}

// ─── Main Component ────────────────────────────────────────────

export default function ItineraryViewClient({ itinerary, data, heroImage }: ItineraryViewClientProps) {
  const [activeActivityIndex, setActiveActivityIndex] = useState<number | null>(null);
  const [activeDay, setActiveDay] = useState<number | null>(null);         // for map
  const [activeScrollDay, setActiveScrollDay] = useState<number | null>(null); // for sticky nav
  const [scrolled, setScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── Scroll-linked Hero Animations ──
  const { scrollY } = useScroll({ container: scrollContainerRef });
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.15]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);
  const textY = useTransform(scrollY, [0, 400], [0, -60]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const smoothHeroScale = useSpring(heroScale, { damping: 20, stiffness: 100 });
  const smoothTextY = useSpring(textY, { damping: 20, stiffness: 100 });

  const flatActivities = useMemo(() => {
    const arr: (Activity & { dayNumber: number })[] = [];
    data.days.forEach(day => {
      day.activities.forEach(act => {
        arr.push({ ...act, dayNumber: day.day });
      });
    });
    return arr;
  }, [data.days]);

  // Sync activeDay with activeActivityIndex
  useEffect(() => {
    if (activeActivityIndex !== null && flatActivities[activeActivityIndex]) {
      const dayNum = flatActivities[activeActivityIndex].dayNumber;
      if (dayNum !== activeDay) {
        setActiveDay(dayNum);
        setActiveScrollDay(dayNum);
      }
    }
  }, [activeActivityIndex, flatActivities, activeDay]);

  // ── Scroll spy ──
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      setScrolled(scrollTop > 80);
      let found: number | null = null;
      for (const day of data.days) {
        const el = document.getElementById(`day-${day.day}`);
        if (el) {
          const { top } = el.getBoundingClientRect();
          if (top <= 250) found = day.day;
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
      className="fixed inset-0 z-[100] flex flex-col bg-black overflow-y-auto overflow-x-hidden font-sans selection:bg-orange-200/40 scrollbar-hide"
    >
      {/* ══════════════════════════════ STICKY DAY NAVIGATOR */}
      <StickyDayNav days={data.days} activeScrollDay={activeScrollDay} />

      {/* ══════════════════════════════ CINEMATIC HERO ══════════════════════════════ */}
      <section className="relative h-screen w-full min-h-[900px] flex flex-col justify-end overflow-hidden bg-black">
        {/* === LUXURY BACKGROUND LAYER === */}
        <motion.div
          style={{ scale: smoothHeroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <motion.img
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 25, ease: [0.25, 0.1, 0.15, 1] }}
            src={heroImage}
            alt={itinerary.destination}
            className="w-full h-full object-cover will-change-transform"
          />

          {/* Cinematic vignette + color grade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_70%)] opacity-60 z-10" />

          {/* Warm light leak from bottom right */}
          <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-gradient-to-tl from-amber-500/15 via-orange-500/5 to-transparent rounded-full blur-[100px] z-10 pointer-events-none" />

          {/* Subtle grain texture for analog luxury feel */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none z-10"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '200px' }} />
        </motion.div>

        {/* === CONTENT CONTAINER === */}
        <div className="relative z-20 w-full px-6 md:px-12 lg:px-20 xl:px-28 pb-20 md:pb-48 flex flex-col-reverse md:flex-row items-start md:items-end justify-between gap-10 md:gap-20">

          {/* LEFT: Journey Chip – now a minimalist luxury badge */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group relative flex items-center gap-4 px-5 py-3 rounded-full bg-black/30 backdrop-blur-2xl border border-white/15 shadow-2xl hover:border-amber-400/40 transition-all duration-700"
          >
            {/* Animated border glow on hover */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-amber-400/20 to-orange-500/20 blur-xl" />

            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/10 flex items-center justify-center border border-amber-400/30 shadow-[0_0_25px_rgba(245,158,11,0.2)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.4)] transition-all duration-500">
              <span className="text-xl font-sans font-light text-amber-200 tracking-tighter">
                <AnimatedCounter to={itinerary.days} />
              </span>
            </div>

            <div className="flex flex-col">
              <span className="md:text-[14px] font-semibold uppercase tracking-[0.25em] text-terracotta">Days</span>

            </div>
          </motion.div>

          {/* RIGHT: Main typography – sensual & powerful */}
          <div className="flex flex-col items-start md:items-end text-left md:text-right max-w-4xl w-full">
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl md:text-9xl lg:text-[9rem] xl:text-[11rem] font-sans font-medium text-white leading-[0.85] tracking-[-0.02em] drop-shadow-2xl mb-6 relative"
            >
              {itinerary.destination.split(",")[0]}
              {/* Elegant underline that appears on hover */}
              <span className="absolute -bottom-4 left-0 md:left-auto md:right-0 w-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-1000 ease-out" />
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.55, duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
              className="w-24 h-[1.5px] bg-gradient-to-r from-amber-400 to-transparent mb-5 origin-left md:origin-right md:bg-gradient-to-l"
            />


          </div>
        </div>

        {/* === LUXURY SCROLL INDICATOR – refined, minimal, kinetic === */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          onClick={() => scrollContainerRef.current?.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 cursor-pointer group flex flex-col items-center gap-2"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-white/40 group-hover:text-white/80 transition-colors duration-300">Scroll</span>
          <div className="relative w-px h-14 overflow-hidden">
            <div className="absolute w-full h-full bg-gradient-to-b from-amber-400/0 via-amber-400/70 to-amber-400/0 animate-[scrollPulse_2.2s_ease-in-out_infinite]" />
            <div className="w-full h-full bg-white/20" />
          </div>
          <div className="w-1 h-1 rounded-full bg-amber-400/60 group-hover:bg-amber-400 transition-colors duration-300" />
        </motion.div>


      </section>



      {/* ══════════════════════════════ CONTENT AREA */}
      <div className="flex-1 w-full relative">
        <div className="flex flex-col lg:flex-row w-full">
          {/* LEFT: Scrollable Content */}
          <div className="w-full lg:w-[60%] xl:w-[65%] px-6 md:px-12 lg:pl-[max(4rem,calc(50vw-650px))] lg:pr-20 pt-0 pb-32">
            <div className="mb-20 space-y-6">
              <div className="text-[20px] md:text-[40px] font-bold tracking-[0.2em] text-terracotta"
                style={{ fontFamily: 'var(--font-dancing), cursive' }}>
                Explore unmissable
              </div>
              <div className="max-w-xl">
                <p className="text-zinc-500 font-light text-lg leading-relaxed">
                  Discover exclusive activities and hidden gems curated specifically for your <span className="text-white font-medium italic">{itinerary.vibe.toLowerCase()}</span> vibe.
                  Every stop is a story waiting to be told.
                </p>
              </div>
            </div>

            <KnowBeforeYouGo data={data} />
            <WhereToStay stays={data.suggestedStays} destination={itinerary.destination} />

            <div className="space-y-0">
              {flatActivities.map((activity, index) => {
                const isFirstActivityOfDay = flatActivities.findIndex(a => a.dayNumber === activity.dayNumber) === index;
                const isLast = index === flatActivities.length - 1;
                const dayData = data.days.find(d => d.day === activity.dayNumber);

                const aligns: ("left" | "right" | "wide")[] = ["left", "right", "wide", "left", "right"];
                const align = aligns[index % aligns.length];

                return (
                  <div key={`${activity.dayNumber}-${index}`} data-activity-lat={activity.lat} data-activity-lng={activity.lng} id={`day-${activity.dayNumber}`}>

                    {isFirstActivityOfDay && dayData && (
                      <DayOpener
                        dayInfo={{ dayTitle: dayData.title, dayNumber: dayData.day, summary: dayData.summary }}
                        image={activity.image}
                      />
                    )}

                    <EditorialActivityScene
                      activity={activity}
                      index={index}
                      onInView={setActiveActivityIndex}
                      align={align}
                      isLast={isLast}
                    />

                    {isLast && (
                      <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-32 pt-32 pb-16 flex flex-col items-center text-center relative"
                      >
                        <div className="w-px h-24 bg-gradient-to-b from-white/10 to-transparent absolute top-0 left-1/2 -translate-x-1/2" />

                        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-orange-400 mb-6">
                          Epilogue
                        </span>

                        <h3 className="text-5xl md:text-7xl font-sans text-white leading-[1.1] tracking-tight mb-6">
                          Your story is<br />ready to begin.
                        </h3>

                        <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-md mx-auto mb-10">
                          Download this curated experience for offline access. Every moment has been carefully crafted.
                        </p>

                        <div className="flex items-center justify-center">
                          <div className="scale-100 transform origin-center shadow-[0_0_40px_rgba(245,158,11,0.1)] hover:shadow-[0_0_60px_rgba(245,158,11,0.2)] transition-shadow duration-700 rounded-full">
                            <ExportPdfButton itineraryId={itinerary.id} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:block lg:w-[40%] xl:w-[35%] border-l border-white/5">
            <div className="sticky top-0 h-screen">
              <div className="w-full h-full bg-zinc-950 overflow-hidden relative">
                <MapWrapper days={data.days} activeActivityIndex={activeActivityIndex} flatActivities={flatActivities} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
