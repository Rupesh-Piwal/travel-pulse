"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Map as MapIcon,
  Calendar,
  Sparkles,
  ArrowLeft,
  Share2,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import MapWrapper from "@/app/components/itinerary/map-wrapper";
import ExportPdfButton from "@/app/components/itinerary/export-pdf-button";
import AnimatedActivityCard from "@/app/components/itinerary/animated-activity-card";

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

interface ItineraryData {
  destination: string;
  days: Day[];
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

/**
 * CuratorNote: Magazine-style quote block
 */
function CuratorNote({ text }: { text: string }) {
  return (
    <div className="my-16 pl-8 border-l-4 border-[#fca5a5] relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-[#fca5a5]/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <p className="text-2xl md:text-3xl font-serif italic text-zinc-800 leading-relaxed relative z-10">
        &ldquo;{text}&rdquo;
      </p>
      <div className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#fca5a5]">
        Curator&apos;s Note
      </div>
    </div>
  );
}

export default function ItineraryViewClient({
  itinerary,
  data,
  heroImage,
}: ItineraryViewClientProps) {
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col lg:flex-row bg-[#F5EFE0] overflow-hidden font-sans selection:bg-[#fca5a5]/30">
      
      {/* LEFT: Immersive Story Canvas */}
      <div className="w-full lg:w-[60%] h-full overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hide relative bg-[#F5EFE0]">
        
        {/* Editorial Floating Header */}
        <header className={`fixed top-0 left-0 w-full lg:w-[60%] z-50 px-8 py-6 flex items-center justify-between transition-all duration-500 ${scrolled ? 'bg-[#F5EFE0]/80 backdrop-blur-md shadow-sm translate-y-0' : 'bg-transparent -translate-y-2'}`}>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="rounded-full gap-2 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 px-4 transition-all group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold text-[10px] uppercase tracking-widest">Dashboard</span>
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="rounded-full text-zinc-500 hover:text-zinc-950 font-semibold text-[10px] uppercase tracking-widest px-4 transition-all">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <div className="scale-90">
              <ExportPdfButton itineraryId={itinerary.id} />
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="icon" className="rounded-full border-zinc-200 hover:border-zinc-950 text-zinc-500 hover:text-zinc-950 transition-all ml-2">
                <X className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </header>

        {/* CINEMATIC HERO SECTION */}
        <section className="relative h-[65vh] w-full overflow-hidden flex items-end">
          <div className="absolute inset-0 z-0">
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src={heroImage}
              alt={itinerary.destination}
              className="w-full h-full object-cover"
            />
            {/* Premium Dark Cinematic Lighting */}
            <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-[#F5EFE0]/100 via-[#F5EFE0]/40 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 bg-black/5 z-0" />
          </div>

          <div className="relative z-20 px-8 md:px-20 pb-16 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="space-y-8 max-w-5xl"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <span className="px-3 py-1 bg-[#fca5a5] text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-sm transform -skew-x-12 shadow-xl shadow-[#fca5a5]/10">
                  {itinerary.vibe}
                </span>
                <div className="h-[1px] w-16 bg-white/20" />
                <span className="text-white/60 text-[9px] font-black uppercase tracking-[0.4em]">
                  Curated Experience
                </span>
              </div>
              
              <h1 className="text-8xl md:text-9xl lg:text-[10rem] font-serif text-white tracking-tighter leading-[0.8] text-shadow-premium-black">
                {itinerary.destination}
              </h1>

              <div className="flex flex-wrap items-center gap-6 pt-6 translate-y-2">
                <div className="flex items-center gap-3 px-6 py-3 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl text-white transition-all hover:bg-black/30 hover:border-white/20 group/pill overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#fca5a5]/5 via-transparent to-transparent opacity-0 group-hover/pill:opacity-100 transition-opacity" />
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/pill:bg-[#fca5a5]/20 transition-colors relative z-10">
                     <Calendar className="w-3.5 h-3.5 text-white group-hover/pill:text-[#fca5a5]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{itinerary.days} Days Journey</span>
                </div>
                
                <div className="flex items-center gap-3 px-6 py-3 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl text-white transition-all hover:bg-black/30 hover:border-white/20 group/pill overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#fca5a5]/5 via-transparent to-transparent opacity-0 group-hover/pill:opacity-100 transition-opacity" />
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/pill:bg-[#fca5a5]/20 transition-colors relative z-10">
                     <Sparkles className="w-3.5 h-3.5 text-white group-hover/pill:text-[#fca5a5]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{itinerary.budget} Luxury</span>
                </div>
                
                <div className="h-12 w-px bg-white/10 hidden md:block mx-2" />
                
                <p className="hidden md:block text-[10px] font-medium text-white/40 uppercase tracking-[0.2em] max-w-[140px] leading-relaxed">
                  Hand-curated for the refined traveler.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group/scroll"
            onClick={() => {
              const el = document.getElementById('day-1');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/60 group-hover/scroll:text-[#fca5a5] transition-colors">Scroll to Begin</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent relative">
               <div className="absolute top-0 left-0 w-full h-1/2 bg-[#fca5a5] animate-scroll-line shadow-[0_0_10px_#fca5a5]" />
            </div>
          </motion.div>
        </section>

        {/* STORY CONTENT CANVAS (Light Theme) */}
        <div className="px-8 md:px-20 pb-48 pt-16 max-w-6xl mx-auto bg-[#F5EFE0] relative z-40 shadow-[0_-100px_100px_rgba(245,239,224,1)]">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent to-[#F5EFE0] -translate-y-full pointer-events-none" />
          
          <CuratorNote text={`${itinerary.destination} is not just a place to visit, but a story to be experienced.`} />

          {/* ... mobile map and rest of content follows ... */}

          {/* Mobile Map Fallback */}
          <section className="lg:hidden h-[400px] w-full rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-100 mb-20 relative z-0 print:hidden">
            <MapWrapper days={data.days} activeDay={activeDay} />
            <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-zinc-900/80 backdrop-blur-md rounded-full text-white text-[9px] font-bold uppercase tracking-widest">
              Interactive Map
            </div>
          </section>

          <div className="space-y-32">
            {data.days.map((day, dayIndex) => (
              <section key={day.day} id={`day-${day.day}`} className="scroll-mt-32 border-t border-zinc-100 pt-16">
                
                {/* Editorial Day Header */}
                <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-4">
                    <p className="text-[#fca5a5] text-xs font-black uppercase tracking-[0.3em]">
                      Day {day.day < 10 ? `0${day.day}` : day.day}
                    </p>
                    <h2 className="text-5xl md:text-6xl font-serif text-zinc-950 leading-tight">
                      {day.title}
                    </h2>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveDay(prev => prev === day.day ? null : day.day)}
                    className={`rounded-full border-zinc-200 gap-3 h-12 px-6 hover:bg-[#fca5a5] hover:text-white hover:border-[#fca5a5] transition-all ${activeDay === day.day ? 'bg-[#fca5a5] text-white border-[#fca5a5]' : ''}`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Pin on Map</span>
                  </Button>
                </div>

                {/* Story Flow Timeline */}
                <div className="relative pl-8 md:pl-12 ml-4 md:ml-6 border-l-[1.5px] border-zinc-100">
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="relative">
                      {/* Editorial Activity Item */}
                      <AnimatedActivityCard
                        activity={activity}
                        index={actIndex}
                      />

                      {/* Transition Label (Subtle) */}
                      {actIndex < day.activities.length - 1 && (
                        <div className="py-24 flex items-center gap-6 group">
                          <div className="absolute -left-[14px] md:-left-[18px] w-7 h-7 bg-[#F5EFE0] border-2 border-[#F5EFE0]/50 rounded-full flex items-center justify-center group-hover:border-[#fca5a5]/20 group-hover:scale-110 transition-all duration-500 shadow-sm overflow-hidden">
                             <div className="w-1 h-1 bg-zinc-200 rounded-full" />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="h-[1px] w-6 bg-zinc-200 group-hover:w-12 group-hover:bg-[#fca5a5]/30 transition-all duration-700" />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300 group-hover:text-[#fca5a5]/50 transition-colors">
                              10 MIN TRANSITION
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {dayIndex === data.days.length - 1 && (
                  <div className="mt-40 p-16 rounded-[2.5rem] bg-zinc-950 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#fca5a5]/20 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="relative z-10 space-y-8 max-w-md">
                      <div className="w-12 h-12 rounded-2xl bg-[#fca5a5]/10 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-[#fca5a5]" />
                      </div>
                      <h3 className="text-4xl font-serif leading-tight">Your story is ready to begin.</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">Download this curated experience for offline access and ensure every moment of your journey is captured perfectly.</p>
                      <Button className="h-14 px-10 bg-[#fca5a5] hover:bg-[#fca5a5]/90 text-white rounded-full font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-[#fca5a5]/20 transition-all active:scale-95">
                        Download Itinerary
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Cinematic Map Panel */}
      <div className="hidden lg:block lg:w-[40%] h-full relative z-10">
        <div className="w-full h-full bg-zinc-900 overflow-hidden relative grayscale-[0.2] hover:grayscale-0 transition-all duration-1000">
          <MapWrapper days={data.days} activeDay={activeDay} />
          
          {/* Subtle editorial vignette */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_40px_0_100px_-20px_rgba(24,24,27,0.8)] z-20" />
          
          {/* Floating UI for Map */}
          <div className="absolute top-8 right-8 z-30 space-y-2">
             <div className="px-4 py-2 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-full text-white/60 text-[9px] font-black uppercase tracking-[0.2em]">
               Interactive Carto View
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}
