"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Map as MapIcon } from "lucide-react";

interface ActivityProps {
  activity: {
    title: string;
    description: string;
    image: string | null;
    timeOfDay: string;
  };
  index: number;
}

export default function AnimatedActivityCard({ activity, index }: ActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
      className="relative group/act"
    >
      {/* Elaborate Activity Bullet */}
      <div className="absolute -left-[35px] top-6 w-5 h-5 rounded-full bg-background border-[4px] border-orange-600 transition-transform duration-500 group-hover/act:scale-125 z-10 shadow-sm" />
      
      <div className="bg-card/40 backdrop-blur-sm rounded-3xl border border-border/50 p-5 hover:bg-card/80 hover:border-orange-500/40 transition-all duration-300 shadow-sm hover:shadow-[0_15px_30px_-10px_rgba(234,88,12,0.15)] flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-md group-hover/act:shadow-lg transition-shadow duration-500">
          {activity.image ? (
            <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover/act:scale-110 transition-transform duration-700" />
          ) : (
            <div className="w-full h-full bg-accent/20 flex items-center justify-center">
              <MapIcon className="w-8 h-8 text-muted-foreground/30" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2.5 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold group-hover/act:text-orange-500 transition-colors duration-300 leading-tight">
              {activity.title}
            </h3>
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-none px-2.5 py-0.5 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap shrink-0">
              <Clock className="w-3 h-3 mr-1 inline-block" />
              {activity.timeOfDay}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm font-medium opacity-90 line-clamp-2 md:line-clamp-3">
            {activity.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
