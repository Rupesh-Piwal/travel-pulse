"use client";

import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

interface Activity {
  title: string;
  description: string;
  image: string | null;
  timeOfDay: string;
}

interface ActivityProps {
  activity: Activity;
  index: number;
}

export default function AnimatedActivityCard({ activity, index }: ActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative py-20 group/act"
    >
      {/* Timeline Bullet (Soft Peach Glow) */}
      <div className="absolute -left-[30px] md:-left-[41px] top-[100px] w-4 h-4 rounded-full bg-[#F5EFE0] border-2 border-[#e5dfd0] flex items-center justify-center z-20 group-hover:border-[#fca5a5]/50 transition-colors duration-500 shadow-sm">
        <div className="w-1.5 h-1.5 bg-[#fca5a5] rounded-full shadow-[0_0_10px_rgba(252,165,165,0.8)]" />
      </div>

      <div className="flex flex-col md:flex-row gap-12 md:items-center">
        
        {/* Editorial Text Area */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
               {activity.timeOfDay} Journey
             </span>
             <div className="h-px w-8 bg-zinc-200/50" />
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl md:text-4xl font-serif text-zinc-950 leading-tight group-hover:text-[#fca5a5] transition-colors duration-500">
              {activity.title}
            </h3>
            <p className="text-zinc-500 text-base md:text-lg font-light leading-relaxed max-w-2xl">
              {activity.description}
            </p>
          </div>

          <div className="flex items-center gap-6 pt-4">
             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#fca5a5]">
               <MapPin className="w-3.5 h-3.5" />
               Curated Spot
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
               <Clock className="w-3.5 h-3.5" />
               Recommended 2h
             </div>
          </div>
        </div>

        {/* Cinematic Image Area */}
        <div className="w-full md:w-[280px] lg:w-[350px] aspect-[4/3] md:aspect-square relative flex-shrink-0 group-hover:scale-[1.02] transition-transform duration-1000 ease-out">
          <div className="absolute inset-0 bg-[#e5dfd0]/30 rounded-3xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_40px_80px_-20px_rgba(252,165,165,0.15)] transition-all duration-700">
            {activity.image ? (
              <>
                <img 
                  src={activity.image} 
                  alt={activity.title} 
                  className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-[8s] ease-out" 
                />
                <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.05)]" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-12">
                <div className="w-full h-full flex items-center justify-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl">
                  <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Image Placeholder</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
