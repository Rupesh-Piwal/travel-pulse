"use client";

import { motion } from "framer-motion";

interface TravelTransitionProps {
  mode?: string;
  duration?: string;
  distance?: string;
}

const TRAVEL_ICONS: Record<string, { emoji: string; label: string }> = {
  walk:  { emoji: "🚶", label: "Walk" },
  bus:   { emoji: "🚌", label: "Bus" },
  train: { emoji: "🚆", label: "Train" },
  taxi:  { emoji: "🚕", label: "Taxi" },
  ferry: { emoji: "⛴️", label: "Ferry" },
};

export default function TravelTransition({ mode = "walk", duration = "10 mins", distance }: TravelTransitionProps) {
  const travel = TRAVEL_ICONS[mode] || TRAVEL_ICONS.walk;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center py-8"
    >
      {/* Background connecting dashed line */}
      <div className="absolute top-0 bottom-0 w-px border-l-2 border-dashed border-white/10 -z-10" />

      {/* Transit Card */}
      <div className="w-full max-w-2xl mx-auto p-8 rounded-[2.5rem] bg-indigo-950/30 border border-indigo-500/20 shadow-2xl backdrop-blur-xl flex items-center justify-between group hover:border-indigo-500/40 transition-all duration-500 overflow-hidden relative">
        
        {/* Decorative giant icon outline in background */}
        <div className="absolute right-[-10%] top-[-20%] text-[150px] opacity-[0.03] rotate-12 select-none pointer-events-none">
          {travel.emoji}
        </div>

        <div className="relative z-10 space-y-3">
          <h4 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tighter flex items-center gap-4">
            <span className="text-indigo-400">{travel.emoji}</span> Transit via {mode}
          </h4>
          <div className="flex flex-wrap items-center gap-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300/80">
            <span className="bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/10">Est. Time: {duration}</span>
            {distance && <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">Distance: {distance}</span>}
          </div>
        </div>

        <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 group-hover:bg-indigo-500 text-indigo-300 group-hover:text-white transition-all duration-500">
          <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
