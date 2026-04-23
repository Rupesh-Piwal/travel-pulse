"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  const [isPending, startTransition] = useTransition();

  //video state
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

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
        <AnimatePresence>
          <motion.img
            src={HERO_IMAGE_URL}
            alt="Travel destination"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: videoLoaded ? 0 : 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: [0.25, 0.8, 0.25, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* 🔹 Video layer (Cloudinary optimized) */}
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
            preload="auto"
            poster={HERO_IMAGE_URL}
            onLoadedData={() => {
              setTimeout(() => setVideoLoaded(true), 150);
            }}
            onError={() => setVideoError(true)}
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
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
          <h1 className="text-[62px] md:text-[100px] font-normal tracking-tight text-white font-[family-name:var(--font-serif)] italic">
            Plan your <br />
            <span className="text-white/60">perfect</span> journey
          </h1>
          <p className="font-bricolage text-[clamp(15px,1.1vw,18px)] text-white/70 max-w-[500px] mx-auto leading-relaxed tracking-wide font-light">
            AI-powered luxury itineraries tailored to your vibe. Get curated guides, maps, and photos in seconds.
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
        <div className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[28px] md:rounded-full shadow-[0_32px_80px_-12px_rgba(0,0,0,0.6)] flex flex-wrap md:flex-nowrap items-center p-1.5 md:p-3 relative">

          {/* Destination */}
          <div className="w-full md:flex-[1.4] flex items-center px-4 py-2.5 md:py-2 relative group cursor-text">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-3">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white/70" />
            </div>
            <div className="flex flex-col flex-1 w-full relative">
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold mb-0.5">
                Destination
              </span>
              <div className="hero-location-input [&_input]:!bg-transparent [&_input]:!border-none [&_input]:!shadow-none [&_input]:!outline-none [&_input]:!ring-0 [&_input]:!h-auto [&_input]:!p-0 [&_input]:!text-white [&_input]:!text-[15px] md:[&_input]:!text-[17px] [&_input]:!font-bold [&_input]:!placeholder:text-white/20 [&_input]:!rounded-none [&_.absolute.left-4]:!hidden [&_input]:focus:!ring-0 [&_input]:focus:!bg-transparent [&_input]:!focus-visible:ring-0 w-full relative z-20">
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

          <div className="hidden md:block w-px h-10 bg-white/10 mx-2" />
          <div className="md:hidden h-px w-full bg-white/5 my-1" />

          {/* Days */}
          <div className="w-1/2 md:flex-[0.8] flex items-center px-4 py-2 md:py-2 relative border-r border-white/5 md:border-none">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-3">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white/70" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold mb-0.5">
                Days
              </span>
              <div className="flex items-center">
                <input
                  type="number"
                  min={1}
                  max={3}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                  className="bg-transparent outline-none text-white text-[15px] md:text-[17px] font-bold w-full appearance-none placeholder:text-white/20"
                  disabled={isPending}
                />
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/10 mx-2" />

          {/* Budget */}
          <div className="w-1/2 md:flex-[1] flex items-center px-4 py-2 md:py-2 relative">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-3">
              <Wallet className="w-4 h-4 md:w-5 md:h-5 text-white/70" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold mb-0.5">
                Budget
              </span>
              <Select value={budget} onValueChange={(val) => val && setBudget(val)} disabled={isPending}>
                <SelectTrigger className="bg-transparent border-none shadow-none p-0 h-auto text-white text-[15px] md:text-[17px] font-bold focus:ring-0 flex-row-reverse justify-end gap-1.5 [&>svg]:opacity-30">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10 shadow-2xl backdrop-blur-3xl">
                  {BUDGETS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-white/10 mx-2" />
          <div className="md:hidden h-px w-full bg-white/5 my-1" />

          {/* Vibe */}
          <div className="w-1/2 md:flex-[1] flex items-center px-4 py-2 md:py-2 relative border-r border-white/5 md:border-none">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mr-3">
              <Compass className="w-4 h-4 md:w-5 md:h-5 text-white/70" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold mb-0.5">
                Vibe
              </span>
              <Select value={vibe} onValueChange={(val) => val && setVibe(val)} disabled={isPending}>
                <SelectTrigger className="bg-transparent border-none shadow-none p-0 h-auto text-white text-[15px] md:text-[17px] font-bold focus:ring-0 flex-row-reverse justify-end gap-1.5 [&>svg]:opacity-30">
                  <SelectValue placeholder="Vibe" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10 shadow-2xl backdrop-blur-3xl">
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
          <div className="w-1/2 md:w-auto md:ml-2">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="group relative overflow-hidden w-full md:w-[150px] h-[50px] md:h-[56px] rounded-xl md:rounded-full bg-gradient-to-br from-[#E67E22] to-[#C0392B] text-white flex items-center justify-center shrink-0 transition-all duration-300 active:scale-95 shadow-[0_8px_32px_rgba(197,99,45,0.4)] disabled:opacity-70"
            >
              <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <span className="relative z-10 flex items-center gap-1.5 font-bold text-[13px] md:text-[14px] tracking-wide">
                {isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="md:inline">Plan Trip</span>
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
          className="w-5 h-8 rounded-full border border-white/25 flex justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/50" />
        </motion.div>
      </div>
    </section>
  );
}
