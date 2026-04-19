"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Map, Camera, Utensils, Plane, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

const loadingSteps = [
  { icon: Globe, text: "Mapping the destination..." },
  { icon: Sparkles, text: "Consulting our AI travel experts..." },
  { icon: Map, text: "Optimizing your daily routes..." },
  { icon: Utensils, text: "Curating local culinary gems..." },
  { icon: Camera, text: "Selecting the most scenic spots..." },
  { icon: Plane, text: "Finalizing your dream journey..." },
];

export default function GenerationLoading({ itineraryId }: { itineraryId: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // 1. Set up SSE connection
    const eventSource = new EventSource(`/api/itinerary/${itineraryId}/stream`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("SSE update:", data);

      if (data.status === "DONE") {
        eventSource.close();
        router.refresh(); // Refresh to clear the Server Component cache and show the DONE state
      } else if (data.status === "FAILED") {
        eventSource.close();
        // You could handle failure here, e.g., toast.error or redirect
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    // 2. Cycle through loading messages
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 4000);

    return () => {
      eventSource.close();
      clearInterval(stepInterval);
    };
  }, [itineraryId, router]);

  const Icon = loadingSteps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-zinc-950 text-white p-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-lg flex flex-col items-center text-center">
        {/* Animated Icon Container */}
        <div className="relative mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-white/10 glass"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ rotate: -20, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 20, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "circOut" }}
              >
                <Icon className="w-10 h-10 text-orange-400" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          {/* Ring Animations */}
          <div className="absolute inset-0 -m-4 border border-white/5 rounded-[2.5rem] animate-[ping_3s_linear_infinite]" />
          <div className="absolute inset-0 -m-8 border border-white/5 rounded-[3rem] animate-[ping_4s_linear_infinite]" />
        </div>

        {/* Text Animations */}
        <div className="space-y-4 mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-serif tracking-tight"
          >
            Crafting your story...
          </motion.h2>
          
          <div className="h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-zinc-400 text-sm font-medium tracking-wide uppercase"
              >
                {loadingSteps[currentStep].text}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 40, ease: "linear" }}
          />
        </div>
        
        <p className="mt-8 text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">
          Please don't close this window
        </p>
      </div>

      <style jsx global>{`
        @keyframes ping {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
