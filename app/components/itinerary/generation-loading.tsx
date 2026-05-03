"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkle, MapTrifold, Camera, ForkKnife, Airplane, Globe, Image as ImageIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

const loadingSteps = [
  { icon: Globe, text: "Mapping the destination..." },
  { icon: Sparkle, text: "Consulting our AI travel experts..." },
  { icon: MapTrifold, text: "Optimizing your daily routes..." },
  { icon: ForkKnife, text: "Curating local culinary gems..." },
  { icon: Camera, text: "Selecting the most scenic spots..." },
  { icon: Airplane, text: "Finalizing your dream journey..." },
];

export default function GenerationLoading({ itineraryId }: { itineraryId: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [discoveredImages, setDiscoveredImages] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("PROCESSING");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/itinerary/${itineraryId}/status`);
        const data = await res.json();
        
        setStatus(data.status);

        if (data.data) {
          const images: string[] = [];
          if (data.data.heroImage) images.push(data.data.heroImage);
          
          data.data.days?.forEach((day: any) => {
            day.activities?.forEach((activity: any) => {
              if (activity.image && !images.includes(activity.image)) {
                images.push(activity.image);
              }
            });
          });

          // Staggered reveal for images
          const newImages = images.filter(img => !discoveredImages.includes(img));
          if (newImages.length > 0) {
            newImages.forEach((img, index) => {
              setTimeout(() => {
                setDiscoveredImages(prev => {
                  if (prev.includes(img)) return prev;
                  return [...prev, img];
                });
              }, index * 800);
            });
          }

          // Fixed scope: Check for DONE inside the data block
          if (data.status === "DONE") {
            if (discoveredImages.length >= images.length) {
              clearInterval(pollInterval);
              setTimeout(() => router.refresh(), 2000);
            }
          }
        } else if (data.status === "DONE") {
           // Fallback if data is missing but status is DONE
           clearInterval(pollInterval);
           router.refresh();
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    const pollInterval = setInterval(checkStatus, 3000);
    checkStatus();

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 4000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(stepInterval);
    };
  }, [itineraryId, router, discoveredImages.length]);

  const Icon = loadingSteps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-zinc-950 text-white p-6 overflow-hidden font-sans">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-2xl flex flex-col items-center">
        
        {/* MASONRY BENTO GRID */}
        <div className="w-full grid grid-cols-5 gap-4 mb-16 px-4">
          <AnimatePresence>
            {discoveredImages.slice(0, 4).map((src, idx) => {
              const colSpan = (idx === 1 || idx === 2) ? "col-span-3" : "col-span-2";
              return (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                  }}
                  className={`${colSpan} aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl relative`}
                >
                  <Image 
                    src={src} 
                    alt="Trip preview" 
                    fill
                    className="object-cover" 
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={idx < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
                </motion.div>
              );
            })}

            {[...Array(Math.max(0, 4 - discoveredImages.length))].map((_, i) => {
              const idx = discoveredImages.length + i;
              const colSpan = (idx === 1 || idx === 2) ? "col-span-3" : "col-span-2";
              return (
                <div 
                  key={`placeholder-${idx}`}
                  className={`${colSpan} aspect-[4/3] rounded-[2rem] bg-zinc-900/50 border border-white/5 flex items-center justify-center animate-pulse`}
                >
                  <ImageIcon className="w-8 h-8 text-white/5" />
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* BOTTOM CONTENT */}
        <div className="flex flex-col items-center text-center space-y-8 w-full max-w-md">
          <div className="space-y-3">
            <motion.h2 className="text-2xl font-sans tracking-tight text-zinc-100">
              Generating Itineraries...
            </motion.h2>
            
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-orange-500/80 text-[10px] font-black uppercase tracking-[0.4em]"
              >
                {loadingSteps[currentStep].text}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="w-full space-y-4">
            <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-500"
                initial={{ width: "5%" }}
                animate={{ width: `${Math.min(10 + (discoveredImages.length * 22), 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                {discoveredImages.length} of 4 Visuals Ready
              </span>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest uppercase">
                {status === "DONE" ? "Complete" : "Processing"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
