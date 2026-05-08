"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, Sparkles, MapPin, Loader2 } from "lucide-react";

interface DownloadOverlayProps {
  isVisible: boolean;
  destination?: string;
}

export default function DownloadOverlay({ isVisible, destination }: DownloadOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#FBF9F4]/40 backdrop-blur-md"
        >
          {/* Main Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-[400px] overflow-hidden rounded-[32px] border border-white/40 bg-white/60 p-10 shadow-[0_32px_64px_-16px_rgba(181,74,42,0.15)] backdrop-blur-xl"
          >
            {/* Background Decorative Gradient */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#B54A2A]/5 blur-[60px]" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#0F172A]/5 blur-[60px]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Icon / Loader Container */}
              <div className="relative mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-[#B54A2A]/20"
                />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-[#B54A2A] to-[#D97742] shadow-[0_12px_24px_rgba(181,74,42,0.3)]">
                  <Download className="h-10 w-10 text-white" />
                  <motion.div
                    animate={{ 
                      y: [0, 5, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute bottom-4"
                  >
                    <div className="h-1 w-1 rounded-full bg-white" />
                  </motion.div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-4 top-0"
                >
                  <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 text-[#B54A2A]" />
                    <span className="text-[10px] font-bold tracking-wider text-[#B54A2A]">CRAFTING</span>
                  </div>
                </motion.div>
              </div>

              {/* Text Content */}
              <div className="mb-8">
                <h3 className="mb-2 font-serif text-3xl text-[#111111]">Preparing Your Editorial</h3>
                <p className="px-4 text-sm leading-relaxed text-[#666666]">
                  We're assembling your pixel-perfect guide to <span className="font-bold text-[#111111]">{destination || "your destination"}</span>. Almost ready.
                </p>
              </div>

              {/* Progress Tracker (Visual Only) */}
              <div className="w-full space-y-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#111111]/5">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-[#B54A2A] to-[#D97742]"
                  />
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-3 w-3 animate-spin text-[#B54A2A]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B54A2A]">
                    Optimizing High-Res Assets
                  </span>
                </div>
              </div>

              {/* Footer Badge */}
              <div className="mt-10 flex items-center gap-2 border-t border-black/5 pt-8">
                <div className="h-6 w-px bg-black/10" />
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#111111]/40">
                  Powered by NomadGo
                </span>
                <div className="h-6 w-px bg-black/10" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
