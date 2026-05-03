"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, Wallet, Compass, Loader2, MapPin } from "lucide-react";
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

/* ── Cloudinary Media Configuration ── */
const HERO_IMAGE_URL = `https://res.cloudinary.com/dtw4aayy4/image/upload/f_auto,q_auto/v1776936139/Hero-Poster_cedudf.png`;
const HERO_VIDEO_URL = `https://res.cloudinary.com/dtw4aayy4/video/upload/f_auto,q_auto/v1776936875/Hero-video_ggtagi.mp4`;

const BUDGETS = ["Budget", "Mid-Range", "Luxury"] as const;
const VIBES = ["Adventure", "Foodie", "Cultural", "Relaxation"] as const;

export default function Hero() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  //video state
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setVideoLoaded(true);
    }
  }, []);

  // Form state
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState<string>("Mid-Range");
  const [vibe, setVibe] = useState<string>("Adventure");

  // Removed rotating images interval as we now use a single Cloudinary video/image

  const handleSubmit = () => {
    if (!destination) {
      toast.error("Please enter a destination");
      return;
    }

    if (!session) {
      toast.error("Please log in to plan your trip", {
        description: "Join NomadGo to save itineraries and sync across devices.",
      });
      router.push("/login");
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
    <section className="relative w-full h-screen">
      <Header />

      {/* ════ FULL-SCREEN BACKGROUND IMAGES ════ */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* 🔹 Fallback image (instant render, priority for LCP) */}
        <AnimatePresence>
          {!videoLoaded && (
            <motion.div
              key="hero-fallback"
              initial={{ opacity: 1, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: [0.25, 0.8, 0.25, 1] }}
              className="absolute inset-0 w-full h-full z-10"
            >
              <Image
                src={HERO_IMAGE_URL}
                alt="Travel destination"
                fill
                priority
                className="object-cover"
                sizes="100vw"
                quality={85}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔹 Video layer (Cloudinary optimized) */}
        {!videoError && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover 
      transition-opacity duration-1000 
      ${videoLoaded ? "opacity-100" : "opacity-0"}
      brightness-[0.9] contrast-[1.05]`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_IMAGE_URL}
            onLoadedData={() => setVideoLoaded(true)}
            onCanPlay={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
          >
            <source src={HERO_VIDEO_URL} />
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
        <div
          className="max-w-4xl animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <h1 className="text-[62px] md:text-[100px] font-normal tracking-tight text-sand font-[family-name:var(--font-serif)] italic leading-[0.95] mb-10">
            Plan your <br />
            <span className="text-terracotta/70">perfect</span> journey
          </h1>
          <p className="font-sans text-[clamp(15px,1.1vw,18px)] text-sand/70 max-w-[500px] mx-auto leading-relaxed tracking-wide font-light ">
            AI-powered luxury itineraries tailored to your vibe. Get curated guides, maps, and photos in seconds.
          </p>
        </div>
      </div>

      {/* ════ CTA SEARCH BAR — anchored at bottom ════ */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-[1060px] px-3 dark"
      >
        <div className="bg-white/[0.12] backdrop-blur-2xl border border-white/20 rounded-[24px] md:rounded-full shadow-[0_32px_80px_-12px_rgba(0,0,0,0.3)] flex flex-wrap md:flex-nowrap items-stretch p-0 md:p-2 relative overflow-hidden md:overflow-visible">

          {/* Destination */}
          <div className="w-full md:flex-[2] flex items-center px-4 py-4 md:pl-6 md:pr-4 md:py-5 relative group cursor-text transition-colors hover:bg-white/10 rounded-t-[24px] md:rounded-none md:rounded-l-full">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-4 transition-colors group-hover:bg-white/[0.15]">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col flex-1 w-full relative min-w-0 justify-center">
              <span className="text-[11px] uppercase tracking-wider text-white/60 font-semibold mb-0.5">
                Destination
              </span>
              <div className="hero-location-input [&_input]:!bg-transparent [&_input]:!border-none [&_input]:!shadow-none [&_input]:!outline-none [&_input]:!ring-0 [&_input]:!p-0 [&_input]:!h-auto [&_input]:!text-white [&_input]:!text-[18px] [&_input]:!font-semibold [&_input]:!placeholder:text-white/40 [&_input]:!rounded-none [&_.absolute.left-4]:!hidden [&_input]:focus:!ring-0 [&_input]:focus:!bg-transparent [&_input]:!focus-visible:ring-0 w-full relative z-20">
                <LocationInput
                  onSelect={(loc) => {
                    const fullName = loc.isFeatured
                      ? `${loc.name}, ${loc.country}`
                      : `${loc.name}${loc.city ? `, ${loc.city}` : ""}, ${loc.country}`;
                    setDestination(fullName);
                  }}
                  disabled={isPending}
                  dropdownClassName="md:w-[360px] md:-left-4 bg-white/90 backdrop-blur-xl border-navy/10 shadow-2xl rounded-[8px]"
                />
              </div>
            </div>
          </div>

          {/* Days */}
          <div className="w-1/2 md:flex-1 flex items-center px-4 py-4 md:px-4 md:py-5 border-t border-r border-white/10 md:border-none relative before:hidden md:before:block before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-[40px] before:w-[1px] before:bg-white/10 transition-colors hover:bg-white/[0.02]">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-3">
              <Calendar className="w-5 h-5 text-white/80" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 justify-center">
              <span className="text-[11px] uppercase tracking-wider text-white/60 font-semibold mb-0.5">
                Days
              </span>
              <div className="flex items-center">
                <input
                  type="number"
                  min={1}
                  max={3}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                  className="bg-transparent border-none p-0 outline-none text-white text-[16px] font-semibold w-full appearance-none placeholder:text-white/30 focus:ring-0"
                  disabled={isPending}
                  aria-label="Trip duration in days"
                />
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="w-1/2 md:flex-1 flex items-center px-4 py-4 md:px-4 md:py-5 border-t border-white/10 md:border-none relative before:hidden md:before:block before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-[40px] before:w-[1px] before:bg-white/20 transition-colors hover:bg-white/10">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-3">
              <Wallet className="w-5 h-5 text-white/80" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 justify-center">
              <span className="text-[11px] uppercase tracking-wider text-white/60 font-semibold mb-0.5">
                Budget
              </span>
              <Select value={budget} onValueChange={(val) => val && setBudget(val)} disabled={isPending}>
                <SelectTrigger aria-label="Select budget" className="bg-transparent border-none shadow-none p-0 h-auto text-white text-[16px] font-semibold focus:ring-0 justify-between gap-2 [&>svg]:opacity-50 [&>svg]:w-4 [&>svg]:h-4">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border-navy/10 shadow-2xl text-navy">
                  {BUDGETS.map((b) => (
                    <SelectItem key={b} value={b} className="focus:bg-white/10 cursor-pointer">
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vibe */}
          <div className="w-1/2 md:flex-1 flex items-center px-4 py-4 md:px-4 md:py-5 border-t border-r border-white/10 md:border-none relative before:hidden md:before:block before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-[40px] before:w-[1px] before:bg-white/10 transition-colors hover:bg-white/[0.02]">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-3">
              <Compass className="w-5 h-5 text-white/80" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 justify-center">
              <span className="text-[11px] uppercase tracking-wider text-white/60 font-semibold mb-0.5">
                Vibe
              </span>
              <Select value={vibe} onValueChange={(val) => val && setVibe(val)} disabled={isPending}>
                <SelectTrigger aria-label="Select vibe" className="bg-transparent border-none shadow-none p-0 h-auto text-white text-[16px] font-semibold focus:ring-0 justify-between gap-2 [&>svg]:opacity-50 [&>svg]:w-4 [&>svg]:h-4">
                  <SelectValue placeholder="Vibe" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border-navy/10 shadow-2xl text-navy">
                  {VIBES.map((v) => (
                    <SelectItem key={v} value={v} className="focus:bg-white/10 cursor-pointer">
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* CTA Button */}
          <div className="w-1/2 md:w-auto flex items-center justify-center p-4 md:pl-8 md:pr-2 border-t border-white/10 md:border-none relative before:hidden md:before:block before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-[40px] before:w-[1px] before:bg-white/20">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="group relative cursor-pointer overflow-hidden w-full md:w-[160px] h-[52px] md:h-[60px] rounded-xl md:rounded-full bg-gradient-to-b from-[#E67E22] to-[#D35400] text-white flex items-center justify-center shrink-0 transition-all duration-300 active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_24px_rgba(211,84,0,0.4)] disabled:opacity-70"
            >
              <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <span className="relative z-10 flex items-center gap-2 font-bold text-[16px] tracking-wide">
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Plan Trip</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-sand/25 flex justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-sand/50" />
        </motion.div>
      </div>
    </section>
  );
}
