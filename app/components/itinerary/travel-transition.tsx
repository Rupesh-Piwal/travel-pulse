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
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="py-4 flex items-center justify-center"
    >
      {/* Connector line */}
      <div className="flex items-center gap-0 w-full max-w-xs mx-auto">
        <div className="flex-1 h-px border-t border-dashed border-zinc-200" />
        
        {/* Travel pill */}
        <div className="flex items-center gap-2.5 px-4 py-2 mx-3 bg-[#FAF8F5] border border-zinc-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-500 group cursor-default">
          <span className="text-sm group-hover:scale-110 transition-transform duration-300">{travel.emoji}</span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">
            {duration}
          </span>
          {distance && (
            <>
              <div className="w-0.5 h-3 bg-zinc-200 rounded-full" />
              <span className="text-[10px] text-zinc-400 tracking-wide">
                {distance}
              </span>
            </>
          )}
        </div>
        
        <div className="flex-1 h-px border-t border-dashed border-zinc-200" />
      </div>
    </motion.div>
  );
}
