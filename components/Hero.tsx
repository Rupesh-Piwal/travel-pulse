"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, Wallet, Compass, Loader2, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import LocationInput from "@/app/components/itinerary/location-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateItinerary } from "@/app/actions/itinerary";

/* ── Auto-rotating hero images ── */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542820229-081e0c12af0b?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop",
];

const BUDGETS = ["Budget", "Mid-Range", "Luxury"] as const;
const VIBES = ["Adventure", "Foodie", "Cultural", "Relaxation"] as const;

export default function Hero() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [idx, setIdx] = useState(0);

  //video state
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Form state
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState<string>("Mid-Range");
  const [vibe, setVibe] = useState<string>("Adventure");

  useEffect(() => {
    const t = setInterval(
      () => setIdx((p) => (p + 1) % HERO_IMAGES.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

  const handleSubmit = () => {
    if (!destination) {
      toast.error("Please enter a destination");
      return;
    }
    if (duration < 1 || duration > 3) {
      toast.error("Duration must be 1–3 days");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("destination", destination);
      formData.append("duration", duration.toString());
      formData.append("budget", budget);
      formData.append("vibe", vibe);

      const result = await generateItinerary(formData);

      if (result.success) {
        toast.success("Itinerary generated!");
        router.push(`/dashboard/itinerary/${result.id}`);
      } else {
        if (result.error === "INSUFFICIENT_CREDITS") {
          toast.error("Insufficient Credits", {
            description:
              "You've used all your credits. Credits reset every 24 hours.",
          });
        } else {
          toast.error("Something went wrong", {
            description: "Please try again in a moment.",
          });
        }
      }
    });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Header />

      {/* ════ FULL-SCREEN BACKGROUND IMAGES ════ */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* 🔹 Fallback image (instant render) */}
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={HERO_IMAGES[idx]}
            alt="Travel destination"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: videoLoaded ? 0 : 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: [0.25, 0.8, 0.25, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* 🔹 Video layer (optimized + accessible) */}
        {!videoError && (
          <video
            className={`absolute inset-0 w-full h-full object-cover 
      transition-opacity duration-1000 
      ${videoLoaded ? "opacity-100" : "opacity-0"}
      brightness-[0.9] contrast-[1.05]`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-fallback.jpg"
            onLoadedData={() => {
              setTimeout(() => setVideoLoaded(true), 150);
            }}
            onError={() => setVideoError(true)}
          >
            <source src="./hero/hero-vid-3.mp4" type="video/mp4" />
            {/* <source src="/hero-video.webm" type="video/webm" /> */}
            {/* Accessibility: captions */}
            <track
              src="/captions.vtt"
              kind="subtitles"
              srcLang="en"
              label="English"
              default
            />
            {/* Fallback text */}
            Your browser does not support the video tag.
          </video>
        )}

        {/* 🔹 Cinematic overlays (refined, not heavy) */}

        {/* Base depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />

        {/* Left readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

        {/* Top light (subtle premium touch) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.07),transparent_60%)]" />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.6)]" />

        {/* Optional grain */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />
      </div>

      {/* ════ HERO CONTENT ════ */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pb-40 md:pb-48">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl"
        >
          <h1 className="font-serif text-[clamp(48px,8.5vw,115px)] text-white leading-[0.95] mb-8 tracking-tighter drop-shadow-[0_4px_40px_rgba(0,0,0,0.5)]">
            Plan your perfect
            <br />
            <span className="italic">journey</span>
          </h1>
          <p className="font-sans text-[clamp(16px,1.2vw,20px)] text-white/80 max-w-[620px] mx-auto leading-[1.6] tracking-wide">
            Tell us your destination and travel vibe. Get a beautiful day-by-day
            itinerary with photos, maps, and a luxury PDF guide — in seconds.
          </p>
        </motion.div>
      </div>

      {/* ════ CTA SEARCH BAR — anchored at bottom ════ */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-[1060px] dark"
      >
        <div className="bg-black/20 backdrop-blur-2xl border border-white/20 rounded-[32px] md:rounded-full shadow-[0_32px_80px_-12px_rgba(0,0,0,0.6)] flex flex-col md:flex-row items-center p-2 md:p-3 relative">

          {/* Destination */}
          <div className="flex-[1.4] w-full flex items-center px-4 py-3 md:py-2 relative group cursor-text">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-3">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col flex-1 w-full relative">
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-black mb-1">
                Destination
              </span>
              <div className="hero-location-input [&_input]:!bg-transparent [&_input]:!border-none [&_input]:!shadow-none [&_input]:!outline-none [&_input]:!ring-0 [&_input]:!h-auto [&_input]:!p-0 [&_input]:!text-white [&_input]:!text-[16px] md:[&_input]:!text-[17px] [&_input]:!font-bold [&_input]:!placeholder:text-white/30 [&_input]:!rounded-none [&_.absolute.left-4]:!hidden [&_input]:focus:!ring-0 [&_input]:focus:!bg-transparent [&_input]:!focus-visible:ring-0 w-full relative z-20">
                <LocationInput
                  onSelect={(loc) => {
                    const fullName = loc.isFeatured
                      ? `${loc.name}, ${loc.country}`
                      : `${loc.name}${loc.city ? `, ${loc.city}` : ""}, ${loc.country}`;
                    setDestination(fullName);
                  }}
                  disabled={isPending}
                />
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/20 mx-2" />
          <div className="md:hidden h-px w-full bg-white/10 my-1" />

          {/* Days */}
          <div className="flex-[0.8] w-full flex items-center px-4 py-3 md:py-2 relative">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-3">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[10px] uppercase tracking-widest text-white/50 font-black mb-1">
                Duration
              </span>
              <div className="flex items-center">
                <input
                  type="number"
                  min={1}
                  max={3}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                  className="bg-transparent outline-none text-white text-[16px] md:text-[17px] font-bold w-full appearance-none placeholder:text-white/30"
                  disabled={isPending}
                />
                <span className="text-white/40 text-[11px] ml-1.5 font-bold uppercase tracking-wider">Days</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/20 mx-2" />
          <div className="md:hidden h-px w-full bg-white/10 my-1" />

          {/* Budget */}
          <div className="flex-[1] w-full flex items-center px-4 py-3 md:py-2 relative">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-3">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-0.5">
                Budget
              </span>
              <Select value={budget} onValueChange={(val) => val && setBudget(val)} disabled={isPending}>
                <SelectTrigger className="bg-transparent border-none shadow-none p-0 h-auto text-white text-[16px] md:text-[17px] font-semibold focus:ring-0 flex-row-reverse justify-end gap-2 [&>svg]:opacity-50">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent className="bg-black/40 border-white/10 shadow-2xl backdrop-blur-3xl">
                  {BUDGETS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/20 mx-2" />
          <div className="md:hidden h-px w-full bg-white/10 my-1" />

          {/* Vibe */}
          <div className="flex-[1] w-full flex items-center px-4 py-3 md:py-2 relative">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-3">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold mb-0.5">
                Vibe
              </span>
              <Select value={vibe} onValueChange={(val) => val && setVibe(val)} disabled={isPending}>
                <SelectTrigger className="bg-transparent border-none shadow-none p-0 h-auto text-white text-[16px] md:text-[17px] font-semibold focus:ring-0 flex-row-reverse justify-end gap-2 [&>svg]:opacity-50">
                  <SelectValue placeholder="Vibe" />
                </SelectTrigger>
                <SelectContent className="bg-black/40 border-white/10 shadow-2xl backdrop-blur-3xl">
                  {VIBES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="group relative overflow-hidden w-full md:w-[150px] h-[56px] md:h-[56px] mt-2 md:mt-0 rounded-[20px] md:rounded-full bg-[#C5632D] text-white flex items-center justify-center shrink-0 transition-all duration-500 active:scale-95 shadow-[0_8px_32px_rgba(197,99,45,0.4)] md:ml-2 disabled:opacity-70 disabled:active:scale-100"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

            <span className="relative z-10 flex items-center gap-2 font-bold text-[14px] tracking-wide">
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Plan My Trip <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </span>
          </button>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/25 flex justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/50" />
        </motion.div>
      </div>
    </section>
  );
}
