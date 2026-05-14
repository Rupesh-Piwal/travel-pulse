"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import MobileTripSummary from "./MobileTripSummary";

interface MobileHeroProps {
  destination: string;
  days: number;
  heroImage: string;
  data: {
    estimatedCostINR?: { min: number; max: number };
    placesCount?: number;
    totalDistanceKm?: number;
    difficulty?: string;
  };
}

export default function MobileHero({ destination, days, heroImage, data }: MobileHeroProps) {
  return (
    <section className="relative w-full h-[45vh] overflow-hidden rounded-b-[32px]">
      {/* Hero Image */}
      <Image
        src={heroImage}
        alt={destination}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      
      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      {/* App Logo */}
      <div className="absolute top-6 left-6 z-10">
        <span className="text-xl font-bold tracking-tight text-white">
          Nomad<span className="text-[#C4632C]">Go</span>
        </span>
      </div>

      {/* Hero Content */}
      <div className="absolute bottom-8 left-6 right-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-[#C4632C] font-semibold text-sm uppercase tracking-widest mb-1">
            {days} Days Itinerary
          </p>
          <h1 className="text-4xl font-serif text-white leading-tight mb-3">
            {destination.split(",")[0]}
          </h1>
          
          {/* Trip Summary Row with Glassmorphism */}
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
            <MobileTripSummary
              costINR={data.estimatedCostINR || { min: 0, max: 0 }}
              places={data.placesCount || 0}
              distanceKm={data.totalDistanceKm || 0}
              difficulty={data.difficulty || "Moderate"}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
