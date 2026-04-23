"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { MapPin, ArrowRight, Share, X, Languages, Sun, Building2, DollarSign, CircleChevronUp, Sparkle, ArrowDownToDot, Compass } from 'lucide-react';
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
              <span className="text-[2rem] font-serif italic text-zinc-800 leading-none mt-[-4px] group-hover/tip:text-orange-400/50 transition-colors duration-500 select-none">
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="mb-20"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-1 rounded-full bg-orange-400" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Reside</h2>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
          Scroll <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-8 snap-x no-scrollbar -mx-4 px-4">
        {stays.map((stay, i) => {
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(stay.name + " " + destination)}`;
          return (
            <motion.a
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-none w-[280px] snap-start group relative p-6 rounded-[1.75rem] bg-zinc-900/40 border border-white/5 hover:border-orange-400/20 transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-lg">
                  {stayEmoji[stay.type] || "🏨"}
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-400/70 bg-orange-400/5 px-2 py-0.5 rounded-md border border-orange-400/10">{stay.type}</span>
              </div>

              <div className="space-y-1 mb-4">
                <h3 className="text-xl font-serif italic text-white truncate group-hover:text-orange-400 transition-colors">
                  {stay.name}
                </h3>
                <p className="text-[11px] text-zinc-500 font-medium truncate opacity-70">
                  {stay.neighborhood}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <p className="text-sm font-bold text-white">
                  {stay.priceRange}<span className="text-zinc-600 font-normal text-[10px] ml-1">/ nt</span>
                </p>
                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white transition-all duration-500">
                  <ArrowRight className="w-3 h-3 text-white group-hover:text-black transition-colors" />
                </div>
              </div>
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
  const y = useTransform(scrollYProgress, [0, 1], [40, -20]);

  // Use the first activity's image as the Day Hero photo
  const dayHeroImage = day.activities.find(a => a.image)?.image || null;

  return (
    <motion.section ref={ref} style={{ y }} id={`day-${day.day}`} className="scroll-mt-40 relative origin-top">

      {/* ──── CINEMATIC DAY HERO ──── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2rem] mb-10"
      >
        {/* Hero Image */}
        {dayHeroImage ? (
          <div className="relative w-full aspect-[4/5] md:aspect-[3/2] min-h-[400px] max-h-[650px] overflow-hidden rounded-[2rem]">
            <img
              src={dayHeroImage}
              alt={day.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

            {/* Overlaid Chapter Info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex items-end justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-4 py-1.5 bg-white text-zinc-950 text-[10px] font-black uppercase tracking-[0.25em] rounded-xl shadow-lg">
                    Day {day.day < 10 ? `0${day.day}` : day.day}
                  </span>
                  {day.estimatedCost && (
                    <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/15 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/20">
                      <DollarSign className="w-3 h-3" />
                      {day.estimatedCost}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl md:text-5xl font-serif italic text-white leading-[1.05] tracking-tight max-w-xl text-shadow-premium-black">
                  {day.title}
                </h2>
                {day.summary && (
                  <p className="text-[14px] text-white/70 leading-relaxed max-w-md font-light">
                    {day.summary}
                  </p>
                )}
              </div>

              <button
                onClick={onPinDay}
                className={`shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 border shadow-sm ${isActive
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40"
                  }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>
        ) : (
          /* Fallback: No image available */
          <div className="relative overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full" />
            <div className="relative p-8 md:p-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-4 py-1.5 bg-white text-black text-[10px] font-black uppercase tracking-[0.25em] rounded-xl shadow-lg">
                    Day {day.day < 10 ? `0${day.day}` : day.day}
                  </span>
                  {day.estimatedCost && (
                    <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-white/10">
                      <DollarSign className="w-3 h-3" />
                      {day.estimatedCost}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl md:text-5xl font-serif italic text-white leading-[1.05] tracking-tight">{day.title}</h2>
                {day.summary && <p className="text-[14px] text-zinc-500 leading-relaxed max-w-lg font-light">{day.summary}</p>}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ──── Activities ──── */}
      <div className="space-y-2">{children}</div>

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
              <Sparkle className="w-7 h-7 text-orange-400" />
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── Compute trip stats ──
  const totalActivities = data.days.reduce((sum, d) => sum + d.activities.length, 0);
  const totalRestaurants = data.days.reduce((sum, d) => sum + d.activities.filter(a => a.category === "RESTAURANT").length, 0);
  const totalExperiences = data.days.reduce((sum, d) => sum + d.activities.filter(a => a.category === "LANDMARK" || a.category === "ACTIVITY").length, 0);



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
      if (found && found !== activeDay) setActiveDay(found);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeScrollDay, activeDay, data.days]);

  return (
    <div
      ref={scrollContainerRef}
      className="fixed inset-0 z-[100] flex flex-col bg-black overflow-y-auto overflow-x-hidden font-sans selection:bg-orange-200/40 scrollbar-hide"
    >

      {/* ══════════════════════════════ STICKY DAY NAVIGATOR */}
      <StickyDayNav days={data.days} activeScrollDay={activeScrollDay} />

      {/* ══════════════════════════════ VALORA GLASS HERO ══════════════════════════════ */}
      <section className="relative h-screen w-full min-h-[800px] flex items-center justify-center overflow-hidden bg-zinc-950">

        {/* Cinematic Background Layer */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
            src={heroImage}
            alt={itinerary.destination}
            className="w-full h-full object-cover"
          />
          {/* Multi-layered Gradients for Premium feel without blurs */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/90 z-10" />
          <div className="absolute inset-0 bg-black/10 z-10" />
        </div>

        {/* Edge-to-Edge Content Container */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-between p-12 md:p-20">

          {/* Integrated Minimalist Header */}
          <div className="w-full flex items-center justify-between">


            <div className="absolute left-1/2 -translate-x-1/2 scale-125">
              <span className="text-2xl font-serif italic text-white tracking-[0.3em] font-light">NOMADGO</span>
            </div>
          </div>

          {/* Hero Typography - MAGAZINE STYLE */}
          <div className="max-w-6xl w-full text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="h-px w-12 bg-white/30" />
                <span className="text-[11px] font-black uppercase tracking-[0.6em] text-orange-400 drop-shadow-lg">Now Discovering</span>
                <div className="h-px w-12 bg-white/30" />
              </div>

              <h1 className="text-8xl md:text-[12rem] font-serif italic text-white leading-[0.85] tracking-tighter text-shadow-premium-black">
                {itinerary.destination.split(",")[0]}
              </h1>

              <div className="relative inline-block mt-4">
                <h2 className="text-4xl md:text-6xl font-serif text-white/90 leading-tight tracking-tight text-shadow-premium-black">
                  A {itinerary.vibe} <span className="italic font-light opacity-60">Odyssey</span>
                </h2>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
            </motion.div>
          </div>

          {/* Luxury Information Bar */}
          <div className="w-full max-w-7xl flex flex-col md:flex-row items-end md:items-center justify-between gap-12 pb-4">
            <div className="flex items-center gap-16 md:gap-24">
              <div className="space-y-4 group">
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="flex flex-col items-end">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white leading-none tracking-tighter">
                    <AnimatedCounter to={itinerary.days} />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-400">Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator with no blur */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-6 right-1/2 translate-x-1/2 z-30 opacity-40"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white via-white to-transparent" />
        </motion.div>
      </section>


      {/* ══════════════════════════════ CONTENT AREA */}
      <div className="flex-1 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT: Scrollable Content */}
          <div className="w-full lg:w-[62%] px-6 md:px-12 lg:px-16 pt-0 pb-32">

            {/* ADVENZO STYLE SECTION HEADER */}
            <div className="mb-20 space-y-6">
              <h2 className="text-4xl md:text-6xl font-serif italic tracking-tight text-white leading-none">
                Explore Unmissable <br />
                <span className="text-orange-400 font-sans font-black not-italic text-3xl md:text-4xl uppercase tracking-[0.1em]">Experience Tailored for you</span>
              </h2>
              <div className="max-w-xl">
                <p className="text-zinc-500 font-light text-lg leading-relaxed">
                  Discover exclusive activities and hidden gems curated specifically for your <span className="text-white font-medium italic">{itinerary.vibe.toLowerCase()}</span> vibe.
                  Every stop is a story waiting to be told.
                </p>
              </div>
            </div>

            <KnowBeforeYouGo data={data} />
            <WhereToStay stays={data.suggestedStays} destination={itinerary.destination} />

            {/* Day Cards */}
            <div className="space-y-32">
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
          <div className="hidden lg:block lg:w-[38%] border-l border-white/5">
            <div className="sticky top-0 h-screen">
              <div className="w-full h-full bg-zinc-950 overflow-hidden relative">
                <MapWrapper days={data.days} activeDay={activeDay} />
                <div className="absolute top-8 right-8 z-30">
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl text-white/50 text-[9px] font-black uppercase tracking-[0.25em]">
                    <Compass className="w-3 h-3" />
                    Interactive Map
                  </div>
                </div>
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

