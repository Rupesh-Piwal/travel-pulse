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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center py-2"
    >
      {/* Top dotted line */}
      <div className="w-px h-8 border-l-2 border-dotted border-zinc-200" />

      {/* Centered travel pill */}
      <div className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-zinc-200/80 rounded-full shadow-sm">
        <span className="text-base">{travel.emoji}</span>
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
          {duration}
        </span>
        {distance && (
          <>
            <div className="w-px h-3 bg-zinc-200" />
            <span className="text-[10px] font-bold text-zinc-400 tracking-wide">
              {distance}
            </span>
          </>
        )}
      </div>

      {/* Bottom dotted line */}
      <div className="w-px h-8 border-l-2 border-dotted border-zinc-200" />
    </motion.div>
  );
}
