"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, Sparkles, MapPin, Loader2 } from "lucide-react";

interface DownloadOverlayProps {
  isVisible: boolean;
  status: "generating" | "completed" | "failed";
  destination?: string;
  url?: string;
  onClose: () => void;
  onRetry?: () => void;
}

export default function DownloadOverlay({ 
  isVisible, 
  status, 
  destination, 
  url, 
  onClose,
  onRetry 
}: DownloadOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#FBF9F4]/60 backdrop-blur-md"
        >
          {/* Main Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-[450px] overflow-hidden rounded-[32px] border border-white/40 bg-white/70 p-10 shadow-[0_32px_64px_-16px_rgba(181,74,42,0.15)] backdrop-blur-2xl"
          >
            {/* Background Decorative Gradient */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#B54A2A]/5 blur-[60px]" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#0F172A]/5 blur-[60px]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute -right-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#111111]/40 hover:text-[#111111] transition-colors"
              >
                <span className="text-xl">×</span>
              </button>

              {/* Icon / Loader Container */}
              <div className="relative mb-8">
                <motion.div
                  animate={status === "generating" ? { rotate: 360 } : {}}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className={`absolute inset-0 rounded-full border-2 border-dashed ${
                    status === "failed" ? "border-red-200" : "border-[#B54A2A]/20"
                  }`}
                />
                <div className={`relative flex h-24 w-24 items-center justify-center rounded-full shadow-[0_12px_24px_rgba(181,74,42,0.3)] transition-colors duration-500 ${
                  status === "failed" 
                    ? "bg-gradient-to-tr from-red-500 to-red-400 shadow-[0_12px_24px_rgba(239,68,68,0.3)]" 
                    : status === "completed"
                    ? "bg-gradient-to-tr from-[#10B981] to-[#34D399] shadow-[0_12px_24px_rgba(16,185,129,0.3)]"
                    : "bg-gradient-to-tr from-[#B54A2A] to-[#D97742]"
                }`}>
                  {status === "generating" && <Download className="h-10 w-10 text-white" />}
                  {status === "completed" && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <Sparkles className="h-10 w-10 text-white" />
                    </motion.div>
                  )}
                  {status === "failed" && <span className="text-3xl text-white font-bold">!</span>}
                  
                  {status === "generating" && (
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
                  )}
                </div>
                
                {/* Floating Elements */}
                {status === "generating" && (
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-4 top-0"
                  >
                    <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-sm border border-black/5">
                      <Sparkles className="h-3 w-3 text-[#B54A2A]" />
                      <span className="text-[10px] font-bold tracking-wider text-[#B54A2A]">CRAFTING</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Text Content */}
              <div className="mb-8">
                <h3 className="mb-2 font-serif text-3xl text-[#111111]">
                  {status === "generating" && "Preparing Your Editorial"}
                  {status === "completed" && "Editorial Ready"}
                  {status === "failed" && "Export Failed"}
                </h3>
                <p className="px-4 text-sm leading-relaxed text-[#666666]">
                  {status === "generating" && (
                    <>We&apos;re assembling your pixel-perfect guide to <span className="font-bold text-[#111111]">{destination || "your destination"}</span>. Almost ready.</>
                  )}
                  {status === "completed" && (
                    <>Your premium editorial guide for <span className="font-bold text-[#111111]">{destination || "your destination"}</span> is ready for download.</>
                  )}
                  {status === "failed" && (
                    <>Something went wrong while generating your PDF. Please try again or contact support if the issue persists.</>
                  )}
                </p>
              </div>

              {/* Actions Area */}
              <div className="w-full space-y-6">
                {status === "generating" && (
                  <div className="space-y-4">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#111111]/5">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 15, ease: "linear" }}
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
                )}

                {status === "completed" && url && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col gap-3"
                  >
                    <a 
                      href={url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-full bg-[#111111] px-8 py-4 text-[13px] font-bold uppercase tracking-widest text-white shadow-xl hover:bg-black transition-all hover:scale-[1.02]"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF Now
                    </a>
                    <button 
                      onClick={onClose}
                      className="text-[11px] font-bold uppercase tracking-widest text-[#666666] hover:text-[#111111] transition-colors"
                    >
                      Maybe Later
                    </button>
                  </motion.div>
                )}

                {status === "failed" && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col gap-3"
                  >
                    <button 
                      onClick={onRetry}
                      className="flex items-center justify-center gap-2 rounded-full bg-[#B54A2A] px-8 py-4 text-[13px] font-bold uppercase tracking-widest text-white shadow-xl hover:bg-[#9E3F24] transition-all"
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={onClose}
                      className="text-[11px] font-bold uppercase tracking-widest text-[#666666] hover:text-[#111111] transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
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
