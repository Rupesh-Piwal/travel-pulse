"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Calendar, Compass, Wallet, FileDown, Check } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Framer Motion Variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

export default function TravelPulseHome() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-sans bg-navy text-sand selection:bg-terracotta/30 min-h-screen overflow-x-hidden">

      {/* ──── NAVIGATION ──── */}
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(15, 25, 35, 0.8)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 w-full z-50 px-6 md:px-12 py-4 flex items-center justify-between"
      >
        <div className="font-serif text-[22px] text-sand">TravelPulse</div>

        <div className="hidden md:flex items-center gap-8 text-[14px]">
          <Link href="#explore" className="text-sand/80 hover:text-sand hover:underline decoration-terracotta underline-offset-4 transition-all">Explore</Link>
          <Link href="#how-it-works" className="text-sand/80 hover:text-sand hover:underline decoration-terracotta underline-offset-4 transition-all">How It Works</Link>
          <Link href="#pricing" className="text-sand/80 hover:text-sand hover:underline decoration-terracotta underline-offset-4 transition-all">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/signin" className="hidden md:flex items-center justify-center h-[36px] px-[20px] rounded-[8px] border border-sand text-sand text-sm hover:bg-white/5 transition-colors">
            Sign In
          </Link>
          <button className="h-[36px] px-[20px] rounded-[8px] bg-terracotta text-white text-sm font-medium hover:bg-[#A95022] transition-colors">
            Plan Free
          </button>
        </div>
      </motion.nav>

      {/* ──── SECTION 1: HERO ──── */}
      <section className="relative w-full h-[100vh] flex flex-col justify-center overflow-hidden">
        {/* Background Image (Replaced Video as per user request) */}
        <div className="absolute inset-0 z-0">
          {/* Fallback color if image fails */}
          <div className="absolute inset-0 bg-navy" />
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{ y: typeof window !== "undefined" ? window.scrollY * 0.4 : 0 }}
          >
            <img
              src="https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?q=80&w=2000&auto=format&fit=crop"
              alt="Kyoto Aerial"
              className="w-full h-[120%] object-cover opacity-65 -translate-y-[10%]"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-navy/85 to-navy/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[640px] pl-[8vw] pr-6 md:pr-0">
          <motion.div initial="hidden" animate="show" variants={staggerContainer} className="flex flex-col gap-6">

            <motion.div variants={fadeUp} className="text-[11px] font-sans uppercase tracking-[0.15em] text-terracotta font-bold">
              YOUR PERSONAL TRAVEL GUIDE
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-serif italic text-[clamp(52px,7vw,96px)] leading-[1.05] text-sand">
              Plan your perfect <br />
              <span className="font-light relative inline-block">
                journey.
                <span className="absolute bottom-1 left-0 w-full h-[4px] bg-terracotta/40 rounded-full" />
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="font-sans text-[16px] md:text-[18px] text-sand/75 leading-[1.6] max-w-[480px]">
              Tell us your destination and travel vibe. Get a beautiful day-by-day itinerary with photos, maps, and a luxury PDF guide — in seconds.
            </motion.p>

            <motion.div variants={fadeUp} className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#1A2A3A] flex items-center justify-center text-[10px] border-2 border-navy text-sand font-medium">A</div>
                <div className="w-8 h-8 rounded-full bg-[#2A3F50] flex items-center justify-center text-[10px] border-2 border-navy text-sand font-medium">B</div>
                <div className="w-8 h-8 rounded-full bg-[#3B5466] flex items-center justify-center text-[10px] border-2 border-navy text-sand font-medium">C</div>
              </div>
              <span className="text-[13px] text-sand/50 font-sans">2,400+ itineraries planned this month</span>
            </motion.div>

            {/* Inline Booking Bar */}
            <motion.div variants={fadeUp} className="mt-8 bg-white/10 backdrop-blur-[24px] border border-white/10 rounded-[16px] p-[6px] flex flex-col md:flex-row gap-2 md:gap-0 max-w-[600px]">

              <div className="flex-1 flex items-center px-4 h-[44px] md:h-auto border-b md:border-b-0 md:border-r border-white/10 gap-3">
                <MapPin className="text-terracotta w-[18px] shrink-0" />
                <input
                  type="text"
                  placeholder="Where to?"
                  className="bg-transparent border-none outline-none text-sand placeholder:text-sand/50 text-[14px] font-sans w-full"
                />
              </div>

              <div className="flex-1 flex items-center px-4 h-[44px] md:h-auto border-b md:border-b-0 md:border-r border-white/10 gap-3">
                <Calendar className="text-sand/50 w-[18px] shrink-0" />
                <input
                  type="number"
                  min="1" max="14"
                  placeholder="Days"
                  className="bg-transparent border-none outline-none text-sand placeholder:text-sand/50 text-[14px] font-sans w-full"
                />
              </div>

              {/* Shadcn Select for Vibe */}
              <div className="flex-1 flex items-center h-[44px] md:h-auto border-b md:border-b-0 md:border-r border-white/10 relative">
                <div className="absolute left-4 z-10 pointer-events-none">
                  <Compass className="text-sand/50 w-[18px]" />
                </div>
                <Select>
                  <SelectTrigger className="w-full bg-transparent border-none text-sand focus:ring-0 pl-10 text-[14px] shadow-none h-full">
                    <SelectValue placeholder="Vibe" />
                  </SelectTrigger>
                  <SelectContent className="bg-navy border-white/10 text-sand">
                    <SelectItem value="adventure" className="hover:bg-white/10 focus:bg-white/10 focus:text-sand">Adventure</SelectItem>
                    <SelectItem value="cultural" className="hover:bg-white/10 focus:bg-white/10 focus:text-sand">Cultural</SelectItem>
                    <SelectItem value="foodie" className="hover:bg-white/10 focus:bg-white/10 focus:text-sand">Foodie</SelectItem>
                    <SelectItem value="relaxed" className="hover:bg-white/10 focus:bg-white/10 focus:text-sand">Relaxed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Shadcn Select for Budget */}
              <div className="flex-1 flex items-center h-[44px] md:h-auto relative">
                <div className="absolute left-4 z-10 pointer-events-none">
                  <Wallet className="text-sand/50 w-[18px]" />
                </div>
                <Select>
                  <SelectTrigger className="w-full bg-transparent border-none text-sand focus:ring-0 pl-10 text-[14px] shadow-none h-full">
                    <SelectValue placeholder="Budget" />
                  </SelectTrigger>
                  <SelectContent className="bg-navy border-white/10 text-sand">
                    <SelectItem value="budget" className="hover:bg-white/10 focus:bg-white/10 focus:text-sand">Budget</SelectItem>
                    <SelectItem value="mid" className="hover:bg-white/10 focus:bg-white/10 focus:text-sand">Mid-range</SelectItem>
                    <SelectItem value="luxury" className="hover:bg-white/10 focus:bg-white/10 focus:text-sand">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <button className="h-[44px] md:h-auto mt-2 md:mt-0 md:ml-2 bg-terracotta text-white px-6 rounded-[12px] text-[14px] font-medium hover:scale-[1.02] hover:bg-[#A95022] transition-all flex items-center justify-center shrink-0">
                Plan My Trip &rarr;
              </button>

            </motion.div>

          </motion.div>
        </div>

        {/* Absolute Bottom Elements */}
        <div className="absolute bottom-8 left-[8vw] z-10 flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-sand/30 relative"
          >
            <div className="w-[3px] h-[3px] rounded-full bg-sand absolute top-0 left-1/2 -translate-x-1/2" />
          </motion.div>
        </div>
        <div className="absolute bottom-8 right-[8vw] z-10 text-[12px] font-sans text-sand/50">
          04 / 04
        </div>
      </section>

      {/* ──── SECTION 2: HOW IT WORKS ──── */}
      <section id="how-it-works" className="bg-navy py-[120px] px-6 md:px-[8vw]">
        <div className="max-w-[1200px] mx-auto hidden md:block">
          <div className="text-center mb-16">
            <div className="text-[11px] font-sans uppercase tracking-[0.15em] text-terracotta font-bold mb-4">THE PROCESS</div>
            <h2 className="font-serif text-[clamp(32px,4vw,52px)] text-sand">Three steps to your perfect trip</h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <motion.div variants={fadeUp} className="bg-white/[0.04] border border-white/[0.08] rounded-[20px] p-10 flex flex-col relative overflow-hidden">
              <div className="text-[72px] font-serif text-terracotta/20 leading-none absolute top-6 left-6 pointer-events-none">01</div>
              <div className="mt-12 mb-8"><Compass className="w-8 h-8 text-terracotta" /></div>
              <h3 className="font-serif text-[24px] text-sand mb-2 z-10">Tell us your vibe</h3>
              <p className="font-sans text-[15px] text-sand/65 leading-[1.6] line-clamp-2 z-10">Destination, days, budget, travel style. 30 seconds to fill.</p>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeUp} className="bg-white/[0.04] border border-white/[0.08] rounded-[20px] p-10 flex flex-col relative overflow-hidden">
              <div className="text-[72px] font-serif text-terracotta/20 leading-none absolute top-6 left-6 pointer-events-none">02</div>
              <div className="mt-12 mb-8"><FileDown className="w-8 h-8 text-terracotta" /></div>
              <h3 className="font-serif text-[24px] text-sand mb-2 z-10">We build your guide</h3>
              <p className="font-sans text-[15px] text-sand/65 leading-[1.6] line-clamp-2 z-10">Day-by-day plan with Unsplash photos and a live Mapbox map.</p>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeUp} className="bg-white/[0.04] border border-white/[0.08] rounded-[20px] p-10 flex flex-col relative overflow-hidden">
              <div className="text-[72px] font-serif text-terracotta/20 leading-none absolute top-6 left-6 pointer-events-none">03</div>
              <div className="mt-12 mb-8"><FileDown  className="w-8 h-8 text-terracotta" /></div>
              <h3 className="font-serif text-[24px] text-sand mb-2 z-10">Export and share</h3>
              <p className="font-sans text-[15px] text-sand/65 leading-[1.6] line-clamp-2 z-10">Download a PDF that looks like a luxury travel magazine.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ──── SECTION 3: LIVE DEMO ──── */}
      <section className="bg-sand py-[120px] px-6 md:px-[8vw] overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-16"
        >
          {/* Left Copy */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 w-full"
          >
            <div className="text-[11px] font-sans uppercase tracking-[0.15em] text-terracotta font-bold mb-4">WATCH IT HAPPEN</div>
            <h2 className="font-serif text-[clamp(32px,4vw,52px)] text-navy mb-6 leading-[1.1]">Your itinerary,<br />built live.</h2>
            <p className="font-sans text-[16px] md:text-[18px] text-navy/75 leading-[1.6] mb-8 max-w-[420px]">
              No AI. No waiting. Watch your day-by-day plan come together in real time — photos, map pins, and all.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-navy text-sand px-3 py-[6px] rounded-[8px] text-[13px] font-medium flex items-center gap-2">
                <span>⚡</span> Live progress updates
              </div>
              <div className="bg-navy text-sand px-3 py-[6px] rounded-[8px] text-[13px] font-medium flex items-center gap-2">
                <span>📸</span> Unsplash photos
              </div>
              <div className="bg-navy text-sand px-3 py-[6px] rounded-[8px] text-[13px] font-medium flex items-center gap-2">
                <span>🗺️</span> Mapbox map pins
              </div>
            </div>
          </motion.div>

          {/* Right Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex-[1.2] w-full"
          >
            <div className="bg-navy rounded-[16px] shadow-[0_40px_80px_rgba(15,25,35,0.15)] border border-navy overflow-hidden flex flex-col relative w-full aspect-[4/3] max-h-[480px]">
              {/* Browser Chrome */}
              <div className="h-10 bg-[#1A2632] flex items-center px-4 gap-2 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="mx-auto bg-[#0F1923] h-6 w-1/2 rounded-md flex items-center justify-center text-[10px] text-sand/30 font-sans">
                  travelpulse.com/build
                </div>
              </div>

              {/* Progress Screen */}
              <div className="p-8 flex-1 flex flex-col gap-8 relative overflow-hidden">
                <h3 className="font-serif text-[24px] text-sand">Kyoto, Japan — 5 Days</h3>

                <div className="flex flex-col gap-5">
                  {/* Step 1 */}
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-terracotta" />
                    </div>
                    <span className="font-sans text-[14px] text-sand/50">Finding top places in Kyoto...</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-terracotta" />
                    </div>
                    <span className="font-sans text-[14px] text-sand/50">Fetching Unsplash photos...</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-terracotta" />
                    </div>
                    <span className="font-sans text-[14px] text-sand/50">Building Day 1 itinerary...</span>
                  </div>

                  {/* Step 4 (Active) */}
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-5 h-5 rounded-full bg-terracotta/20 flex items-center justify-center shrink-0 relative"
                    >
                      <div className="w-2 h-2 rounded-full bg-terracotta" />
                    </motion.div>
                    <span className="font-sans text-[14px] text-sand">Adding map pins...</span>
                  </div>
                </div>

                {/* Background fade preview of a day card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute bottom-0 left-8 right-8 h-24 bg-white/5 border border-white/10 rounded-t-[12px] p-4 flex gap-4 backdrop-blur-sm"
                >
                  <div className="w-16 h-16 rounded-[8px] bg-[#1A2632] shrink-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=200&auto=format&fit=crop" alt="preview" className="w-full h-full object-cover opacity-50" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-[12px] text-terracotta font-sans uppercase tracking-wider mb-1">Day 1</div>
                    <div className="font-serif text-[16px] text-sand truncate">Fushimi Inari Shrine</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ──── SECTION 4: DESTINATIONS GRID ──── */}
      <section id="explore" className="bg-off-white py-[120px] px-6 md:px-[8vw]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <div className="text-[11px] font-sans uppercase tracking-[0.15em] text-terracotta font-bold mb-4">EXPLORE DESTINATIONS</div>
            <h2 className="font-serif text-[clamp(32px,4vw,52px)] text-navy">Where do you want to go?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Used reliable images.unsplash fallback to source.unsplash to follow instructions but ensure quality */}
            {[
              { name: "Kyoto, Japan", vibe: "Cultural", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop" },
              { name: "Bali, Indonesia", vibe: "Relaxed", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop" },
              { name: "Paris, France", vibe: "Cultural", img: "https://images.unsplash.com/photo-1502602881226-540bbefa4266?q=80&w=800&auto=format&fit=crop" },
              { name: "Santorini, Greece", vibe: "Luxury", img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop" },
              { name: "Tokyo, Japan", vibe: "Adventure", img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop" },
              { name: "Amalfi, Italy", vibe: "Relaxed", img: "https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?q=80&w=800&auto=format&fit=crop" },
            ].map((dest, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="group relative aspect-[4/3] rounded-[16px] overflow-hidden cursor-pointer"
              >
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-md rounded-[8px] px-3 py-1 text-[11px] text-white font-sans uppercase tracking-wider font-medium pointer-events-none border border-white/20">
                  {dest.vibe}
                </div>

                <div className="absolute bottom-6 left-6 pointer-events-none">
                  <h3 className="font-serif text-[22px] text-white">{dest.name}</h3>
                </div>

                <div className="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <button className="bg-terracotta text-white font-sans text-[13px] font-medium px-4 py-2 rounded-[8px] shadow-lg hover:bg-[#A95022]">
                    Plan This Trip &rarr;
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="#" className="font-sans text-terracotta text-[15px] hover:underline underline-offset-4 decoration-terracotta/50 transition-all font-medium">
              View All Destinations &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ──── SECTION 5: PDF EXPORT SHOWCASE ──── */}
      <section className="bg-navy py-[140px] px-6 md:px-[8vw] flex flex-col items-center">
        <div className="max-w-[900px] w-full text-center mb-16">
          <div className="text-[11px] font-sans uppercase tracking-[0.15em] text-terracotta font-bold mb-4">THE EXPORT</div>
          <h2 className="font-serif text-[clamp(28px,4vw,48px)] text-sand mb-4 leading-[1.1]">Your itinerary as a<br />luxury travel guide.</h2>
          <p className="font-sans text-[16px] text-sand/65 max-w-[500px] mx-auto">
            Every itinerary exports as a stunning PDF. Shareable. Printable. Beautiful.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[800px] aspect-[1.414/1] bg-white rounded-[12px] shadow-[0_60px_120px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative"
        >
          {/* Top 40% Photo */}
          <div className="h-[40%] relative w-full pt-4 pr-4 pl-4">
            <div className="w-full h-full rounded-t-[8px] overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Kyoto" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h2 className="absolute bottom-4 left-6 font-serif text-[36px] text-white leading-none">KYOTO, JAPAN</h2>
            </div>
          </div>

          {/* Bottom 60% Layout */}
          <div className="flex-1 flex gap-4 p-6 pt-4 bg-white">
            {[1, 2, 3].map((day) => (
              <div key={day} className="flex-1 flex flex-col gap-3">
                <h4 className="font-serif text-terracotta text-[18px]">Day {day}</h4>
                <div className="w-full h-[60px] bg-gray-100 rounded-[6px] overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-1542931287-023b922fa89b?q=80&w=200&auto=format&fit=crop&sig=${day}`} className="w-full h-full object-cover opacity-80" alt="thumb" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-2 bg-navy/10 w-[80%] rounded-full" />
                  <div className="h-2 bg-navy/10 w-[60%] rounded-full" />
                  <div className="h-2 bg-navy/10 w-[90%] rounded-full" />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="h-2 bg-navy/10 w-[70%] rounded-full" />
                  <div className="h-2 bg-navy/10 w-[50%] rounded-full" />
                </div>
              </div>
            ))}

            {/* Map Placeholder Bottom Right */}
            <div className="absolute bottom-6 right-6 w-[120px] h-[80px] bg-navy rounded-[6px] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-terracotta relative">
                <div className="absolute inset-0 bg-terracotta rounded-full animate-ping opacity-50" />
              </div>
            </div>

            {/* Logo Bottom Left */}
            <div className="absolute bottom-6 left-6 font-serif text-[12px] text-navy italic font-medium">
              TravelPulse
            </div>
          </div>
        </motion.div>

        <div className="mt-8 font-sans text-[14px] text-sand/50 text-center">
          1 credit per export · Looks like a magazine · Signed URL, expires in 24h
        </div>
      </section>

      {/* ──── SECTION 6: PRICING ──── */}
      <section id="pricing" className="bg-sand py-[120px] px-6 md:px-[8vw]">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <div className="text-[11px] font-sans uppercase tracking-[0.15em] text-terracotta font-bold mb-4">SIMPLE PRICING</div>
            <h2 className="font-serif text-[clamp(32px,4vw,52px)] text-navy">Start free. Upgrade when ready.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Card 1 - Free */}
            <div className="bg-white border border-navy/10 rounded-[16px] p-8 flex flex-col">
              <h3 className="font-serif text-[24px] text-navy">Free</h3>
              <div className="font-serif text-[48px] text-navy mt-4 leading-none">₹0</div>
              <p className="font-sans text-[14px] text-navy/60 mt-2 mb-8">3 credits included</p>

              <div className="flex flex-col gap-3 mb-8">
                <div className="flex gap-3 text-[14px] font-sans text-navy"><Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" /> 3 itinerary credits</div>
                <div className="flex gap-3 text-[14px] font-sans text-navy"><Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" /> Wishlist (20 destinations)</div>
                <div className="flex gap-3 text-[14px] font-sans text-navy"><Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" /> PDF export</div>
              </div>

              <button className="w-full py-3 rounded-[8px] border border-navy text-navy font-sans text-[14px] font-medium hover:bg-navy hover:text-white transition-colors mt-auto">
                Get Started
              </button>
            </div>

            {/* Card 2 - Explorer (Elevated) */}
            <div className="bg-navy rounded-[16px] p-8 flex flex-col shadow-[0_30px_60px_rgba(15,25,35,0.2)] md:scale-105 relative z-10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terracotta text-white font-sans text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="font-serif text-[24px] text-sand">Explorer</h3>
              <div className="font-serif text-[48px] text-sand mt-4 leading-none flex items-end gap-1">
                ₹749<span className="text-[16px] text-sand/50 font-sans mb-1">/mo</span>
              </div>
              <p className="font-sans text-[14px] text-sand/70 mt-2 mb-8">15 credits/month</p>

              <div className="flex flex-col gap-3 mb-8">
                <div className="flex gap-3 text-[14px] font-sans text-sand/80"><Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" /> 15 credits/month</div>
                <div className="flex gap-3 text-[14px] font-sans text-sand/80"><Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" /> Unlimited wishlist</div>
                <div className="flex gap-3 text-[14px] font-sans text-sand/80"><Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" /> Priority queue</div>
              </div>

              <button className="w-full py-3 rounded-[8px] bg-terracotta text-white font-sans text-[14px] font-medium hover:bg-[#A95022] transition-colors mt-auto shadow-lg shadow-terracotta/20">
                Start Explorer
              </button>
            </div>

            {/* Card 3 - Pro */}
            <div className="bg-white border border-navy/10 rounded-[16px] p-8 flex flex-col">
              <h3 className="font-serif text-[24px] text-navy">Pro</h3>
              <div className="font-serif text-[48px] text-navy mt-4 leading-none flex items-end gap-1">
                ₹1,499<span className="text-[16px] text-navy/50 font-sans mb-1">/mo</span>
              </div>
              <p className="font-sans text-[14px] text-navy/60 mt-2 mb-8">50 credits/month</p>

              <div className="flex flex-col gap-3 mb-8">
                <div className="flex gap-3 text-[14px] font-sans text-navy"><Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" /> 50 credits/month</div>
                <div className="flex gap-3 text-[14px] font-sans text-navy"><Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" /> Team seats (up to 3)</div>
                <div className="flex gap-3 text-[14px] font-sans text-navy"><Check className="w-4 h-4 text-terracotta shrink-0 mt-0.5" /> White-label PDF</div>
              </div>

              <button className="w-full py-3 rounded-[8px] border border-navy text-navy font-sans text-[14px] font-medium hover:bg-navy hover:text-white transition-colors mt-auto">
                Start Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──── SECTION 7: CLOSING CTA ──── */}
      <section className="relative w-full h-[80vh] flex flex-col justify-center items-center text-center px-6">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2000&auto=format&fit=crop"
            alt="Tropical Beach"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-navy/70" />
        </div>

        <div className="relative z-10 max-w-[800px] flex flex-col items-center gap-6">
          <h2 className="font-serif italic text-[clamp(48px,6vw,88px)] text-sand leading-tight">
            Where do you want to go?
          </h2>
          <p className="font-sans text-[18px] text-sand/70 mb-4">
            Your first 3 itineraries are free. No card required.
          </p>
          <button className="h-[52px] px-[32px] rounded-[12px] bg-terracotta text-white text-[16px] font-medium hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(196,98,45,0.3)] transition-all">
            Plan My First Trip &rarr;
          </button>
        </div>
      </section>

      {/* ──── FOOTER ──── */}
      <footer className="bg-navy pt-[60px] pb-6 px-6 md:px-[8vw] border-t border-white/5">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between mb-16 gap-8 text-center md:text-left">

          {/* Left */}
          <div className="flex flex-col gap-2">
            <div className="font-serif text-[20px] text-sand">TravelPulse</div>
            <div className="font-sans text-[13px] text-sand/50">Your AI-free personal travel guide.</div>
            <div className="font-sans text-[12px] text-terracotta mt-2 opacity-80 hover:opacity-100 transition-opacity cursor-default">Total infra cost: ₹0/month</div>
          </div>

          {/* Center - Links */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 font-sans text-[14px]">
            <Link href="#explore" className="text-sand/70 hover:text-sand transition-colors">Explore</Link>
            <Link href="#how-it-works" className="text-sand/70 hover:text-sand transition-colors">How It Works</Link>
            <Link href="#pricing" className="text-sand/70 hover:text-sand transition-colors">Pricing</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sand/70 hover:text-sand transition-colors">GitHub</a>
          </div>

          {/* Right - Icons */}
          <div className="flex items-center justify-center md:justify-end gap-4">
            <a href="https://github.com" className="text-sand hover:text-terracotta transition-colors"><FileDown className="w-6 h-6" /></a>
            <a href="https://linkedin.com" className="text-sand hover:text-terracotta transition-colors"><FileDown className="w-6 h-6" /></a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-[1200px] mx-auto border-t border-sand/10 pt-6 text-center">
          <p className="font-sans text-[12px] text-sand/40">
            © 2024 TravelPulse · Built with Next.js, BullMQ, Redis & Stripe
          </p>
        </div>
      </footer>
    </div>
  );
}
