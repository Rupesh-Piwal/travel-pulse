"use client";

import { motion } from "framer-motion";
import { Plus, CreditCard } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface CreditsCardProps {
  initialCredits: number;
}

export function CreditsCard({ initialCredits }: CreditsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-accent/20 backdrop-blur-sm p-8 flex items-center justify-between group">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-orange-600/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform duration-500">
            <CreditCard className="w-7 h-7 text-orange-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Available Credits
            </p>
            <h2 className="text-4xl font-black font-sans tracking-tight">
              {initialCredits}
            </h2>
          </div>
        </div>

        <Link href="/dashboard/itinerary/new">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-8 h-12 gap-2 shadow-lg shadow-orange-950/20 font-bold transition-all hover:scale-105 active:scale-95">
            <Plus className="w-4 h-4" />
            Plan New Trip
          </Button>
        </Link>
        
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-600/10 transition-colors duration-700" />
      </Card>
    </motion.div>
  );
}
