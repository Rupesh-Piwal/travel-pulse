"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, Wallet, Compass, Loader2 } from "lucide-react";
import { toast } from "sonner";
import LocationInput from "@/app/components/itinerary/location-input";
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

      {/* ════ HEADER NAV ════ */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-14 py-6"
      >
        {/* Left nav */}
        <nav className="flex items-center gap-4 md:gap-6">
          {["Explore", "Pricing", "How it Works"].map((label) => (
            <Link
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              className="group relative text-sm text-white/80 font-medium tracking-wide transition-colors duration-300 hover:text-white"
            >
              {label}

              <span className="absolute left-1/2 -bottom-1 h-[1.5px] w-0 -translate-x-1/2 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>

        {/* Center logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif italic text-[26px] text-white tracking-tight drop-shadow-lg"
        >
          NomadGo
        </Link>

        {/* Right buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="px-5 py-2.5 rounded-full border border-white/20 text-[13px] text-white/85 font-medium backdrop-blur-md hover:bg-white/10 hover:border-white/35 transition-all"
          >
            LogIn
          </Link>
          <Link
            href="/dashboard/itinerary/new"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full
  bg-[#C5632D] text-[13px] text-white font-medium tracking-[0.02em]
  transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
  hover:bg-[#b55524] active:scale-[0.98]"
          >
            <span>Plan Trip</span>

            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.header>

      {/* ════ HERO CONTENT ════ */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pb-40 md:pb-48">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl"
        >
          <h1 className="font-serif text-[clamp(44px,8vw,110px)] text-white leading-[1.05] mb-6 tracking-tight drop-shadow-[0_4px_40px_rgba(0,0,0,0.5)]">
            Plan your perfect
            <br />
            journey
          </h1>
          <p className="font-sans text-[clamp(15px,1.3vw,20px)] text-white/70 max-w-[580px] mx-auto leading-[1.7]">
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
        className="absolute bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-[960px]"
      >
        <div className="bg-[#F5EFE0] rounded-[22px] shadow-[0_24px_80px_rgba(0,0,0,0.35)] flex flex-col md:flex-row items-stretch overflow-visible relative">
          {/* Destination — uses LocationInput */}
          <div className="flex-[1.4] flex flex-col justify-center px-5 py-4 border-b md:border-b-0 md:border-r border-[#0E1922]/10 relative">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#0E1922]/40 font-bold mb-1">
              Destination
            </span>
            <div className="hero-location-input [&_input]:!bg-transparent [&_input]:!border-none [&_input]:!shadow-none [&_input]:!outline-none [&_input]:!ring-0 [&_input]:!h-auto [&_input]:!p-0 [&_input]:!pl-0 [&_input]:!text-[#0E1922] [&_input]:!text-[15px] [&_input]:!font-medium [&_input]:!placeholder:text-[#0E1922]/30 [&_input]:!rounded-none [&_.absolute.left-4]:!hidden [&_input]:focus:!ring-0 [&_input]:focus:!bg-transparent [&_input]:!focus-visible:ring-0">
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

          {/* Days */}
          <div className="flex-1 flex flex-col justify-center px-5 py-4 border-b md:border-b-0 md:border-r border-[#0E1922]/10">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#0E1922]/40 font-bold mb-1">
              Days
            </span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0E1922]/40" />
              <input
                type="number"
                min={1}
                max={3}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                className="bg-transparent outline-none text-[#0E1922] text-[15px] font-medium w-full appearance-none"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Budget */}
          <div className="flex-1 flex flex-col justify-center px-5 py-4 border-b md:border-b-0 md:border-r border-[#0E1922]/10">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#0E1922]/40 font-bold mb-1">
              Budget
            </span>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#0E1922]/40" />
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="bg-transparent outline-none text-[#0E1922] text-[15px] font-medium w-full appearance-none cursor-pointer"
                disabled={isPending}
              >
                {BUDGETS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vibe */}
          <div className="flex-1 flex flex-col justify-center px-5 py-4 border-b md:border-b-0 md:border-r border-[#0E1922]/10">
            <span className="text-[10px] uppercase tracking-[0.15em] text-[#0E1922]/40 font-bold mb-1">
              Vibe
            </span>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#0E1922]/40" />
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="bg-transparent outline-none text-[#0E1922] text-[15px] font-medium w-full appearance-none cursor-pointer"
                disabled={isPending}
              >
                {VIBES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-[#0E1922] text-[#F5EFE0] px-8 py-5 md:py-0 text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-[#1a2d3d] active:scale-[0.98] transition-all whitespace-nowrap md:rounded-r-[22px] shrink-0 disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Crafting...
              </>
            ) : (
              <>
                Plan My Trip <ArrowRight className="w-4 h-4" />
              </>
            )}
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
