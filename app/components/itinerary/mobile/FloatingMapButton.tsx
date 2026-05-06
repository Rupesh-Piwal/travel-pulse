import React from "react";
import { motion } from "framer-motion";
import { Map } from "lucide-react";

interface FloatingMapButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

export default function FloatingMapButton({ onClick, isVisible }: FloatingMapButtonProps) {
  return (
    <motion.button
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : 100, opacity: isVisible ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onClick={onClick}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-md border border-white/40 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-95 transition-transform"
    >
      <Map className="w-5 h-5 text-zinc-900" />
      <span className="font-semibold text-zinc-900">Map</span>
    </motion.button>
  );
}
